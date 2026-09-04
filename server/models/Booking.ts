import mongoose from 'mongoose';

export interface IBooking {
  _id?: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantAvatar?: string;
  ownerId: string;
  ownerName: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  guestsCount: number;
  pricing: {
    pricePerNight: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    totalAmount: number;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  stripePaymentIntentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema = new mongoose.Schema<IBooking>(
  {
    propertyId: { type: String, required: true },
    propertyTitle: { type: String, required: true },
    propertyImage: { type: String, default: '' },
    propertyLocation: { type: String, default: '' },
    tenantId: { type: String, required: true },
    tenantName: { type: String, required: true },
    tenantEmail: { type: String, required: true },
    tenantAvatar: { type: String, default: '' },
    ownerId: { type: String, required: true },
    ownerName: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    totalNights: { type: Number, required: true },
    guestsCount: { type: Number, required: true },
    pricing: {
      pricePerNight: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      cleaningFee: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    stripePaymentIntentId: { type: String, default: '' },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
