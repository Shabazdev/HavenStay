import { Router } from 'express';
import { getOwnerAnalytics } from '../controllers/ownerController.ts';
import { requireAuth, authorizeRoles } from '../middleware/auth.ts';

const router = Router();

router.get('/analytics', requireAuth, authorizeRoles('owner', 'admin'), getOwnerAnalytics);

export default router;
