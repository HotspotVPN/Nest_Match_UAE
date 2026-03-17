import { MiddlewareHandler } from 'hono';
import { Env, JWTPayload } from '../types';

export const tierGate = (minTier: number = 2): MiddlewareHandler<{ Bindings: Env; Variables: { user: JWTPayload } }> => {
  return async (c, next) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ error: 'Unauthorized', message: 'Authentication required' }, 401);
    }

    if (user.tier < minTier) {
      return c.json({ 
        error: 'Forbidden', 
        message: 'UAE PASS verification required. Upgrade to Tier 2 to access this feature.' 
      }, 403);
    }

    await next();
  };
};
