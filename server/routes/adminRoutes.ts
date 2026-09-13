import { Router } from 'express';
import {
  getAdminStats,
  getAllUsers,
  getAdminProperties,
  getAdminBookings,
  updateUserRole,
  toggleUserBlock,
  toggleUserStatusAlias,
  getAllTransactions,
} from '../controllers/adminController.ts';
import { requireAuth, authorizeRoles } from '../middleware/auth.ts';

const router = Router();

router.use(requireAuth, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/properties', getAdminProperties);
router.get('/users', getAllUsers);
router.get('/bookings', getAdminBookings);
router.put('/users/:userId/role', updateUserRole);
router.put('/users/:userId/block', toggleUserBlock);
// Compatibility aliases used by the admin dashboard.
router.get('/properties/all', getAdminProperties);
router.put('/users/:userId/status', toggleUserStatusAlias);
router.get('/transactions', getAllTransactions);

export default router;
