import { dbCheckAndRegisterRateLimit } from './supabase';

/**
 * Checks if a client IP address has exceeded the rate limit of 3 submissions per hour.
 * 
 * @param ipAddress Client's IP address
 * @returns Promise<boolean> True if rate limited (blocked), False if allowed.
 */
export async function isRateLimited(ipAddress: string): Promise<boolean> {
  // If IP address is missing (local environment or proxy issue), fallback to localhost
  const clientIp = ipAddress || '127.0.0.1';
  
  // dbCheckAndRegisterRateLimit returns true if allowed, false if limited
  const allowed = await dbCheckAndRegisterRateLimit(clientIp);
  return !allowed;
}
