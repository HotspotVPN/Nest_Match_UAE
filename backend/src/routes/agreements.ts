import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { auth as authMiddleware } from '../middleware/auth';

const agreements = new Hono<AppEnv>();

// GET /api/agreements/:id
agreements.get('/:id', authMiddleware({ required: true }), async (c) => {
  const id = c.req.param('id');
  const agreement = await c.env.DB.prepare(
    `SELECT va.*, vb.property_id, vb.tenant_id, vb.landlord_id, vb.scheduled_date, vb.time_slot
     FROM viewing_agreements va
     JOIN viewing_bookings vb ON vb.id = va.viewing_id
     WHERE va.id = ?`
  ).bind(id).first();
  if (!agreement) return c.json({ error: 'Agreement not found' }, 404);

  const sigs = await c.env.DB.prepare(
    'SELECT * FROM agreement_signatures WHERE agreement_id = ?'
  ).bind(id).all();

  return c.json({ ...agreement, signatures: sigs.results });
});

export default agreements;
