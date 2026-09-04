import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useSession, signIn, signUp, signOut, updateUser } from '../lib/auth-client.ts';
import { User as AppUser, UserRole } from '../types/index.ts';

const VALID_ROLES: UserRole[] = ['tenant', 'owner', 'admin'];

export interface AuthResult {
  ok: boolean;
  message?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: RegisterInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<Pick<AppUser, 'name' | 'phone' | 'bio' | 'avatar'>>) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Map a Better Auth session user to the application's User shape. */
function mapSessionUser(sessionUser: Record<string, unknown>): AppUser {
  const role = VALID_ROLES.includes(sessionUser.role as UserRole)
    ? (sessionUser.role as UserRole)
    : 'tenant';
  return {
    _id: sessionUser.id as string,
    id: sessionUser.id as string,
    name: (sessionUser.name as string) || '',
    email: (sessionUser.email as string) || '',
    role,
    avatar: (sessionUser.avatar as string) || (sessionUser.image as string) || '',
    phone: (sessionUser.phone as string) || '',
    bio: (sessionUser.bio as string) || '',
    isBlocked: sessionUser.banned === true,
    createdAt: sessionUser.createdAt as string | undefined,
  };
}

function errorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null;
  const msg = (error as { message?: unknown })?.message;
  return typeof msg === 'string' && msg.trim() ? msg : fallback;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The browser client cannot mirror the server-side Better Auth schema
  // (additional user fields live server-side), so the reactive session hook
  // is typed via an assertion. Runtime behavior is unchanged.
  const { data, isPending, refetch } = useSession() as unknown as {
    data: { user?: Record<string, unknown> | null } | null;
    isPending: boolean;
    refetch: () => Promise<unknown>;
  };

  // Session data comes exclusively from Better Auth (httpOnly cookie).
  const user = useMemo<AppUser | null>(
    () => (data?.user ? mapSessionUser(data.user as unknown as Record<string, unknown>) : null),
    [data]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const res = await signIn.email({ email: email.trim().toLowerCase(), password });
        if (res.error) {
          return { ok: false, message: errorMessage(res.error, 'Invalid email or password.') ?? 'Invalid email or password.' };
        }
        await refetch();
        return { ok: true };
      } catch {
        return { ok: false, message: 'Unable to reach the server. Please check your connection and try again.' };
      }
    },
    [refetch]
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<AuthResult> => {
      try {
        const res = await signUp.email({
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          password: input.password,
        });
        if (res.error) {
          return {
            ok: false,
            message: errorMessage(res.error, 'Registration failed. Please try again.') ?? 'Registration failed.',
          };
        }
        await refetch();
        return { ok: true };
      } catch {
        return { ok: false, message: 'Unable to reach the server. Please check your connection and try again.' };
      }
    },
    [refetch]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await (signOut as unknown as () => Promise<unknown>)();
    } catch {
      // Session is cleared on the next get-session call; ignore network errors here.
    } finally {
      await refetch().catch(() => undefined);
    }
  }, [refetch]);

  const updateUserProfile = useCallback(
    async (data: Partial<Pick<AppUser, 'name' | 'phone' | 'bio' | 'avatar'>>): Promise<AuthResult> => {
      try {
        const res = await (updateUser as unknown as (
          d: Record<string, unknown>
        ) => Promise<{ error?: { message?: string } | null }>)({
          name: data.name,
          phone: data.phone ?? undefined,
          bio: data.bio ?? undefined,
          avatar: data.avatar ?? undefined,
        });
        if (res.error) {
          return { ok: false, message: errorMessage(res.error, 'Failed to update profile.') ?? 'Failed to update profile.' };
        }
        await refetch();
        return { ok: true };
      } catch {
        return { ok: false, message: 'Unable to reach the server. Please check your connection and try again.' };
      }
    },
    [refetch]
  );

  const value = useMemo<AuthContextType>(
    () => ({ user, isLoading: isPending, login, register, logout, updateUserProfile }),
    [user, isPending, login, register, logout, updateUserProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
