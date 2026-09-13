import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getAllBookings,
  updateBookingStatus,
  updateBookingStatusWithCancelAlias,
} from '../controllers/bookingController.ts';
import { requireAuth, authorizeRoles } from '../middleware/auth.ts';

const router = Router();

router.post('/', requireAuth, createBooking);
router.get('/my-bookings', requireAuth, getMyBookings);
router.get('/owner-bookings', requireAuth, authorizeRoles('owner', 'admin'), getOwnerBookings);
// Compatibility alias used by the owner dashboard.
router.get('/owner/requests', requireAuth, authorizeRoles('owner', 'admin'), getOwnerBookings);
router.get('/all', requireAuth, authorizeRoles('admin'), getAllBookings);
router.put('/:id/status', requireAuth, updateBookingStatus);
// Compatibility alias used by the tenant dashboard ("cancel" action).
router.put('/:id/cancel', requireAuth, updateBookingStatusWithCancelAlias);

export default router;
