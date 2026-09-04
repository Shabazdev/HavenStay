import mongoose from 'mongoose';

export interface ITransaction {
  _id?: string;
  bookingId: string;
  propertyTitle: string;
  tenantName: string;
  tenantEmail: string;
  ownerName: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  stripePaymentId: string;
  paymentMethod: string;
  createdAt?: Date;
}

const TransactionSchema = new mongoose.Schema<ITransaction>(
  {
    bookingId: { type: String, required: true },
    propertyTitle: { type: String, required: true },
    tenantName: { type: String, required: true },
    tenantEmail: { type: String, required: true },
    ownerName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['succeeded', 'pending', 'failed'],
      default: 'succeeded',
    },
    stripePaymentId: { type: String, required: true },
    paymentMethod: { type: String, default: 'card' },
  },
  { timestamps: true }
);

export const TransactionModel =
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
