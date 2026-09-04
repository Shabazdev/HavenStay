import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders, getAuth } from '../lib/auth.ts';
import { AppRole, normalizeRole } from '../lib/roles.ts';

export type { AppRole };

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AppRole;
  avatar?: string;
  phone?: string;
  bio?: string;
  isBlocked: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

/**
 * Session-based authentication middleware backed by Better Auth.
 * Reads the httpOnly session cookie, resolves the session and returns the
 * real database user (role included). No JWTs in headers, no localStorage
 * tokens. Ban status is enforced from the server-side session record only.
 */
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await getAuth().api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    const user = (session as unknown as { user?: Record<string, unknown> | null })?.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required. Please sign in to continue.' });
      return;
    }

    if (user.banned === true) {
      res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
      return;
    }

    req.user = {
      id: user.id as string,
      email: user.email as string,
      name: user.name as string,
      role: normalizeRole(user.role),
      avatar: (user.avatar as string) || (user.image as string) || '',
      phone: (user.phone as string) || '',
      bio: (user.bio as string) || '',
      isBlocked: user.banned === true,
    };
    next();
  } catch (err) {
    console.warn('[Auth] Session verification failed:', err);
    res.status(401).json({ success: false, message: 'Your session could not be verified. Please sign in again.' });
  }
};

/** Restrict a route to specific roles. Must be used after requireAuth. */
export const authorizeRoles = (...allowedRoles: AppRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
      });
      return;
    }

    next();
  };
};
