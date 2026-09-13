import { Request, Response } from 'express';
import { dbStore } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';
import { SeedBooking } from '../seedData.ts';

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { propertyId, checkIn, checkOut, guestsCount } = req.body;

    if (!propertyId || !checkIn || !checkOut || !guestsCount) {
      res.status(400).json({ success: false, message: 'Missing booking details (property, dates, or guests).' });
      return;
    }

    const property = dbStore.properties.find((p) => p._id === propertyId);
    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    if (property.status !== 'approved') {
      res.status(400).json({ success: false, message: 'This property is not currently accepting bookings.' });
      return;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = endDate.getTime() - startDate.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      res.status(400).json({ success: false, message: 'Check-out date must be after check-in date.' });
      return;
    }

    if (Number(guestsCount) > property.maxGuests) {
      res.status(400).json({
        success: false,
        message: `Maximum guest capacity for this property is ${property.maxGuests}.`,
      });
      return;
    }

    const pricePerNight = property.pricePerNight;
    const subtotal = pricePerNight * nights;
    const cleaningFee = Math.round(pricePerNight * 0.18);
    const serviceFee = Math.round(subtotal * 0.08);
    const taxes = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + cleaningFee + serviceFee + taxes;

    const tenantUser = dbStore.users.find((u) => u._id === req.user?.id);

    const newBooking: SeedBooking = {
      _id: `book_${Date.now()}`,
      propertyId: property._id,
      propertyTitle: property.title,
      propertyImage: property.images[0] || '',
      propertyLocation: `${property.location.city}, ${property.location.state}`,
      tenantId: req.user.id,
      tenantName: tenantUser?.name || req.user.name,
      tenantEmail: tenantUser?.email || req.user.email,
      tenantAvatar: tenantUser?.avatar || '',
      ownerId: property.owner.id,
      ownerName: property.owner.name,
      checkIn,
      checkOut,
      totalNights: nights,
      guestsCount: Number(guestsCount),
      pricing: {
        pricePerNight,
        subtotal,
        cleaningFee,
        serviceFee,
        taxes,
        totalAmount,
      },
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
    };

    dbStore.bookings.unshift(newBooking);

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully! Complete checkout to confirm your reservation.',
      booking: newBooking,
    });
  } catch (error: any) {
    console.error('createBooking error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking.' });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const myBookings = dbStore.bookings
      .filter((b) => b.tenantId === req.user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.status(200).json({ success: true, bookings: myBookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
  }
};

export const getOwnerBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const ownerBookings = dbStore.bookings
      .filter((b) => b.ownerId === req.user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.status(200).json({ success: true, bookings: ownerBookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve owner bookings.' });
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin authorization required.' });
      return;
    }

    const allBookings = [...dbStore.bookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json({ success: true, bookings: allBookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve all bookings.' });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    // The tenant "cancel" alias sends an empty body, so treat a missing
    // status on that route as 'cancelled'.
    const { status } = req.body as { status?: string };
    const effectiveStatus = status || (req.path.endsWith('/cancel') ? 'cancelled' : undefined);

    const booking = dbStore.bookings.find((b) => b._id === id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    if (!effectiveStatus || !['confirmed', 'cancelled', 'rejected'].includes(effectiveStatus)) {
      res.status(400).json({ success: false, message: 'A valid booking status is required.' });
      return;
    }

    const isTenant = booking.tenantId === req.user.id;
    const isOwner = booking.ownerId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isTenant && !isOwner && !isAdmin) {
      res.status(403).json({ success: false, message: 'Not authorized to manage this booking.' });
      return;
    }

    if (isTenant && !isAdmin && effectiveStatus !== 'cancelled') {
      res.status(403).json({ success: false, message: 'Tenants can only cancel bookings.' });
      return;
    }

    booking.status = effectiveStatus as SeedBooking['status'];
    if (effectiveStatus === 'cancelled' && booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${effectiveStatus}.`,
      booking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update booking status.' });
  }
};

/**
 * Alias handler for `PUT /api/bookings/:id/cancel` (used by the tenant
 * dashboard). Delegates to updateBookingStatus, which treats the missing
 * status body on the /cancel path as 'cancelled'.
 */
export const updateBookingStatusWithCancelAlias = async (req: Request, res: Response): Promise<void> => {
  return updateBookingStatus(req as AuthRequest, res);
};
