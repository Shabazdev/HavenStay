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
 *
 * On Vercel each serverless invocation may run on a fresh instance, so this
 * in-memory store is NOT shared across instances. Real registered users only
 * persist when MONGODB_URI is configured (Better Auth uses the mongodb
 * adapter in that case). Without MONGODB_URI, sign-up/sign-in works within a
 * single warm instance only — Vercel env must include MONGODB_URI.
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

/** True when a usable remote MongoDB URI is configured. */
export function isMongoConfigured(): boolean {
  const mongoUri = process.env.MONGODB_URI;
  return Boolean(mongoUri && !mongoUri.includes('<username>') && !mongoUri.includes('example.mongodb.net'));
}

let dbConnectionPromise: Promise<void> | null = null;

export async function connectDB() {
  if (!isMongoConfigured()) {
    console.log('[Database] No valid remote MONGODB_URI provided in environment. Using resilient in-memory data store.');
    return;
  }

  // Reuse an existing connection (required on serverless where invocations
  // may share a warm instance). `mongoose.connection.readyState === 1`
  // means already connected.
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (dbConnectionPromise) {
    return dbConnectionPromise;
  }

  dbConnectionPromise = mongoose
    .connect(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 8000,
    })
    .then(() => {
      console.log('[Database] Connected to MongoDB Atlas successfully.');
    })
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[Database] MongoDB Atlas connection error (${message}). Falling back safely to in-memory data store.`);
      dbConnectionPromise = null;
    });

  return dbConnectionPromise;
}
