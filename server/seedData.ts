export interface SeedUser {
  _id: string;
  name: string;
  email: string;
  role: 'tenant' | 'owner' | 'admin';
  avatar: string;
  phone: string;
  bio: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface SeedProperty {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface SeedBooking {
  _id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantAvatar: string;
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
  createdAt: string;
}

export interface SeedReview {
  _id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  categories: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    value: number;
  };
  comment: string;
  createdAt: string;
}

export interface SeedTransaction {
  _id: string;
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

export const INITIAL_USERS: SeedUser[] = [
  {
    _id: 'user_admin_001',
    name: 'Alexander Wright',
    email: 'admin@havenstay.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 234-5678',
    bio: 'Chief Platform Administrator and Safety Operations Director at HavenStay.',
    isBlocked: false,
    createdAt: '2025-01-10T08:00:00.000Z',
  },
  {
    _id: 'user_owner_001',
    name: 'Eleanor Vance',
    email: 'owner@havenstay.com',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 876-5432',
    bio: 'Architect and boutique property host with a passion for sustainable luxury sanctuaries.',
    isBlocked: false,
    createdAt: '2025-02-14T10:30:00.000Z',
  },
  {
    _id: 'user_owner_002',
    name: 'Marcus Sterling',
    email: 'marcus@havenstay.com',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 345-9876',
    bio: 'Hospitality veteran with premium seaside villas in Malibu and Maui.',
    isBlocked: false,
    createdAt: '2025-03-01T12:00:00.000Z',
  },
  {
    _id: 'user_tenant_001',
    name: 'Sophia Chen',
    email: 'tenant@havenstay.com',
    role: 'tenant',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 432-1098',
    bio: 'Creative director & digital nomad seeking serene architectural getaways.',
    isBlocked: false,
    createdAt: '2025-04-12T09:15:00.000Z',
  },
];

export const INITIAL_PROPERTIES: SeedProperty[] = [
  {
    _id: 'prop_001',
    title: 'Azure Horizon Cliffside Infinity Villa',
    description: 'Perched high above the Pacific Ocean, this masterpiece features panoramic 270-degree floor-to-ceiling glass walls, an expansive cantilevered infinity pool, heated spa, outdoor kitchen, and private descent path to the cove.',
    category: 'Villa',
    location: {
      address: '28400 Pacific Coast Highway',
      city: 'Malibu',
      state: 'California',
      country: 'United States',
      zipCode: '90265',
      lat: 34.0259,
      lng: -118.7798,
    },
    pricePerNight: 850,
    bedrooms: 4,
    bathrooms: 4.5,
    maxGuests: 8,
    squareFeet: 5200,
    amenities: [
      'Infinity Pool',
      'Ocean View',
      'Hot Tub',
      'Chef Kitchen',
      'High-Speed WiFi',
      'Air Conditioning',
      'Free Parking',
      'EV Charger',
      'Fireplace',
      'Smart TV'
    ],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80'
    ],
    owner: {
      id: 'user_owner_001',
      name: 'Eleanor Vance',
      email: 'owner@havenstay.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 876-5432',
    },
    status: 'approved',
    featured: true,
    averageRating: 4.96,
    totalReviews: 24,
    createdAt: '2025-05-01T10:00:00.000Z',
    updatedAt: '2025-05-01T10:00:00.000Z',
  },
  {
    _id: 'prop_002',
    title: 'The Glass Crown Penthouse at Tribeca',
    description: 'A duplex sky residence commanding dramatic views of the Manhattan skyline. Features triple-height ceilings, Italian marble waterfall island, gas fireplace, private wrap-around terrace, and bespoke designer furnishings.',
    category: 'Penthouse',
    location: {
      address: '74 Franklin Street, Penthouse B',
      city: 'New York',
      state: 'New York',
      country: 'United States',
      zipCode: '10013',
      lat: 40.7183,
      lng: -74.0048,
    },
    pricePerNight: 720,
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    squareFeet: 3400,
    amenities: [
      'Skyline View',
      'Private Terrace',
      'High-Speed WiFi',
      'Gym Access',
      'Air Conditioning',
      'Doorman 24/7',
      'Workspace',
      'Smart TV',
      'Sound System',
      'Wine Cellar'
    ],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80'
    ],
    owner: {
      id: 'user_owner_001',
      name: 'Eleanor Vance',
      email: 'owner@havenstay.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 876-5432',
    },
    status: 'approved',
    featured: true,
    averageRating: 4.92,
    totalReviews: 18,
    createdAt: '2025-05-04T14:30:00.000Z',
    updatedAt: '2025-05-04T14:30:00.000Z',
  },
  {
    _id: 'prop_003',
    title: 'Nordic Alpine Pine Lodge & Cedar Spa',
    description: 'Nestled within ancient Aspen and pine groves, this Scandinavian-inspired chalet combines raw timber architecture, black steel detailing, an authentic outdoor cedar barrel sauna, hot tub, and ski-in/ski-out convenience.',
    category: 'Cabin',
    location: {
      address: '1120 Peak View Road',
      city: 'Aspen',
      state: 'Colorado',
      country: 'United States',
      zipCode: '81611',
      lat: 39.1911,
      lng: -106.8175,
    },
    pricePerNight: 590,
    bedrooms: 4,
    bathrooms: 3.5,
    maxGuests: 8,
    squareFeet: 3800,
    amenities: [
      'Mountain View',
      'Cedar Sauna',
      'Hot Tub',
      'Stone Fireplace',
      'Ski-in/Ski-out',
      'High-Speed WiFi',
      'Chef Kitchen',
      'Free Parking',
      'Pet Friendly',
      'Heated Floors'
    ],
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80'
    ],
    owner: {
      id: 'user_owner_002',
      name: 'Marcus Sterling',
      email: 'marcus@havenstay.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 345-9876',
    },
    status: 'approved',
    featured: true,
    averageRating: 4.98,
    totalReviews: 31,
    createdAt: '2025-05-10T11:00:00.000Z',
    updatedAt: '2025-05-10T11:00:00.000Z',
  },
  {
    _id: 'prop_004',
    title: 'Minimalist Desert Solarium Estate',
    description: 'An architectural marvel blending seamlessly into the Mojave desert boulders. Features rammed-earth walls, solar energy array, deep plunge pool, star-gazing deck, and floor-to-ceiling sliding glass doors.',
    category: 'Villa',
    location: {
      address: '6450 Boulder Canyon Trail',
      city: 'Joshua Tree',
      state: 'California',
      country: 'United States',
      zipCode: '92252',
      lat: 34.1347,
      lng: -116.3131,
    },
    pricePerNight: 460,
    bedrooms: 3,
    bathrooms: 2.5,
    maxGuests: 6,
    squareFeet: 2700,
    amenities: [
      'Plunge Pool',
      'Desert Mountain View',
      'Stargazing Deck',
      'Fire Pit',
      'High-Speed WiFi',
      'Air Conditioning',
      'Workspace',
      'EV Charger',
      'Sound System',
      'Outdoor Shower'
    ],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80'
    ],
    owner: {
      id: 'user_owner_001',
      name: 'Eleanor Vance',
      email: 'owner@havenstay.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 876-5432',
    },
    status: 'approved',
    featured: true,
    averageRating: 4.95,
    totalReviews: 20,
    createdAt: '2025-05-15T15:20:00.000Z',
    updatedAt: '2025-05-15T15:20:00.000Z',
  },
  {
    _id: 'prop_005',
    title: 'Historic French Quarter Courtyard Residence',
    description: 'Charming 19th-century townhouse restored with modern luxury. Features exposed brick walls, 14-foot ceilings, wrought-iron balconies overlooking the historic avenue, and a private secluded lush fountain courtyard.',
    category: 'Apartment',
    location: {
      address: '912 Royal Street',
      city: 'New Orleans',
      state: 'Louisiana',
      country: 'United States',
      zipCode: '70116',
      lat: 29.9601,
      lng: -90.0622,
    },
    pricePerNight: 340,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    squareFeet: 1850,
    amenities: [
      'Private Courtyard',
      'Historic Balcony',
      'High-Speed WiFi',
      'Air Conditioning',
      'Chef Kitchen',
      'Washer & Dryer',
      'Coffee Bar',
      'Smart TV',
      'Workspace'
    ],
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80'
    ],
    owner: {
      id: 'user_owner_002',
      name: 'Marcus Sterling',
      email: 'marcus@havenstay.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 345-9876',
    },
    status: 'approved',
    featured: true,
    averageRating: 4.88,
    totalReviews: 15,
    createdAt: '2025-05-18T16:00:00.000Z',
    updatedAt: '2025-05-18T16:00:00.000Z',
  },
  {
    _id: 'prop_006',
    title: 'Lakeside Cedar Glasshouse & Private Pier',
    description: 'Waterfront haven on Lake Tahoe. Step directly from the sun-drenched cedar deck onto your private boat dock. Complete with kayaks, paddleboards, outdoor hot tub, and stone fire pit overlooking the emerald water.',
    category: 'Cottage',
    location: {
      address: '4300 West Lake Boulevard',
      city: 'Lake Tahoe',
      state: 'California',
      country: 'United States',
      zipCode: '96145',
      lat: 39.1415,
      lng: -120.1554,
    },
    pricePerNight: 520,
    bedrooms: 3,
    bathrooms: 2.5,
    maxGuests: 6,
    squareFeet: 2600,
    amenities: [
      'Lakefront & Private Dock',
      'Hot Tub',
      'Kayaks Included',
      'Fire Pit',
      'High-Speed WiFi',
      'Free Parking',
      'Pet Friendly',
      'Stone Fireplace',
      'BBQ Grill'
    ],
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80'
    ],
    owner: {
      id: 'user_owner_001',
      name: 'Eleanor Vance',
      email: 'owner@havenstay.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 876-5432',
    },
    status: 'approved',
    featured: true,
    averageRating: 4.97,
    totalReviews: 27,
    createdAt: '2025-05-20T12:00:00.000Z',
    updatedAt: '2025-05-20T12:00:00.000Z',
  },
  {
    _id: 'prop_007',
    title: 'SoHo Industrial Loft with Sunken Living Room',
    description: 'Iconic cast-iron district loft with 16ft soaring ceilings, exposed brick, fluted columns, custom brass kitchen, and soundproof studio workspace perfect for digital creatives.',
    category: 'Studio',
    location: {
      address: '142 Mercer Street',
      city: 'New York',
      state: 'New York',
      country: 'United States',
      zipCode: '10012',
      lat: 40.7246,
      lng: -73.9981,
    },
    pricePerNight: 395,
    bedrooms: 1,
    bathrooms: 1.5,
    maxGuests: 2,
    squareFeet: 1550,
    amenities: [
      'High-Speed WiFi',
      'Creative Workspace',
      'Air Conditioning',
      'Smart TV',
      'Sound System',
      'Chef Kitchen',
      'Coffee Bar'
    ],
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80'
    ],
    owner: {
      id: 'user_owner_002',
      name: 'Marcus Sterling',
      email: 'marcus@havenstay.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 345-9876',
    },
    status: 'pending',
    featured: false,
    averageRating: 0,
    totalReviews: 0,
    createdAt: '2025-06-01T09:00:00.000Z',
    updatedAt: '2025-06-01T09:00:00.000Z',
  },
  {
    _id: 'prop_008',
    title: 'Smoky Mountains Timber Ridge Retreat',
    description: 'High elevation cabin with wraparound observation deck, outdoor jacuzzi, game room with billiards, and direct access to mountain hiking trails.',
    category: 'Cabin',
    location: {
      address: '882 Whispering Pines Way',
      city: 'Gatlinburg',
      state: 'Tennessee',
      country: 'United States',
      zipCode: '37738',
      lat: 35.7143,
      lng: -83.5102,
    },
    pricePerNight: 290,
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    squareFeet: 2100,
    amenities: [
      'Mountain View',
      'Hot Tub',
      'Game Room',
      'Fireplace',
      'High-Speed WiFi',
      'Free Parking',
      'BBQ Grill'
    ],
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1400&q=80'
    ],
    owner: {
      id: 'user_owner_001',
      name: 'Eleanor Vance',
      email: 'owner@havenstay.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 876-5432',
    },
    status: 'rejected',
    rejectionFeedback: 'Please provide high-resolution photos of all bedrooms and upload proof of local short-term lodging permit.',
    featured: false,
    averageRating: 0,
    totalReviews: 0,
    createdAt: '2025-06-05T10:00:00.000Z',
    updatedAt: '2025-06-06T14:00:00.000Z',
  }
];

export const INITIAL_BOOKINGS: SeedBooking[] = [
  {
    _id: 'book_001',
    propertyId: 'prop_001',
    propertyTitle: 'Azure Horizon Cliffside Infinity Villa',
    propertyImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80',
    propertyLocation: 'Malibu, California',
    tenantId: 'user_tenant_001',
    tenantName: 'Sophia Chen',
    tenantEmail: 'tenant@havenstay.com',
    tenantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    ownerId: 'user_owner_001',
    ownerName: 'Eleanor Vance',
    checkIn: '2025-08-10',
    checkOut: '2025-08-14',
    totalNights: 4,
    guestsCount: 4,
    pricing: {
      pricePerNight: 850,
      subtotal: 3400,
      cleaningFee: 200,
      serviceFee: 240,
      taxes: 180,
      totalAmount: 4020,
    },
    status: 'confirmed',
    paymentStatus: 'paid',
    stripePaymentIntentId: 'pi_test_3N82jKlz982312haven',
    createdAt: '2025-07-01T10:20:00.000Z',
  },
  {
    _id: 'book_002',
    propertyId: 'prop_002',
    propertyTitle: 'The Glass Crown Penthouse at Tribeca',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
    propertyLocation: 'New York, New York',
    tenantId: 'user_tenant_001',
    tenantName: 'Sophia Chen',
    tenantEmail: 'tenant@havenstay.com',
    tenantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    ownerId: 'user_owner_001',
    ownerName: 'Eleanor Vance',
    checkIn: '2025-09-15',
    checkOut: '2025-09-18',
    totalNights: 3,
    guestsCount: 2,
    pricing: {
      pricePerNight: 720,
      subtotal: 2160,
      cleaningFee: 180,
      serviceFee: 160,
      taxes: 120,
      totalAmount: 2620,
    },
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: '2025-07-05T14:40:00.000Z',
  }
];

export const INITIAL_REVIEWS: SeedReview[] = [
  {
    _id: 'rev_001',
    propertyId: 'prop_001',
    userId: 'user_tenant_001',
    userName: 'Sophia Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      value: 5,
    },
    comment: 'An utterly breathtaking sanctuary. Watching the sunset over the Pacific from the infinity pool was an unforgettable experience. Spotlessly clean and Eleanor was a gracious host!',
    createdAt: '2025-06-12T16:00:00.000Z',
  },
  {
    _id: 'rev_002',
    propertyId: 'prop_003',
    userId: 'user_tenant_001',
    userName: 'Sophia Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      value: 5,
    },
    comment: 'The cedar barrel sauna after a brisk hike in Aspen was pure bliss. True Scandinavian craftsmanship and serenity.',
    createdAt: '2025-06-20T18:30:00.000Z',
  }
];

export const INITIAL_TRANSACTIONS: SeedTransaction[] = [
  {
    _id: 'tx_001',
    bookingId: 'book_001',
    propertyTitle: 'Azure Horizon Cliffside Infinity Villa',
    tenantName: 'Sophia Chen',
    tenantEmail: 'tenant@havenstay.com',
    ownerName: 'Eleanor Vance',
    amount: 4020,
    currency: 'USD',
    status: 'succeeded',
    stripePaymentId: 'pi_test_3N82jKlz982312haven',
    paymentMethod: 'visa_card_4242',
    createdAt: '2025-07-01T10:25:00.000Z',
  }
];
