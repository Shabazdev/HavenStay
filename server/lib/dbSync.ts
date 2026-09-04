/**
 * Keeps the application's in-memory store (dbStore) in sync with the
 * Better Auth user database.
 *
 * The existing business controllers (bookings, favorites, reviews, owner
 * analytics, admin directory) resolve users through `dbStore.users`. This
 * bridge mirrors every authenticated user into that store so existing
 * business logic keeps working without changes and user records stay
 * persistent (they live in the Better Auth database — MongoDB when
 * configured, the in-memory adapter for the resilient dev fallback).
 */
import { dbStore } from '../config/db.ts';
import { AppRole, normalizeRole } from './roles.ts';

/** Shape of a user record as returned by Better Auth (session / hooks). */
export interface AuthUserDoc {
  id: string;
  name: string;
  email: string;
  role?: unknown;
  banned?: boolean;
  avatar?: string;
  phone?: string;
  bio?: string;
  image?: string | null;
  createdAt?: string | Date;
}

export interface AppUserRecord {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: AppRole;
  avatar: string;
  phone: string;
  bio: string;
  isBlocked: boolean;
  createdAt: string;
}

export function authUserToAppRecord(user: AuthUserDoc): AppUserRecord {
  return {
    _id: user.id,
    id: user.id,
    name: user.name,
    email: user.email.toLowerCase().trim(),
    role: normalizeRole(user.role),
    avatar: user.avatar || user.image || '',
    phone: user.phone || '',
    bio: user.bio || '',
    isBlocked: user.banned === true,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
  };
}

export function findAppUser(idOrEmail: string) {
  const query = String(idOrEmail).toLowerCase().trim();
  return dbStore.users.find(
    (u) => u._id === idOrEmail || u.email.toLowerCase() === query
  );
}

/** Insert or update the dbStore record for an authenticated Better Auth user. */
export function upsertAuthUserSync(user: AuthUserDoc): AppUserRecord {
  const record = authUserToAppRecord(user);
  const existing = findAppUser(record._id) || findAppUser(record.email);
  if (existing) {
    existing.name = record.name;
    existing.email = record.email;
    existing.role = record.role;
    existing.avatar = record.avatar;
    existing.phone = record.phone;
    existing.bio = record.bio;
    existing.isBlocked = record.isBlocked;
    return existing;
  }
  dbStore.users.push(record);
  return record;
}

/** Mirror profile/role/ban changes emitted by Better Auth into the app store. */
export function syncAuthUserUpdate(user: AuthUserDoc): AppUserRecord | undefined {
  return upsertAuthUserSync(user);
}

/** Backfill every Better Auth user into the app store (used on startup). */
export async function syncAllAuthUsers(getUsers: () => Promise<AuthUserDoc[]>): Promise<number> {
  const users = await getUsers().catch(() => []);
  for (const user of users) {
    try {
      upsertAuthUserSync(user);
    } catch (err) {
      console.warn('[Auth] Failed to sync user during startup:', err);
    }
  }
  return users.length;
}