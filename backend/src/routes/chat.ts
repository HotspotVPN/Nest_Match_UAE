import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { auth as authMiddleware } from '../middleware/auth';

const chat = new Hono<AppEnv>();

chat.get('/channels', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  // chat_channels uses 'participants' JSON array column in current schema
  const results = await c.env.DB.prepare(
    "SELECT * FROM chat_channels WHERE participants LIKE '%' || ? || '%' ORDER BY created_at DESC"
  ).bind(user.sub).all();
  return c.json(results.results);
});

export default chat;
