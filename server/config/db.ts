import mongoose from 'mongoose';
import {
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_TRANSACTIONS,
  SeedUser,
  SeedProperty,
  SeedBooking,
  SeedReview,
  SeedTransaction,
} from '../seedData.ts';

/**
 * In-memory database store for resilient runtime execution.
 *
 * NOTE: seed "users" are catalog/owner content records (they are referenced by
 * seeded properties, bookings, reviews, and favorites). They are NOT login
 * credentials — authentication is handled exclusively by Better Auth.
 */
class InMemoryDatabase {
  users: SeedUser[] = [];
  properties: SeedProperty[] = [];
  bookings: SeedBooking[] = [];
  reviews: SeedReview[] = [];
  transactions: SeedTransaction[] = [];
  favorites: Record<string, string[]> = {
    user_tenant_001: ['prop_001', 'prop_003'],
  };

  constructor() {
    this.seed();
  }

  seed() {
    this.users = [...INITIAL_USERS];
    this.properties = [...INITIAL_PROPERTIES];
    this.bookings = [...INITIAL_BOOKINGS];
    this.reviews = [...INITIAL_REVIEWS];
    this.transactions = [...INITIAL_TRANSACTIONS];
    console.log('[Database] In-memory store seeded successfully with default data');
  }
}

export const dbStore = new InMemoryDatabase();

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('<username>') || mongoUri.includes('example.mongodb.net')) {
    console.log('[Database] No valid remote MONGODB_URI provided in environment. Using resilient in-memory data store.');
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log('[Database] Connected to MongoDB Atlas successfully.');
  } catch (err: any) {
    console.warn(`[Database] MongoDB Atlas connection error (${err.message}). Falling back safely to in-memory data store.`);
  }
}
