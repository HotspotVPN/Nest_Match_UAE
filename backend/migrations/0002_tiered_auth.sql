-- migrations/0002_tiered_auth.sql

-- 1. Create tenant_profiles table
CREATE TABLE IF NOT EXISTS tenant_profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id),
    lifestyle_tags TEXT, -- JSON array
    budget_min INTEGER,
    budget_max INTEGER,
    preferred_districts TEXT, -- JSON array
    bio TEXT
);

-- 2. Update users table structure (via temp table since SQLite doesn't support complex ALTER)
CREATE TABLE users_new (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT CHECK(role IN ('TENANT', 'LANDLORD', 'AGENT', 'ADMIN')),
    auth_tier INTEGER DEFAULT 1, -- 1: Email/Google, 2: UAE PASS/Onfido
    is_uae_pass_verified INTEGER DEFAULT 0,
    uae_pass_id TEXT UNIQUE,
    rera_license TEXT,
    gcc_score INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Note: We are doing a clean reset as per Phase 1 instructions, so no data migration.
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

-- 3. Update properties table (Strict Makani + Capacity Guard)
CREATE TABLE properties_new (
    id TEXT PRIMARY KEY,
    landlord_id TEXT REFERENCES users(id),
    agent_id TEXT REFERENCES users(id),
    title TEXT,
    district TEXT,
    address TEXT,
    makani_number TEXT NOT NULL CHECK(length(makani_number) = 10),
    municipality_permit TEXT NOT NULL,
    trakheesi_permit TEXT,
    max_legal_occupancy INTEGER NOT NULL,
    current_occupants INTEGER DEFAULT 0,
    rent_per_room INTEGER,
    deposit INTEGER,
    total_rooms INTEGER,
    available_rooms INTEGER,
    description TEXT,
    amenities TEXT, -- JSON
    house_rules TEXT, -- JSON
    tags TEXT, -- JSON
    transport_chips TEXT, -- JSON
    is_api_verified INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (current_occupants <= max_legal_occupancy)
);

DROP TABLE properties;
ALTER TABLE properties_new RENAME TO properties;

-- 4. Update viewings table
CREATE TABLE viewings_new (
    id TEXT PRIMARY KEY,
    property_id TEXT REFERENCES properties(id),
    tenant_id TEXT REFERENCES users(id),
    viewing_date DATETIME,
    status TEXT CHECK(status IN ('PENDING', 'ACCEPTED', 'COMPLETED', 'TENANT_NOSHOW', 'LANDLORD_NOSHOW')),
    stripe_hold_id TEXT, -- For the 50 AED Penalty
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE viewing_bookings; -- Existing table was named viewing_bookings
ALTER TABLE viewings_new RENAME TO viewings;
