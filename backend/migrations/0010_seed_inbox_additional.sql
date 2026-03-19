-- ═══════════════════════════════════════════════════════════════
-- NestMatch UAE — Additional Inbox Messages to Match Canonical Seed
-- Migration 0010 — 19 March 2026
-- Adds 8 messages to bring total from 7 → 15 (14 canonical + 1 Sara)
-- ═══════════════════════════════════════════════════════════════

-- ─── Aisha (roommate-7) — 2 additional ────────────────────────

INSERT OR IGNORE INTO inbox_messages
  (id, user_id, category, type, priority, title, body,
   cta_label, cta_link, viewing_id, sender_id, created_at)
VALUES (
  'inbox-aisha-2', 'roommate-7', 'message', 'viewing_confirmed', 'normal',
  'Viewing Confirmed',
  'Ahmed confirmed your viewing for March 22 at 10:00 AM.',
  'View Details', '/viewings',
  'viewing-aisha-1', 'landlord-1',
  datetime('now', '-5 hours')
);

INSERT OR IGNORE INTO inbox_messages
  (id, user_id, category, type, priority, title, body,
   created_at, read_at)
VALUES (
  'inbox-aisha-3', 'roommate-7', 'update', 'premium', 'low',
  'Gold Member Benefits',
  'As a Tier 2 Gold member, you get priority support and free Premium features.',
  datetime('now', '-2 days'), datetime('now', '-1 day')
);

-- ─── Ahmed (landlord-1) — 2 additional ───────────────────────

INSERT OR IGNORE INTO inbox_messages
  (id, user_id, category, type, priority, title, body,
   cta_label, cta_link, sender_id, created_at, read_at)
VALUES (
  'inbox-ahmed-3', 'landlord-1', 'message', 'chat', 'normal',
  'Marcus Chen',
  'Hi Ahmed, the AC is making a strange noise. Could you send someone?',
  'View Chat', '/chat',
  'roommate-2',
  datetime('now', '-6 hours'), datetime('now', '-5 hours')
);

INSERT OR IGNORE INTO inbox_messages
  (id, user_id, category, type, priority, title, body,
   created_at, read_at)
VALUES (
  'inbox-ahmed-4', 'landlord-1', 'update', 'analytics', 'low',
  'March Property Insights',
  'Your properties received 12 viewing requests this month. Occupancy: 85%.',
  datetime('now', '-1 day'), datetime('now', '-1 day')
);

-- ─── Khalid (agent-1) — 2 new ────────────────────────────────

INSERT OR IGNORE INTO inbox_messages
  (id, user_id, category, type, priority, title, body,
   cta_label, cta_link, agreement_id, created_at)
VALUES (
  'inbox-khalid-1', 'agent-1', 'action', 'sign_agreement', 'critical',
  'Agreement Awaiting Your Signature',
  'Viewing agreement for Business Bay needs your signature as listing agent.',
  'Sign Agreement', '/viewings',
  'agreement-aisha-1',
  datetime('now', '-2 hours')
);

INSERT OR IGNORE INTO inbox_messages
  (id, user_id, category, type, priority, title, body,
   cta_label, cta_link, sender_id, created_at)
VALUES (
  'inbox-khalid-2', 'agent-1', 'message', 'chat', 'normal',
  'Liam O Brien',
  'Hi Khalid, is the JVC property still available for this weekend?',
  'View Chat', '/chat',
  'tier1-1',
  datetime('now', '-8 hours')
);

-- ─── Liam (tier1-1) — 2 new ──────────────────────────────────

INSERT OR IGNORE INTO inbox_messages
  (id, user_id, category, type, priority, title, body,
   cta_label, cta_link, created_at)
VALUES (
  'inbox-liam-1', 'tier1-1', 'action', 'verification', 'normal',
  'Upgrade to Gold',
  'Connect UAE PASS to unlock free Premium features.',
  'Connect UAE PASS', '/profile',
  datetime('now', '-1 day')
);

INSERT OR IGNORE INTO inbox_messages
  (id, user_id, category, type, priority, title, body,
   created_at, read_at)
VALUES (
  'inbox-liam-2', 'tier1-1', 'update', 'welcome', 'low',
  'Welcome to NestMatch!',
  'You are now verified and can request viewings and sign DLD agreements.',
  datetime('now', '-3 days'), datetime('now', '-3 days')
);
