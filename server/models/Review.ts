import mongoose from 'mongoose';

export interface IReview {
  _id?: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  categories: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    value: number;
  };
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new mongoose.Schema<IReview>(
  {
    propertyId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    categories: {
      cleanliness: { type: Number, default: 5 },
      accuracy: { type: Number, default: 5 },
      communication: { type: Number, default: 5 },
      location: { type: Number, default: 5 },
      value: { type: Number, default: 5 },
    },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
