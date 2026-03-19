-- Demo Ejari documents for landlord demo
-- These represent certificates the landlord obtained
-- from typing centres and uploaded to NestMatch.

-- Ahmed's Ejari documents (landlord-1)

-- Active contract with Priya
INSERT OR IGNORE INTO ejari_documents (
  id, uploaded_by, property_id,
  ejari_number, contract_start_date, contract_end_date,
  annual_rent, landlord_name, tenant_name, tenant_user_id,
  ejari_status, uploaded_at
) VALUES (
  'ejari-ahmed-1', 'landlord-1', 'list-entry-10',
  'EJ-2026-001234', '2025-12-15', '2026-12-14',
  85000, 'Ahmed Al Maktoum', 'Priya Sharma', 'roommate-1',
  'active', datetime('now', '-30 days')
);

-- Active contract with Marcus
INSERT OR IGNORE INTO ejari_documents (
  id, uploaded_by, property_id,
  ejari_number, contract_start_date, contract_end_date,
  annual_rent, landlord_name, tenant_name, tenant_user_id,
  ejari_status, uploaded_at
) VALUES (
  'ejari-ahmed-2', 'landlord-1', 'list-entry-10',
  'EJ-2026-001235', '2026-01-01', '2026-12-31',
  78000, 'Ahmed Al Maktoum', 'Marcus Chen', 'roommate-2',
  'active', datetime('now', '-20 days')
);

-- Upcoming contract with Aisha (starts next month)
INSERT OR IGNORE INTO ejari_documents (
  id, uploaded_by, property_id,
  ejari_number, contract_start_date, contract_end_date,
  annual_rent, landlord_name, tenant_name, tenant_user_id,
  ejari_status, uploaded_at
) VALUES (
  'ejari-ahmed-3', 'landlord-1', 'list-entry-11',
  'EJ-2026-001567', '2026-04-01', '2027-03-31',
  92000, 'Ahmed Al Maktoum', 'Aisha Patel', 'roommate-7',
  'active', datetime('now', '-2 days')
);

-- Expired contract (past)
INSERT OR IGNORE INTO ejari_documents (
  id, uploaded_by, property_id,
  ejari_number, contract_start_date, contract_end_date,
  annual_rent, landlord_name, tenant_name, tenant_user_id,
  ejari_status, uploaded_at
) VALUES (
  'ejari-ahmed-4', 'landlord-1', 'list-entry-9',
  'EJ-2025-008765', '2024-06-01', '2025-05-31',
  72000, 'Ahmed Al Maktoum', 'James Morrison', 'roommate-6',
  'expired', '2024-06-05'
);

-- Fatima's Ejari documents (landlord-2)
INSERT OR IGNORE INTO ejari_documents (
  id, uploaded_by, property_id,
  ejari_number, contract_start_date, contract_end_date,
  annual_rent, landlord_name, tenant_name, tenant_user_id,
  ejari_status, uploaded_at
) VALUES (
  'ejari-fatima-1', 'landlord-2', 'list-entry-8',
  'EJ-2026-003456', '2026-02-01', '2027-01-31',
  65000, 'Fatima Hassan', 'Liam O Brien', 'tier1-1',
  'active', datetime('now', '-45 days')
);
