import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB, isMongoConfigured } from './config/db.ts';
import { initAuth, ensureBootstrapAdmin } from './lib/auth.ts';
import { hydratePropertiesFromMongo } from './lib/seedMongo.ts';
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

  // Behind Vercel's proxy, `req.secure` / `X-Forwarded-Proto` must be trusted
  // so Better Auth sets `Secure` cookies correctly in production.
  app.set('trust proxy', 1);

  // Same-origin in production (Express serves the SPA + /api on one host),
  // so a permissive reflector is fine and required for the httpOnly session
  // cookie. Credentials must stay enabled for Better Auth.
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // Database + catalog are OPTIONAL: if Mongo is missing/unreachable, the app
  // falls back to the in-memory store and the in-memory Better Auth adapter.
  // Startup failures here must never take down the whole API in serverless.
  try {
    await connectDB();
  } catch (err) {
    console.error('[API] Database startup failure (continuing with in-memory fallback):', err);
  }

  // Serve the property catalog from MongoDB when it is reachable (and seed
  // it on first run). Falls back to the in-memory catalog otherwise.
  try {
    await hydratePropertiesFromMongo();
  } catch (err) {
    console.error('[API] Property catalog hydration failure (continuing with in-memory catalog):', err);
  }

  // Better Auth (email/password authentication + admin plugin).
  // IMPORTANT: mounted BEFORE body-parsing middleware as required by Better Auth.
  let auth: ReturnType<typeof initAuth>;
  try {
    auth = initAuth();
  } catch (err) {
    console.error('[API] Better Auth initialization failure:', err);
    throw err;
  }
  // Optionally create the env-configured bootstrap admin (server-side only).
  await ensureBootstrapAdmin(auth);
  app.all('/api/auth/*', toNodeHandler(auth));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check (also reports whether durable auth persistence is active).
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'HavenStay MERN Property Rental Platform API',
      timestamp: new Date().toISOString(),
      authPersistence: isMongoConfigured() ? 'mongodb' : 'memory (configure MONGODB_URI for production login persistence)',
    });
  });

  // Better Auth diagnostics endpoint: confirms whether the server can reach a
  // durable user database. Login ("Invalid email or password") with a correct
  // password almost always means the user/account record is missing — i.e.
  // the serverless memory adapter was used because MONGODB_URI is unset.
  app.get('/api/auth-status', (req, res) => {
    res.json({
      success: true,
      mongoConfigured: isMongoConfigured(),
      authPersistence: isMongoConfigured() ? 'mongodb' : 'memory',
      hint: isMongoConfigured()
        ? 'Auth users persist in MongoDB.'
        : 'Set MONGODB_URI in Vercel so registrations survive across serverless invocations; otherwise sign-up succeeds but later sign-in returns "Invalid email or password".',
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