import { NextRequest, NextResponse } from 'next/server';

// Configuration des routes nécessitant une authentification
const protectedPaths = ['/reclamations', '/admin'];
const authPaths = ['/login', '/auth/callback'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('jwt_token')?.value;
  const isAuthenticated = !!token;

  // Vérifie si l'utilisateur tente d'accéder à une route protégée
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Vérifie si l'utilisateur tente d'accéder aux pages d'authentification
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // Rediriger vers la page de connexion si non authentifié et accès à une route protégée
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
  
  // Rediriger vers la page des réclamations si déjà authentifié et accès aux pages d'authentification
  if (isAuthPath && isAuthenticated) {
    const url = new URL('/reclamations', request.url);
    return NextResponse.redirect(url);
  }

  // Si aucun des cas précédents, continuer normalement
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
