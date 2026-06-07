/**
 * proxy.ts (Next.js 16 Edge Proxy — replaces middleware.ts)
 *
 * Runs on the Edge Runtime before every request is processed.
 * Protects all routes under /(dashboard) by checking for a valid auth_token cookie.
 * Unauthenticated users are redirected to /login.
 * Authenticated users trying to access /login are redirected to the home page.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TOKEN_COOKIE = 'auth_token';

/** Routes that do NOT require authentication */
const PUBLIC_PATHS = ['/login', '/register'];

/**
 * Next.js 16 proxy function — must be exported as `proxy` (renamed from `middleware`).
 * Handles route protection for the entire application.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // --- Redirect authenticated user away from auth pages ---
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // --- Redirect unauthenticated user away from protected pages ---
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/login', request.url);
    // Preserve intended destination so we can redirect back after login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/** Apply proxy to all routes except Next.js internals and static files */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.ico$).*)',
  ],
};
