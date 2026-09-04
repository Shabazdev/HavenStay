import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db.ts';
import { initAuth, ensureBootstrapAdmin } from './server/lib/auth.ts';
import { toNodeHandler } from 'better-auth/node';

import propertyRoutes from './server/routes/propertyRoutes.ts';
import bookingRoutes from './server/routes/bookingRoutes.ts';
import paymentRoutes from './server/routes/paymentRoutes.ts';
import reviewRoutes from './server/routes/reviewRoutes.ts';
import ownerRoutes from './server/routes/ownerRoutes.ts';
import adminRoutes from './server/routes/adminRoutes.ts';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
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

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HavenStay Server] running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
