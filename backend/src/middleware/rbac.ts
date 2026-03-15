import { MiddlewareHandler } from 'hono';
import { Env } from '../types';

export const rbac = (...allowedRoles: string[]): MiddlewareHandler<{ Bindings: Env }> => {
  return async (c, next) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ error: 'Unauthorized', message: 'Authentication required' }, 401);
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json({ 
        error: 'Forbidden', 
        message: `Role ${user.role} does not have access to this resource.` 
      }, 403);
    }

    await next();
  };
};
