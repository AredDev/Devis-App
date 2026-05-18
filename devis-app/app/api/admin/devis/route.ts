import { NextRequest, NextResponse } from 'next/server';
import { dbGetDevis, dbGetStats24h } from '../../../../lib/supabase';
import { Statut } from '../../../../types/devis';

export async function GET(request: NextRequest) {
  try {
    // 1. Verify static Bearer token authorization or session cookie
    const authHeader = request.headers.get('authorization');
    const expectedToken = `Bearer ${process.env.ADMIN_BEARER_TOKEN || 'secret_bearer_token_2026'}`;
    const adminSession = request.cookies.get('admin_session')?.value;

    const isAuthorized = (authHeader && authHeader === expectedToken) || adminSession === 'authenticated';

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Non autorisé. Token Bearer de sécurité absent ou cookie de session invalide.' },
        { status: 401 }
      );
    }

    // 2. Extract query filters (statut = nouveau | traite | archive)
    const { searchParams } = new URL(request.url);
    const statut = searchParams.get('statut') as Statut | null;

    // Validate parameter if provided
    if (statut && !['nouveau', 'traite', 'archive'].includes(statut)) {
      return NextResponse.json(
        { error: 'Le filtre de statut est invalide.' },
        { status: 400 }
      );
    }

    // 3. Fetch filtered list from DB
    const devisList = await dbGetDevis(statut || undefined);

    // 4. Calculate stats for the bonus load indicator (submissions in the last 24h)
    const stats24h = await dbGetStats24h();

    // 5. Respond with list and additional payload details
    return NextResponse.json(
      {
        devis: devisList,
        stats24h
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('API /api/admin/devis GET Error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue. Veuillez réessayer ultérieurement.' },
      { status: 500 }
    );
  }
}
