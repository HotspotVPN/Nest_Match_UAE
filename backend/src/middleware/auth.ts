import { MiddlewareHandler } from 'hono';
import { Env, JWTPayload } from '../types';
import { verifyJWT } from '../services/jwt';

export const auth = (options: { required: boolean } = { required: true }): MiddlewareHandler<{ Bindings: Env; Variables: { user: JWTPayload } }> => {
  return async (c, next) => {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (options.required) {
        return c.json({ error: 'Unauthorized', message: 'Bearer token required' }, 401);
      }
      return await next();
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await verifyJWT(token, c.env.JWT_SECRET);
      c.set('user', payload);
      await next();
    } catch (e) {
      if (options.required) {
        return c.json({ error: 'Unauthorized', message: (e as Error).message }, 401);
      }
      await next();
    }
  };
};
