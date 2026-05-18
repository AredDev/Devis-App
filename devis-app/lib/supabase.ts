import { createClient } from '@supabase/supabase-js';
import { Devis, DevisInput, Statut } from '../types/devis';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Detect if Supabase is properly configured with real project credentials
const isSupabaseConfigured =
  supabaseUrl &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your-supabase-anon-key';

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin client to bypass RLS for server-side rate limits and devis listings
export const supabaseAdmin = isSupabaseConfigured && supabaseServiceRoleKey && supabaseServiceRoleKey !== 'your-supabase-service-role-key'
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

// Global Mock Database to persist data between Next.js hot reloads in development
interface MockDb {
  devis: Devis[];
  rateLimits: { ip_address: string; created_at: string }[];
}

const globalForMock = globalThis as unknown as { mockDb: MockDb };
if (!globalForMock.mockDb) {
  globalForMock.mockDb = {
    devis: [],
    rateLimits: [],
  };
}
const mockDb = globalForMock.mockDb;

/**
 * Inserts a new devis (quote request) into the database.
 */
export async function dbInsertDevis(input: DevisInput, ipAddress: string): Promise<Devis> {
  const newDevis: Devis = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15) + '-' + Math.random().toString(36).substring(2, 15),
    created_at: new Date().toISOString(),
    ...input,
    statut: 'nouveau',
    ip_address: ipAddress
  };

  if (isSupabaseConfigured) {
    const client = supabaseAdmin || supabase;
    if (client) {
      const { data, error } = await client
        .from('devis')
        .insert([newDevis])
        .select()
        .single();

      if (error) {
        console.warn('Supabase devis insert failed, falling back to mock database. Error:', error.message);
        mockDb.devis.push(newDevis);
        return newDevis;
      }
      return data as Devis;
    }
  }

  mockDb.devis.push(newDevis);
  return newDevis;
}

/**
 * Fetches all devis, optionally filtered by status, ordered by creation date descending.
 */
export async function dbGetDevis(statutFilter?: Statut): Promise<Devis[]> {
  if (isSupabaseConfigured) {
    const client = supabaseAdmin || supabase;
    if (client) {
      let query = client.from('devis').select('*').order('created_at', { ascending: false });
      if (statutFilter) {
        query = query.eq('statut', statutFilter);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('Supabase devis fetch failed, falling back to mock database. Error:', error.message);
      } else {
        return data as Devis[];
      }
    }
  }

  // Fallback / Mock logic
  let filtered = [...mockDb.devis];
  if (statutFilter) {
    filtered = filtered.filter(d => d.statut === statutFilter);
  }
  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Updates the status of a specific devis.
 */
export async function dbUpdateDevisStatus(id: string, statut: Statut): Promise<Devis | null> {
  if (isSupabaseConfigured) {
    const client = supabaseAdmin || supabase;
    if (client) {
      const { data, error } = await client
        .from('devis')
        .update({ statut })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('Supabase devis status update failed, falling back to mock. Error:', error.message);
      } else {
        return data as Devis;
      }
    }
  }

  // Fallback / Mock logic
  const index = mockDb.devis.findIndex(d => d.id === id);
  if (index !== -1) {
    mockDb.devis[index].statut = statut;
    return mockDb.devis[index];
  }
  return null;
}

/**
 * Checks if the IP is allowed to submit a quote (max 3 submissions per hour).
 * Also registers the request and cleans old rate limit entries.
 */
export async function dbCheckAndRegisterRateLimit(ipAddress: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString();

  if (isSupabaseConfigured) {
    const client = supabaseAdmin || supabase;
    if (client) {
      // 1. Clean stale rate limits (older than 1h)
      await client
        .from('rate_limits')
        .delete()
        .lt('created_at', oneHourAgo);

      // 2. Count requests by this IP in the last hour
      const { count, error } = await client
        .from('rate_limits')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ipAddress)
        .gte('created_at', oneHourAgo);

      if (!error && count !== null) {
        if (count >= 3) {
          return false; // Rate limit exceeded
        }

        // 3. Register current submission
        await client
          .from('rate_limits')
          .insert([{ ip_address: ipAddress }]);

        return true;
      } else {
        console.warn('Supabase rate limiting count failed, falling back to mock rate limiter. Error:', error?.message);
      }
    }
  }

  // Fallback / Mock Rate Limiting
  // 1. Clean stale mock limits
  mockDb.rateLimits = mockDb.rateLimits.filter(limit => limit.created_at >= oneHourAgo);

  // 2. Count current IP submissions
  const ipCount = mockDb.rateLimits.filter(limit => limit.ip_address === ipAddress).length;
  if (ipCount >= 3) {
    return false;
  }

  // 3. Register current submission
  mockDb.rateLimits.push({
    ip_address: ipAddress,
    created_at: new Date().toISOString()
  });

  return true;
}

/**
 * Returns statistics for the admin dashboard (e.g. number of submissions in the last 24h)
 */
export async function dbGetStats24h(): Promise<number> {
  const twentyFourHoursAgo = new Date(Date.now() - 86400000).toISOString();

  if (isSupabaseConfigured) {
    const client = supabaseAdmin || supabase;
    if (client) {
      const { count, error } = await client
        .from('devis')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twentyFourHoursAgo);

      if (!error && count !== null) {
        return count;
      }
    }
  }

  return mockDb.devis.filter(d => d.created_at >= twentyFourHoursAgo).length;
}
