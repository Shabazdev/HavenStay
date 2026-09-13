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
    // better-auth's client does NOT throw on HTTP errors — it resolves with
    // `{ error }`. Check it so failures surface instead of spinning forever.
    const result = (await signIn.social({
      provider: 'google',
      callbackURL: SOCIAL_REDIRECT,
    })) as { error?: { message?: string; status?: number } | null } | undefined;

    if (result?.error) {
      const status = result.error.status;
      const message =
        status === 400 || /provider|configured|not enabled/i.test(result.error.message || '')
          ? 'Google sign-in is not configured yet. Please use email and password, or contact the administrator.'
          : result.error.message || 'Google sign-in failed. Please try again.';
      return { ok: false, message };
    }
    // When the provider is configured, the browser is redirected to Google and
    // this promise typically never resolves — reaching here means success.
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Google sign-in is not available right now.';
    return { ok: false, message };
  }
}

export { authClient as default };