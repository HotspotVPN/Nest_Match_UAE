import { Hono } from 'hono';
import { Env } from '../types';
import { auth as authMiddleware } from '../middleware/auth';
import { tierGate } from '../middleware/tierGate';
import { rbac } from '../middleware/rbac';
import { createPropertySchema } from '../validation/schemas';
import { verifySharedHousingPermit } from '../services/mockDld';

const properties = new Hono<{ Bindings: Env }>();

// GET /api/properties (Browse)
properties.get('/', async (c) => {
  const district = c.req.query('district');
  const maxBudget = c.req.query('maxBudget');
  const search = c.req.query('search');

  let query = 'SELECT * FROM properties WHERE is_active = 1 AND current_occupants < max_legal_occupancy';
  const params: any[] = [];

  if (district && district !== 'All') {
    query += ' AND district = ?';
    params.push(district);
  }
  if (maxBudget) {
    query += ' AND rent_per_room <= ?';
    params.push(parseInt(maxBudget));
  }
  if (search) {
    query += ' AND (title LIKE ? OR address LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const results = await c.env.DB.prepare(query).bind(...params).all<any>();
  
  // Format JSON arrays
  const formatted = results.results.map(p => ({
    ...p,
    amenities: p.amenities ? JSON.parse(p.amenities) : [],
    tags: p.tags ? JSON.parse(p.tags) : [],
    transport_chips: p.transport_chips ? JSON.parse(p.transport_chips) : [],
  }));

  return c.json(formatted);
});

// GET /api/properties/:id
properties.get('/:id', async (c) => {
  const id = c.req.param('id');
  const p = await c.env.DB.prepare('SELECT * FROM properties WHERE id = ?')
    .bind(id).first<any>();

  if (!p) return c.json({ error: 'Property not found' }, 404);

  // Format JSON
  p.amenities = p.amenities ? JSON.parse(p.amenities) : [];
  p.tags = p.tags ? JSON.parse(p.tags) : [];
  p.transport_chips = p.transport_chips ? JSON.parse(p.transport_chips) : [];
  p.house_rules = p.house_rules ? JSON.parse(p.house_rules) : [];

  return c.json(p);
});

// POST /api/properties
properties.post('/', 
  authMiddleware({ required: true }),
  tierGate(2),
  rbac('LANDLORD', 'AGENT'),
  async (c) => {
    const userPayload = c.get('user')!;
    const body = await c.req.json();
    const result = createPropertySchema.safeParse(body);

    if (!result.success) return c.json({ error: 'Validation failed', details: result.error.format() }, 400);

    const data = result.data;

    // STEP 1: Verify with DLD (Compliance Guard)
    const verification = verifySharedHousingPermit(data.municipality_permit, data.makani_number);
    if (!verification.success) {
      return c.json({ error: 'DLD Verification Failed', message: verification.error }, 422);
    }

    // STEP 2: Save to DB
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await c.env.DB.prepare(
      `INSERT INTO properties (
        id, landlord_id, title, address, district, 
        makani_number, municipality_permit, trakheesi_permit, 
        max_legal_occupancy, rent_per_room, deposit, 
        total_rooms, available_rooms, description, 
        amenities, house_rules, bills_included, is_api_verified,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
    ).bind(
      id, userPayload.sub, data.title, data.address, data.district,
      data.makani_number, data.municipality_permit, data.trakheesi_permit || null,
      verification.maxLegalOccupancy, data.rent_per_room, data.deposit,
      data.total_rooms, data.total_rooms, data.description || null,
      JSON.stringify(data.amenities), JSON.stringify(data.house_rules),
      data.bills_included ? 1 : 0, now, now
    ).run();

    return c.json({ success: true, id }, 201);
  }
);

export default properties;
