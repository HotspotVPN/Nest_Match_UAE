-- Migration 0004: State machine tables for OAuth, KYC, occupancy, viewing agreements, tenancy, verification
-- NestMatch UAE — Session 6

-- Add missing columns to users table (added in frontend Session 5, now in D1)
ALTER TABLE users ADD COLUMN verification_tier TEXT DEFAULT 'tier1_unverified';
ALTER TABLE users ADD COLUMN nationality TEXT;
ALTER TABLE users ADD COLUMN passport_number TEXT;
ALTER TABLE users ADD COLUMN visa_type TEXT;
ALTER TABLE users ADD COLUMN visa_expiry TEXT;

-- OAuth tokens
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google','uae_pass')),
  provider_user_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(provider, provider_user_id)
);

-- KYC documents
CREATE TABLE IF NOT EXISTS kyc_documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('passport','visa_page','emirates_id','uae_pass')),
  r2_key TEXT NOT NULL,
  review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending','approved','rejected')),
  reviewed_by TEXT,
  reviewed_at TEXT,
  uploaded_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_kyc_user ON kyc_documents(user_id);

-- Occupancy event audit log
CREATE TABLE IF NOT EXISTS occupancy_events (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  room_number INTEGER NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('tenant_applied','landlord_approved','landlord_rejected','viewing_confirmed','move_in_confirmed','notice_given','move_out_confirmed','landlord_removed','room_added','room_removed')),
  from_status TEXT,
  to_status TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  tenant_id TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_occ_events_property ON occupancy_events(property_id);

-- Viewing agreements (DLD form data)
CREATE TABLE IF NOT EXISTS viewing_agreements (
  id TEXT PRIMARY KEY,
  viewing_id TEXT NOT NULL,
  agreement_number TEXT NOT NULL UNIQUE,
  broker_orn TEXT,
  broker_brn TEXT,
  commercial_license TEXT,
  plot_number TEXT,
  building_number TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','agent_signed','fully_signed')),
  outcome TEXT CHECK (outcome IN ('attended','no_show_tenant','no_show_landlord')),
  outcome_recorded_at TEXT,
  outcome_recorded_by TEXT,
  generated_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Digital signatures
CREATE TABLE IF NOT EXISTS agreement_signatures (
  id TEXT PRIMARY KEY,
  agreement_id TEXT NOT NULL,
  signer_id TEXT NOT NULL,
  signer_role TEXT NOT NULL CHECK (signer_role IN ('broker','tenant')),
  signature_data TEXT NOT NULL,
  signed_at TEXT DEFAULT (datetime('now')),
  ip_address TEXT
);

-- Tenancy events
CREATE TABLE IF NOT EXISTS tenancy_events (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  room_number INTEGER NOT NULL,
  tenant_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('move_in','notice_given','move_out','early_termination')),
  event_date TEXT NOT NULL,
  notice_period_days INTEGER,
  move_out_date TEXT,
  recorded_by TEXT NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_tenancy_tenant ON tenancy_events(tenant_id);

-- Verification events
CREATE TABLE IF NOT EXISTS verification_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  from_tier TEXT,
  to_tier TEXT NOT NULL,
  trigger TEXT NOT NULL CHECK (trigger IN ('passport_upload','emirates_id_upload','uae_pass_oauth','admin_approval','admin_rejection')),
  kyc_document_id TEXT,
  performed_by TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ver_events_user ON verification_events(user_id);
