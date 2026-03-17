import { Hono } from 'hono';
import { AppEnv } from '../types';
import { auth as authMiddleware } from '../middleware/auth';
import { tierGate } from '../middleware/tierGate';
import { createViewingSchema } from '../validation/schemas';

const viewings = new Hono<AppEnv>();

// GET /api/viewings
viewings.get('/', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  let query = 'SELECT * FROM viewing_bookings WHERE tenant_id = ? OR landlord_id = ?';
  const results = await c.env.DB.prepare(query).bind(user.sub, user.sub).all<any>();
  return c.json(results.results);
});

// POST /api/viewings
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

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await c.env.DB.prepare(
      `INSERT INTO viewing_bookings (
        id, property_id, tenant_id, landlord_id,
        scheduled_date, time_slot, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)`
    ).bind(
      id, result.data.property_id, user.sub, property.landlord_id,
      result.data.scheduled_date, result.data.time_slot, now, now
    ).run();

    return c.json({ success: true, id }, 201);
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

    await c.env.DB.prepare(
      "UPDATE viewing_bookings SET status = 'CONFIRMED', updated_at = datetime('now') WHERE id = ?"
    ).bind(id).run();

    // Create viewing_agreements record with status 'sent'
    const agreementId = crypto.randomUUID();
    const agreementNumber = `NM-VA-${new Date().getFullYear()}-${id.slice(-5).toUpperCase()}`;

    await c.env.DB.prepare(
      `INSERT INTO viewing_agreements (id, viewing_id, agreement_number, status)
       VALUES (?, ?, ?, 'sent')`
    ).bind(agreementId, id, agreementNumber).run();

    // Auto-create chat channel if one doesn't exist
    const existingChannel = await c.env.DB.prepare(
      `SELECT id FROM chat_channels WHERE property_id = ?`
    ).bind(viewing.property_id).first<any>();

    if (!existingChannel) {
      const channelId = crypto.randomUUID();
      await c.env.DB.prepare(
        `INSERT INTO chat_channels (id, property_id, name, created_at) VALUES (?, ?, 'Viewing Chat', datetime('now'))`
      ).bind(channelId, viewing.property_id).run();
    }

    return c.json({ success: true, agreement_id: agreementId, agreement_number: agreementNumber });
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

    await c.env.DB.prepare(
      "UPDATE viewing_bookings SET status = 'CANCELLED', updated_at = datetime('now') WHERE id = ?"
    ).bind(id).run();

    return c.json({ success: true });
  }
);

export default viewings;
