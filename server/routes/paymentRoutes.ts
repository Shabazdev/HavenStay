import { Router } from 'express';
import { createPaymentIntent, confirmPayment } from '../controllers/paymentController.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = Router();

router.post('/create-payment-intent', requireAuth, createPaymentIntent);
router.post('/confirm-payment', requireAuth, confirmPayment);

export default router;
