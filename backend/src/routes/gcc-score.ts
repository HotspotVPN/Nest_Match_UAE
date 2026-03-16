import { Hono } from 'hono';
import { Env } from '../types';
import { auth as authMiddleware } from '../middleware/auth';

const gccScore = new Hono<{ Bindings: Env }>();

// POST /api/users/:id/recalculate-gcc — Recalculate GCC score
// Auth: compliance admin or system
gccScore.post('/users/:id/recalculate-gcc', authMiddleware({ required: true }), async (c) => {
  const caller = c.get('user')!;

  // Only compliance admin can trigger recalculation
  if (!['COMPLIANCE_ADMIN', 'OPERATIONS_ADMIN'].includes(caller.role)) {
    return c.json({ error: 'Forbidden — compliance or operations admin only' }, 403);
  }

  const userId = c.req.param('id');

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(userId).first<any>();

  if (!user) return c.json({ error: 'User not found' }, 404);

  // Formula: base 0
  let score = 0;

  // +20 per 12-month completed tenancy
  const tenancies = await c.env.DB.prepare(
    `SELECT * FROM tenancy_events WHERE tenant_id = ? AND event_type = 'move_out'`
  ).bind(userId).all<any>();
  // Count tenancy durations (approximate: each completed move_out = 1 tenancy cycle)
  score += tenancies.results.length * 20;

  // +10 if landlord rating >= 4.5
  const ratings = await c.env.DB.prepare(
    `SELECT AVG((ac_quality + amenities + maintenance_speed) / 3.0) as avg_rating
     FROM property_ratings WHERE tenant_id = ?`
  ).bind(userId).first<any>();
  if (ratings?.avg_rating && ratings.avg_rating >= 4.5) {
    score += 10;
  }

  // +5 per completed viewing
  const completedViewings = await c.env.DB.prepare(
    `SELECT COUNT(*) as cnt FROM viewing_bookings WHERE tenant_id = ? AND status = 'COMPLETED'`
  ).bind(userId).first<any>();
  score += (completedViewings?.cnt ?? 0) * 5;

  // -10 per no-show (tenant)
  const noShows = await c.env.DB.prepare(
    `SELECT COUNT(*) as cnt FROM viewing_bookings WHERE tenant_id = ? AND status = 'NO_SHOW_TENANT'`
  ).bind(userId).first<any>();
  score -= (noShows?.cnt ?? 0) * 10;

  // -20 per early termination
  const earlyTerminations = await c.env.DB.prepare(
    `SELECT COUNT(*) as cnt FROM tenancy_events WHERE tenant_id = ? AND event_type = 'early_termination'`
  ).bind(userId).first<any>();
  score -= (earlyTerminations?.cnt ?? 0) * 20;

  // Cap at 0-100
  score = Math.max(0, Math.min(100, score));

  // Update user
  await c.env.DB.prepare(
    `UPDATE users SET gcc_score = ?, updated_at = datetime('now') WHERE id = ?`
  ).bind(score, userId).run();

  return c.json({
    success: true,
    user_id: userId,
    gcc_score: score,
    breakdown: {
      completed_tenancies: tenancies.results.length,
      avg_landlord_rating: ratings?.avg_rating ?? 0,
      completed_viewings: completedViewings?.cnt ?? 0,
      no_shows: noShows?.cnt ?? 0,
      early_terminations: earlyTerminations?.cnt ?? 0,
    },
  });
});

export default gccScore;
