import { NextRequest, NextResponse } from 'next/server';
import { devisFormSchema } from '../../../lib/validators';
import { sanitizeInput } from '../../../lib/sanitize';
import { isRateLimited } from '../../../lib/rateLimit';
import { dbInsertDevis } from '../../../lib/supabase';
import { sendDevisConfirmationEmail } from '../../../lib/email';

export async function POST(request: NextRequest) {
  try {
    // 1. Resolve client IP address (supporting standard proxies, Vercel headers, etc.)
    let ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    if (ipAddress.includes(',')) {
      ipAddress = ipAddress.split(',')[0].trim();
    }

    // 2. Rate Limiting check (Max 3 submissions per hour per IP)
    const rateLimited = await isRateLimited(ipAddress);
    if (rateLimited) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Vous avez dépassé la limite de 3 demandes de devis par heure. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }

    // 3. Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Le corps de la requête est invalide.' }, { status: 400 });
    }

    // 4. Validate payload with Zod
    const validation = devisFormSchema.safeParse(body);
    if (!validation.success) {
      const errorMap = validation.error.flatten().fieldErrors;
      // Get the first error message to present a concise response
      const firstError = Object.values(errorMap)[0]?.[0] || 'Données invalides.';
      return NextResponse.json({ error: firstError, details: errorMap }, { status: 400 });
    }

    // 5. Sanitize text inputs before insertion (Prevent XSS/HTML Injection)
    const sanitizedInput = sanitizeInput(validation.data);

    // 6. Save in database
    const createdDevis = await dbInsertDevis(sanitizedInput, ipAddress);

    // 7. Envoi de l'email de confirmation automatique au client en arrière-plan (Bonus!)
    // Déclenché de manière non bloquante pour optimiser le temps de réponse client.
    sendDevisConfirmationEmail(createdDevis).catch((err) => {
      console.error('❌ Resend : Erreur d\'arrière-plan lors du déclenchement de l\'email :', err);
    });

    // 8. Return generated UUID
    return NextResponse.json(
      { 
        message: 'Demande de devis enregistrée avec succès.',
        id: createdDevis.id 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('API /api/devis POST Error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue. Veuillez réessayer ultérieurement.' },
      { status: 500 }
    );
  }
}
