-- ═══════════════════════════════════════════════════════════════
-- NestMatch UAE — Seed Inbox Messages for Demo
-- Migration 0009 — 19 March 2026
-- IDs verified against canonical 15-persona list
-- ═══════════════════════════════════════════════════════════════

-- ─── Priya (roommate-1) — 3 messages ──────────────────────────

-- Action: Sign agreement for JLT viewing
INSERT OR IGNORE INTO inbox_messages (
  id, user_id, category, type, priority,
  title, body, cta_label, cta_link,
  property_id, agreement_id, viewing_id, sender_id,
  created_at
) VALUES (
  'inbox-priya-1', 'roommate-1', 'action', 'contract_signature', 'high',
  'Sign Viewing Agreement',
  'Your viewing at Luxury JLT Private Room has been confirmed. Please sign the DLD Viewing Agreement to proceed.',
  'Sign Now', '/viewings',
  'list-entry-11', 'agreement-priya-1', 'viewing-priya-1', 'landlord-1',
  '2026-03-17T11:00:00Z'
);

-- Update: Viewing request approved
INSERT OR IGNORE INTO inbox_messages (
  id, user_id, category, type, priority,
  title, body, cta_label, cta_link,
  property_id, viewing_id, sender_id,
  read_at, created_at
) VALUES (
  'inbox-priya-2', 'roommate-1', 'update', 'viewing_confirmed', 'normal',
  'Viewing Request Approved',
  'Ahmed Al Maktoum approved your viewing request for the JLT property on 22 March at 10:00 AM.',
  'View Details', '/viewings',
  'list-entry-11', 'viewing-priya-1', 'landlord-1',
  '2026-03-17T12:00:00Z', '2026-03-17T10:30:00Z'
);

-- Message: From Fatima about Business Bay
INSERT OR IGNORE INTO inbox_messages (
  id, user_id, category, type, priority,
  title, body, cta_label, cta_link,
  property_id, viewing_id, sender_id,
  read_at, created_at
) VALUES (
  'inbox-priya-3', 'roommate-1', 'message', 'landlord_message', 'normal',
  'Message from Fatima Hassan',
  'Thank you for completing the viewing at Business Bay. I hope you enjoyed the property. Feel free to reach out if you have any questions.',
  'Reply', '/chat',
  'list-entry-10', 'viewing-priya-3', 'landlord-2',
  '2026-03-11T09:00:00Z', '2026-03-10T13:00:00Z'
);

-- ─── Ahmed (landlord-1) — 2 messages ──────────────────────────

-- Action: Review new viewing request (Priya Marina)
INSERT OR IGNORE INTO inbox_messages (
  id, user_id, category, type, priority,
  title, body, cta_label, cta_link,
  property_id, viewing_id, sender_id,
  created_at
) VALUES (
  'inbox-ahmed-1', 'landlord-1', 'action', 'viewing_request', 'high',
  'New Viewing Request',
  'Priya Sharma has requested a viewing at Ultra-Premium Marina En-Suite on 25 March at 2:00 PM. GCC Score: 85.',
  'Review Request', '/viewings',
  'list-entry-12', 'viewing-priya-2', 'roommate-1',
  '2026-03-17T08:30:00Z'
);

-- Update: Agreement fully signed (Aisha DSO)
INSERT OR IGNORE INTO inbox_messages (
  id, user_id, category, type, priority,
  title, body, cta_label, cta_link,
  property_id, agreement_id, viewing_id, sender_id,
  read_at, created_at
) VALUES (
  'inbox-ahmed-2', 'landlord-1', 'update', 'agreement_signed', 'normal',
  'Agreement Fully Signed',
  'Aisha Patel has signed the DLD Viewing Agreement for Dubai Silicon Oasis. Both parties have now signed.',
  'View Agreement', '/viewings',
  'list-entry-8', 'agreement-aisha-1', 'viewing-aisha-1', 'roommate-7',
  '2026-03-18T17:00:00Z', '2026-03-18T16:00:00Z'
);

-- ─── Aisha (roommate-7) — 1 message ──────────────────────────

-- Update: Agreement ready
INSERT OR IGNORE INTO inbox_messages (
  id, user_id, category, type, priority,
  title, body, cta_label, cta_link,
  property_id, agreement_id, viewing_id, sender_id,
  created_at
) VALUES (
  'inbox-aisha-1', 'roommate-7', 'update', 'agreement_signed', 'normal',
  'Viewing Agreement Complete',
  'Your DLD Viewing Agreement for Dubai Silicon Oasis has been fully signed by both parties. You may download a copy.',
  'View Agreement', '/viewings',
  'list-entry-8', 'agreement-aisha-1', 'viewing-aisha-1', 'landlord-1',
  '2026-03-18T16:30:00Z'
);

-- ─── Sara (admin-1) — 1 message ──────────────────────────────

-- Update: KYC review needed
INSERT OR IGNORE INTO inbox_messages (
  id, user_id, category, type, priority,
  title, body, cta_label, cta_link,
  sender_id,
  created_at
) VALUES (
  'inbox-sara-1', 'admin-1', 'action', 'kyc_review', 'high',
  'Pending KYC Review',
  'James Okafor has submitted passport and visa documents for Tier 0 verification. Please review.',
  'Review Documents', '/compliance',
  'tier0-1',
  '2026-03-17T09:00:00Z'
);
