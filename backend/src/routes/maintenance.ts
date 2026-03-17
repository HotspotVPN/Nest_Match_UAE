import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { auth as authMiddleware } from '../middleware/auth';

const maintenance = new Hono<AppEnv>();

maintenance.get('/', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  const results = await c.env.DB.prepare(
    'SELECT * FROM maintenance_tickets WHERE tenant_id = ? ORDER BY created_at DESC'
  ).bind(user.sub).all();
  return c.json(results.results);
});

export default maintenance;
