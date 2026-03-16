import { Hono } from 'hono';
import { Env } from '../types';
import { auth as authMiddleware } from '../middleware/auth';
import { tierGate } from '../middleware/tierGate';
import { createViewingSchema } from '../validation/schemas';
import { createHoldAuthorization, voidHoldAuthorization } from '../services/mockStripe';

const viewings = new Hono<{ Bindings: Env }>();

// GET /api/viewings
viewings.get('/', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  let query = 'SELECT * FROM viewing_bookings WHERE tenant_id = ? OR landlord_id = ?';
  const results = await c.env.DB.prepare(query).bind(user.sub, user.sub).all<any>();
  return c.json(results.results);
});

// POST /api/viewings (Two-Way Commitment Hold)
viewings.post('/', 
  authMiddleware({ required: true }),
  tierGate(2),
  async (c) => {
    const user = c.get('user')!;
    const body = await c.req.json();
    const result = createViewingSchema.safeParse(body);

    if (!result.success) return c.json({ error: 'Validation failed' }, 400);

    // Get landlord_id from property
    const property = await c.env.DB.prepare('SELECT landlord_id FROM properties WHERE id = ?')
      .bind(result.data.property_id).first<any>();

    if (!property) return c.json({ error: 'Property not found' }, 404);

    // Compliance: Create 50 AED Hold (AED 50 pre-auth)
    const hold = createHoldAuthorization(user.sub, 50);

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await c.env.DB.prepare(
      `INSERT INTO viewing_bookings (
        id, property_id, tenant_id, landlord_id, 
        scheduled_date, time_slot, status, 
        stripe_hold_id, hold_amount, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?, 5000, ?, ?)`
    ).bind(
      id, result.data.property_id, user.sub, property.landlord_id,
      result.data.scheduled_date, result.data.time_slot, hold.id, now, now
    ).run();

    return c.json({ success: true, id, holdStatus: hold.status }, 201);
  }
);

// PATCH /api/viewings/:id/accept
viewings.patch('/:id/accept', 
  authMiddleware({ required: true }),
  tierGate(2),
  async (c) => {
    const user = c.get('user')!;
    const id = c.req.param('id');

    const viewing = await c.env.DB.prepare('SELECT * FROM viewing_bookings WHERE id = ? AND landlord_id = ?')
      .bind(id, user.sub).first<any>();

    if (!viewing) return c.json({ error: 'Viewing not found' }, 404);

    // Landlord agrees to penalty (another 50 AED hold simulated)
    const landlordHold = createHoldAuthorization(user.sub, 50);

    await c.env.DB.prepare(
      "UPDATE viewing_bookings SET status = 'CONFIRMED', landlord_agreed_penalty = 1, updated_at = datetime('now') WHERE id = ?"
    ).bind(id).run();

    // Create viewing_agreements record with status 'sent'
    const agreementId = crypto.randomUUID();
    const agreementNumber = `DLD-VA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    await c.env.DB.prepare(
      `INSERT INTO viewing_agreements (id, viewing_id, agreement_number, status)
       VALUES (?, ?, ?, 'sent')`
    ).bind(agreementId, id, agreementNumber).run();

    // Auto-create chat channel if one doesn't exist for this tenant+landlord+property combo
    const existingChannel = await c.env.DB.prepare(
      `SELECT id FROM chat_channels WHERE property_id = ? AND id IN (
        SELECT channel_id FROM chat_participants WHERE user_id = ?
        INTERSECT
        SELECT channel_id FROM chat_participants WHERE user_id = ?
      )`
    ).bind(viewing.property_id, viewing.tenant_id, user.sub).first<any>();

    if (!existingChannel) {
      const channelId = crypto.randomUUID();
      const channelNow = new Date().toISOString();
      await c.env.DB.prepare(
        `INSERT INTO chat_channels (id, property_id, name, created_at) VALUES (?, ?, 'Viewing Chat', ?)`
      ).bind(channelId, viewing.property_id, channelNow).run();
      // Add both participants
      await c.env.DB.prepare(
        `INSERT INTO chat_participants (channel_id, user_id) VALUES (?, ?)`
      ).bind(channelId, viewing.tenant_id).run();
      await c.env.DB.prepare(
        `INSERT INTO chat_participants (channel_id, user_id) VALUES (?, ?)`
      ).bind(channelId, user.sub).run();
    }

    return c.json({ success: true, landlordHoldStatus: landlordHold.status, agreement_id: agreementId, agreement_number: agreementNumber });
  }
);

// PATCH /api/viewings/:id/decline
viewings.patch('/:id/decline', 
  authMiddleware({ required: true }),
  async (c) => {
    const user = c.get('user')!;
    const id = c.req.param('id');

    const viewing = await c.env.DB.prepare('SELECT * FROM viewing_bookings WHERE id = ? AND landlord_id = ?')
      .bind(id, user.sub).first<any>();

    if (!viewing) return c.json({ error: 'Viewing not found' }, 404);

    // Compliance: Void tenant hold
    voidHoldAuthorization(viewing.stripe_hold_id);

    await c.env.DB.prepare(
      "UPDATE viewing_bookings SET status = 'DECLINED', updated_at = datetime('now') WHERE id = ?"
    ).bind(id).run();

    return c.json({ success: true });
  }
);

export default viewings;
