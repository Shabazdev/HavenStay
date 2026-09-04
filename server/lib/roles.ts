/**
 * Shared application roles for HavenStay.
 *
 * Roles are assigned exclusively server-side (Better Auth admin plugin).
 * The frontend can never set a role — registration always creates a `tenant`,
 * and `owner`/`admin` are granted by an authenticated administrator.
 */
export const APP_ROLES = ['tenant', 'owner', 'admin'] as const;

export type AppRole = (typeof APP_ROLES)[number];

export function isAppRole(role: unknown): role is AppRole {
  return typeof role === 'string' && (APP_ROLES as readonly string[]).includes(role);
}

/** Safely coerce any value coming from the auth session/adapter into an AppRole. */
export function normalizeRole(role: unknown): AppRole {
  return isAppRole(role) ? role : 'tenant';
}