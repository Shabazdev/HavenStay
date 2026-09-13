/**
 * Vercel serverless entry point (Node.js runtime).
 *
 * Every `/api/*` request is served by this catch-all function, which
 * delegates to the shared HavenStay Express application (Better Auth routes,
 * health check, business API). `api/[...path].ts` is the documented Vercel
 * Function catch-all name — each request keeps its original URL, so Express
 * routes (`/api/auth/*`, `/api/properties`, `/api/health`, …) match as-is.
 *
 * The app instance is cached on `globalThis` so warm instances reuse the
 * same Express app, mongoose connection, and Better Auth singleton.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Express } from 'express';
import { createApp } from '../server/app.ts';

const globalForApp = globalThis as { __havenstayApp?: Promise<Express> };

function getApp(): Promise<Express> {
  if (!globalForApp.__havenstayApp) {
    globalForApp.__havenstayApp = createApp().catch((err) => {
      console.error('[API] createApp failed:', err);
      globalForApp.__havenstayApp = undefined;
      throw err;
    });
  }
  return globalForApp.__havenstayApp;
}

// Better Auth reads the raw request body itself via `toNodeHandler(auth)`.
// Vercel's default body parser would consume/parse the stream first and break
// POST /api/auth/* (sign-up, sign-in), so it must stay disabled here.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const app = await getApp();
    // An Express app is a valid Node.js request handler.
    (app as unknown as (rq: unknown, rs: unknown) => void)(req, res);
  } catch (err) {
    console.error('[API] Unhandled request error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Internal server error. Please try again.' });
    }
  }
}