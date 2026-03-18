import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { auth as authMiddleware } from '../middleware/auth';

const agreements = new Hono<AppEnv>();

// ── GET /api/agreements/:id ──────────────────────────────────
agreements.get('/:id', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');

  const agreement = await c.env.DB.prepare(`
    SELECT va.*,
      vb.property_id, vb.tenant_id, vb.landlord_id,
      vb.scheduled_date, vb.time_slot,
      vb.status as viewing_status,
      p.title as property_title,
      p.address as property_address,
      p.makani_number,
      p.district
    FROM viewing_agreements va
    JOIN viewing_bookings vb ON vb.id = va.viewing_id
    JOIN properties p ON p.id = vb.property_id
    WHERE va.id = ?
  `).bind(id).first<any>();

  if (!agreement) return c.json({ error: 'Agreement not found' }, 404);

  if (agreement.tenant_id !== user.sub && agreement.landlord_id !== user.sub) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const sigs = await c.env.DB.prepare(`
    SELECT id, signer_id, signer_role, signed_at
    FROM agreement_signatures
    WHERE agreement_id = ?
    ORDER BY signed_at ASC
  `).bind(id).all();

  return c.json({ ...agreement, signatures: sigs.results || [] });
});

// ── POST /api/agreements ─────────────────────────────────────
agreements.post('/', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  const { viewing_id, broker_orn, commercial_license, plot_number, building_number } =
    await c.req.json();

  if (!viewing_id) return c.json({ error: 'viewing_id required' }, 400);

  const viewing = await c.env.DB.prepare(
    'SELECT * FROM viewing_bookings WHERE id = ?'
  ).bind(viewing_id).first<any>();

  if (!viewing) return c.json({ error: 'Viewing not found' }, 404);
  if (viewing.landlord_id !== user.sub) {
    return c.json({ error: 'Forbidden' }, 403);
  }
  if (viewing.status !== 'CONFIRMED') {
    return c.json({
      error: `Viewing must be CONFIRMED. Current: ${viewing.status}`,
    }, 400);
  }

  const existing = await c.env.DB.prepare(
    'SELECT id FROM viewing_agreements WHERE viewing_id = ?'
  ).bind(viewing_id).first();
  if (existing) {
    return c.json({ error: 'Agreement already exists for this viewing' }, 409);
  }

  const year = new Date().getFullYear();
  const countRow = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM viewing_agreements'
  ).first<any>();
  const seq = String((countRow?.count || 0) + 1).padStart(5, '0');
  const agreement_number = `NM-VA-${year}-${seq}`;

  const agent = await c.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(user.sub).first<any>();

  const id = crypto.randomUUID();
  await c.env.DB.prepare(`
    INSERT INTO viewing_agreements (
      id, viewing_id, agreement_number,
      broker_orn, broker_brn, commercial_license,
      plot_number, building_number, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent')
  `).bind(
    id, viewing_id, agreement_number,
    broker_orn || agent?.rera_license || '',
    agent?.rera_license || '',
    commercial_license || '',
    plot_number || '',
    building_number || '',
  ).run();

  await c.env.DB.prepare(`
    UPDATE viewing_bookings
    SET status = 'AGREEMENT_SENT', updated_at = datetime('now')
    WHERE id = ?
  `).bind(viewing_id).run();

  const created = await c.env.DB.prepare(
    'SELECT * FROM viewing_agreements WHERE id = ?'
  ).bind(id).first();

  return c.json({ data: created }, 201);
});

// ── PATCH /api/agreements/:id/sign ──────────────────────────
agreements.patch('/:id/sign', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');
  const { signature_data, signer_role } = await c.req.json();

  if (!signature_data) {
    return c.json({ error: 'signature_data required' }, 400);
  }
  if (!['broker', 'tenant'].includes(signer_role)) {
    return c.json({ error: 'signer_role must be broker or tenant' }, 400);
  }
  if (!signature_data.startsWith('data:image/')) {
    return c.json({ error: 'signature_data must be a data URI' }, 400);
  }

  const agreement = await c.env.DB.prepare(`
    SELECT va.*, vb.tenant_id, vb.landlord_id, vb.id as viewing_booking_id
    FROM viewing_agreements va
    JOIN viewing_bookings vb ON vb.id = va.viewing_id
    WHERE va.id = ?
  `).bind(id).first<any>();

  if (!agreement) return c.json({ error: 'Agreement not found' }, 404);

  const isTenant = agreement.tenant_id === user.sub;
  const isLandlord = agreement.landlord_id === user.sub;

  if (!isTenant && !isLandlord) {
    return c.json({ error: 'Forbidden — not a party to this agreement' }, 403);
  }
  if (signer_role === 'tenant' && !isTenant) {
    return c.json({ error: 'Cannot sign as tenant for this agreement' }, 403);
  }
  if (signer_role === 'broker' && !isLandlord) {
    return c.json({ error: 'Cannot sign as broker for this agreement' }, 403);
  }

  const existingSig = await c.env.DB.prepare(
    'SELECT id FROM agreement_signatures WHERE agreement_id = ? AND signer_id = ?'
  ).bind(id, user.sub).first();
  if (existingSig) {
    return c.json({ error: 'You have already signed this agreement' }, 409);
  }

  const sigId = crypto.randomUUID();
  await c.env.DB.prepare(`
    INSERT INTO agreement_signatures
      (id, agreement_id, signer_id, signer_role, signature_data, signed_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).bind(sigId, id, user.sub, signer_role, signature_data).run();

  const sigCount = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM agreement_signatures WHERE agreement_id = ?'
  ).bind(id).first<any>();

  const totalSigs = sigCount?.count || 1;
  const newAgreementStatus = totalSigs >= 2 ? 'fully_signed' : 'agent_signed';
  const newViewingStatus = totalSigs >= 2 ? 'FULLY_SIGNED' : 'AGENT_SIGNED';

  await c.env.DB.prepare(`
    UPDATE viewing_agreements
    SET status = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(newAgreementStatus, id).run();

  await c.env.DB.prepare(`
    UPDATE viewing_bookings
    SET status = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(newViewingStatus, agreement.viewing_booking_id).run();

  const updatedAgreement = await c.env.DB.prepare(`
    SELECT va.*, vb.status as viewing_status
    FROM viewing_agreements va
    JOIN viewing_bookings vb ON vb.id = va.viewing_id
    WHERE va.id = ?
  `).bind(id).first<any>();

  const allSignatures = await c.env.DB.prepare(`
    SELECT id, signer_id, signer_role, signed_at
    FROM agreement_signatures
    WHERE agreement_id = ?
    ORDER BY signed_at ASC
  `).bind(id).all();

  return c.json({
    data: {
      ...updatedAgreement,
      signatures: allSignatures.results || [],
    },
  });
});

export default agreements;
