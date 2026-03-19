import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { auth as authMiddleware } from '../middleware/auth';

const ejari = new Hono<AppEnv>();

ejari.use('/*', authMiddleware({ required: true }));

// ═══════════════════════════════════════════════════════════
// ROUTE ORDER IS CRITICAL
// /stats/summary MUST come BEFORE /:id
// Otherwise Hono matches 'stats' as an id parameter
// ═══════════════════════════════════════════════════════════

// GET /api/ejari/stats/summary — Dashboard stats (MUST BE FIRST)
ejari.get('/stats/summary', async (c) => {
  const user = c.get('user')!;

  const stats = await c.env.DB.prepare(`
    SELECT
      COUNT(*) as total_documents,
      SUM(CASE WHEN ejari_status = 'active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN ejari_status = 'expired' THEN 1 ELSE 0 END) as expired,
      SUM(CASE WHEN ejari_status = 'active' THEN annual_rent ELSE 0 END) as total_annual_rent
    FROM ejari_documents
    WHERE uploaded_by = ?
  `).bind(user.sub).first();

  const expiring = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM ejari_documents
    WHERE uploaded_by = ?
    AND ejari_status = 'active'
    AND date(contract_end_date) <= date('now', '+90 days')
  `).bind(user.sub).first<any>();

  return c.json({
    ...stats,
    expiring_soon: expiring?.count || 0,
  });
});

// GET /api/ejari/:id — Single document details (AFTER stats)
ejari.get('/:id', async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');

  // NOTE: Use p.makani_number (snake_case), NOT p.makaniNumber
  const doc = await c.env.DB.prepare(`
    SELECT e.*,
           p.title as property_title,
           p.district as property_district,
           p.address as property_address,
           p.makani_number as property_makani
    FROM ejari_documents e
    LEFT JOIN properties p ON e.property_id = p.id
    WHERE e.id = ? AND (e.uploaded_by = ? OR e.tenant_user_id = ?)
  `).bind(id, user.sub, user.sub).first();

  if (!doc) {
    return c.json({ error: 'Document not found' }, 404);
  }

  return c.json(doc);
});

// GET /api/ejari — List documents for landlord OR tenant
ejari.get('/', async (c) => {
  const user = c.get('user')!;
  const status = c.req.query('status');

  let query = `
    SELECT e.*,
           p.title as property_title,
           p.district as property_district,
           p.address as property_address
    FROM ejari_documents e
    LEFT JOIN properties p ON e.property_id = p.id
    WHERE (e.uploaded_by = ? OR e.tenant_user_id = ?)
  `;
  const params: string[] = [user.sub, user.sub];

  if (status && status !== 'all') {
    query += ' AND e.ejari_status = ?';
    params.push(status);
  }

  query += ' ORDER BY e.contract_end_date DESC';

  const docs = await c.env.DB.prepare(query).bind(...params).all();

  const counts = await c.env.DB.prepare(`
    SELECT ejari_status, COUNT(*) as count
    FROM ejari_documents
    WHERE uploaded_by = ? OR tenant_user_id = ?
    GROUP BY ejari_status
  `).bind(user.sub, user.sub).all();

  const statusCounts = { active: 0, expired: 0, cancelled: 0 };
  for (const row of (counts.results || []) as any[]) {
    if (row.ejari_status in statusCounts) {
      statusCounts[row.ejari_status as keyof typeof statusCounts] = row.count;
    }
  }

  return c.json({
    documents: docs.results || [],
    counts: statusCounts,
  });
});

// POST /api/ejari — Upload new document (landlord only)
// NOTE: This stores an ALREADY-REGISTERED certificate.
// NestMatch does NOT create or file Ejari registrations.
ejari.post('/', async (c) => {
  const user = c.get('user')!;
  const body = await c.req.json();

  const {
    ejari_number, property_id, contract_start_date, contract_end_date,
    annual_rent, landlord_name, tenant_name, tenant_user_id,
    certificate_url, qr_data,
  } = body;

  if (!ejari_number || !property_id) {
    return c.json({ error: 'Ejari number and property are required' }, 400);
  }

  const now = new Date();
  const endDate = contract_end_date ? new Date(contract_end_date) : null;
  let status = 'active';
  if (endDate && now > endDate) {
    status = 'expired';
  }

  const id = `ejari-${Date.now()}`;

  await c.env.DB.prepare(`
    INSERT INTO ejari_documents (
      id, uploaded_by, property_id,
      ejari_number, contract_start_date, contract_end_date,
      annual_rent, landlord_name, tenant_name, tenant_user_id,
      certificate_url, qr_data, ejari_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, user.sub, property_id,
    ejari_number, contract_start_date || null, contract_end_date || null,
    annual_rent || null, landlord_name || null, tenant_name || null,
    tenant_user_id || null, certificate_url || null, qr_data || null,
    status,
  ).run();

  return c.json({ success: true, id, ejari_status: status }, 201);
});

export default ejari;
