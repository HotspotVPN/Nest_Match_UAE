import { MiddlewareHandler } from 'hono';
import { Env } from '../types';

export const cors = (): MiddlewareHandler<{ Bindings: Env }> => {
  return async (c, next) => {
    const requestOrigin = c.req.header('Origin');
    const allowedOrigin = c.env.ALLOWED_ORIGIN || '*';
    
    // In development or local testing, allow localhost origins
    let origin = allowedOrigin;
    if (requestOrigin && (requestOrigin.startsWith('http://localhost') || requestOrigin.startsWith('http://127.0.0.1'))) {
      origin = requestOrigin;
    }
    
    c.res.headers.set('Access-Control-Allow-Origin', origin);
    c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    c.res.headers.set('Access-Control-Allow-Credentials', 'true');
    c.res.headers.set('Access-Control-Max-Age', '86400');

    if (c.req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    await next();
  };
};
