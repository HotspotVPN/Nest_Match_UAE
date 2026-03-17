-- ═══════════════════════════════════════════════════════════════
-- NestMatch UAE — Fix viewing_bookings CHECK + Seed Viewings
-- Session 9C — 17 March 2026
-- IDs verified against production D1
-- ═══════════════════════════════════════════════════════════════

-- ─── Fix viewing_bookings status CHECK constraint ─────────────
-- Original only had: PENDING, PENDING_LANDLORD_APPROVAL, CONFIRMED,
-- COMPLETED, TENANT_NO_SHOW_PENALTY, LANDLORD_NO_SHOW_PENALTY
-- Missing: AGREEMENT_SENT, AGENT_SIGNED, FULLY_SIGNED, NO_SHOW_TENANT,
-- NO_SHOW_LANDLORD, CANCELLED

CREATE TABLE viewing_bookings_new (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES properties(id),
    tenant_id TEXT NOT NULL REFERENCES users(id),
    landlord_id TEXT NOT NULL REFERENCES users(id),
    scheduled_date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'PENDING_LANDLORD_APPROVAL', 'CONFIRMED',
        'AGREEMENT_SENT', 'AGENT_SIGNED', 'FULLY_SIGNED',
        'COMPLETED', 'NO_SHOW_TENANT', 'NO_SHOW_LANDLORD',
        'CANCELLED',
        'TENANT_NO_SHOW_PENALTY', 'LANDLORD_NO_SHOW_PENALTY'
    )),
    stripe_hold_id TEXT,
    hold_amount INTEGER DEFAULT 5000,
    landlord_agreed_penalty INTEGER DEFAULT 0,
    resolution_date TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

INSERT INTO viewing_bookings_new SELECT * FROM viewing_bookings;
DROP TABLE viewing_bookings;
ALTER TABLE viewing_bookings_new RENAME TO viewing_bookings;

-- ─── Viewing Bookings — 5 rows ────────────────────────────────

INSERT OR IGNORE INTO viewing_bookings (
  id, property_id, tenant_id, landlord_id,
  scheduled_date, time_slot, status,
  created_at, updated_at
) VALUES (
  'viewing-priya-1', 'list-entry-11', 'roommate-1', 'landlord-1',
  '2026-03-22', '10:00 AM', 'CONFIRMED',
  '2026-03-15T10:00:00Z', '2026-03-17T10:30:00Z'
);

INSERT OR IGNORE INTO viewing_bookings (
  id, property_id, tenant_id, landlord_id,
  scheduled_date, time_slot, status,
  created_at, updated_at
) VALUES (
  'viewing-priya-2', 'list-entry-12', 'roommate-1', 'landlord-1',
  '2026-03-25', '2:00 PM', 'PENDING',
  '2026-03-17T08:30:00Z', '2026-03-17T08:30:00Z'
);

INSERT OR IGNORE INTO viewing_bookings (
  id, property_id, tenant_id, landlord_id,
  scheduled_date, time_slot, status,
  created_at, updated_at
) VALUES (
  'viewing-priya-3', 'list-entry-10', 'roommate-1', 'landlord-2',
  '2026-03-10', '11:00 AM', 'COMPLETED',
  '2026-03-05T14:00:00Z', '2026-03-10T12:00:00Z'
);

INSERT OR IGNORE INTO viewing_bookings (
  id, property_id, tenant_id, landlord_id,
  scheduled_date, time_slot, status,
  created_at, updated_at
) VALUES (
  'viewing-aisha-1', 'list-entry-8', 'roommate-7', 'landlord-1',
  '2026-03-20', '10:00 AM', 'FULLY_SIGNED',
  '2026-03-14T11:00:00Z', '2026-03-18T16:00:00Z'
);

INSERT OR IGNORE INTO viewing_bookings (
  id, property_id, tenant_id, landlord_id,
  scheduled_date, time_slot, status,
  created_at, updated_at
) VALUES (
  'viewing-sofia-1', 'list-entry-11', 'tier0-2', 'landlord-1',
  '2026-03-24', '4:00 PM', 'AGREEMENT_SENT',
  '2026-03-16T09:00:00Z', '2026-03-17T14:00:00Z'
);

-- ─── Viewing Agreements — 4 rows ──────────────────────────────

INSERT OR IGNORE INTO viewing_agreements (
  id, viewing_id, agreement_number,
  broker_orn, broker_brn, commercial_license,
  plot_number, building_number,
  status, generated_at, updated_at
) VALUES (
  'agreement-priya-1', 'viewing-priya-1', 'NM-VA-2026-00042',
  'ORN-12345', 'BRN-67890', 'CL-2024-001234',
  'PLT-JLT-4521', 'BLD-JLT-D1',
  'draft', '2026-03-17T10:30:00Z', '2026-03-17T10:30:00Z'
);

-- Priya COMPLETED viewing — fully signed with outcome 'attended'
INSERT OR IGNORE INTO viewing_agreements (
  id, viewing_id, agreement_number,
  broker_orn, broker_brn, commercial_license,
  plot_number, building_number,
  status, outcome, outcome_recorded_at,
  generated_at, updated_at
) VALUES (
  'agreement-priya-3', 'viewing-priya-3', 'NM-VA-2026-00038',
  'ORN-12345', 'BRN-67890', 'CL-2024-001234',
  'PLT-BB-1122', 'BLD-BB-T10',
  'fully_signed', 'attended', '2026-03-10T12:00:00Z',
  '2026-03-08T09:00:00Z', '2026-03-10T12:00:00Z'
);

INSERT OR IGNORE INTO viewing_agreements (
  id, viewing_id, agreement_number,
  broker_orn, broker_brn, commercial_license,
  plot_number, building_number,
  status, generated_at, updated_at
) VALUES (
  'agreement-aisha-1', 'viewing-aisha-1', 'NM-VA-2026-00041',
  'ORN-12345', 'BRN-67890', 'CL-2024-001234',
  'PLT-DSO-3344', 'BLD-DSO-A8',
  'fully_signed', '2026-03-16T14:00:00Z', '2026-03-18T16:00:00Z'
);

INSERT OR IGNORE INTO viewing_agreements (
  id, viewing_id, agreement_number,
  broker_orn, broker_brn, commercial_license,
  plot_number, building_number,
  status, generated_at, updated_at
) VALUES (
  'agreement-sofia-1', 'viewing-sofia-1', 'NM-VA-2026-00043',
  'ORN-12345', 'BRN-67890', 'CL-2024-001234',
  'PLT-JLT-4521', 'BLD-JLT-D1',
  'agent_signed', '2026-03-17T14:00:00Z', '2026-03-17T14:00:00Z'
);

-- ─── Agreement Signatures — 5 rows ────────────────────────────
-- signer_role CHECK allows: 'broker' | 'tenant' (not 'agent')

INSERT OR IGNORE INTO agreement_signatures (
  id, agreement_id, signer_id, signer_role,
  signature_data, signed_at
) VALUES (
  'sig-priya-3-broker', 'agreement-priya-3', 'landlord-1', 'broker',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  '2026-03-08T10:00:00Z'
);

INSERT OR IGNORE INTO agreement_signatures (
  id, agreement_id, signer_id, signer_role,
  signature_data, signed_at
) VALUES (
  'sig-priya-3-tenant', 'agreement-priya-3', 'roommate-1', 'tenant',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  '2026-03-08T11:00:00Z'
);

INSERT OR IGNORE INTO agreement_signatures (
  id, agreement_id, signer_id, signer_role,
  signature_data, signed_at
) VALUES (
  'sig-aisha-1-broker', 'agreement-aisha-1', 'landlord-1', 'broker',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  '2026-03-16T15:00:00Z'
);

INSERT OR IGNORE INTO agreement_signatures (
  id, agreement_id, signer_id, signer_role,
  signature_data, signed_at
) VALUES (
  'sig-aisha-1-tenant', 'agreement-aisha-1', 'roommate-7', 'tenant',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  '2026-03-18T16:00:00Z'
);

INSERT OR IGNORE INTO agreement_signatures (
  id, agreement_id, signer_id, signer_role,
  signature_data, signed_at
) VALUES (
  'sig-sofia-1-broker', 'agreement-sofia-1', 'landlord-1', 'broker',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  '2026-03-17T14:00:00Z'
);
