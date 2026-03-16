import { Hono } from 'hono';
import { Env } from '../types';
import { signJWT } from '../services/jwt';
import { getMockUaePassUser } from '../services/mockUaePass';

const authUaePass = new Hono<{ Bindings: Env }>();

// POST /api/auth/uae-pass — UAE PASS OAuth callback
// CRITICAL: This is the ONLY path to verification_tier = 'tier2_uae_pass' (gold)
authUaePass.post('/', async (c) => {
  const body = await c.req.json();
  const { code } = body as { code?: string };

  if (!code) return c.json({ error: 'Authorization code required' }, 400);

  const mockUser = getMockUaePassUser(code);

  // Find or create user
  let user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE uae_pass_id = ? OR email = ?'
  ).bind(mockUser.uaePassId, mockUser.email).first<any>();

  const previousTier = user?.verification_tier || null;

  if (user) {
    // Update existing user to gold tier via UAE PASS
    await c.env.DB.prepare(
      `UPDATE users SET uae_pass_id = ?, is_uae_pass_verified = 1,
       verification_tier = 'tier2_uae_pass' WHERE id = ?`
    ).bind(mockUser.uaePassId, user.id).run();
  } else {
    // Create new user at gold tier (UAE PASS OAuth completed)
    const id = crypto.randomUUID();
    await c.env.DB.prepare(
      `INSERT INTO users (id, email, uae_pass_id, is_uae_pass_verified, role, name, verification_tier)
       VALUES (?, ?, ?, 1, 'SEARCHING_TENANT', ?, 'tier2_uae_pass')`
    ).bind(id, mockUser.email, mockUser.uaePassId, mockUser.name).run();
    user = { id, email: mockUser.email, role: 'SEARCHING_TENANT', name: mockUser.name };
  }

  // Store OAuth token
  const existingToken = await c.env.DB.prepare(
    `SELECT id FROM oauth_tokens WHERE provider = 'uae_pass' AND provider_user_id = ?`
  ).bind(mockUser.uaePassId).first<any>();

  if (!existingToken) {
    const tokenId = crypto.randomUUID();
    await c.env.DB.prepare(
      `INSERT INTO oauth_tokens (id, user_id, provider, provider_user_id, access_token, expires_at)
       VALUES (?, ?, 'uae_pass', ?, ?, datetime('now', '+1 hour'))`
    ).bind(tokenId, user.id, mockUser.uaePassId, `mock_uaepass_token_${code}`).run();
  }

  // Write verification event (audit log)
  const verEventId = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO verification_events (id, user_id, from_tier, to_tier, trigger, performed_by)
     VALUES (?, ?, ?, 'tier2_uae_pass', 'uae_pass_oauth', ?)`
  ).bind(verEventId, user.id, previousTier, user.id).run();

  const token = await signJWT(
    { sub: user.id, email: user.email, role: user.role, tier: 2 },
    c.env.JWT_SECRET
  );

  return c.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, tier: 2, isUaePassVerified: true }
  });
});

export default authUaePass;
