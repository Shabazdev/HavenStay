/**
 * Vercel serverless entry point (Node.js runtime).
 *
 * Vercel routes every `/api/*` request to this catch-all function, which
 * delegates to the shared HavenStay Express application (Better Auth routes,
 * health check, business API). The app instance is created once per warm
 * lambda instance and reused across invocations.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Express } from 'express';
import { createApp } from '../server/app.ts';

let appPromise: Promise<Express> | null = null;

function getApp(): Promise<Express> {
  if (!appPromise) {
    appPromise = createApp();
  }
  return appPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const app = await getApp();
    // The Express application is itself a Node.js request handler.
    (app as unknown as (rq: unknown, rs: unknown) => void)(req, res);
  } catch (err) {
    console.error('[API] Failed to handle request:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}