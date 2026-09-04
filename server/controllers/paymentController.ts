import { Response } from 'express';
import Stripe from 'stripe';
import { dbStore } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';
import { SeedTransaction } from '../seedData.ts';

let stripeClient: Stripe | null = null;

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes('your_stripe') || !key.startsWith('sk_')) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { bookingId } = req.body;
    if (!bookingId) {
      res.status(400).json({ success: false, message: 'Booking ID is required.' });
      return;
    }

    const booking = dbStore.bookings.find((b) => b._id === bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    if (booking.tenantId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this booking.' });
      return;
    }

    if (booking.paymentStatus === 'paid') {
      res.status(400).json({ success: false, message: 'This reservation has already been paid.' });
      return;
    }

    const amountInCents = Math.round(booking.pricing.totalAmount * 100);
    const stripe = getStripe();

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        metadata: {
          bookingId: booking._id,
          tenantId: booking.tenantId,
          propertyTitle: booking.propertyTitle,
        },
      });

      res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: booking.pricing.totalAmount,
      });
      return;
    }

    // Resilient simulated Stripe mode for instant testing without API keys
    const simulatedIntentId = `pi_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const simulatedClientSecret = `${simulatedIntentId}_secret_${Math.random().toString(36).substring(2, 10)}`;

    res.status(200).json({
      success: true,
      clientSecret: simulatedClientSecret,
      paymentIntentId: simulatedIntentId,
      amount: booking.pricing.totalAmount,
      isSimulated: true,
      message: 'Simulated Stripe test payment intent generated.',
    });
  } catch (error: any) {
    console.error('createPaymentIntent error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment intent.' });
  }
};

export const confirmPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { bookingId, paymentIntentId, paymentMethod = 'card_visa' } = req.body;
    const booking = dbStore.bookings.find((b) => b._id === bookingId);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.stripePaymentIntentId = paymentIntentId || `pi_paid_${Date.now()}`;

    // Record Transaction
    const transaction: SeedTransaction = {
      _id: `tx_${Date.now()}`,
      bookingId: booking._id,
      propertyTitle: booking.propertyTitle,
      tenantName: booking.tenantName,
      tenantEmail: booking.tenantEmail,
      ownerName: booking.ownerName,
      amount: booking.pricing.totalAmount,
      currency: 'USD',
      status: 'succeeded',
      stripePaymentId: booking.stripePaymentIntentId,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    dbStore.transactions.unshift(transaction);

    res.status(200).json({
      success: true,
      message: 'Payment confirmed and reservation booked!',
      booking,
      transaction,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to confirm payment.' });
  }
};
