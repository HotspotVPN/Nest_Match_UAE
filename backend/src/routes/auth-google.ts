import { Hono } from 'hono';
import { Env } from '../types';
import { signJWT } from '../services/jwt';

const authGoogle = new Hono<{ Bindings: Env }>();

// POST /api/auth/google — Google OAuth callback (mock implementation)
authGoogle.post('/', async (c) => {
  const body = await c.req.json();
  const { code, email, name } = body as { code?: string; email?: string; name?: string };

  if (!code) return c.json({ error: 'Authorization code required' }, 400);

  // Mock: derive email from code if not provided
  const userEmail = email || `google-user-${code.slice(0, 8)}@gmail.com`;
  const userName = name || 'Google User';

  // Find existing user by email
  let user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(userEmail).first<any>();

  if (!user) {
    // Create new user with 'explorer' (tier1_unverified) tier
    const id = crypto.randomUUID();
    const providerUserId = `google_${code.slice(0, 16)}`;

    await c.env.DB.prepare(
      `INSERT INTO users (id, email, name, role, verification_tier, is_uae_pass_verified)
       VALUES (?, ?, ?, 'SEARCHING_TENANT', 'tier1_unverified', 0)`
    ).bind(id, userEmail, userName).run();

    // Store OAuth token
    const tokenId = crypto.randomUUID();
    await c.env.DB.prepare(
      `INSERT INTO oauth_tokens (id, user_id, provider, provider_user_id, access_token, expires_at)
       VALUES (?, ?, 'google', ?, ?, datetime('now', '+1 hour'))`
    ).bind(tokenId, id, providerUserId, `mock_access_${code}`).run();

    user = { id, email: userEmail, name: userName, role: 'SEARCHING_TENANT', verification_tier: 'tier1_unverified' };
  } else {
    // Existing user — update OAuth token if needed
    const providerUserId = `google_${code.slice(0, 16)}`;
    const existing = await c.env.DB.prepare(
      `SELECT id FROM oauth_tokens WHERE provider = 'google' AND user_id = ?`
    ).bind(user.id).first<any>();

    if (!existing) {
      const tokenId = crypto.randomUUID();
      await c.env.DB.prepare(
        `INSERT INTO oauth_tokens (id, user_id, provider, provider_user_id, access_token, expires_at)
         VALUES (?, ?, 'google', ?, ?, datetime('now', '+1 hour'))`
      ).bind(tokenId, user.id, providerUserId, `mock_access_${code}`).run();
    }
  }

  const tier = user.is_uae_pass_verified ? 2 : 1;
  const token = await signJWT(
    { sub: user.id, email: user.email, role: user.role, tier },
    c.env.JWT_SECRET
  );

  return c.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, tier }
  });
});

export default authGoogle;
