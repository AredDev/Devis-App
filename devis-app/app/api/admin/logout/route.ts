import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Déconnexion réussie.' },
      { status: 200 }
    );

    // Delete cookie by setting its maxAge to 0
    response.cookies.set('admin_session', '', {
      path: '/',
      httpOnly: true,
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 });
  }
}
