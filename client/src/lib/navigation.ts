import { UserRole } from '../types/index.ts';

/** Map a user role to the role-based dashboard route. */
export function dashboardRoute(role: UserRole | undefined | null): string {
  if (role === 'admin') return '/dashboard/admin';
  if (role === 'owner') return '/dashboard/owner';
  return '/dashboard/tenant';
}