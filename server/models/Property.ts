import mongoose from 'mongoose';

export interface IProperty {
  _id?: string;
  title: string;
  description: string;
  category: 'Villa' | 'Apartment' | 'Cabin' | 'Penthouse' | 'Cottage' | 'Studio';
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    lat: number;
    lng: number;
  };
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  squareFeet: number;
  amenities: string[];
  images: string[];
  owner: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    phone: string;
  };
  status: 'approved' | 'pending' | 'rejected';
  rejectionFeedback?: string;
  featured: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PropertySchema = new mongoose.Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Villa', 'Apartment', 'Cabin', 'Penthouse', 'Cottage', 'Studio'],
      required: true,
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      country: { type: String, default: 'United States' },
      zipCode: { type: String, default: '' },
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    pricePerNight: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, required: true, min: 1 },
    bathrooms: { type: Number, required: true, min: 1 },
    maxGuests: { type: Number, required: true, min: 1 },
    squareFeet: { type: Number, default: 0 },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    owner: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
    },
    rejectionFeedback: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PropertyModel = mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
