import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db.ts';
import { initAuth, ensureBootstrapAdmin } from './lib/auth.ts';
import { toNodeHandler } from 'better-auth/node';

import propertyRoutes from './routes/propertyRoutes.ts';
import bookingRoutes from './routes/bookingRoutes.ts';
import paymentRoutes from './routes/paymentRoutes.ts';
import reviewRoutes from './routes/reviewRoutes.ts';
import ownerRoutes from './routes/ownerRoutes.ts';
import adminRoutes from './routes/adminRoutes.ts';

dotenv.config();

/**
 * Builds the fully configured HavenStay Express application (API + Better Auth).
 *
 * This factory is shared by two entry points:
 *  - `server.ts` — the local development/production Node.js server (adds Vite
 *    middleware in dev and calls `app.listen`).
 *  - `api/[[...path]].ts` — the Vercel serverless function (all `/api/*`
 *    requests are routed here in production deployments).
 *
 * The application is created without calling `app.listen` so it can be used as
 * a request handler in serverless environments.
 */
export async function createApp(): Promise<express.Express> {
  const app = express();

  // CORS
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // Connect to the database first so Better Auth can use the same
  // MongoDB connection when one is configured.
  await connectDB();

  // Better Auth (email/password authentication + admin plugin).
  // IMPORTANT: mounted BEFORE body-parsing middleware as required by Better Auth.
  const auth = initAuth();
  // Optionally create the env-configured bootstrap admin (server-side only).
  await ensureBootstrapAdmin(auth);
  app.all('/api/auth/*', toNodeHandler(auth));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'HavenStay MERN Property Rental Platform API',
      timestamp: new Date().toISOString(),
    });
  });

  // Business API routes (authentication handled by requireAuth middleware,
  // which resolves the Better Auth session cookie server-side).
  app.use('/api/properties', propertyRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/owner', ownerRoutes);
  app.use('/api/admin', adminRoutes);

  // Static serving for a local production run (`npm run build && npm start`).
  // On Vercel the SPA is served by the CDN from `dist/` (see vercel.json) and
  // only `/api/*` requests reach this application, so the SPA catch-all is
  // skipped there — unknown API paths should still return a real 404.
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}