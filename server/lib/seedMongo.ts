/**
 * MongoDB property persistence.
 *
 * When MongoDB is configured and reachable, the property catalog is sourced
 * from (and persisted in) the Mongo `properties` collection:
 *
 *  1. On the first run after connect, the initial catalog is seeded into the
 *     collection (as documented product data — not demo-order mocking).
 *  2. The application store (`dbStore.properties`) is hydrated from the
 *     collection so every existing controller keeps working unchanged.
 *
 * If Mongo is not configured/reachable, the in-memory store keeps its default
 * catalog so the app degrades gracefully instead of erroring.
 */
import mongoose from 'mongoose';
import { PropertyModel, IProperty } from '../models/Property.ts';
import { dbStore } from '../config/db.ts';
import { INITIAL_PROPERTIES, SeedProperty } from '../seedData.ts';

function toPropertyDoc(p: SeedProperty): Omit<IProperty, '_id'> {
  return {
    title: p.title,
    description: p.description,
    category: p.category,
    location: {
      address: p.location.address,
      city: p.location.city,
      state: p.location.state || '',
      country: p.location.country || 'United States',
      zipCode: p.location.zipCode || '',
      lat: p.location.lat || 0,
      lng: p.location.lng || 0,
    },
    pricePerNight: p.pricePerNight,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    maxGuests: p.maxGuests,
    squareFeet: p.squareFeet || 0,
    amenities: [...(p.amenities || [])],
    images: [...(p.images || [])],
    owner: {
      id: p.owner.id,
      name: p.owner.name,
      email: p.owner.email,
      avatar: p.owner.avatar || '',
      phone: p.owner.phone || '',
    },
    status: p.status,
    rejectionFeedback: p.rejectionFeedback || '',
    featured: Boolean(p.featured),
    averageRating: Number(p.averageRating || 0),
    totalReviews: Number(p.totalReviews || 0),
    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  };
}

function toSeedProperty(doc: IProperty): SeedProperty {
  return {
    _id: String(doc._id),
    title: doc.title,
    description: doc.description,
    category: doc.category,
    location: {
      address: doc.location.address,
      city: doc.location.city,
      state: doc.location.state || '',
      country: doc.location.country || 'United States',
      zipCode: doc.location.zipCode || '',
      lat: Number(doc.location.lat || 0),
      lng: Number(doc.location.lng || 0),
    },
    pricePerNight: Number(doc.pricePerNight),
    bedrooms: Number(doc.bedrooms),
    bathrooms: Number(doc.bathrooms),
    maxGuests: Number(doc.maxGuests),
    squareFeet: Number(doc.squareFeet || 0),
    amenities: doc.amenities || [],
    images: doc.images || [],
    owner: {
      id: doc.owner.id,
      name: doc.owner.name,
      email: doc.owner.email,
      avatar: doc.owner.avatar || '',
      phone: doc.owner.phone || '',
    },
    status: doc.status,
    rejectionFeedback: doc.rejectionFeedback || '',
    featured: Boolean(doc.featured),
    averageRating: Number(doc.averageRating || 0),
    totalReviews: Number(doc.totalReviews || 0),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
  };
}

/**
 * Seeds the Mongo catalog once (when empty) and hydrates `dbStore.properties`
 * from MongoDB. Returns true when the store is Mongo-backed.
 */
export async function hydratePropertiesFromMongo(): Promise<boolean> {
  // Only runs when mongoose is connected to a real MongoDB database.
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    return false;
  }
  try {
    const existing = await PropertyModel.estimatedDocumentCount();
    if (existing === 0) {
      await PropertyModel.insertMany(INITIAL_PROPERTIES.map(toPropertyDoc));
      console.log('[Database] Property catalog seeded into MongoDB.');
    }
    const docs = (await PropertyModel.find().lean()) as unknown as IProperty[];
    dbStore.properties = docs.map(toSeedProperty);
    console.log(`[Database] Hydrated ${dbStore.properties.length} properties from MongoDB.`);
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[Database] MongoDB property hydration failed (${message}); using in-memory catalog.`);
    return false;
  }
}