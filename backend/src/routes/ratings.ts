import { Hono } from 'hono';
import { AppEnv } from '../types';
import { auth as authMiddleware } from '../middleware/auth';
import { tierGate } from '../middleware/tierGate';
import { createRatingSchema } from '../validation/schemas';

const ratings = new Hono<AppEnv>();

// GET /api/properties/:id/ratings
ratings.get('/:propertyId', async (c) => {
  const propertyId = c.req.param('propertyId');
  const results = await c.env.DB.prepare('SELECT * FROM property_ratings WHERE property_id = ?')
    .bind(propertyId).all<any>();
  return c.json(results.results);
});

// POST /api/properties/:id/ratings
ratings.post('/:propertyId', 
  authMiddleware({ required: true }),
  tierGate(2),
  async (c) => {
    const user = c.get('user')!;
    const propertyId = c.req.param('propertyId');
    const body = await c.req.json();
    
    // STRICT: schema enforces no extra fields (like text reviews)
    const result = createRatingSchema.safeParse(body);
    if (!result.success) return c.json({ error: 'Validation failed', message: 'Only star ratings allowed (Law No. 34)' }, 400);

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    try {
      await c.env.DB.prepare(
        `INSERT INTO property_ratings (
          id, property_id, tenant_id, ac_quality, 
          amenities, maintenance_speed, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id, propertyId, user.sub, 
        result.data.ac_quality, result.data.amenities, result.data.maintenance_speed,
        now
      ).run();

      return c.json({ success: true, id }, 201);
    } catch (e) {
      // Handle UNIQUE(property_id, tenant_id)
      return c.json({ error: 'Submission failed', message: 'You have already rated this property' }, 409);
    }
  }
);

export default ratings;
