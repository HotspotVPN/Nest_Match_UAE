import { Hono } from 'hono';
import { Env } from '../types';
import { signJWT } from '../services/jwt';
import { getMockUaePassUser } from '../services/mockUaePass';
import { loginSchema, registerSchema } from '../validation/schemas';
import { auth as authMiddleware } from '../middleware/auth';

const auth = new Hono<{ Bindings: Env }>();

// POST /api/auth/register
auth.post('/register', async (c) => {
  const body = await c.req.json();
  const result = registerSchema.safeParse(body);
  if (!result.success) return c.json({ error: 'Validation failed', details: result.error.format() }, 400);

  const { email, password, name, role } = result.data;
  const id = crypto.randomUUID();
  
  try {
    await c.env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, email, password, name, role).run();

    return c.json({ success: true, userId: id }, 201);
  } catch (e) {
    return c.json({ error: 'Registration failed', message: (e as Error).message }, 500);
  }
});

// POST /api/auth/login
auth.post('/login', async (c) => {
  const body = await c.req.json();
  const result = loginSchema.safeParse(body);
  if (!result.success) return c.json({ error: 'Invalid credentials' }, 400);

  const { email, password } = result.data;
  
  const user = await c.env.DB.prepare(
    'SELECT id, email, role, is_uae_pass_verified FROM users WHERE email = ? AND password_hash = ?'
  ).bind(email, password).first<any>();

  if (!user) return c.json({ error: 'Invalid email or password' }, 401);

  const tier = user.is_uae_pass_verified ? 2 : 1;
  const token = await signJWT({ sub: user.id, email: user.email, role: user.role, tier }, c.env.JWT_SECRET);

  return c.json({ token, user: { id: user.id, email: user.email, role: user.role, tier } });
});

// POST /api/auth/uaepass-callback (Mock)
auth.post('/uaepass-callback', async (c) => {
  const { code } = await c.req.json();
  if (!code) return c.json({ error: 'Authorization code required' }, 400);

  const mockUser = getMockUaePassUser(code);
  
  // Find or update user in DB
  let user = await c.env.DB.prepare('SELECT * FROM users WHERE uae_pass_id = ? OR email = ?')
    .bind(mockUser.uaePassId, mockUser.email).first<any>();

  if (user) {
    await c.env.DB.prepare(
      'UPDATE users SET uae_pass_id = ?, is_uae_pass_verified = 1 WHERE id = ?'
    ).bind(mockUser.uaePassId, user.id).run();
  } else {
    const id = crypto.randomUUID();
    await c.env.DB.prepare(
      'INSERT INTO users (id, email, uae_pass_id, is_uae_pass_verified, role, name) VALUES (?, ?, ?, 1, ?, ?)'
    ).bind(id, mockUser.email, mockUser.uaePassId, 'SEARCHING_TENANT', mockUser.name).run();
    user = { id, email: mockUser.email, role: 'SEARCHING_TENANT' };
  }

  const token = await signJWT({ sub: user.id, email: user.email, role: user.role, tier: 2 }, c.env.JWT_SECRET);
  return c.json({ token, user: { id: user.id, email: user.email, role: user.role, tier: 2 } });
});

// GET /api/auth/me
auth.get('/me', authMiddleware({ required: true }), async (c) => {
  const userPayload = c.get('user');
  if (!userPayload) return c.json({ error: 'Unauthorized' }, 401);

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(userPayload.sub).first<any>();

  if (!user) return c.json({ error: 'User not found' }, 404);

  return c.json(user);
});

export default auth;
