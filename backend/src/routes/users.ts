import { Hono } from 'hono';
import { AppEnv } from '../types';
import { auth as authMiddleware } from '../middleware/auth';
import { updateProfileSchema } from '../validation/schemas';

const users = new Hono<AppEnv>();

// GET /api/users/me
users.get('/me', authMiddleware({ required: true }), async (c) => {
  const userPayload = c.get('user')!;
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(userPayload.sub).first<any>();
  return c.json(user);
});

// PATCH /api/users/me
users.patch('/me', authMiddleware({ required: true }), async (c) => {
  const userPayload = c.get('user')!;
  const body = await c.req.json();
  const result = updateProfileSchema.safeParse(body);
  
  if (!result.success) return c.json({ error: 'Validation failed' }, 400);

  // Simple dynamic update (for demo purposes)
  const fields = Object.keys(result.data);
  if (fields.length === 0) return c.json({ message: 'No changes' });

  const sets = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => {
    const val = (result.data as any)[f];
    return Array.isArray(val) ? JSON.stringify(val) : val;
  });

  await c.env.DB.prepare(
    `UPDATE users SET ${sets}, updated_at = datetime('now') WHERE id = ?`
  ).bind(...values, userPayload.sub).run();

  return c.json({ success: true });
});

// GET /api/users/:id
users.get('/:id', async (c) => {
  const id = c.req.param('id');
  // Blind Matching: Omit sensitive fields
  const user = await c.env.DB.prepare(
    'SELECT id, name, avatar_key, bio, lifestyle_tags, personality_traits, hobbies, gcc_score, is_premium, compliance_verified, role FROM users WHERE id = ?'
  ).bind(id).first<any>();

  if (!user) return c.json({ error: 'User not found' }, 404);

  // Parse JSON arrays
  ['lifestyle_tags', 'personality_traits', 'hobbies'].forEach(f => {
    if (user[f] && typeof user[f] === 'string') user[f] = JSON.parse(user[f]);
  });

  return c.json(user);
});

export default users;
