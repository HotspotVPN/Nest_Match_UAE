import { Hono } from 'hono';
import { AppEnv } from '../types';
import { auth as authMiddleware } from '../middleware/auth';

const payments = new Hono<AppEnv>();

// GET /api/payments
payments.get('/', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  const results = await c.env.DB.prepare('SELECT * FROM payments WHERE payer_id = ? OR payee_id = ?')
    .bind(user.sub, user.sub).all<any>();
  return c.json(results.results);
});

// POST /api/payments (RECORD KEEPING ONLY - No Fund Holding)
payments.post('/', 
  authMiddleware({ required: true }),
  async (c) => {
    const user = c.get('user')!;
    const body = await c.req.json();
    
    // Minimal record keeping for demo
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await c.env.DB.prepare(
      `INSERT INTO payments (
        id, property_id, payer_id, payee_id, 
        type, amount, due_date, status, reference, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`
    ).bind(
      id, body.property_id, user.sub, body.payee_id,
      body.type, body.amount, body.due_date, `REF-${id.substring(0,8).toUpperCase()}`,
      now, now
    ).run();

    return c.json({ success: true, id }, 201);
  }
);

export default payments;
