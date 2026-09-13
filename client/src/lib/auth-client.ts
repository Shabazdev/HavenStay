/**
 * The single shared Better Auth client for the entire frontend.
 *
 * Every page/component must import from here — never create a second
 * auth client. Authentication state flows through `useSession()` (reactive)
 * and all mutations go through the same client so cookies and session state
 * always stay in sync.
 */
import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';

const SOCIAL_REDIRECT = '/dashboard/tenant';

/**
 * Resolve the Better Auth base URL at runtime:
 *  - Same-origin (`window.location.origin`) by default — works on localhost,
 *    Vercel production, and preview deployments without rebuilding.
 *  - If `VITE_API_URL` is set (split frontend/backend), use it and strip the
 *    trailing `/api` suffix since the auth client appends `/api/auth/*` itself.
 */
function resolveAuthBaseUrl(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const configured = ((import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_API_URL || '').trim();
  if (!configured) return window.location.origin;
  return configured.replace(/\/+$/, '').replace(/\/api$/, '') || window.location.origin;
}

export const authClient = createAuthClient({
  baseURL: resolveAuthBaseUrl(),
  plugins: [adminClient()],
});

export const { useSession, signIn, signUp, signOut, updateUser } = authClient;

/**
 * Google OAuth sign-in. Enabled only when the backend is configured with
 * GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET; otherwise shows a friendly toast
 * instead of failing with a raw OAuth error.
 */
export async function signInWithGoogle(): Promise<{ ok: boolean; message?: string }> {
  try {
    await signIn.social({
      provider: 'google',
      callbackURL: SOCIAL_REDIRECT,
    });
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Google sign-in is not available right now.';
    return { ok: false, message };
  }
}

export { authClient as default };