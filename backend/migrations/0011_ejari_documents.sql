-- Ejari Document Storage
-- Stores already-registered Ejari certificates for reference.
-- NestMatch does NOT create, manage, or file contracts.

CREATE TABLE IF NOT EXISTS ejari_documents (
  id TEXT PRIMARY KEY,

  -- Who uploaded this document
  uploaded_by TEXT NOT NULL,

  -- Property reference
  property_id TEXT NOT NULL,

  -- Ejari certificate data (extracted from QR/PDF)
  ejari_number TEXT UNIQUE,
  contract_start_date TEXT,
  contract_end_date TEXT,
  annual_rent INTEGER,

  -- Parties as listed on certificate
  landlord_name TEXT,
  tenant_name TEXT,
  tenant_user_id TEXT,

  -- Document storage
  certificate_url TEXT,
  qr_data TEXT,

  -- Status (derived from certificate dates, not managed by us)
  ejari_status TEXT DEFAULT 'active'
    CHECK (ejari_status IN ('active', 'expired', 'cancelled', 'unknown')),

  -- Timestamps
  uploaded_at TEXT DEFAULT (datetime('now')),
  last_verified_at TEXT,

  FOREIGN KEY (uploaded_by) REFERENCES users(id),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (tenant_user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_ejari_uploaded_by
  ON ejari_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_ejari_property
  ON ejari_documents(property_id);
CREATE INDEX IF NOT EXISTS idx_ejari_tenant
  ON ejari_documents(tenant_user_id);
CREATE INDEX IF NOT EXISTS idx_ejari_number
  ON ejari_documents(ejari_number);
