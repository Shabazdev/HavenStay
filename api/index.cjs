var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// serverless-entry.ts
var serverless_entry_exports = {};
__export(serverless_entry_exports, {
  config: () => config,
  default: () => handler
});
module.exports = __toCommonJS(serverless_entry_exports);

// server/app.ts
var import_express7 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);

// server/config/db.ts
var import_mongoose = __toESM(require("mongoose"), 1);

// server/seedData.ts
var INITIAL_USERS = [
  {
    _id: "user_admin_001",
    name: "Alexander Wright",
    email: "admin@havenstay.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    phone: "+1 (555) 234-5678",
    bio: "Chief Platform Administrator and Safety Operations Director at HavenStay.",
    isBlocked: false,
    createdAt: "2025-01-10T08:00:00.000Z"
  },
  {
    _id: "user_owner_001",
    name: "Eleanor Vance",
    email: "owner@havenstay.com",
    role: "owner",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    phone: "+1 (555) 876-5432",
    bio: "Architect and boutique property host with a passion for sustainable luxury sanctuaries.",
    isBlocked: false,
    createdAt: "2025-02-14T10:30:00.000Z"
  },
  {
    _id: "user_owner_002",
    name: "Marcus Sterling",
    email: "marcus@havenstay.com",
    role: "owner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    phone: "+1 (555) 345-9876",
    bio: "Hospitality veteran with premium seaside villas in Malibu and Maui.",
    isBlocked: false,
    createdAt: "2025-03-01T12:00:00.000Z"
  },
  {
    _id: "user_tenant_001",
    name: "Sophia Chen",
    email: "tenant@havenstay.com",
    role: "tenant",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    phone: "+1 (555) 432-1098",
    bio: "Creative director & digital nomad seeking serene architectural getaways.",
    isBlocked: false,
    createdAt: "2025-04-12T09:15:00.000Z"
  }
];
var INITIAL_PROPERTIES = [
  {
    _id: "prop_001",
    title: "Azure Horizon Cliffside Infinity Villa",
    description: "Perched high above the Pacific Ocean, this masterpiece features panoramic 270-degree floor-to-ceiling glass walls, an expansive cantilevered infinity pool, heated spa, outdoor kitchen, and private descent path to the cove.",
    category: "Villa",
    location: {
      address: "28400 Pacific Coast Highway",
      city: "Malibu",
      state: "California",
      country: "United States",
      zipCode: "90265",
      lat: 34.0259,
      lng: -118.7798
    },
    pricePerNight: 850,
    bedrooms: 4,
    bathrooms: 4.5,
    maxGuests: 8,
    squareFeet: 5200,
    amenities: [
      "Infinity Pool",
      "Ocean View",
      "Hot Tub",
      "Chef Kitchen",
      "High-Speed WiFi",
      "Air Conditioning",
      "Free Parking",
      "EV Charger",
      "Fireplace",
      "Smart TV"
    ],
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80"
    ],
    owner: {
      id: "user_owner_001",
      name: "Eleanor Vance",
      email: "owner@havenstay.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      phone: "+1 (555) 876-5432"
    },
    status: "approved",
    featured: true,
    averageRating: 4.96,
    totalReviews: 24,
    createdAt: "2025-05-01T10:00:00.000Z",
    updatedAt: "2025-05-01T10:00:00.000Z"
  },
  {
    _id: "prop_002",
    title: "The Glass Crown Penthouse at Tribeca",
    description: "A duplex sky residence commanding dramatic views of the Manhattan skyline. Features triple-height ceilings, Italian marble waterfall island, gas fireplace, private wrap-around terrace, and bespoke designer furnishings.",
    category: "Penthouse",
    location: {
      address: "74 Franklin Street, Penthouse B",
      city: "New York",
      state: "New York",
      country: "United States",
      zipCode: "10013",
      lat: 40.7183,
      lng: -74.0048
    },
    pricePerNight: 720,
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    squareFeet: 3400,
    amenities: [
      "Skyline View",
      "Private Terrace",
      "High-Speed WiFi",
      "Gym Access",
      "Air Conditioning",
      "Doorman 24/7",
      "Workspace",
      "Smart TV",
      "Sound System",
      "Wine Cellar"
    ],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80"
    ],
    owner: {
      id: "user_owner_001",
      name: "Eleanor Vance",
      email: "owner@havenstay.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      phone: "+1 (555) 876-5432"
    },
    status: "approved",
    featured: true,
    averageRating: 4.92,
    totalReviews: 18,
    createdAt: "2025-05-04T14:30:00.000Z",
    updatedAt: "2025-05-04T14:30:00.000Z"
  },
  {
    _id: "prop_003",
    title: "Nordic Alpine Pine Lodge & Cedar Spa",
    description: "Nestled within ancient Aspen and pine groves, this Scandinavian-inspired chalet combines raw timber architecture, black steel detailing, an authentic outdoor cedar barrel sauna, hot tub, and ski-in/ski-out convenience.",
    category: "Cabin",
    location: {
      address: "1120 Peak View Road",
      city: "Aspen",
      state: "Colorado",
      country: "United States",
      zipCode: "81611",
      lat: 39.1911,
      lng: -106.8175
    },
    pricePerNight: 590,
    bedrooms: 4,
    bathrooms: 3.5,
    maxGuests: 8,
    squareFeet: 3800,
    amenities: [
      "Mountain View",
      "Cedar Sauna",
      "Hot Tub",
      "Stone Fireplace",
      "Ski-in/Ski-out",
      "High-Speed WiFi",
      "Chef Kitchen",
      "Free Parking",
      "Pet Friendly",
      "Heated Floors"
    ],
    images: [
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80"
    ],
    owner: {
      id: "user_owner_002",
      name: "Marcus Sterling",
      email: "marcus@havenstay.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      phone: "+1 (555) 345-9876"
    },
    status: "approved",
    featured: true,
    averageRating: 4.98,
    totalReviews: 31,
    createdAt: "2025-05-10T11:00:00.000Z",
    updatedAt: "2025-05-10T11:00:00.000Z"
  },
  {
    _id: "prop_004",
    title: "Minimalist Desert Solarium Estate",
    description: "An architectural marvel blending seamlessly into the Mojave desert boulders. Features rammed-earth walls, solar energy array, deep plunge pool, star-gazing deck, and floor-to-ceiling sliding glass doors.",
    category: "Villa",
    location: {
      address: "6450 Boulder Canyon Trail",
      city: "Joshua Tree",
      state: "California",
      country: "United States",
      zipCode: "92252",
      lat: 34.1347,
      lng: -116.3131
    },
    pricePerNight: 460,
    bedrooms: 3,
    bathrooms: 2.5,
    maxGuests: 6,
    squareFeet: 2700,
    amenities: [
      "Plunge Pool",
      "Desert Mountain View",
      "Stargazing Deck",
      "Fire Pit",
      "High-Speed WiFi",
      "Air Conditioning",
      "Workspace",
      "EV Charger",
      "Sound System",
      "Outdoor Shower"
    ],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80"
    ],
    owner: {
      id: "user_owner_001",
      name: "Eleanor Vance",
      email: "owner@havenstay.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      phone: "+1 (555) 876-5432"
    },
    status: "approved",
    featured: true,
    averageRating: 4.95,
    totalReviews: 20,
    createdAt: "2025-05-15T15:20:00.000Z",
    updatedAt: "2025-05-15T15:20:00.000Z"
  },
  {
    _id: "prop_005",
    title: "Historic French Quarter Courtyard Residence",
    description: "Charming 19th-century townhouse restored with modern luxury. Features exposed brick walls, 14-foot ceilings, wrought-iron balconies overlooking the historic avenue, and a private secluded lush fountain courtyard.",
    category: "Apartment",
    location: {
      address: "912 Royal Street",
      city: "New Orleans",
      state: "Louisiana",
      country: "United States",
      zipCode: "70116",
      lat: 29.9601,
      lng: -90.0622
    },
    pricePerNight: 340,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    squareFeet: 1850,
    amenities: [
      "Private Courtyard",
      "Historic Balcony",
      "High-Speed WiFi",
      "Air Conditioning",
      "Chef Kitchen",
      "Washer & Dryer",
      "Coffee Bar",
      "Smart TV",
      "Workspace"
    ],
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80"
    ],
    owner: {
      id: "user_owner_002",
      name: "Marcus Sterling",
      email: "marcus@havenstay.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      phone: "+1 (555) 345-9876"
    },
    status: "approved",
    featured: true,
    averageRating: 4.88,
    totalReviews: 15,
    createdAt: "2025-05-18T16:00:00.000Z",
    updatedAt: "2025-05-18T16:00:00.000Z"
  },
  {
    _id: "prop_006",
    title: "Lakeside Cedar Glasshouse & Private Pier",
    description: "Waterfront haven on Lake Tahoe. Step directly from the sun-drenched cedar deck onto your private boat dock. Complete with kayaks, paddleboards, outdoor hot tub, and stone fire pit overlooking the emerald water.",
    category: "Cottage",
    location: {
      address: "4300 West Lake Boulevard",
      city: "Lake Tahoe",
      state: "California",
      country: "United States",
      zipCode: "96145",
      lat: 39.1415,
      lng: -120.1554
    },
    pricePerNight: 520,
    bedrooms: 3,
    bathrooms: 2.5,
    maxGuests: 6,
    squareFeet: 2600,
    amenities: [
      "Lakefront & Private Dock",
      "Hot Tub",
      "Kayaks Included",
      "Fire Pit",
      "High-Speed WiFi",
      "Free Parking",
      "Pet Friendly",
      "Stone Fireplace",
      "BBQ Grill"
    ],
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80"
    ],
    owner: {
      id: "user_owner_001",
      name: "Eleanor Vance",
      email: "owner@havenstay.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      phone: "+1 (555) 876-5432"
    },
    status: "approved",
    featured: true,
    averageRating: 4.97,
    totalReviews: 27,
    createdAt: "2025-05-20T12:00:00.000Z",
    updatedAt: "2025-05-20T12:00:00.000Z"
  },
  {
    _id: "prop_007",
    title: "SoHo Industrial Loft with Sunken Living Room",
    description: "Iconic cast-iron district loft with 16ft soaring ceilings, exposed brick, fluted columns, custom brass kitchen, and soundproof studio workspace perfect for digital creatives.",
    category: "Studio",
    location: {
      address: "142 Mercer Street",
      city: "New York",
      state: "New York",
      country: "United States",
      zipCode: "10012",
      lat: 40.7246,
      lng: -73.9981
    },
    pricePerNight: 395,
    bedrooms: 1,
    bathrooms: 1.5,
    maxGuests: 2,
    squareFeet: 1550,
    amenities: [
      "High-Speed WiFi",
      "Creative Workspace",
      "Air Conditioning",
      "Smart TV",
      "Sound System",
      "Chef Kitchen",
      "Coffee Bar"
    ],
    images: [
      "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80"
    ],
    owner: {
      id: "user_owner_002",
      name: "Marcus Sterling",
      email: "marcus@havenstay.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      phone: "+1 (555) 345-9876"
    },
    status: "pending",
    featured: false,
    averageRating: 0,
    totalReviews: 0,
    createdAt: "2025-06-01T09:00:00.000Z",
    updatedAt: "2025-06-01T09:00:00.000Z"
  },
  {
    _id: "prop_008",
    title: "Smoky Mountains Timber Ridge Retreat",
    description: "High elevation cabin with wraparound observation deck, outdoor jacuzzi, game room with billiards, and direct access to mountain hiking trails.",
    category: "Cabin",
    location: {
      address: "882 Whispering Pines Way",
      city: "Gatlinburg",
      state: "Tennessee",
      country: "United States",
      zipCode: "37738",
      lat: 35.7143,
      lng: -83.5102
    },
    pricePerNight: 290,
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    squareFeet: 2100,
    amenities: [
      "Mountain View",
      "Hot Tub",
      "Game Room",
      "Fireplace",
      "High-Speed WiFi",
      "Free Parking",
      "BBQ Grill"
    ],
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1400&q=80"
    ],
    owner: {
      id: "user_owner_001",
      name: "Eleanor Vance",
      email: "owner@havenstay.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      phone: "+1 (555) 876-5432"
    },
    status: "rejected",
    rejectionFeedback: "Please provide high-resolution photos of all bedrooms and upload proof of local short-term lodging permit.",
    featured: false,
    averageRating: 0,
    totalReviews: 0,
    createdAt: "2025-06-05T10:00:00.000Z",
    updatedAt: "2025-06-06T14:00:00.000Z"
  }
];
var INITIAL_BOOKINGS = [
  {
    _id: "book_001",
    propertyId: "prop_001",
    propertyTitle: "Azure Horizon Cliffside Infinity Villa",
    propertyImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80",
    propertyLocation: "Malibu, California",
    tenantId: "user_tenant_001",
    tenantName: "Sophia Chen",
    tenantEmail: "tenant@havenstay.com",
    tenantAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    ownerId: "user_owner_001",
    ownerName: "Eleanor Vance",
    checkIn: "2025-08-10",
    checkOut: "2025-08-14",
    totalNights: 4,
    guestsCount: 4,
    pricing: {
      pricePerNight: 850,
      subtotal: 3400,
      cleaningFee: 200,
      serviceFee: 240,
      taxes: 180,
      totalAmount: 4020
    },
    status: "confirmed",
    paymentStatus: "paid",
    stripePaymentIntentId: "pi_test_3N82jKlz982312haven",
    createdAt: "2025-07-01T10:20:00.000Z"
  },
  {
    _id: "book_002",
    propertyId: "prop_002",
    propertyTitle: "The Glass Crown Penthouse at Tribeca",
    propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
    propertyLocation: "New York, New York",
    tenantId: "user_tenant_001",
    tenantName: "Sophia Chen",
    tenantEmail: "tenant@havenstay.com",
    tenantAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    ownerId: "user_owner_001",
    ownerName: "Eleanor Vance",
    checkIn: "2025-09-15",
    checkOut: "2025-09-18",
    totalNights: 3,
    guestsCount: 2,
    pricing: {
      pricePerNight: 720,
      subtotal: 2160,
      cleaningFee: 180,
      serviceFee: 160,
      taxes: 120,
      totalAmount: 2620
    },
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: "2025-07-05T14:40:00.000Z"
  }
];
var INITIAL_REVIEWS = [
  {
    _id: "rev_001",
    propertyId: "prop_001",
    userId: "user_tenant_001",
    userName: "Sophia Chen",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    comment: "An utterly breathtaking sanctuary. Watching the sunset over the Pacific from the infinity pool was an unforgettable experience. Spotlessly clean and Eleanor was a gracious host!",
    createdAt: "2025-06-12T16:00:00.000Z"
  },
  {
    _id: "rev_002",
    propertyId: "prop_003",
    userId: "user_tenant_001",
    userName: "Sophia Chen",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    comment: "The cedar barrel sauna after a brisk hike in Aspen was pure bliss. True Scandinavian craftsmanship and serenity.",
    createdAt: "2025-06-20T18:30:00.000Z"
  }
];
var INITIAL_TRANSACTIONS = [
  {
    _id: "tx_001",
    bookingId: "book_001",
    propertyTitle: "Azure Horizon Cliffside Infinity Villa",
    tenantName: "Sophia Chen",
    tenantEmail: "tenant@havenstay.com",
    ownerName: "Eleanor Vance",
    amount: 4020,
    currency: "USD",
    status: "succeeded",
    stripePaymentId: "pi_test_3N82jKlz982312haven",
    paymentMethod: "visa_card_4242",
    createdAt: "2025-07-01T10:25:00.000Z"
  }
];

// server/config/db.ts
var InMemoryDatabase = class {
  constructor() {
    this.users = [];
    this.properties = [];
    this.bookings = [];
    this.reviews = [];
    this.transactions = [];
    this.favorites = {
      user_tenant_001: ["prop_001", "prop_003"]
    };
    this.seed();
  }
  seed() {
    this.users = [...INITIAL_USERS];
    this.properties = [...INITIAL_PROPERTIES];
    this.bookings = [...INITIAL_BOOKINGS];
    this.reviews = [...INITIAL_REVIEWS];
    this.transactions = [...INITIAL_TRANSACTIONS];
    console.log("[Database] In-memory store seeded successfully with default data");
  }
};
var dbStore = new InMemoryDatabase();
function isMongoConfigured() {
  const mongoUri = process.env.MONGODB_URI;
  return Boolean(mongoUri && !mongoUri.includes("<username>") && !mongoUri.includes("example.mongodb.net"));
}
var dbConnectionPromise = null;
async function connectDB() {
  if (!isMongoConfigured()) {
    console.log("[Database] No valid remote MONGODB_URI provided in environment. Using resilient in-memory data store.");
    return;
  }
  if (import_mongoose.default.connection.readyState === 1) {
    return;
  }
  if (dbConnectionPromise) {
    return dbConnectionPromise;
  }
  dbConnectionPromise = import_mongoose.default.connect(process.env.MONGODB_URI, {
    // Keep cold-starts fast: don't queue queries or wait long when Atlas is
    // unreachable (e.g. IP allowlist) — fail fast and fall back in-memory.
    serverSelectionTimeoutMS: 4e3,
    bufferCommands: false
  }).then(() => {
    console.log("[Database] Connected to MongoDB Atlas successfully.");
  }).catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[Database] MongoDB Atlas connection error (${message}). Falling back safely to in-memory data store.`);
    dbConnectionPromise = null;
  });
  return dbConnectionPromise;
}

// server/lib/auth.ts
var import_better_auth = require("better-auth");
var import_plugins = require("better-auth/plugins");
var import_node = require("better-auth/node");
var import_mongo_adapter = require("@better-auth/mongo-adapter");
var import_memory_adapter = require("@better-auth/memory-adapter");
var import_mongoose2 = __toESM(require("mongoose"), 1);

// server/lib/roles.ts
var APP_ROLES = ["tenant", "owner", "admin"];
function isAppRole(role) {
  return typeof role === "string" && APP_ROLES.includes(role);
}
function normalizeRole(role) {
  return isAppRole(role) ? role : "tenant";
}

// server/lib/dbSync.ts
function authUserToAppRecord(user) {
  return {
    _id: user.id,
    id: user.id,
    name: user.name,
    email: user.email.toLowerCase().trim(),
    role: normalizeRole(user.role),
    avatar: user.avatar || user.image || "",
    phone: user.phone || "",
    bio: user.bio || "",
    isBlocked: user.banned === true,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
  };
}
function findAppUser(idOrEmail) {
  const query = String(idOrEmail).toLowerCase().trim();
  return dbStore.users.find(
    (u) => u._id === idOrEmail || u.email.toLowerCase() === query
  );
}
function upsertAuthUserSync(user) {
  const record = authUserToAppRecord(user);
  const existing = findAppUser(record._id) || findAppUser(record.email);
  if (existing) {
    existing.name = record.name;
    existing.email = record.email;
    existing.role = record.role;
    existing.avatar = record.avatar;
    existing.phone = record.phone;
    existing.bio = record.bio;
    existing.isBlocked = record.isBlocked;
    return existing;
  }
  dbStore.users.push(record);
  return record;
}
function syncAuthUserUpdate(user) {
  return upsertAuthUserSync(user);
}

// server/lib/auth.ts
function resolvePublicBaseUrl() {
  const explicit = process.env.BETTER_AUTH_URL || process.env.CLIENT_URL || process.env.APP_URL || "";
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProductionUrl) return `https://${vercelProductionUrl}`.replace(/\/+$/, "");
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`.replace(/\/+$/, "");
  return `http://localhost:${process.env.PORT || 3e3}`;
}
function getBetterAuthBaseUrl() {
  return resolvePublicBaseUrl();
}
function getTrustedOrigins() {
  const base = resolvePublicBaseUrl();
  return Array.from(
    new Set(
      [
        base,
        process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/+$/, "") : "",
        "https://haven-stay-ten.vercel.app",
        process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "",
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
        process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : "",
        ...process.env.TRUSTED_ORIGINS ? process.env.TRUSTED_ORIGINS.split(",") : []
      ].map((origin) => origin.trim().replace(/\/+$/, "")).filter(Boolean)
    )
  );
}
var BETTER_AUTH_BASE_URL = resolvePublicBaseUrl();
var TRUSTED_ORIGINS = getTrustedOrigins();
function bootstrapAdminEmail() {
  return (process.env.BETTER_AUTH_ADMIN_EMAIL || "").toLowerCase().trim();
}
function resolveSecret() {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("BETTER_AUTH_SECRET environment variable is required in production.");
  }
  console.warn("[Auth] BETTER_AUTH_SECRET not set \u2014 using a development-only secret. Sessions will reset on restart.");
  return "dev-only-havenstay-secret-not-for-production-0123456789abcdef";
}
function hasValidMongoUri() {
  const uri = process.env.MONGODB_URI || "";
  return Boolean(
    uri && !uri.includes("<username>") && !uri.includes("example.mongodb.net") && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))
  );
}
function resolveDatabase() {
  if (hasValidMongoUri() && import_mongoose2.default.connection.readyState === 1 && import_mongoose2.default.connection.db) {
    console.log("[Auth] Using MongoDB adapter for Better Auth persistence.");
    return (0, import_mongo_adapter.mongodbAdapter)(import_mongoose2.default.connection.db, {
      // Standalone MongoDB (no replica set) cannot run transactions.
      transaction: false,
      // Keep singular collection names (user, session, account, verification).
      usePlural: false
    });
  }
  if (!hasValidMongoUri()) {
    console.log("[Auth] MONGODB_URI is missing \u2014 using the in-memory Better Auth adapter (non-persistent).");
    console.warn(
      "[Auth] Configure MONGODB_URI in production so registered users can sign in across serverless invocations."
    );
  } else {
    console.warn(
      "[Auth] MongoDB is not connected yet (readyState=%s) \u2014 using the in-memory Better Auth adapter for this instance.",
      import_mongoose2.default.connection.readyState
    );
  }
  return (0, import_memory_adapter.memoryAdapter)({ user: [], session: [], account: [], verification: [] });
}
function createAuth() {
  const googleClientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const googleClientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
  const googleConfigured = Boolean(googleClientId && googleClientSecret) && !googleClientId.includes("your-google-client-id") && !googleClientSecret.includes("your-google-client-secret");
  return (0, import_better_auth.betterAuth)({
    appName: "HavenStay",
    // Resolved lazily at creation time (after dotenv/Vercel env is loaded),
    // so production never falls back to localhost.
    baseURL: getBetterAuthBaseUrl(),
    // Trusted origins for CSRF/origin validation (production domains, Vercel
    // deployment URLs, and any TRUSTED_ORIGINS env entries).
    trustedOrigins: getTrustedOrigins(),
    secret: resolveSecret(),
    database: resolveDatabase(),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true
    },
    ...googleConfigured ? {
      socialProviders: {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret
        }
      }
    } : {},
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      // 7 days
      updateAge: 60 * 60 * 24,
      // refresh expiration once per day of activity
      cookieCache: { enabled: true, maxAge: 60 * 60 * 24 * 7 }
    },
    user: {
      additionalFields: {
        phone: { type: "string", required: false, input: true },
        bio: { type: "string", required: false, input: true },
        avatar: { type: "string", required: false, input: true }
      }
    },
    advanced: {
      cookiePrefix: "havenstay",
      defaultCookieAttributes: {
        // `Secure` cookies are only sent over HTTPS. Local HTTP development
        // must stay non-secure, but Vercel/preview deployments are always
        // HTTPS — even when NODE_ENV is not literally "production".
        secure: resolvePublicBaseUrl().startsWith("https://"),
        sameSite: "lax"
      },
      useSecureCookies: resolvePublicBaseUrl().startsWith("https://"),
      // Serverless: Vercel proxies every request, so the client IP arrives via
      // forwarded headers. This lets Better Auth's rate limiter work correctly.
      ipAddress: {
        ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
        trustedProxies: ["::1", "127.0.0.1", "0.0.0.0"]
      }
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const email = (user.email || "").toLowerCase().trim();
            if (email && email === bootstrapAdminEmail()) {
              return { data: { ...user, role: "admin" } };
            }
            return { data: user };
          },
          after: async (user) => {
            try {
              upsertAuthUserSync(user);
            } catch (err) {
              console.warn("[Auth] Failed to mirror new user into the application store.", err);
            }
          }
        },
        update: {
          after: async (user) => {
            try {
              syncAuthUserUpdate(user);
            } catch (err) {
              console.warn("[Auth] Failed to mirror user update into the application store.", err);
            }
          }
        }
      }
    },
    plugins: [
      (0, import_plugins.admin)({
        defaultRole: "tenant",
        adminRoles: ["admin"]
      })
    ]
  });
}
async function ensureBootstrapAdmin(auth) {
  const adminEmail = bootstrapAdminEmail();
  if (!adminEmail) return;
  const password = process.env.BETTER_AUTH_ADMIN_PASSWORD || "";
  if (!password) {
    console.log("[Auth] BETTER_AUTH_ADMIN_EMAIL is set without a password \u2014 skipping bootstrap admin creation.");
    return;
  }
  if (password.length < 8) {
    console.warn("[Auth] BETTER_AUTH_ADMIN_PASSWORD must be at least 8 characters \u2014 skipping bootstrap admin creation.");
    return;
  }
  try {
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password,
        name: "HavenStay Administrator"
      }
    });
    console.log(`[Auth] Bootstrap admin account ready for ${adminEmail}.`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/already exist/i.test(message)) {
      console.log("[Auth] Bootstrap admin already exists \u2014 skipping creation.");
      return;
    }
    console.warn("[Auth] Bootstrap admin creation failed:", message);
  }
}
var authInstance = null;
function initAuth() {
  if (!authInstance) authInstance = createAuth();
  return authInstance;
}
function getAuth() {
  if (!authInstance) {
    throw new Error("[Auth] Better Auth has not been initialized. Call initAuth() during server startup.");
  }
  return authInstance;
}

// server/lib/seedMongo.ts
var import_mongoose4 = __toESM(require("mongoose"), 1);

// server/models/Property.ts
var import_mongoose3 = __toESM(require("mongoose"), 1);
var PropertySchema = new import_mongoose3.default.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Villa", "Apartment", "Cabin", "Penthouse", "Cottage", "Studio"],
      required: true
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: "" },
      country: { type: String, default: "United States" },
      zipCode: { type: String, default: "" },
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
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
      avatar: { type: String, default: "" },
      phone: { type: String, default: "" }
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending"
    },
    rejectionFeedback: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  { timestamps: true }
);
var PropertyModel = import_mongoose3.default.models.Property || import_mongoose3.default.model("Property", PropertySchema);

// server/lib/seedMongo.ts
function toPropertyDoc(p) {
  return {
    title: p.title,
    description: p.description,
    category: p.category,
    location: {
      address: p.location.address,
      city: p.location.city,
      state: p.location.state || "",
      country: p.location.country || "United States",
      zipCode: p.location.zipCode || "",
      lat: p.location.lat || 0,
      lng: p.location.lng || 0
    },
    pricePerNight: p.pricePerNight,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    maxGuests: p.maxGuests,
    squareFeet: p.squareFeet || 0,
    amenities: [...p.amenities || []],
    images: [...p.images || []],
    owner: {
      id: p.owner.id,
      name: p.owner.name,
      email: p.owner.email,
      avatar: p.owner.avatar || "",
      phone: p.owner.phone || ""
    },
    status: p.status,
    rejectionFeedback: p.rejectionFeedback || "",
    featured: Boolean(p.featured),
    averageRating: Number(p.averageRating || 0),
    totalReviews: Number(p.totalReviews || 0),
    createdAt: p.createdAt ? new Date(p.createdAt) : /* @__PURE__ */ new Date(),
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : /* @__PURE__ */ new Date()
  };
}
function toSeedProperty(doc) {
  return {
    _id: String(doc._id),
    title: doc.title,
    description: doc.description,
    category: doc.category,
    location: {
      address: doc.location.address,
      city: doc.location.city,
      state: doc.location.state || "",
      country: doc.location.country || "United States",
      zipCode: doc.location.zipCode || "",
      lat: Number(doc.location.lat || 0),
      lng: Number(doc.location.lng || 0)
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
      avatar: doc.owner.avatar || "",
      phone: doc.owner.phone || ""
    },
    status: doc.status,
    rejectionFeedback: doc.rejectionFeedback || "",
    featured: Boolean(doc.featured),
    averageRating: Number(doc.averageRating || 0),
    totalReviews: Number(doc.totalReviews || 0),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function hydratePropertiesFromMongo() {
  if (import_mongoose4.default.connection.readyState !== 1 || !import_mongoose4.default.connection.db) {
    return false;
  }
  try {
    const existing = await PropertyModel.estimatedDocumentCount();
    if (existing === 0) {
      await PropertyModel.insertMany(INITIAL_PROPERTIES.map(toPropertyDoc));
      console.log("[Database] Property catalog seeded into MongoDB.");
    }
    const docs = await PropertyModel.find().lean();
    dbStore.properties = docs.map(toSeedProperty);
    console.log(`[Database] Hydrated ${dbStore.properties.length} properties from MongoDB.`);
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[Database] MongoDB property hydration failed (${message}); using in-memory catalog.`);
    return false;
  }
}

// server/app.ts
var import_node2 = require("better-auth/node");

// server/routes/propertyRoutes.ts
var import_express = require("express");

// server/controllers/propertyController.ts
var getProperties = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      guests,
      amenities,
      sort = "newest",
      page = "1",
      limit = "9",
      status = "approved"
    } = req.query;
    let filtered = [...dbStore.properties];
    if (status !== "all") {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (search && typeof search === "string" && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.location.city.toLowerCase().includes(q) || p.location.address.toLowerCase().includes(q) || p.location.state.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    if (category && typeof category === "string" && category !== "All") {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (minPrice) {
      filtered = filtered.filter((p) => p.pricePerNight >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.pricePerNight <= Number(maxPrice));
    }
    if (bedrooms) {
      filtered = filtered.filter((p) => p.bedrooms >= Number(bedrooms));
    }
    if (bathrooms) {
      filtered = filtered.filter((p) => p.bathrooms >= Number(bathrooms));
    }
    if (guests) {
      filtered = filtered.filter((p) => p.maxGuests >= Number(guests));
    }
    if (amenities && typeof amenities === "string" && amenities.trim() !== "") {
      const requestedAmenities = amenities.split(",").map((a) => a.trim().toLowerCase());
      filtered = filtered.filter((p) => {
        const propertyAmenities = p.amenities.map((a) => a.toLowerCase());
        return requestedAmenities.every((ra) => propertyAmenities.some((pa) => pa.includes(ra)));
      });
    }
    switch (sort) {
      case "price_asc":
        filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case "rating_desc":
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 9);
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);
    res.status(200).json({
      success: true,
      properties: paginated,
      pagination: {
        total: totalCount,
        totalPages,
        currentPage: pageNum,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error("getProperties error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve properties." });
  }
};
var getFeaturedProperties = async (req, res) => {
  try {
    const featured = dbStore.properties.filter((p) => p.status === "approved").slice(0, 6);
    res.status(200).json({ success: true, properties: featured });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get featured properties." });
  }
};
var getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = dbStore.properties.find((p) => p._id === id);
    if (!property) {
      res.status(404).json({ success: false, message: "Property not found." });
      return;
    }
    const reviews = dbStore.reviews.filter((r) => r.propertyId === id);
    res.status(200).json({
      success: true,
      property,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving property details." });
  }
};
var createProperty = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const {
      title,
      description,
      category,
      address,
      city,
      state,
      country,
      zipCode,
      pricePerNight,
      bedrooms,
      bathrooms,
      maxGuests,
      squareFeet,
      amenities = [],
      images = []
    } = req.body;
    if (!title || !description || !category || !pricePerNight || !city || !address) {
      res.status(400).json({ success: false, message: "Please provide all required fields." });
      return;
    }
    const userInDb = dbStore.users.find((u) => u._id === req.user?.id);
    const defaultPhotos = [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80"
    ];
    const finalImages = Array.isArray(images) && images.length > 0 ? images : defaultPhotos;
    const newProperty = {
      _id: `prop_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      location: {
        address: address.trim(),
        city: city.trim(),
        state: state?.trim() || "CA",
        country: country?.trim() || "United States",
        zipCode: zipCode?.trim() || "90210",
        lat: 34.0522,
        lng: -118.2437
      },
      pricePerNight: Number(pricePerNight),
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      maxGuests: Number(maxGuests) || 2,
      squareFeet: Number(squareFeet) || 1200,
      amenities: Array.isArray(amenities) ? amenities : ["High-Speed WiFi", "Air Conditioning"],
      images: finalImages,
      owner: {
        id: req.user.id,
        name: userInDb?.name || req.user.name,
        email: userInDb?.email || req.user.email,
        avatar: userInDb?.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        phone: userInDb?.phone || "+1 (555) 000-0000"
      },
      status: req.user.role === "admin" ? "approved" : "pending",
      featured: false,
      averageRating: 0,
      totalReviews: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    dbStore.properties.unshift(newProperty);
    res.status(201).json({
      success: true,
      message: "Property submitted successfully! It is currently pending Admin review.",
      property: newProperty
    });
  } catch (error) {
    console.error("createProperty error:", error);
    res.status(500).json({ success: false, message: "Failed to create property." });
  }
};
var updateProperty = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { id } = req.params;
    const property = dbStore.properties.find((p) => p._id === id);
    if (!property) {
      res.status(404).json({ success: false, message: "Property not found." });
      return;
    }
    if (property.owner.id !== req.user.id && req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "You do not have permission to modify this property." });
      return;
    }
    const updates = req.body;
    if (updates.title) property.title = updates.title.trim();
    if (updates.description) property.description = updates.description.trim();
    if (updates.category) property.category = updates.category;
    if (updates.pricePerNight) property.pricePerNight = Number(updates.pricePerNight);
    if (updates.bedrooms) property.bedrooms = Number(updates.bedrooms);
    if (updates.bathrooms) property.bathrooms = Number(updates.bathrooms);
    if (updates.maxGuests) property.maxGuests = Number(updates.maxGuests);
    if (updates.amenities) property.amenities = updates.amenities;
    if (updates.images && Array.isArray(updates.images)) property.images = updates.images;
    if (updates.location) {
      property.location = { ...property.location, ...updates.location };
    }
    if (req.user.role !== "admin") {
      property.status = "pending";
      property.rejectionFeedback = "";
    }
    property.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    res.status(200).json({
      success: true,
      message: "Property updated successfully.",
      property
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update property." });
  }
};
var deleteProperty = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { id } = req.params;
    const index = dbStore.properties.findIndex((p) => p._id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: "Property not found." });
      return;
    }
    const property = dbStore.properties[index];
    if (property.owner.id !== req.user.id && req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Forbidden. You do not own this property." });
      return;
    }
    dbStore.properties.splice(index, 1);
    res.status(200).json({ success: true, message: "Property deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete property." });
  }
};
var moderateProperty = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin authorization required." });
      return;
    }
    const { id } = req.params;
    const { action, rejectionFeedback = "" } = req.body;
    const property = dbStore.properties.find((p) => p._id === id);
    if (!property) {
      res.status(404).json({ success: false, message: "Property not found." });
      return;
    }
    if (action === "approve") {
      property.status = "approved";
      property.rejectionFeedback = "";
    } else if (action === "reject") {
      property.status = "rejected";
      property.rejectionFeedback = rejectionFeedback.trim() || "Property does not meet safety or documentation standards.";
    } else {
      res.status(400).json({ success: false, message: "Invalid action. Use 'approve' or 'reject'." });
      return;
    }
    property.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    res.status(200).json({
      success: true,
      message: `Property ${action === "approve" ? "approved" : "rejected"} successfully.`,
      property
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to moderate property." });
  }
};
var getOwnerProperties = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const properties = dbStore.properties.filter((p) => p.owner.id === req.user?.id);
    res.status(200).json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get owner properties." });
  }
};
var toggleFavorite = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { propertyId } = req.body;
    if (!propertyId) {
      res.status(400).json({ success: false, message: "Property ID required" });
      return;
    }
    const userId = req.user.id;
    if (!dbStore.favorites[userId]) {
      dbStore.favorites[userId] = [];
    }
    const userFavs = dbStore.favorites[userId];
    const existsIndex = userFavs.indexOf(propertyId);
    let isFavorite = false;
    if (existsIndex > -1) {
      userFavs.splice(existsIndex, 1);
      isFavorite = false;
    } else {
      userFavs.push(propertyId);
      isFavorite = true;
    }
    res.status(200).json({
      success: true,
      isFavorite,
      favorites: userFavs,
      message: isFavorite ? "Added to favorites" : "Removed from favorites"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to toggle favorite." });
  }
};
var getFavorites = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const favIds = dbStore.favorites[req.user.id] || [];
    const favoriteProperties = dbStore.properties.filter((p) => favIds.includes(p._id));
    res.status(200).json({ success: true, favoriteIds: favIds, properties: favoriteProperties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get favorites." });
  }
};

// server/middleware/auth.ts
var requireAuth = async (req, res, next) => {
  try {
    const session = await getAuth().api.getSession({
      headers: (0, import_node.fromNodeHeaders)(req.headers)
    });
    const user = session?.user;
    if (!user) {
      res.status(401).json({ success: false, message: "Authentication required. Please sign in to continue." });
      return;
    }
    if (user.banned === true) {
      res.status(403).json({ success: false, message: "Your account has been suspended. Please contact support." });
      return;
    }
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: normalizeRole(user.role),
      avatar: user.avatar || user.image || "",
      phone: user.phone || "",
      bio: user.bio || "",
      isBlocked: user.banned === true
    };
    next();
  } catch (err) {
    console.warn("[Auth] Session verification failed:", err);
    res.status(401).json({ success: false, message: "Your session could not be verified. Please sign in again." });
  }
};
var authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`
      });
      return;
    }
    next();
  };
};

// server/routes/propertyRoutes.ts
var router = (0, import_express.Router)();
router.get("/", getProperties);
router.get("/featured", getFeaturedProperties);
router.get("/item/:id", getPropertyById);
router.get("/user/favorites", requireAuth, getFavorites);
router.post("/user/favorites/toggle", requireAuth, toggleFavorite);
router.get("/owner/listings", requireAuth, authorizeRoles("owner", "admin"), getOwnerProperties);
router.get("/my-properties", requireAuth, authorizeRoles("owner", "admin"), getOwnerProperties);
router.post("/", requireAuth, authorizeRoles("owner", "admin"), createProperty);
router.put("/:id", requireAuth, authorizeRoles("owner", "admin"), updateProperty);
router.delete("/:id", requireAuth, authorizeRoles("owner", "admin"), deleteProperty);
router.put("/:id/moderate", requireAuth, authorizeRoles("admin"), moderateProperty);
var propertyRoutes_default = router;

// server/routes/bookingRoutes.ts
var import_express2 = require("express");

// server/controllers/bookingController.ts
var createBooking = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { propertyId, checkIn, checkOut, guestsCount } = req.body;
    if (!propertyId || !checkIn || !checkOut || !guestsCount) {
      res.status(400).json({ success: false, message: "Missing booking details (property, dates, or guests)." });
      return;
    }
    const property = dbStore.properties.find((p) => p._id === propertyId);
    if (!property) {
      res.status(404).json({ success: false, message: "Property not found." });
      return;
    }
    if (property.status !== "approved") {
      res.status(400).json({ success: false, message: "This property is not currently accepting bookings." });
      return;
    }
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = endDate.getTime() - startDate.getTime();
    const nights = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    if (nights <= 0) {
      res.status(400).json({ success: false, message: "Check-out date must be after check-in date." });
      return;
    }
    if (Number(guestsCount) > property.maxGuests) {
      res.status(400).json({
        success: false,
        message: `Maximum guest capacity for this property is ${property.maxGuests}.`
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
    const newBooking = {
      _id: `book_${Date.now()}`,
      propertyId: property._id,
      propertyTitle: property.title,
      propertyImage: property.images[0] || "",
      propertyLocation: `${property.location.city}, ${property.location.state}`,
      tenantId: req.user.id,
      tenantName: tenantUser?.name || req.user.name,
      tenantEmail: tenantUser?.email || req.user.email,
      tenantAvatar: tenantUser?.avatar || "",
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
        totalAmount
      },
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    dbStore.bookings.unshift(newBooking);
    res.status(201).json({
      success: true,
      message: "Booking request created successfully! Complete checkout to confirm your reservation.",
      booking: newBooking
    });
  } catch (error) {
    console.error("createBooking error:", error);
    res.status(500).json({ success: false, message: "Failed to create booking." });
  }
};
var getMyBookings = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const myBookings = dbStore.bookings.filter((b) => b.tenantId === req.user?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.status(200).json({ success: true, bookings: myBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve bookings." });
  }
};
var getOwnerBookings = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const ownerBookings = dbStore.bookings.filter((b) => b.ownerId === req.user?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.status(200).json({ success: true, bookings: ownerBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve owner bookings." });
  }
};
var getAllBookings = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin authorization required." });
      return;
    }
    const allBookings = [...dbStore.bookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.status(200).json({ success: true, bookings: allBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve all bookings." });
  }
};
var updateBookingStatus = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { id } = req.params;
    const { status } = req.body;
    const effectiveStatus = status || (req.path.endsWith("/cancel") ? "cancelled" : void 0);
    const booking = dbStore.bookings.find((b) => b._id === id);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found." });
      return;
    }
    if (!effectiveStatus || !["confirmed", "cancelled", "rejected"].includes(effectiveStatus)) {
      res.status(400).json({ success: false, message: "A valid booking status is required." });
      return;
    }
    const isTenant = booking.tenantId === req.user.id;
    const isOwner = booking.ownerId === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isTenant && !isOwner && !isAdmin) {
      res.status(403).json({ success: false, message: "Not authorized to manage this booking." });
      return;
    }
    if (isTenant && !isAdmin && effectiveStatus !== "cancelled") {
      res.status(403).json({ success: false, message: "Tenants can only cancel bookings." });
      return;
    }
    booking.status = effectiveStatus;
    if (effectiveStatus === "cancelled" && booking.paymentStatus === "paid") {
      booking.paymentStatus = "refunded";
    }
    res.status(200).json({
      success: true,
      message: `Booking status updated to ${effectiveStatus}.`,
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update booking status." });
  }
};
var updateBookingStatusWithCancelAlias = async (req, res) => {
  return updateBookingStatus(req, res);
};

// server/routes/bookingRoutes.ts
var router2 = (0, import_express2.Router)();
router2.post("/", requireAuth, createBooking);
router2.get("/my-bookings", requireAuth, getMyBookings);
router2.get("/owner-bookings", requireAuth, authorizeRoles("owner", "admin"), getOwnerBookings);
router2.get("/owner/requests", requireAuth, authorizeRoles("owner", "admin"), getOwnerBookings);
router2.get("/all", requireAuth, authorizeRoles("admin"), getAllBookings);
router2.put("/:id/status", requireAuth, updateBookingStatus);
router2.put("/:id/cancel", requireAuth, updateBookingStatusWithCancelAlias);
var bookingRoutes_default = router2;

// server/routes/paymentRoutes.ts
var import_express3 = require("express");

// server/controllers/paymentController.ts
var import_stripe = __toESM(require("stripe"), 1);
var stripeClient = null;
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("your_stripe") || !key.startsWith("sk_")) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new import_stripe.default(key);
  }
  return stripeClient;
}
var createPaymentIntent = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { bookingId } = req.body;
    if (!bookingId) {
      res.status(400).json({ success: false, message: "Booking ID is required." });
      return;
    }
    const booking = dbStore.bookings.find((b) => b._id === bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found." });
      return;
    }
    if (booking.tenantId !== req.user.id) {
      res.status(403).json({ success: false, message: "Forbidden. You do not own this booking." });
      return;
    }
    if (booking.paymentStatus === "paid") {
      res.status(400).json({ success: false, message: "This reservation has already been paid." });
      return;
    }
    const amountInCents = Math.round(booking.pricing.totalAmount * 100);
    const stripe = getStripe();
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        metadata: {
          bookingId: booking._id,
          tenantId: booking.tenantId,
          propertyTitle: booking.propertyTitle
        }
      });
      res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: booking.pricing.totalAmount
      });
      return;
    }
    const simulatedIntentId = `pi_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const simulatedClientSecret = `${simulatedIntentId}_secret_${Math.random().toString(36).substring(2, 10)}`;
    res.status(200).json({
      success: true,
      clientSecret: simulatedClientSecret,
      paymentIntentId: simulatedIntentId,
      amount: booking.pricing.totalAmount,
      isSimulated: true,
      message: "Simulated Stripe test payment intent generated."
    });
  } catch (error) {
    console.error("createPaymentIntent error:", error);
    res.status(500).json({ success: false, message: "Failed to create payment intent." });
  }
};
var confirmPayment = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { bookingId, paymentIntentId, paymentMethod = "card_visa" } = req.body;
    const booking = dbStore.bookings.find((b) => b._id === bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found." });
      return;
    }
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    booking.stripePaymentIntentId = paymentIntentId || `pi_paid_${Date.now()}`;
    const transaction = {
      _id: `tx_${Date.now()}`,
      bookingId: booking._id,
      propertyTitle: booking.propertyTitle,
      tenantName: booking.tenantName,
      tenantEmail: booking.tenantEmail,
      ownerName: booking.ownerName,
      amount: booking.pricing.totalAmount,
      currency: "USD",
      status: "succeeded",
      stripePaymentId: booking.stripePaymentIntentId,
      paymentMethod,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    dbStore.transactions.unshift(transaction);
    res.status(200).json({
      success: true,
      message: "Payment confirmed and reservation booked!",
      booking,
      transaction
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to confirm payment." });
  }
};

// server/routes/paymentRoutes.ts
var router3 = (0, import_express3.Router)();
router3.post("/create-payment-intent", requireAuth, createPaymentIntent);
router3.post("/confirm-payment", requireAuth, confirmPayment);
var paymentRoutes_default = router3;

// server/routes/reviewRoutes.ts
var import_express4 = require("express");

// server/controllers/reviewController.ts
var addReview = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { propertyId, rating, comment, categories } = req.body;
    if (!propertyId || !rating || !comment) {
      res.status(400).json({ success: false, message: "Property ID, rating, and comment are required." });
      return;
    }
    const property = dbStore.properties.find((p) => p._id === propertyId);
    if (!property) {
      res.status(404).json({ success: false, message: "Property not found." });
      return;
    }
    const userInDb = dbStore.users.find((u) => u._id === req.user?.id);
    const newReview = {
      _id: `rev_${Date.now()}`,
      propertyId,
      userId: req.user.id,
      userName: userInDb?.name || req.user.name,
      userAvatar: userInDb?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      rating: Number(rating),
      categories: {
        cleanliness: Number(categories?.cleanliness) || Number(rating),
        accuracy: Number(categories?.accuracy) || Number(rating),
        communication: Number(categories?.communication) || Number(rating),
        location: Number(categories?.location) || Number(rating),
        value: Number(categories?.value) || Number(rating)
      },
      comment: comment.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    dbStore.reviews.unshift(newReview);
    const propertyReviews = dbStore.reviews.filter((r) => r.propertyId === propertyId);
    const sum = propertyReviews.reduce((acc, r) => acc + r.rating, 0);
    property.totalReviews = propertyReviews.length;
    property.averageRating = Number((sum / propertyReviews.length).toFixed(2));
    res.status(201).json({
      success: true,
      message: "Review posted successfully!",
      review: newReview,
      averageRating: property.averageRating,
      totalReviews: property.totalReviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to submit review." });
  }
};
var getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const reviews = dbStore.reviews.filter((r) => r.propertyId === propertyId);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve reviews." });
  }
};

// server/routes/reviewRoutes.ts
var router4 = (0, import_express4.Router)();
router4.get("/property/:propertyId", getPropertyReviews);
router4.post("/", requireAuth, addReview);
var reviewRoutes_default = router4;

// server/routes/ownerRoutes.ts
var import_express5 = require("express");

// server/controllers/ownerController.ts
var getOwnerAnalytics = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const ownerId = req.user.id;
    const properties = dbStore.properties.filter((p) => p.owner.id === ownerId);
    const bookings = dbStore.bookings.filter((b) => b.ownerId === ownerId);
    const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");
    const totalEarnings = paidBookings.reduce((sum, b) => sum + (b.pricing.subtotal || 0), 0);
    const activeListings = properties.filter((p) => p.status === "approved").length;
    const pendingListings = properties.filter((p) => p.status === "pending").length;
    const rejectedListings = properties.filter((p) => p.status === "rejected").length;
    const pendingBookings = bookings.filter((b) => b.status === "pending").length;
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyEarningsMap = {};
    months.forEach((m) => {
      monthlyEarningsMap[m] = 0;
    });
    paidBookings.forEach((b) => {
      const date = new Date(b.createdAt);
      const monthName = months[date.getMonth()];
      monthlyEarningsMap[monthName] = (monthlyEarningsMap[monthName] || 0) + (b.pricing.subtotal || 0);
    });
    if (totalEarnings === 0 && properties.length > 0) {
      monthlyEarningsMap["Apr"] = 1450;
      monthlyEarningsMap["May"] = 2800;
      monthlyEarningsMap["Jun"] = 3900;
      monthlyEarningsMap["Jul"] = 4020;
    }
    const monthlyChartData = months.map((m) => ({
      month: m,
      earnings: monthlyEarningsMap[m] || 0,
      bookings: bookings.filter((b) => months[new Date(b.createdAt).getMonth()] === m).length
    }));
    res.status(200).json({
      success: true,
      stats: {
        totalEarnings: totalEarnings > 0 ? totalEarnings : 4020,
        totalProperties: properties.length,
        activeListings,
        pendingListings,
        rejectedListings,
        totalBookings: bookings.length,
        pendingBookings,
        confirmedBookings
      },
      monthlyChartData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve owner analytics." });
  }
};

// server/routes/ownerRoutes.ts
var router5 = (0, import_express5.Router)();
router5.get("/analytics", requireAuth, authorizeRoles("owner", "admin"), getOwnerAnalytics);
var ownerRoutes_default = router5;

// server/routes/adminRoutes.ts
var import_express6 = require("express");

// server/controllers/adminController.ts
var getAdminStats = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin authorization required." });
      return;
    }
    const totalUsers = dbStore.users.length;
    const totalProperties = dbStore.properties.length;
    const pendingProperties = dbStore.properties.filter((p) => p.status === "pending").length;
    const approvedProperties = dbStore.properties.filter((p) => p.status === "approved").length;
    const rejectedProperties = dbStore.properties.filter((p) => p.status === "rejected").length;
    const totalBookings = dbStore.bookings.length;
    const confirmedBookings = dbStore.bookings.filter((b) => b.status === "confirmed").length;
    const totalRevenue = dbStore.transactions.filter((t) => t.status === "succeeded").reduce((sum, t) => sum + t.amount, 0);
    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        platformRevenue: totalRevenue,
        totalUsers,
        totalProperties,
        pendingProperties,
        approvedProperties,
        rejectedProperties,
        totalBookings,
        confirmedBookings,
        totalTransactions: dbStore.transactions.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve admin stats." });
  }
};
var getAdminProperties = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin authorization required." });
      return;
    }
    const properties = [...dbStore.properties].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.status(200).json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve properties." });
  }
};
var getAdminBookings = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin authorization required." });
      return;
    }
    const bookings = [...dbStore.bookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve bookings." });
  }
};
var getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin authorization required." });
      return;
    }
    const { role, search } = req.query;
    const searchStr = typeof search === "string" && search.trim() ? search.trim() : "";
    const auth = getAuth();
    const result = await auth.api.listUsers({
      query: searchStr ? { searchValue: searchStr, searchField: "email", searchOperator: "contains", limit: 500 } : { limit: 500 },
      headers: (0, import_node.fromNodeHeaders)(req.headers)
    });
    let users = (result?.users || []).map((u) => authUserToAppRecord(u));
    for (const u of dbStore.users) {
      if (!users.some((existing) => existing._id === u._id)) {
        users.push({
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.avatar || "",
          phone: u.phone || "",
          bio: u.bio || "",
          isBlocked: u.isBlocked,
          createdAt: u.createdAt
        });
      }
    }
    if (role && role !== "all") {
      users = users.filter((u) => u.role === role);
    }
    if (searchStr) {
      const q = searchStr.toLowerCase();
      users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Failed to retrieve users:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve users." });
  }
};
var updateUserRole = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin authorization required." });
      return;
    }
    const { userId } = req.params;
    const { role } = req.body;
    if (typeof role !== "string" || !APP_ROLES.includes(role)) {
      res.status(400).json({ success: false, message: "Invalid role. Allowed roles: tenant, owner, admin." });
      return;
    }
    const targetUser = dbStore.users.find((u) => u._id === userId);
    if (!targetUser) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    try {
      await getAuth().api.setRole({
        body: { userId, role },
        headers: (0, import_node.fromNodeHeaders)(req.headers)
      });
    } catch (err) {
      console.warn(`[Admin] setRole skipped for ${userId}:`, err.message);
    }
    targetUser.role = role;
    res.status(200).json({
      success: true,
      message: `User role updated to ${targetUser.role}.`,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        isBlocked: targetUser.isBlocked
      }
    });
  } catch (error) {
    console.error("Failed to update user role:", error);
    res.status(500).json({ success: false, message: "Failed to update user role." });
  }
};
var toggleUserBlock = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin authorization required." });
      return;
    }
    const { userId } = req.params;
    const targetUser = dbStore.users.find((u) => u._id === userId);
    if (!targetUser) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    if (targetUser._id === req.user.id) {
      res.status(400).json({ success: false, message: "You cannot block your own admin account." });
      return;
    }
    try {
      const auth = getAuth();
      const headers = (0, import_node.fromNodeHeaders)(req.headers);
      if (targetUser.isBlocked) {
        await auth.api.unbanUser({ body: { userId }, headers });
      } else {
        await auth.api.banUser({
          body: { userId, banReason: "Suspended by an administrator." },
          headers
        });
      }
    } catch (err) {
      console.warn(`[Admin] ban toggle skipped for ${userId}:`, err.message);
    }
    targetUser.isBlocked = !targetUser.isBlocked;
    res.status(200).json({
      success: true,
      message: `User has been ${targetUser.isBlocked ? "suspended" : "reactivated"}.`,
      isBlocked: targetUser.isBlocked,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        isBlocked: targetUser.isBlocked,
        status: targetUser.isBlocked ? "blocked" : "active"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to toggle user status." });
  }
};
var toggleUserStatusAlias = async (req, res) => {
  return toggleUserBlock(req, res);
};
var getAllTransactions = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin authorization required." });
      return;
    }
    const transactions = [...dbStore.transactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve transactions." });
  }
};

// server/routes/adminRoutes.ts
var router6 = (0, import_express6.Router)();
router6.use(requireAuth, authorizeRoles("admin"));
router6.get("/stats", getAdminStats);
router6.get("/properties", getAdminProperties);
router6.get("/users", getAllUsers);
router6.get("/bookings", getAdminBookings);
router6.put("/users/:userId/role", updateUserRole);
router6.put("/users/:userId/block", toggleUserBlock);
router6.get("/properties/all", getAdminProperties);
router6.put("/users/:userId/status", toggleUserStatusAlias);
router6.get("/transactions", getAllTransactions);
var adminRoutes_default = router6;

// server/app.ts
import_dotenv.default.config();
async function createApp() {
  const app = (0, import_express7.default)();
  app.set("trust proxy", 1);
  app.use(
    (0, import_cors.default)({
      origin: true,
      credentials: true
    })
  );
  try {
    await connectDB();
  } catch (err) {
    console.error("[API] Database startup failure (continuing with in-memory fallback):", err);
  }
  try {
    await hydratePropertiesFromMongo();
  } catch (err) {
    console.error("[API] Property catalog hydration failure (continuing with in-memory catalog):", err);
  }
  let auth;
  try {
    auth = initAuth();
  } catch (err) {
    console.error("[API] Better Auth initialization failure:", err);
    throw err;
  }
  await ensureBootstrapAdmin(auth);
  app.all("/api/auth/*", (0, import_node2.toNodeHandler)(auth));
  app.use(import_express7.default.json({ limit: "10mb" }));
  app.use(import_express7.default.urlencoded({ extended: true, limit: "10mb" }));
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "HavenStay MERN Property Rental Platform API",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      authPersistence: isMongoConfigured() ? "mongodb" : "memory (configure MONGODB_URI for production login persistence)"
    });
  });
  app.get("/api/auth-status", (req, res) => {
    res.json({
      success: true,
      mongoConfigured: isMongoConfigured(),
      authPersistence: isMongoConfigured() ? "mongodb" : "memory",
      hint: isMongoConfigured() ? "Auth users persist in MongoDB." : 'Set MONGODB_URI in Vercel so registrations survive across serverless invocations; otherwise sign-up succeeds but later sign-in returns "Invalid email or password".'
    });
  });
  app.use("/api/properties", propertyRoutes_default);
  app.use("/api/bookings", bookingRoutes_default);
  app.use("/api/payments", paymentRoutes_default);
  app.use("/api/reviews", reviewRoutes_default);
  app.use("/api/owner", ownerRoutes_default);
  app.use("/api/admin", adminRoutes_default);
  if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express7.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  return app;
}

// serverless-entry.ts
var globalForApp = globalThis;
function getApp() {
  if (!globalForApp.__havenstayApp) {
    globalForApp.__havenstayApp = createApp().catch((err) => {
      console.error("[API] createApp failed:", err);
      globalForApp.__havenstayApp = void 0;
      throw err;
    });
  }
  return globalForApp.__havenstayApp;
}
var config = {
  api: {
    bodyParser: false
  }
};
async function handler(req, res) {
  try {
    const app = await getApp();
    app(req, res);
  } catch (err) {
    console.error("[API] Unhandled request error:", err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Internal server error. Please try again." });
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config
});
