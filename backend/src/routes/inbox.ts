import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { auth as authMiddleware } from '../middleware/auth';

const inbox = new Hono<AppEnv>();

// ── GET /api/inbox ─────────────────────────────────────────
inbox.get('/', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  const category = c.req.query('category');
  const unreadOnly = c.req.query('unread') === 'true';
  const limit = parseInt(c.req.query('limit') || '50', 10);
  const offset = parseInt(c.req.query('offset') || '0', 10);

  let query = 'SELECT * FROM inbox_messages WHERE user_id = ? AND archived_at IS NULL';
  const params: (string | number)[] = [user.sub];

  if (category && ['action', 'message', 'update'].includes(category)) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (unreadOnly) {
    query += ' AND read_at IS NULL';
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const results = await c.env.DB.prepare(query).bind(...params).all<any>();

  // Get unread counts per category
  const unreadCounts = await c.env.DB.prepare(`
    SELECT category, COUNT(*) as count
    FROM inbox_messages
    WHERE user_id = ? AND read_at IS NULL AND archived_at IS NULL
    GROUP BY category
  `).bind(user.sub).all<any>();

  const unread = { action: 0, message: 0, update: 0, total: 0 };
  for (const row of unreadCounts.results || []) {
    if (row.category in unread) {
      (unread as any)[row.category] = row.count;
    }
    unread.total += row.count;
  }

  return c.json({
    messages: results.results || [],
    unread,
    pagination: { limit, offset },
  });
});

// ── GET /api/inbox/unread-count ────────────────────────────
inbox.get('/unread-count', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;

  const result = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM inbox_messages WHERE user_id = ? AND read_at IS NULL AND archived_at IS NULL'
  ).bind(user.sub).first<any>();

  return c.json({ count: result?.count || 0 });
});

// ── PATCH /api/inbox/:id/read ──────────────────────────────
inbox.patch('/:id/read', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');

  const msg = await c.env.DB.prepare(
    'SELECT id, user_id FROM inbox_messages WHERE id = ?'
  ).bind(id).first<any>();

  if (!msg) return c.json({ error: 'Message not found' }, 404);
  if (msg.user_id !== user.sub) return c.json({ error: 'Forbidden' }, 403);

  await c.env.DB.prepare(
    "UPDATE inbox_messages SET read_at = datetime('now') WHERE id = ? AND read_at IS NULL"
  ).bind(id).run();

  return c.json({ success: true });
});

// ── POST /api/inbox/mark-all-read ──────────────────────────
inbox.post('/mark-all-read', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  const body = await c.req.json().catch(() => ({}));
  const category = (body as any).category;

  let query = "UPDATE inbox_messages SET read_at = datetime('now') WHERE user_id = ? AND read_at IS NULL";
  const params: string[] = [user.sub];

  if (category && ['action', 'message', 'update'].includes(category)) {
    query += ' AND category = ?';
    params.push(category);
  }

  const result = await c.env.DB.prepare(query).bind(...params).run();

  return c.json({ success: true, updated: result.meta.changes });
});

// ── PATCH /api/inbox/:id/action ────────────────────────────
inbox.patch('/:id/action', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');

  const msg = await c.env.DB.prepare(
    'SELECT id, user_id FROM inbox_messages WHERE id = ?'
  ).bind(id).first<any>();

  if (!msg) return c.json({ error: 'Message not found' }, 404);
  if (msg.user_id !== user.sub) return c.json({ error: 'Forbidden' }, 403);

  await c.env.DB.prepare(
    "UPDATE inbox_messages SET actioned_at = datetime('now'), read_at = COALESCE(read_at, datetime('now')) WHERE id = ?"
  ).bind(id).run();

  return c.json({ success: true });
});

export default inbox;
