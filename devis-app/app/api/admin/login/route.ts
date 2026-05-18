import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
    }

    const { password } = body;
    const expectedPassword = process.env.ADMIN_PASSWORD || 'AdminPestControl2026!';

    if (password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect. Accès refusé.' },
        { status: 401 }
      );
    }

    // Create a response indicating success
    const response = NextResponse.json(
      { success: true, message: 'Authentification réussie.' },
      { status: 200 }
    );

    // Set secure HTTP-only cookie to prevent XSS theft of session token
    response.cookies.set('admin_session', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
    });

    return response;

  } catch (error: any) {
    console.error('API /api/admin/login POST Error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}
