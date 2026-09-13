export type UserRole = 'tenant' | 'owner' | 'admin';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  bio?: string;
  isBlocked?: boolean;
  createdAt?: string;
}

export type PropertyCategory = 'Villa' | 'Apartment' | 'Cabin' | 'Penthouse' | 'Cottage' | 'Studio';

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  lat: number;
  lng: number;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  category: PropertyCategory;
  location: PropertyLocation;
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
  createdAt: string;
  updatedAt: string;
}

export interface BookingPricing {
  pricePerNight: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  totalAmount: number;
}

export interface Booking {
  _id: string;
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
  pricing: BookingPricing;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  stripePaymentIntentId?: string;
  createdAt: string;
}

export interface ReviewCategoryScores {
  cleanliness: number;
  accuracy: number;
  communication: number;
  location: number;
  value: number;
}

export interface Review {
  _id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  categories: ReviewCategoryScores;
  comment: string;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  transactionId?: string;
  platformFee?: number;
  hostPayout?: number;
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
  createdAt: string;
}

export interface PaginationData {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  // Aliases returned by older API payloads — accepted so both shapes work.
  totalCount?: number;
  page?: number;
}
