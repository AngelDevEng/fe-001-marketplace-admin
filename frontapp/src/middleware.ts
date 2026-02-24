import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MIDDLEWARE DE AUTORIZACIÓN
 * 
 * Protege rutas según el rol del usuario:
 * - /admin/* → solo admin
 * - /operador/* → admin y operador
 * - /seller/* → admin, operador, vendedor
 * 
 * La sesión se valida mediante cookies de WordPress
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Rutas públicas que no requieren autenticación
const publicPaths = [
  '/',
  '/login',
  '/api/auth',
  '/api/webhooks',
];

// Rutas por rol
const roleRoutes = {
  admin: ['/admin', '/operador', '/seller'],
  operador: ['/operador', '/seller'],
  seller: ['/seller'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip para rutas públicas
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Obtener información de sesión de las cookies
  const userRole = request.cookies.get('user_role')?.value;
  const userId = request.cookies.get('user_id')?.value;
  const userEmail = request.cookies.get('user_email')?.value;
  const wpSession = request.cookies.get('wp_session')?.value;

  // Redirecciones por rol (solo para rutas raíz)
  if (pathname === '/') {
    if (!wpSession || !userRole) {
      // No hay sesión → login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redireccionar según rol
    if (userRole === 'admin' && userEmail?.includes('admin')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (userRole === 'operador' || userEmail?.includes('operador')) {
      return NextResponse.redirect(new URL('/operador', request.url));
    }
    return NextResponse.redirect(new URL('/seller', request.url));
  }

  // Validar acceso a rutas protegidas
  const isAdminRoute = pathname.startsWith('/admin');
  const isOperadorRoute = pathname.startsWith('/operador');
  const isSellerRoute = pathname.startsWith('/seller');

  // No hay sesión
  if (!wpSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validar rol para la ruta
  if (isAdminRoute) {
    if (userRole !== 'admin' || !userEmail?.includes('admin')) {
      return NextResponse.redirect(new URL('/seller', request.url));
    }
  }

  if (isOperadorRoute) {
    if (userRole !== 'admin' && userRole !== 'operador' && !userEmail?.includes('operador')) {
      return NextResponse.redirect(new URL('/seller', request.url));
    }
  }

  // Seller puede acceder a todo lo anterior
  if (isSellerRoute) {
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Agregar headers con info del usuario para los Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', userId || '');
  requestHeaders.set('x-user-role', userRole || '');
  requestHeaders.set('x-user-email', userEmail || '');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
