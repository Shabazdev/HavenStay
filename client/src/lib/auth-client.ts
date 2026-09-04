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

export const authClient = createAuthClient({
  // Same-origin: Express serves the SPA and the Better Auth API on one host.
  baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
  plugins: [adminClient()],
});

export const { useSession, signIn, signUp, signOut, updateUser } = authClient;
export { authClient as default };