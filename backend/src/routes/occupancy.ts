import { Hono } from 'hono';
import { AppEnv } from '../types';
import { auth as authMiddleware } from '../middleware/auth';

const occupancy = new Hono<AppEnv>();

// PATCH /api/properties/:id/rooms/:roomNumber — Landlord/agent room state change
occupancy.patch('/:id/rooms/:roomNumber', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  const propertyId = c.req.param('id');
  const roomNumber = parseInt(c.req.param('roomNumber'), 10);

  // Auth: must be landlord or agent
  if (!['LANDLORD', 'AGENT'].includes(user.role)) {
    return c.json({ error: 'Forbidden — landlord or agent only' }, 403);
  }

  const body = await c.req.json();
  const { action, tenant_id, notes } = body as { action?: string; tenant_id?: string; notes?: string };

  if (!action) return c.json({ error: 'action is required' }, 400);

  const validActions = ['approve_application', 'reject_application', 'remove_tenant', 'add_room', 'remove_room'];
  if (!validActions.includes(action)) {
    return c.json({ error: `Invalid action. Must be one of: ${validActions.join(', ')}` }, 400);
  }

  // Fetch property
  const property = await c.env.DB.prepare(
    'SELECT * FROM properties WHERE id = ?'
  ).bind(propertyId).first<any>();

  if (!property) return c.json({ error: 'Property not found' }, 404);

  const currentOccupants = property.current_occupants ?? 0;
  const maxLegal = property.max_legal_occupancy ?? property.total_rooms;

  let fromStatus: string | null = null;
  let toStatus: string;
  let eventType: string;
  let newOccupantCount = currentOccupants;

  switch (action) {
    case 'approve_application':
      // Occupants must not exceed maxLegalOccupancy
      if (currentOccupants >= maxLegal) {
        return c.json({ error: 'Cannot approve — property is at maximum legal occupancy' }, 400);
      }
      fromStatus = 'pending_approval';
      toStatus = 'occupied';
      eventType = 'landlord_approved';
      newOccupantCount = currentOccupants + 1;
      break;

    case 'reject_application':
      fromStatus = 'pending_approval';
      toStatus = 'available';
      eventType = 'landlord_rejected';
      break;

    case 'remove_tenant':
      // Occupants must never go below 0
      if (currentOccupants <= 0) {
        return c.json({ error: 'Cannot remove — no occupants in this property' }, 400);
      }
      fromStatus = 'occupied';
      toStatus = 'available';
      eventType = 'landlord_removed';
      newOccupantCount = currentOccupants - 1;
      break;

    case 'add_room':
      fromStatus = null;
      toStatus = 'available';
      eventType = 'room_added';
      break;

    case 'remove_room':
      fromStatus = 'available';
      toStatus = 'removed';
      eventType = 'room_removed';
      break;

    default:
      return c.json({ error: 'Unknown action' }, 400);
  }

  // INVARIANT: occupants never below 0 or above maxLegalOccupancy
  if (newOccupantCount < 0) {
    return c.json({ error: 'Occupancy count cannot go below 0' }, 400);
  }
  if (newOccupantCount > maxLegal) {
    return c.json({ error: `Occupancy count cannot exceed maxLegalOccupancy (${maxLegal})` }, 400);
  }

  // Update property occupant count
  if (newOccupantCount !== currentOccupants) {
    await c.env.DB.prepare(
      `UPDATE properties SET current_occupants = ?, updated_at = datetime('now') WHERE id = ?`
    ).bind(newOccupantCount, propertyId).run();
  }

  // Write occupancy_events audit log (never delete)
  const eventId = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO occupancy_events (id, property_id, room_number, event_type, from_status, to_status, actor_id, tenant_id, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(eventId, propertyId, roomNumber, eventType, fromStatus, toStatus, user.sub, tenant_id || null, notes || null).run();

  return c.json({
    success: true,
    event_id: eventId,
    current_occupants: newOccupantCount,
    max_legal_occupancy: maxLegal,
  });
});

// POST /api/properties/:id/rooms/:roomNumber/notice — Tenant gives move-out notice
occupancy.post('/:id/rooms/:roomNumber/notice', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  const propertyId = c.req.param('id');
  const roomNumber = parseInt(c.req.param('roomNumber'), 10);

  const body = await c.req.json();
  const { move_out_date, notes } = body as { move_out_date?: string; notes?: string };

  if (!move_out_date) return c.json({ error: 'move_out_date is required' }, 400);

  // Validate 30-day minimum notice period
  const now = new Date();
  const moveOut = new Date(move_out_date);
  const diffMs = moveOut.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return c.json({ error: 'Minimum 30-day notice period required' }, 400);
  }

  // Write tenancy_events
  const tenancyEventId = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO tenancy_events (id, property_id, room_number, tenant_id, event_type, event_date, notice_period_days, move_out_date, recorded_by, notes)
     VALUES (?, ?, ?, ?, 'notice_given', datetime('now'), ?, ?, ?, ?)`
  ).bind(tenancyEventId, propertyId, roomNumber, user.sub, diffDays, move_out_date, user.sub, notes || null).run();

  // Write occupancy_events audit
  const occEventId = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO occupancy_events (id, property_id, room_number, event_type, from_status, to_status, actor_id, tenant_id, notes)
     VALUES (?, ?, ?, 'notice_given', 'occupied', 'notice_given', ?, ?, ?)`
  ).bind(occEventId, propertyId, roomNumber, user.sub, user.sub, notes || null).run();

  return c.json({
    success: true,
    tenancy_event_id: tenancyEventId,
    notice_period_days: diffDays,
    move_out_date,
  });
});

// POST /api/properties/:id/rooms/:roomNumber/move-out — Landlord/agent confirms move-out
occupancy.post('/:id/rooms/:roomNumber/move-out', authMiddleware({ required: true }), async (c) => {
  const user = c.get('user')!;
  const propertyId = c.req.param('id');
  const roomNumber = parseInt(c.req.param('roomNumber'), 10);

  // Auth: must be landlord or agent
  if (!['LANDLORD', 'AGENT'].includes(user.role)) {
    return c.json({ error: 'Forbidden — landlord or agent only' }, 403);
  }

  const body = await c.req.json();
  const { tenant_id, notes } = body as { tenant_id?: string; notes?: string };

  // Fetch property to check occupancy
  const property = await c.env.DB.prepare(
    'SELECT * FROM properties WHERE id = ?'
  ).bind(propertyId).first<any>();

  if (!property) return c.json({ error: 'Property not found' }, 404);

  const currentOccupants = property.current_occupants ?? 0;

  // Occupants must never go below 0
  if (currentOccupants <= 0) {
    return c.json({ error: 'Cannot confirm move-out — no occupants in this property' }, 400);
  }

  const newOccupantCount = currentOccupants - 1;

  // Update property occupant count
  await c.env.DB.prepare(
    `UPDATE properties SET current_occupants = ?, updated_at = datetime('now') WHERE id = ?`
  ).bind(newOccupantCount, propertyId).run();

  // Write tenancy_events
  const tenancyEventId = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO tenancy_events (id, property_id, room_number, tenant_id, event_type, event_date, recorded_by, notes)
     VALUES (?, ?, ?, ?, 'move_out', datetime('now'), ?, ?)`
  ).bind(tenancyEventId, propertyId, roomNumber, tenant_id || user.sub, user.sub, notes || null).run();

  // Write occupancy_events audit
  const occEventId = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO occupancy_events (id, property_id, room_number, event_type, from_status, to_status, actor_id, tenant_id, notes)
     VALUES (?, ?, ?, 'move_out_confirmed', 'notice_given', 'available', ?, ?, ?)`
  ).bind(occEventId, propertyId, roomNumber, user.sub, tenant_id || null, notes || null).run();

  return c.json({
    success: true,
    tenancy_event_id: tenancyEventId,
    current_occupants: newOccupantCount,
  });
});

export default occupancy;
