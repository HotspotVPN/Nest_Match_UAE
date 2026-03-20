import { MiddlewareHandler } from 'hono';
import { Env } from '../types';

export const cors = (): MiddlewareHandler<{ Bindings: Env }> => {
  return async (c, next) => {
    const requestOrigin = c.req.header('Origin') || '';
    const allowedOrigin = c.env.ALLOWED_ORIGIN || 'https://nest-match-uae.vercel.app';

    // Determine which origin to allow
    let origin: string;
    if (requestOrigin.startsWith('http://localhost') || requestOrigin.startsWith('http://127.0.0.1')) {
      // Development: allow any localhost port
      origin = requestOrigin;
    } else if (requestOrigin === allowedOrigin) {
      // Production: exact match
      origin = allowedOrigin;
    } else {
      // Fallback for non-browser requests (curl, etc.)
      origin = allowedOrigin;
    }

    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    };

    // OPTIONS preflight: return 204 WITH cors headers
    if (c.req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // All other requests: set headers then continue
    await next();

    Object.entries(corsHeaders).forEach(([key, value]) => {
      c.res.headers.set(key, value);
    });
  };
};
