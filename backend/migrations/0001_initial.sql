-- migrations/0001_initial.sql

-- ─── USERS ───────────────────────────────────────────────────
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,                          -- Tier 1: email/password
    google_id TEXT UNIQUE,                       -- Tier 1: Google OAuth
    uae_pass_id TEXT UNIQUE,                     -- Tier 2: UAE PASS identity
    emirates_id TEXT UNIQUE,                     -- Emirates ID number
    is_uae_pass_verified INTEGER DEFAULT 0,      -- Tier 2: UAE PASS OAuth
    is_id_verified INTEGER DEFAULT 0,            -- Tier 2 alt: Onfido
    role TEXT NOT NULL CHECK (role IN (
        'SEARCHING_TENANT', 'RESIDING_TENANT', 'LANDLORD',
        'AGENT', 'COMPLIANCE_ADMIN', 'FINANCE_ADMIN', 'OPERATIONS_ADMIN'
    )),
    name TEXT NOT NULL,
    phone TEXT,                                   -- +971 format
    avatar_key TEXT,                              -- R2 object key
    bio TEXT,
    lifestyle_tags TEXT DEFAULT '[]',             -- JSON array
    personality_traits TEXT DEFAULT '[]',         -- JSON array
    hobbies TEXT DEFAULT '[]',                    -- JSON array
    keywords TEXT DEFAULT '[]',                   -- JSON array
    gcc_score INTEGER DEFAULT 0,                 -- 0-100
    is_premium INTEGER DEFAULT 0,
    bank_linked INTEGER DEFAULT 0,
    stripe_customer_id TEXT,
    rera_license TEXT,                            -- AGENT only
    agency_name TEXT,                             -- AGENT only
    -- Compliance
    kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending','completed','rejected')),
    kyc_completed_date TEXT,
    aml_status TEXT DEFAULT 'pending' CHECK (aml_status IN ('pending','completed','rejected')),
    aml_completed_date TEXT,
    pep_status TEXT DEFAULT 'pending' CHECK (pep_status IN ('pending','clear','failed')),
    pep_completed_date TEXT,
    compliance_verified INTEGER DEFAULT 0,
    -- Roommate-specific
    resident_role TEXT CHECK (resident_role IN ('searching', 'residing')),
    preferences TEXT,                            -- JSON: {budget_min, budget_max, ...}
    current_property_id TEXT,
    rent_monthly INTEGER,                        -- AED
    deposit INTEGER,                             -- AED
    -- Landlord-specific
    bank_details TEXT,                           -- JSON: {account_name, iban, swift, bank}
    monthly_income INTEGER,                      -- AED
    managed_by_agent_id TEXT,
    -- Timestamps
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_uae_pass ON users(uae_pass_id);

-- ─── PROPERTIES ──────────────────────────────────────────────
CREATE TABLE properties (
    id TEXT PRIMARY KEY,
    landlord_id TEXT NOT NULL REFERENCES users(id),
    agent_id TEXT REFERENCES users(id),
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    district TEXT NOT NULL,
    -- UAE Compliance (Law No. 4 of 2026)
    makani_number TEXT NOT NULL,                  -- EXACTLY 10 digits
    trakheesi_permit TEXT,
    municipality_permit TEXT UNIQUE,
    max_legal_occupancy INTEGER NOT NULL,         -- FROM DLD API, never user-entered
    current_occupants INTEGER DEFAULT 0,
    is_api_verified INTEGER DEFAULT 0,           -- DLD mock validated
    is_active INTEGER DEFAULT 1,                 -- Auto-false at capacity
    -- Listing details
    rent_per_room INTEGER NOT NULL,              -- AED
    deposit INTEGER NOT NULL,                    -- AED
    total_rooms INTEGER NOT NULL,
    available_rooms INTEGER NOT NULL,
    description TEXT,
    amenities TEXT DEFAULT '[]',                 -- JSON array
    house_rules TEXT DEFAULT '[]',               -- JSON array
    tags TEXT DEFAULT '[]',                      -- JSON array
    bills_included INTEGER DEFAULT 0,
    bills_breakdown TEXT,
    -- Transport
    transport_chips TEXT DEFAULT '[]',           -- JSON array of {label, type, walk_time, ...}
    -- Location
    location_lat REAL,
    location_lng REAL,
    location_data TEXT,                          -- JSON: nearest_metro, amenities, etc.
    -- Fintech
    rera_escrow_verified INTEGER DEFAULT 0,
    -- Timestamps
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_properties_landlord ON properties(landlord_id);
CREATE INDEX idx_properties_district ON properties(district);
CREATE INDEX idx_properties_active ON properties(is_active);

-- ─── ROOM OCCUPANCY ──────────────────────────────────────────
CREATE TABLE room_occupancy (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES properties(id),
    room_number INTEGER NOT NULL,
    tenant_id TEXT REFERENCES users(id),
    status TEXT DEFAULT 'available' CHECK (status IN ('occupied','available','pending_approval')),
    UNIQUE(property_id, room_number)
);

-- ─── VIEWING BOOKINGS ────────────────────────────────────────
-- Platform Abuse Penalty system (NOT a "viewing fee")
CREATE TABLE viewing_bookings (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES properties(id),
    tenant_id TEXT NOT NULL REFERENCES users(id),
    landlord_id TEXT NOT NULL REFERENCES users(id),
    scheduled_date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'PENDING_LANDLORD_APPROVAL', 'CONFIRMED',
        'COMPLETED', 'TENANT_NO_SHOW_PENALTY', 'LANDLORD_NO_SHOW_PENALTY'
    )),
    stripe_hold_id TEXT,                         -- Mock Stripe PaymentIntent ID
    hold_amount INTEGER DEFAULT 5000,            -- 50 AED in fils
    landlord_agreed_penalty INTEGER DEFAULT 0,
    resolution_date TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_viewings_tenant ON viewing_bookings(tenant_id);
CREATE INDEX idx_viewings_landlord ON viewing_bookings(landlord_id);
CREATE INDEX idx_viewings_property ON viewing_bookings(property_id);

-- ─── PROPERTY RATINGS (Defamation-Safe) ──────────────────────
-- STRICT: Star sliders ONLY — NO text fields
-- UAE Federal Decree-Law No. 34 of 2021 (Cybercrime Law)
CREATE TABLE property_ratings (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES properties(id),
    tenant_id TEXT NOT NULL REFERENCES users(id),
    ac_quality INTEGER NOT NULL CHECK (ac_quality BETWEEN 1 AND 5),
    amenities INTEGER NOT NULL CHECK (amenities BETWEEN 1 AND 5),
    maintenance_speed INTEGER NOT NULL CHECK (maintenance_speed BETWEEN 1 AND 5),
    -- STRICTLY NO TEXT FIELDS (review_text, comments, etc.)
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(property_id, tenant_id)
);

-- ─── PAYMENTS ────────────────────────────────────────────────
CREATE TABLE payments (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES properties(id),
    payer_id TEXT NOT NULL REFERENCES users(id),
    payee_id TEXT NOT NULL REFERENCES users(id),
    type TEXT NOT NULL CHECK (type IN ('rent', 'deposit', 'refund')),
    amount INTEGER NOT NULL,                     -- AED
    due_date TEXT NOT NULL,
    paid_date TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','overdue')),
    method TEXT CHECK (method IN ('bank_transfer','direct_debit','card')),
    reference TEXT UNIQUE NOT NULL,
    rera_escrow_ref TEXT,
    rera_escrow_status TEXT CHECK (rera_escrow_status IN ('registered','held','release_requested','released')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_payments_property ON payments(property_id);
CREATE INDEX idx_payments_payer ON payments(payer_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ─── APPLICATIONS ────────────────────────────────────────────
CREATE TABLE applications (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES properties(id),
    applicant_id TEXT NOT NULL REFERENCES users(id),
    landlord_id TEXT NOT NULL REFERENCES users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','withdrawn')),
    landlord_approved INTEGER DEFAULT 0,
    move_in_date TEXT NOT NULL,
    applicant_message TEXT,
    landlord_notes TEXT,
    roommate_notes TEXT,
    applied_at TEXT DEFAULT (datetime('now')),
    approved_at TEXT,
    rejected_at TEXT
);

-- ─── ROOMMATE APPROVALS ──────────────────────────────────────
CREATE TABLE roommate_approvals (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL REFERENCES applications(id),
    roommate_id TEXT NOT NULL REFERENCES users(id),
    approved INTEGER DEFAULT 0,
    approved_at TEXT,
    rejection_reason TEXT,
    UNIQUE(application_id, roommate_id)
);

-- ─── GOOD CONDUCT CERTIFICATES ───────────────────────────────
CREATE TABLE good_conduct_certificates (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES users(id),
    issued_by_landlord TEXT NOT NULL REFERENCES users(id),
    property_id TEXT NOT NULL REFERENCES properties(id),
    tenancy_start TEXT NOT NULL,
    tenancy_end TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    payment_reliability TEXT CHECK (payment_reliability IN ('excellent','good','average','poor')),
    property_care TEXT CHECK (property_care IN ('excellent','good','average','poor')),
    issued_at TEXT DEFAULT (datetime('now')),
    verified INTEGER DEFAULT 0
    -- NOTE: No conduct_notes field — UAE defamation law
);

-- ─── COMPLIANCE CHECKS ───────────────────────────────────────
CREATE TABLE compliance_checks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    check_type TEXT NOT NULL CHECK (check_type IN ('kyc','aml','pep')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','passed','failed','manual_review')),
    result_score INTEGER,
    result_risk_level TEXT CHECK (result_risk_level IN ('low','medium','high')),
    result_flags TEXT DEFAULT '[]',              -- JSON array
    result_message TEXT,
    api_provider TEXT,
    api_reference_id TEXT,
    checked_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT
);

CREATE INDEX idx_compliance_user ON compliance_checks(user_id);

-- ─── CHAT CHANNELS ───────────────────────────────────────────
CREATE TABLE chat_channels (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES properties(id),
    name TEXT NOT NULL,
    participants TEXT DEFAULT '[]',              -- JSON array of user IDs
    created_at TEXT DEFAULT (datetime('now'))
);

-- ─── CHAT MESSAGES ───────────────────────────────────────────
CREATE TABLE chat_messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES chat_channels(id),
    sender_id TEXT NOT NULL REFERENCES users(id),
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text','maintenance_request','announcement','system')),
    content TEXT NOT NULL,
    read_by TEXT DEFAULT '[]',                   -- JSON array of user IDs
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_messages_channel ON chat_messages(channel_id);

-- ─── FINANCIAL LEDGER (per-property summary) ─────────────────
CREATE TABLE financial_ledgers (
    property_id TEXT PRIMARY KEY REFERENCES properties(id),
    total_rent_due INTEGER DEFAULT 0,            -- AED
    amount_collected INTEGER DEFAULT 0,          -- AED
    collective_status_percent INTEGER DEFAULT 0,
    status TEXT DEFAULT 'partial' CHECK (status IN ('partial','full','overdue')),
    last_updated TEXT DEFAULT (datetime('now'))
);

-- ─── RESIDENT FINANCIAL SHARES ───────────────────────────────
CREATE TABLE resident_shares (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES properties(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    monthly_share INTEGER NOT NULL,              -- AED
    payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Paid','Pending')),
    deposit_held INTEGER DEFAULT 0,
    has_rera_escrow INTEGER DEFAULT 0,
    utility_status TEXT CHECK (utility_status IN ('pending','completed')),
    UNIQUE(property_id, user_id)
);
