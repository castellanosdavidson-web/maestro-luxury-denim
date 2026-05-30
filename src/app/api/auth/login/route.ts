import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const adminEmail    = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminSecret   = process.env.ADMIN_SECRET || 'maestro-secret-2025';

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
  }

  // Crear token simple: base64 del email + timestamp + secret
  const payload = Buffer.from(`${email}:${Date.now()}:${adminSecret}`).toString('base64');

  const response = NextResponse.json({ success: true });
  response.cookies.set('maestro_admin', payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dÃ­as
    path: '/',
  });

  return response;
}
