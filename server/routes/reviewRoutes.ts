import { Router } from 'express';
import { addReview, getPropertyReviews } from '../controllers/reviewController.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = Router();

router.get('/property/:propertyId', getPropertyReviews);
router.post('/', requireAuth, addReview);

export default router;
