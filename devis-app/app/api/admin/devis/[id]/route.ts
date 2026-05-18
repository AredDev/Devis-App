import { NextRequest, NextResponse } from 'next/server';
import { dbUpdateDevisStatus } from '../../../../../lib/supabase';
import { Statut } from '../../../../../types/devis';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify Bearer token authorization or session cookie
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

    // 2. Await dynamic route parameters for Next.js 15/16 compatibility
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "L'identifiant du devis est manquant." }, { status: 400 });
    }

    // 3. Parse and validate new status
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Le corps de la requête est invalide.' }, { status: 400 });
    }

    const { statut } = body as { statut: Statut };

    if (!statut || !['nouveau', 'traite', 'archive'].includes(statut)) {
      return NextResponse.json(
        { error: "Le statut fourni est invalide. Valeurs attendues : 'nouveau' | 'traite' | 'archive'." },
        { status: 400 }
      );
    }

    // 4. Update in database
    const updatedDevis = await dbUpdateDevisStatus(id, statut);

    if (!updatedDevis) {
      return NextResponse.json(
        { error: "Demande de devis introuvable avec l'identifiant fourni." },
        { status: 404 }
      );
    }

    // 5. Respond with updated object
    return NextResponse.json(
      { 
        message: 'Statut mis à jour avec succès.',
        devis: updatedDevis 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('API /api/admin/devis/[id] PATCH Error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue. Veuillez réessayer ultérieurement.' },
      { status: 500 }
    );
  }
}
