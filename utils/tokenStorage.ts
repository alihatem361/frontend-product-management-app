/**
 * tokenStorage.ts
 *
 * Utility helpers for reading and writing the JWT auth token
 * using browser cookies (SameSite=Strict for CSRF protection).
 *
 * Note: We use a regular (non-httpOnly) cookie because DummyJSON
 * returns the token client-side. A Next.js API Route could be added
 * to set a true httpOnly cookie if needed in production.
 */

import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

/** Persist the token in a SameSite=Strict cookie (7-day expiry). */
export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,          // days
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
  });
}

/** Read the token from the cookie (returns undefined if absent). */
export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

/** Remove the token cookie on logout. */
export function removeToken(): void {
  Cookies.remove(TOKEN_KEY);
}
