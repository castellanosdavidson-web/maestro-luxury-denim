import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // No proteger la página de login ni las APIs de auth
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Proteger solo rutas /admin
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Verificar cookie de sesión
  const adminCookie = request.cookies.get('maestro_admin');

  if (!adminCookie?.value) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
