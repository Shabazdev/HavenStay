# HavenStay - MERN Stack Property Rental & Booking Platform

HavenStay is an architectural luxury property rental and booking platform built with the complete **MERN Stack** (MongoDB, Express.js, React, Node.js) and TypeScript. It bridges discerning travelers and luxury property owners through transparent escrow payments via Stripe, interactive search and filter discovery, review aggregation, and role-based access control (RBAC) across Tenant, Host/Owner, and Superadmin tiers.

---

## 🔐 Authentication

HavenStay uses **Better Auth** for real, production-grade email/password
authentication:

- Secure, hashed passwords (Better Auth email & password provider).
- HttpOnly, same-site cookie sessions with sliding expiration (7 days).
- No hardcoded credentials, no demo logins, no localStorage tokens.
- Server-side role management (Tenant / Owner / Admin) — roles are never
  accepted from the client. New accounts start as **Tenant** and may be
  promoted by an administrator (or the bootstrap admin in `.env`).
- All authenticated business APIs verify the session cookie server-side.

---

## 🛠️ Technology Stack

### Frontend (`client/`)
- **Core:** React 19, TypeScript, Vite
- **Routing:** React Router DOM (v7) with role-protected route guards
- **Styling:** Tailwind CSS v4, Modern Typography (`Outfit` and `Plus Jakarta Sans`)
- **Animation:** Motion (`motion/react`)
- **Icons:** Lucide React
- **Data Visualization:** Recharts (Responsive Area Chart for host monthly revenue analytics)
- **HTTP Client:** Axios with server-side session-cookie authorization (`withCredentials`)
- **Notifications:** SweetAlert2 luxury alerts & toasts

### Backend (`server/`)
- **Runtime:** Node.js with Express.js REST API
- **Language:** TypeScript (`tsx` runtime + `esbuild` production bundling)
- **Database & ODM:** MongoDB & Mongoose schemas with seamless in-memory fallback for container stability
- **Authentication & Security:** Better Auth (email/password, session cookies, admin plugin for roles/bans), bcrypt password hashing, CORS, RBAC middleware over session-based auth
- **Payment Processing:** Stripe API integration for payment intents and escrow confirmation

---

## 🌟 Key Features

### 1. Authentication & Role-Based Access Control (RBAC)
- **Real Email/Password Authentication:** Better Auth sign-up & sign-in with server-side session cookies.
- **Secure Sessions:** httpOnly cookies, sliding expiration, session persists across refreshes.
- **Three Distinct User Roles:**
  - **Tenant:** Browse catalog, manage personal reservations, save favorites, write reviews.
  - **Owner (Host):** Monitor monthly yield, publish new sanctuaries, manage guest bookings.
  - **Admin:** Moderate property submissions, toggle user status, change user roles, inspect financial escrows.
- **Server-Assigned Roles:** Roles are granted only by authenticated administrators (or the bootstrap admin) — never from the frontend.

### 2. Marketplace & Discovery
- **Hero Search Bar:** Filter by destination, category, and date range.
- **Featured Sanctuaries:** 6 handpicked residences prominently displayed on the Home page.
- **Dynamic Search & Filtering:**
  - Real-time search by city, title, or address
  - Category pill filter: *Villas, Penthouses, Cabins, Cottages, Studios*
  - Nightly price range sliders (Min / Max)
  - Bedroom selector (1, 2, 3, 4+)
  - Amenities checklist (WiFi, Infinity Pool, Hot Tub, Chef Kitchen, EV Charger, etc.)
  - Sort options: *Newest, Price Low to High, Price High to Low, Highest Rated*
- **Backend Pagination:** Server-side `page` and `limit` support with total count calculation.

### 3. Detailed Sanctuary Views & Booking
- **Gallery Mosaic:** High-definition photography with interactive photo switching.
- **Property Specs & Amenities:** Bedroom, bathroom, guest limits, and verified amenities.
- **Sticky Price Calculator:** Computes nights, sanitization fees, escrow fees, and taxes in real-time.
- **Escrow Stripe Checkout:** Modal with a "Fill Test Card" button allowing instant testing with Visa 4242 credentials.

### 4. Dedicated Dashboards
- **Tenant Dashboard:**
  - Active, pending, and confirmed reservations
  - One-click trigger to resume unpaid reservations via Stripe
  - Wish list / Saved properties collection
  - Personal profile editor (Name, Phone, Bio)
- **Owner / Host Dashboard:**
  - KPI cards: Total Revenue, Listings, Total Bookings, Pending Requests
  - Recharts Monthly Earnings area chart
  - Add New Property listing form with instant submission
  - Property listings table with live status badges (`Approved`, `Under Review`, `Rejected`)
  - "View Feedback" modal to inspect admin rejection notes
  - Guest booking requests table with Accept and Decline actions
- **Admin Control Center:**
  - Platform-wide statistics (Volume, Sanctuaries, Users, Bookings, Transactions)
  - Property Moderation Feed: 1-click Approve or Reject with constructive host feedback
  - User Directory: Role assignment dropdown and Block/Unblock toggle
  - Global Reservations table
  - Stripe Financial Transactions ledger with platform fee and host payout splits

### 5. Review & Rating System
- 5-star overall rating input
- Subcategory criteria ratings: *Cleanliness, Accuracy, Communication, Location, Value*
- Automatic average score and review count aggregation

---

## 📁 Repository Structure

```
├── client/                      # Frontend Client Application
│   └── src/
│       ├── components/          # Reusable UI components
│       │   ├── Footer.tsx
│       │   ├── LoadingSpinner.tsx
│       │   ├── Navbar.tsx
│       │   ├── PropertyCard.tsx
│       │   ├── ProtectedRoute.tsx
│       │   ├── RejectionModal.tsx
│       │   ├── ReviewModal.tsx
│       │   ├── SearchFilterBar.tsx
│       │   └── StripePaymentModal.tsx
│       ├── context/             # React Context Providers
│       │   ├── AuthContext.tsx
│       │   └── FavoritesContext.tsx
│       ├── pages/               # Application Route Views
│       │   ├── AdminDashboard.tsx
│       │   ├── HomePage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── NotFoundPage.tsx
│       │   ├── OwnerDashboard.tsx
│       │   ├── PropertiesPage.tsx
│       │   ├── PropertyDetailPage.tsx
│       │   ├── RegisterPage.tsx
│       │   └── TenantDashboard.tsx
│       ├── services/            # Axios API & SweetAlert2 helpers
│       │   └── api.ts
│       ├── types/               # Shared TypeScript interfaces
│       │   └── index.ts
│       └── App.tsx              # Router and layout configuration
├── server/                      # Backend Server Application
│   ├── config/                  # Database connection & persistence store
│   │   └── db.ts
│   ├── controllers/             # REST API business logic
│   │   ├── adminController.ts
│   │   ├── authController.ts
│   │   ├── bookingController.ts
│   │   ├── ownerController.ts
│   │   ├── paymentController.ts
│   │   ├── propertyController.ts
│   │   └── reviewController.ts
│   ├── middleware/              # JWT & RBAC authorization
│   │   └── auth.ts
│   ├── models/                  # Mongoose data models
│   │   ├── Booking.ts
│   │   ├── Property.ts
│   │   ├── Review.ts
│   │   ├── Transaction.ts
│   │   └── User.ts
│   ├── routes/                  # Express route routers
│   │   ├── adminRoutes.ts
│   │   ├── authRoutes.ts
│   │   ├── bookingRoutes.ts
│   │   ├── ownerRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   ├── propertyRoutes.ts
│   │   └── reviewRoutes.ts
│   └── seedData.ts              # Pre-seeded luxury properties & users
├── server.ts                    # Root full-stack Express server entry point
├── package.json
└── README.md
```

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/sign-up/email` | Public | Better Auth — register with name, email & password |
| `POST` | `/api/auth/sign-in/email` | Public | Better Auth — sign in with email & password |
| `POST` | `/api/auth/sign-out` | Authenticated | Better Auth — destroy session cookie |
| `GET` | `/api/auth/get-session` | Any | Better Auth — current session user |
| `POST` | `/api/auth/update-user` | Authenticated | Better Auth — update own profile (name, phone, bio, avatar) |
| `GET` | `/api/auth/ok` | Public | Better Auth health check |
| `POST` | `/api/admin/set-role` | Admin | Better Auth — change a user's role server-side |
| `POST` | `/api/admin/ban-user` / `unban-user` | Admin | Better Auth — ban / unban a user |
| `GET` | `/api/properties` | Public | Filtered & paginated property search |
| `GET` | `/api/properties/featured` | Public | Retrieve 6 handpicked featured stays |
| `GET` | `/api/properties/item/:id` | Public | Retrieve single property with reviews |
| `POST` | `/api/properties` | Owner/Admin | Submit new property listing |
| `DELETE`| `/api/properties/:id` | Owner/Admin | Remove property listing |
| `PUT` | `/api/properties/:id/moderate`| Admin | Approve or reject listing with reason |
| `POST` | `/api/properties/user/favorites/toggle` | Tenant | Add or remove stay from favorites |
| `POST` | `/api/bookings` | Tenant/Admin | Create new booking reservation |
| `GET` | `/api/bookings/my-bookings` | Tenant | Get personal reservations |
| `GET` | `/api/bookings/owner/requests` | Owner | Get incoming booking requests |
| `PUT` | `/api/bookings/:id/status` | Owner/Admin | Accept or decline booking request |
| `PUT` | `/api/bookings/:id/cancel` | Tenant/Admin | Cancel booking reservation |
| `POST` | `/api/payments/create-payment-intent` | Tenant | Generate Stripe Payment Intent |
| `POST` | `/api/payments/confirm-payment` | Tenant | Settle Stripe payment and update booking |
| `POST` | `/api/reviews` | Tenant/Admin | Submit rating & review for property |
| `GET` | `/api/owner/analytics` | Owner/Admin | Monthly earnings and KPI statistics |
| `GET` | `/api/admin/stats` | Admin | Global platform overview metrics |
| `GET` | `/api/admin/users` | Admin | Superadmin user management list |
| `PUT` | `/api/admin/users/:id/status` | Admin | Toggle block/active user status |
| `PUT` | `/api/admin/users/:id/role` | Admin | Reassign user RBAC role |

---

## ⚙️ Environment Variables

Copy the example configuration to your local environment file:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Container access port (must be 3000) | `3000` |
| `NODE_ENV` | Runtime environment | `development` or `production` |
| `MONGODB_URI` | MongoDB connection URI (persistent users when set; in-memory otherwise) | `mongodb://localhost:27017/havenstay` |
| `BETTER_AUTH_SECRET` | Better Auth signing secret (≥32 chars, required in production) | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Public base URL for cookie/CSRF origin | `http://localhost:3000` |
| `BETTER_AUTH_ADMIN_EMAIL` / `BETTER_AUTH_ADMIN_PASSWORD` | Optional bootstrap admin (created with admin role server-side) | `admin@yourdomain.com` |
| `STRIPE_SECRET_KEY` | Stripe secret key for real payments | `sk_test_...` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable public key | `pk_test_...` |

---

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Start development server (serves Express backend and Vite frontend on port 3000)
npm run dev

# Production build
npm run build

# Start production server
npm start
```
