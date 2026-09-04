/**
 * Centralized Better Auth server configuration for HavenStay.
 *
 * - Email/password authentication (sign-up, sign-in, sign-out).
 * - Cookie-based, secure, persistent sessions with sliding refresh.
 * - MongoDB persistence via the official mongo adapter when MONGODB_URI is
 *   configured; in-memory adapter otherwise (resilient dev fallback that
 *   mirrors the rest of the application's store strategy).
 * - Admin plugin for server-side role management & bans (roles are never
 *   accepted from the client).
 * - `databaseHooks` keep the application's business store in sync and allow a
 *   server-side bootstrap admin defined purely through environment variables.
 */
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { fromNodeHeaders } from 'better-auth/node';
import { memoryAdapter } from '@better-auth/memory-adapter';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import mongoose from 'mongoose';
import { upsertAuthUserSync, syncAuthUserUpdate, AuthUserDoc } from './dbSync.ts';

export { fromNodeHeaders };

export const BETTER_AUTH_BASE_URL = (
  process.env.BETTER_AUTH_URL || process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`
).replace(/\/+$/, '');

/**
 * Read at call time (never at import time) so values loaded by
 * dotenv.config() during server startup are always visible.
 */
function bootstrapAdminEmail(): string {
  return (process.env.BETTER_AUTH_ADMIN_EMAIL || '').toLowerCase().trim();
}

/**
 * BETTER_AUTH_SECRET must be at least 32 chars of high entropy.
 * We never hardcode a production secret — only a clearly-marked dev fallback
 * so the app boots out of the box. In production the server refuses to start
 * without an explicit secret (configure via .env / secrets manager).
 */
function resolveSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('BETTER_AUTH_SECRET environment variable is required in production.');
  }
  console.warn('[Auth] BETTER_AUTH_SECRET not set — using a development-only secret. Sessions will reset on restart.');
  return 'dev-only-havenstay-secret-not-for-production-0123456789abcdef';
}

function hasValidMongoUri(): boolean {
  const uri = process.env.MONGODB_URI || '';
  return Boolean(
    uri &&
      !uri.includes('<username>') &&
      !uri.includes('example.mongodb.net') &&
      (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))
  );
}

function resolveDatabase() {
  if (hasValidMongoUri() && mongoose.connection.db) {
    console.log('[Auth] Using MongoDB adapter for Better Auth persistence.');
    return mongodbAdapter(mongoose.connection.db as never, {
      // Standalone MongoDB (no replica set) cannot run transactions.
      transaction: false,
      // Keep singular collection names (user, session, account, verification).
      usePlural: false,
    });
  }
  console.log('[Auth] No MongoDB connection — using in-memory adapter for Better Auth.');
  // Production deployments should always provide MONGODB_URI for persistent sessions.
  return memoryAdapter({ user: [], session: [], account: [], verification: [] });
}

export function createAuth() {
  return betterAuth({
    appName: 'HavenStay',
    baseURL: BETTER_AUTH_BASE_URL,
    secret: resolveSecret(),
    database: resolveDatabase(),

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // refresh expiration once per day of activity
      cookieCache: { enabled: true, maxAge: 60 * 60 * 24 * 7 },
    },

    user: {
      additionalFields: {
        phone: { type: 'string', required: false, input: true },
        bio: { type: 'string', required: false, input: true },
        avatar: { type: 'string', required: false, input: true },
      },
    },

    advanced: {
      cookiePrefix: 'havenstay',
      defaultCookieAttributes: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    },

    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const email = ((user as unknown as { email?: string }).email || '').toLowerCase().trim();
            // Server-side bootstrap admin (email defined via env). No one else can
            // receive the admin role at signup.
            if (email && email === bootstrapAdminEmail()) {
              return { data: { ...user, role: 'admin' } as never };
            }
            return { data: user as never };
          },
          after: async (user) => {
            try {
              upsertAuthUserSync(user as unknown as AuthUserDoc);
            } catch (err) {
              console.warn('[Auth] Failed to mirror new user into the application store.', err);
            }
          },
        },
        update: {
          after: async (user) => {
            try {
              syncAuthUserUpdate(user as unknown as AuthUserDoc);
            } catch (err) {
              console.warn('[Auth] Failed to mirror user update into the application store.', err);
            }
          },
        },
      },
    },

    plugins: [
      admin({
        defaultRole: 'tenant',
        adminRoles: ['admin'],
      }),
    ],
  });
}

export type AuthInstance = ReturnType<typeof createAuth>;

/**
 * Optional bootstrap admin: when BETTER_AUTH_ADMIN_EMAIL and
 * BETTER_AUTH_ADMIN_PASSWORD are configured and no account exists for that
 * email, the account is created server-side on startup. The 'admin' role is
 * assigned exclusively by the database hook above — the client can never set
 * a role. Leave the variables empty to disable this behavior.
 */
export async function ensureBootstrapAdmin(auth: AuthInstance): Promise<void> {
  const adminEmail = bootstrapAdminEmail();
  if (!adminEmail) return;
  const password = process.env.BETTER_AUTH_ADMIN_PASSWORD || '';
  if (!password) {
    console.log('[Auth] BETTER_AUTH_ADMIN_EMAIL is set without a password — skipping bootstrap admin creation.');
    return;
  }
  if (password.length < 8) {
    console.warn('[Auth] BETTER_AUTH_ADMIN_PASSWORD must be at least 8 characters — skipping bootstrap admin creation.');
    return;
  }
  try {
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password,
        name: 'HavenStay Administrator',
      },
    });
    console.log(`[Auth] Bootstrap admin account ready for ${adminEmail}.`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/already exist/i.test(message)) {
      console.log('[Auth] Bootstrap admin already exists — skipping creation.');
      return;
    }
    console.warn('[Auth] Bootstrap admin creation failed:', message);
  }
}

let authInstance: AuthInstance | null = null;

/** Must be called once during server startup *after* the database connects. */
export function initAuth(): AuthInstance {
  if (!authInstance) authInstance = createAuth();
  return authInstance;
}

export function getAuth(): AuthInstance {
  if (!authInstance) {
    throw new Error('[Auth] Better Auth has not been initialized. Call initAuth() during server startup.');
  }
  return authInstance;
}