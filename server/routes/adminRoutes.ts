import { Router } from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  toggleUserBlock,
  getAllTransactions,
} from '../controllers/adminController.ts';
import { requireAuth, authorizeRoles } from '../middleware/auth.ts';

const router = Router();

router.use(requireAuth, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.put('/users/:userId/block', toggleUserBlock);
router.get('/transactions', getAllTransactions);

export default router;
