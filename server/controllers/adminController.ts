import { Response } from 'express';
import { dbStore } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';
import { fromNodeHeaders, getAuth } from '../lib/auth.ts';
import { authUserToAppRecord } from '../lib/dbSync.ts';
import { APP_ROLES, AppRole } from '../lib/roles.ts';

export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin authorization required.' });
      return;
    }

    const totalUsers = dbStore.users.length;
    const totalProperties = dbStore.properties.length;
    const pendingProperties = dbStore.properties.filter((p) => p.status === 'pending').length;
    const approvedProperties = dbStore.properties.filter((p) => p.status === 'approved').length;
    const rejectedProperties = dbStore.properties.filter((p) => p.status === 'rejected').length;

    const totalBookings = dbStore.bookings.length;
    const confirmedBookings = dbStore.bookings.filter((b) => b.status === 'confirmed').length;

    const totalRevenue = dbStore.transactions
      .filter((t) => t.status === 'succeeded')
      .reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalUsers,
        totalProperties,
        pendingProperties,
        approvedProperties,
        rejectedProperties,
        totalBookings,
        confirmedBookings,
        totalTransactions: dbStore.transactions.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
  }
};

/**
 * List users for the admin directory.
 *
 * Real users come from Better Auth (source of truth incl. role/ban status).
 * Catalog-only records (e.g. seeded property owners referenced by listings)
 * are appended so existing dashboards keep working — these are content
 * records, not login credentials.
 */
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin authorization required.' });
      return;
    }

    const { role, search } = req.query;
    const searchStr = typeof search === 'string' && search.trim() ? search.trim() : '';

    const auth = getAuth();
    const result = (await auth.api.listUsers({
      query: searchStr
        ? { searchValue: searchStr, searchField: 'email', searchOperator: 'contains', limit: 500 }
        : { limit: 500 },
      headers: fromNodeHeaders(req.headers),
    })) as unknown as { users?: Array<Record<string, unknown>> };

    let users = (result?.users || []).map((u) => authUserToAppRecord(u as any));

    // Append catalog-only store records that are not Better Auth users so the
    // business directory stays intact (existing application data is preserved).
    for (const u of dbStore.users) {
      if (!users.some((existing) => existing._id === u._id)) {
        users.push({
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.avatar || '',
          phone: u.phone || '',
          bio: u.bio || '',
          isBlocked: u.isBlocked,
          createdAt: u.createdAt,
        });
      }
    }

    if (role && role !== 'all') {
      users = users.filter((u) => u.role === role);
    }
    if (searchStr) {
      const q = searchStr.toLowerCase();
      users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    res.status(200).json({ success: true, users });
  } catch (error: any) {
    console.error('Failed to retrieve users:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin authorization required.' });
      return;
    }

    const { userId } = req.params;
    const { role } = req.body;

    if (typeof role !== 'string' || !(APP_ROLES as readonly string[]).includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role. Allowed roles: tenant, owner, admin.' });
      return;
    }

    const targetUser = dbStore.users.find((u) => u._id === userId);
    if (!targetUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Persist the role change in Better Auth (source of truth).
    try {
      await getAuth().api.setRole({
        body: { userId, role: role as AppRole },
        headers: fromNodeHeaders(req.headers),
      } as never);
    } catch (err) {
      // Catalog-only record (not a Better Auth user) — still update the app store.
      console.warn(`[Admin] setRole skipped for ${userId}:`, (err as Error).message);
    }

    targetUser.role = role as AppRole;

    res.status(200).json({
      success: true,
      message: `User role updated to ${targetUser.role}.`,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        isBlocked: targetUser.isBlocked,
      },
    });
  } catch (error: any) {
    console.error('Failed to update user role:', error);
    res.status(500).json({ success: false, message: 'Failed to update user role.' });
  }
};

export const toggleUserBlock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin authorization required.' });
      return;
    }

    const { userId } = req.params;
    const targetUser = dbStore.users.find((u) => u._id === userId);

    if (!targetUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (targetUser._id === req.user.id) {
      res.status(400).json({ success: false, message: 'You cannot block your own admin account.' });
      return;
    }

    // Persist the ban in Better Auth — enforced on every authenticated request.
    try {
      const auth = getAuth();
      const headers = fromNodeHeaders(req.headers);
      if (targetUser.isBlocked) {
        await auth.api.unbanUser({ body: { userId }, headers } as never);
      } else {
        await auth.api.banUser({
          body: { userId, banReason: 'Suspended by an administrator.' },
          headers,
        } as never);
      }
    } catch (err) {
      console.warn(`[Admin] ban toggle skipped for ${userId}:`, (err as Error).message);
    }

    targetUser.isBlocked = !targetUser.isBlocked;

    res.status(200).json({
      success: true,
      message: `User has been ${targetUser.isBlocked ? 'suspended' : 'reactivated'}.`,
      isBlocked: targetUser.isBlocked,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to toggle user status.' });
  }
};

export const getAllTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin authorization required.' });
      return;
    }

    const transactions = [...dbStore.transactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json({ success: true, transactions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve transactions.' });
  }
};
