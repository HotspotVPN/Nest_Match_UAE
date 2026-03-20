-- 0006_seed_full_mockdata.sql
-- Full seed migration: copies ALL users and properties from frontend mockData.ts into D1
-- Generated from src/data/mockData.ts — every user and listing included

PRAGMA foreign_keys = OFF;

-- ─── CLEAN SLATE ────────────────────────────────────────────────────
DELETE FROM room_occupancy WHERE property_id LIKE 'list-entry-%';
DELETE FROM properties WHERE id LIKE 'list-entry-%';
DELETE FROM users WHERE id LIKE 'roommate-%' OR id LIKE 'landlord-%' OR id LIKE 'agent-%' OR id LIKE 'admin-%' OR id LIKE 'tier0-%' OR id LIKE 'tier1-%';

-- ═══════════════════════════════════════════════════════════════════
-- USERS
-- ═══════════════════════════════════════════════════════════════════

-- ── Landlord 1: Ahmed Al Maktoum ──────────────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, bank_linked, monthly_income, managed_by_agent_id,
    bank_details, slug,
    created_at, updated_at
) VALUES (
    'landlord-1', 'ahmed.almaktoum@nestmatch.ae', 'Ahmed Al Maktoum', 'LANDLORD', '+971 50 123 4567',
    'Experienced property investor managing 8 units across Dubai Marina, JBR, and Downtown. I believe in providing well-maintained, fully compliant shared housing. All my properties are Municipality-permitted and RERA-registered.',
    1, 0, 'tier2_uae_pass', 'Emirati',
    0, 0, 1,
    'completed', '2025-11-10', 'completed', '2025-11-10', 'clear', '2025-11-10',
    '["professional","responsive","compliant","long-term","premium"]', 1, 28000, 'agent-1',
    '{"account_name":"Al Maktoum Properties LLC","iban":"AE07033300000*****01","swift_code":"BOMLAEAD","bank_name":"Mashreq Bank"}',
    'ahmed-al-maktoum',
    '2025-10-01', '2026-03-10'
);

-- ── Landlord 2: Fatima Hassan ─────────────────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, bank_details, slug,
    created_at, updated_at
) VALUES (
    'landlord-2', 'fatima.hassan@nestmatch.ae', 'Fatima Hassan', 'LANDLORD', '+971 55 234 5678',
    'Property owner in JLT and Business Bay. I focus on creating comfortable shared living spaces for young professionals. Quick maintenance responses and transparent communication.',
    1, 0, 'tier2_uae_pass', 'Emirati',
    0, 0, 1,
    'completed', '2025-12-05', 'completed', '2025-12-05', 'clear', '2025-12-05',
    '["professional","transparent","tenant-friendly","modern"]',
    '{"account_name":"Fatima Hassan","iban":"AE260260001000*****02","swift_code":"EABORAEAD","bank_name":"Emirates NBD"}',
    'fatima-hassan',
    '2025-11-15', '2026-03-08'
);

-- ── Landlord 3: Saeed Sultan ──────────────────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, slug,
    created_at, updated_at
) VALUES (
    'landlord-3', 'saeed@example.com', 'Saeed Sultan', 'LANDLORD', '+971 50 111 2222',
    'Portfolio owner in Business Bay.',
    1, 0, 'tier2_uae_pass', 'Emirati',
    0, 0, 1,
    'completed', '2025-01-01', 'completed', '2025-01-01', 'clear', '2025-01-01',
    '["compliant"]',
    'saeed-sultan',
    '2025-01-01', '2026-03-01'
);

-- ── Landlord 4: Nadia Mansour ─────────────────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, slug,
    created_at, updated_at
) VALUES (
    'landlord-4', 'nadia@example.com', 'Nadia Mansour', 'LANDLORD', '+971 50 222 3333',
    'Owner of multiple units in JVC.',
    1, 0, 'tier2_uae_pass', 'Emirati',
    0, 0, 1,
    'completed', '2025-01-01', 'completed', '2025-01-01', 'clear', '2025-01-01',
    '["compliant"]',
    'nadia-mansour',
    '2025-01-01', '2026-03-01'
);

-- ── Agent 1: Khalid Al Rashid ─────────────────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, rera_license, agency_name, slug,
    created_at, updated_at
) VALUES (
    'agent-1', 'khalid@dubaipropertygroup.ae', 'Khalid Al Rashid', 'AGENT', '+971 56 345 6789',
    'RERA-certified property broker with 6 years managing shared housing portfolios in Dubai. Specializing in compliant co-living setups. I handle tenant relations, viewings, and Municipality permit coordination.',
    1, 0, 'tier2_uae_pass', 'Emirati',
    0, 0, 1,
    'completed', '2025-10-15', 'completed', '2025-10-15', 'clear', '2025-10-15',
    '["RERA-certified","professional","shared-housing","responsive","compliant"]',
    'RERA-BRN-2025-12345', 'Dubai Property Group',
    'khalid-al-rashid',
    '2025-09-01', '2026-03-10'
);

-- ── Agent 2: Tariq Mahmood ────────────────────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, rera_license, agency_name, slug,
    created_at, updated_at
) VALUES (
    'agent-2', 'tariq@agency.ae', 'Tariq Mahmood', 'AGENT', '+971 50 333 4444',
    'RERA certified broker.',
    1, 0, 'tier2_uae_pass', 'Pakistani',
    0, 0, 1,
    'completed', '2025-01-01', 'completed', '2025-01-01', 'clear', '2025-01-01',
    '["compliant"]',
    'RERA-BRN-33333', 'Prime Real Estate',
    'tariq-mahmood',
    '2025-01-01', '2026-03-01'
);

-- ── Agent 3: Elena Popova ─────────────────────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, rera_license, agency_name, slug,
    created_at, updated_at
) VALUES (
    'agent-3', 'elena@agency.ae', 'Elena Popova', 'AGENT', '+971 50 444 5555',
    'RERA certified broker.',
    1, 0, 'tier2_uae_pass', 'Russian',
    0, 0, 1,
    'completed', '2025-01-01', 'completed', '2025-01-01', 'clear', '2025-01-01',
    '["compliant"]',
    'RERA-BRN-44444', 'Luxury Homes',
    'elena-popova',
    '2025-01-01', '2026-03-01'
);

-- ── Roommate 1: Priya Sharma (residing) ───────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role, current_property_id, rent_monthly, deposit,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-1', 'priya.sharma@email.com', 'Priya Sharma', 'RESIDING_TENANT', '+971 52 456 7890',
    'UX Designer at a fintech startup in DIFC. Love weekend brunches at Dubai Marina, yoga at sunrise, and cooking elaborate Indian meals. I keep common areas spotless and believe communication is key.',
    1, 0, 'tier2_uae_pass', 'Indian',
    85, 1, 1,
    'completed', '2025-12-01', 'completed', '2025-12-01', 'clear', '2025-12-01',
    '["non-smoker","early-bird","professional","clean","social","yoga"]',
    'residing', 'list-entry-11', 3200, 3200,
    '["yoga","gym-goer","runner","swimmer"]',
    '["extroverted","social","organised","early-riser"]',
    '["cooking","interior-design","reading","brunch-culture","hiking"]',
    'priya-sharma',
    '2025-11-20', '2026-03-05'
);

-- ── Roommate 2: Marcus Chen (residing) ────────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role, current_property_id, rent_monthly, deposit,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-2', 'marcus.chen@email.com', 'Marcus Chen', 'RESIDING_TENANT', '+971 54 567 8901',
    'Software engineer working remotely for a climate tech company in Singapore. Quiet during work hours, love hitting the gym in the evenings and exploring Dubai''s food scene on weekends. Big fan of board games and cycling.',
    1, 0, 'tier2_uae_pass', 'Singaporean',
    70, 0, 1,
    'completed', '2025-11-25', 'completed', '2025-11-25', 'clear', '2025-11-25',
    '["professional","quiet","gym-goer","non-smoker","tech","foodie"]',
    'residing', 'list-entry-12', 3500, 3500,
    '["gym-goer","cyclist","rock-climbing"]',
    '["introverted","curious","analytical","night-owl"]',
    '["board-games","cycling","coding","food-vlogger","photography"]',
    'marcus-chen',
    '2025-10-25', '2026-03-05'
);

-- ── Roommate 3: Elena Rodriguez (residing) ────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role, current_property_id, rent_monthly, deposit,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-3', 'elena.rodriguez@email.com', 'Elena Rodriguez', 'RESIDING_TENANT', '+971 58 678 9012',
    'Marketing coordinator at a sustainability startup in Dubai Design District. Love exploring the city — weekend markets, art galleries, and trying every coffee shop I can find.',
    1, 0, 'tier2_uae_pass', 'Spanish',
    30, 0, 1,
    'completed', '2026-01-15', 'completed', '2026-01-15', 'clear', '2026-01-15',
    '["non-smoker","social","professional","clean","creative","coffee-lover"]',
    'residing', 'list-entry-3', 800, 800,
    '["walking","yoga","dance"]',
    '["extroverted","creative","traveller","empathetic"]',
    '["coffee-tasting","street-photography","gallery-hopping","salsa-dancing"]',
    'elena-rodriguez',
    '2026-01-15', '2026-03-08'
);

-- ── Roommate 4: Omar Khalil (residing) ────────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role, current_property_id, rent_monthly, deposit,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-4', 'omar.khalil@email.com', 'Omar Khalil', 'RESIDING_TENANT', '+971 50 789 0123',
    'Bartender and music producer. I work late shifts so I''m quiet during the day. Love cooking Middle Eastern breakfasts on Friday mornings. 9 months in the flat and loving JLT.',
    1, 0, 'tier2_uae_pass', 'Lebanese',
    60, 0, 1,
    'completed', '2025-06-01', 'completed', '2025-06-01', 'clear', '2025-06-01',
    '["night-owl","musician","clean","friendly","non-smoker","creative"]',
    'residing', 'list-entry-8', 2200, 2200,
    '["gym-goer","swimming","football"]',
    '["extroverted","comedian","social","night-owl"]',
    '["music-production","cooking-arabic","football","desert-camping"]',
    'omar-khalil',
    '2025-06-01', '2026-03-08'
);

-- ── Roommate 5: Yuki Tanaka (residing) ────────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role, current_property_id, rent_monthly, deposit,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-5', 'yuki.tanaka@email.com', 'Yuki Tanaka', 'RESIDING_TENANT', '+971 52 890 1234',
    'Japanese architect working on EXPO City Dubai projects. Living in Business Bay for 6 months. Love the canal walks, weekend brunches, and the Dubai Design Week scene.',
    1, 0, 'tier2_uae_pass', 'Japanese',
    40, 1, 1,
    'completed', '2025-09-01', 'completed', '2025-09-01', 'clear', '2025-09-01',
    '["non-smoker","professional","design","organised","quiet"]',
    'residing', 'list-entry-10', 2800, 2800,
    '["runner","cycling","swimming"]',
    '["introverted","creative","organised","calm"]',
    '["architecture-walks","photography","japanese-cooking","design-exhibitions"]',
    'yuki-tanaka',
    '2025-09-01', '2026-03-08'
);

-- ── Roommate 6: James Morrison (searching) ────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-6', 'james.morrison@email.com', 'James Morrison', 'SEARCHING_TENANT', '+971 55 901 2345',
    'Data analyst relocating from London to Dubai for a new role at an AI company in DIFC. Love long-distance cycling, dim sum, and quiet evenings. Looking for a tidy, professional household near the Metro.',
    1, 0, 'tier2_uae_pass', 'British',
    0, 0, 1,
    'completed', '2026-02-20', 'completed', '2026-02-20', 'clear', '2026-02-20',
    '["non-smoker","quiet","professional","tidy","cyclist","reader"]',
    'searching',
    '["cyclist","swimming","running"]',
    '["introverted","analytical","reader","calm"]',
    '["cycling","reading","data-viz","desert-drives"]',
    'james-morrison',
    '2026-02-20', '2026-03-08'
);

-- ── Roommate 7: Aisha Patel (searching) ───────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-7', 'aisha.patel@email.com', 'Aisha Patel', 'SEARCHING_TENANT', '+971 50 012 3456',
    'Strategy consultant at McKinsey. Previous NestMatch tenant in London with 18 months verified tenancy and an excellent GCC. Relocating to Dubai — looking for a quiet, premium household.',
    1, 0, 'tier2_uae_pass', 'British-Indian',
    92, 1, 1,
    'completed', '2025-05-10', 'completed', '2025-05-10', 'clear', '2025-05-10',
    '["non-smoker","professional","quiet","experienced-tenant","long-term"]',
    'searching',
    '["pilates","runner","tennis"]',
    '["introverted","organised","analytical","calm"]',
    '["brunch-culture","bookshops","travel-planning","podcasts"]',
    'aisha-patel',
    '2025-05-10', '2026-03-08'
);

-- ── Roommate 8: David Muller (searching) ──────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-8', 'david.muller@email.com', 'David Muller', 'SEARCHING_TENANT', '+971 56 123 4567',
    'German expat, senior engineer at a fintech company. Multi-year verified track record — 30 months total tenancy. Looking for a premium, well-managed property. I value transparency.',
    1, 0, 'tier2_uae_pass', 'German',
    95, 1, 1,
    'completed', '2024-02-01', 'completed', '2024-02-01', 'clear', '2024-02-01',
    '["non-smoker","professional","elite-tenant","long-term","quiet","tech"]',
    'searching',
    '["cycling","gym-goer","hiking"]',
    '["introverted","analytical","organised","calm"]',
    '["cycling","mechanical-keyboards","craft-coffee","desert-hiking"]',
    'david-muller',
    '2024-02-01', '2026-03-08'
);

-- ── Roommate 9: Sophie Laurent (searching) ────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-9', 'sophie.laurent@email.com', 'Sophie Laurent', 'SEARCHING_TENANT', '+971 52 234 5678',
    'French expat working in fashion PR at a Dubai Media City agency. First time on NestMatch — excited to find a vibrant, social household near the beach.',
    1, 0, 'tier2_uae_pass', 'French',
    0, 0, 1,
    'completed', '2026-02-15', 'completed', '2026-02-15', 'clear', '2026-02-15',
    '["non-smoker","professional","creative","social","fashion"]',
    'searching',
    '["yoga","swimming","dance"]',
    '["extroverted","creative","social","stylish"]',
    '["fashion","french-cooking","beach-clubs","art-exhibitions"]',
    'sophie-laurent',
    '2026-02-15', '2026-03-08'
);

-- ── Roommate 10: Raj Krishnan (searching) ─────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-10', 'raj.krishnan@email.com', 'Raj Krishnan', 'SEARCHING_TENANT', '+971 55 345 6789',
    'NHS-trained doctor now working at Cleveland Clinic Abu Dhabi. Relocating to Dubai for a new role at Mediclinic. Calm, respectful, and adaptable to different routines.',
    1, 0, 'tier2_uae_pass', 'Indian',
    0, 0, 1,
    'completed', '2026-02-25', 'completed', '2026-02-25', 'clear', '2026-02-25',
    '["non-smoker","professional","quiet","clean","vegetarian","doctor"]',
    'searching',
    '["yoga","meditation","walking"]',
    '["introverted","calm","reader","empathetic"]',
    '["meditation","cooking-indian","journaling","cricket"]',
    'raj-krishnan',
    '2026-02-25', '2026-03-08'
);

-- ── Roommate srch-0: Aditya Kapoor (searching) ───────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-srch-0', 'aditya.kapoor@gmail.com', 'Aditya Kapoor', 'SEARCHING_TENANT', '+971 52 101 2020',
    'Product manager at a Series B startup in Dubai Internet City. Relocated from Bangalore 3 months ago, loves weekend hikes in Hatta.',
    1, 0, 'tier2_uae_pass', 'Indian',
    0, 0, 1,
    'completed', '2026-01-01', 'completed', '2026-01-01', 'clear', '2026-01-01',
    '["professional","hiking","startup"]',
    'searching',
    '["hiking","gym-goer","cyclist"]',
    '["organised","social","ambitious"]',
    '["hiking","cricket","product-thinking"]',
    'aditya-kapoor',
    '2026-01-01', '2026-01-01'
);

-- ── Roommate srch-1: Chloe Dubois (searching) ────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-srch-1', 'chloe.dubois@outlook.com', 'Chloe Dubois', 'SEARCHING_TENANT', '+971 54 202 3030',
    'Fashion buyer for a luxury retail group in Mall of the Emirates. Originally from Lyon, been in Dubai two years and loves the food scene.',
    1, 0, 'tier2_uae_pass', 'French',
    0, 0, 1,
    'completed', '2026-01-01', 'completed', '2026-01-01', 'clear', '2026-01-01',
    '["professional","fashion","foodie"]',
    'searching',
    '["yoga","runner","foodie"]',
    '["creative","extroverted","tidy"]',
    '["fashion","cooking","yoga"]',
    'chloe-dubois',
    '2026-01-01', '2026-01-01'
);

-- ── Roommate srch-2: Daniel Osei (searching) ─────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-srch-2', 'daniel.osei@gmail.com', 'Daniel Osei', 'SEARCHING_TENANT', '+971 56 303 4040',
    'Civil engineer on the Metro Blue Line extension project. Arrived from Accra on a 2-year contract, looking for somewhere close to Al Quoz.',
    1, 0, 'tier2_uae_pass', 'Ghanaian',
    0, 0, 1,
    'completed', '2026-01-01', 'completed', '2026-01-01', 'clear', '2026-01-01',
    '["professional","engineer","football"]',
    'searching',
    '["football","gym-goer","swimmer"]',
    '["calm","reliable","social"]',
    '["football","afrobeats","cooking"]',
    'daniel-osei',
    '2026-01-01', '2026-01-01'
);

-- ── Roommate srch-3: Mei Lin Zhang (searching) ───────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-srch-3', 'meilin.zhang@email.com', 'Mei Lin Zhang', 'SEARCHING_TENANT', '+971 50 404 5050',
    'UX researcher at a fintech company in DIFC. Moved from Shanghai, passionate about sustainable living and finding a plant-friendly flat.',
    1, 0, 'tier2_uae_pass', 'Chinese',
    0, 0, 1,
    'completed', '2026-01-01', 'completed', '2026-01-01', 'clear', '2026-01-01',
    '["professional","sustainable","creative"]',
    'searching',
    '["yoga","cycling","runner"]',
    '["introverted","analytical","creative"]',
    '["watercolour","cycling","plant-care"]',
    'mei-lin-zhang',
    '2026-01-01', '2026-01-01'
);

-- ── Roommate res-new-0: Tariq Al Balushi (residing) ──────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-res-new-0', 'tariq.albalushi@email.com', 'Tariq Al Balushi', 'RESIDING_TENANT', '+971 55 505 6060',
    'Logistics coordinator at DP World, Jebel Ali. Commutes from Bur Dubai, enjoys quiet evenings and weekend drives to Oman.',
    1, 0, 'tier2_uae_pass', 'Omani',
    0, 0, 1,
    'completed', '2026-01-01', 'completed', '2026-01-01', 'clear', '2026-01-01',
    '["professional","quiet","logistics"]',
    'residing',
    '["gym-goer","swimming","driving"]',
    '["calm","quiet","organised"]',
    '["road-trips","cooking","football"]',
    'tariq-al-balushi',
    '2026-01-01', '2026-01-01'
);

-- ── Roommate res-new-1: Valentina Cruz (residing) ────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-res-new-1', 'valentina.cruz@email.com', 'Valentina Cruz', 'RESIDING_TENANT', '+971 52 606 7070',
    'Marketing executive at a travel tech startup in Business Bay. Salsa dancer, brunch enthusiast, and JBR regular on weekends.',
    1, 0, 'tier2_uae_pass', 'Colombian',
    0, 0, 1,
    'completed', '2026-01-01', 'completed', '2026-01-01', 'clear', '2026-01-01',
    '["professional","social","marketing"]',
    'residing',
    '["dancing","runner","foodie"]',
    '["extroverted","social","creative"]',
    '["salsa-dancing","travel-blogging","swimming"]',
    'valentina-cruz',
    '2026-01-01', '2026-01-01'
);

-- ── Roommate res-new-2: Yusuf Ibrahim (residing) ─────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-res-new-2', 'yusuf.ibrahim@email.com', 'Yusuf Ibrahim', 'RESIDING_TENANT', '+971 54 707 8080',
    'Arabic-English translator at a legal firm in DIFC. Quiet, bookish, and looking for a flat with good natural light and fast WiFi.',
    1, 0, 'tier2_uae_pass', 'Sudanese',
    0, 0, 1,
    'completed', '2026-01-01', 'completed', '2026-01-01', 'clear', '2026-01-01',
    '["professional","quiet","translator"]',
    'residing',
    '["reading","walking","swimming"]',
    '["introverted","calm","intellectual"]',
    '["arabic-literature","chess","photography"]',
    'yusuf-ibrahim',
    '2026-01-01', '2026-01-01'
);

-- ── Roommate res-new-3: Hana Petrov (residing) ───────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'roommate-res-new-3', 'hana.petrov@email.com', 'Hana Petrov', 'RESIDING_TENANT', '+971 56 808 9090',
    'Junior architect at a firm behind several Downtown Dubai projects. Weekend runner, coffee shop hopper, and obsessive about good design.',
    1, 0, 'tier2_uae_pass', 'Czech',
    0, 0, 1,
    'completed', '2026-01-01', 'completed', '2026-01-01', 'clear', '2026-01-01',
    '["professional","creative","architecture"]',
    'residing',
    '["runner","cycling","yoga"]',
    '["creative","organised","introverted"]',
    '["architecture","sketching","running"]',
    'hana-petrov',
    '2026-01-01', '2026-01-01'
);

-- ── Tier 0-1: James Okafor (passport KYC) ────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    passport_number, visa_type, visa_expiry,
    gcc_score, is_premium, compliance_verified,
    kyc_status, aml_status, pep_status,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'tier0-1', 'james.okafor@gmail.com', 'James Okafor', 'SEARCHING_TENANT', '+971 52 111 2233',
    'Data engineer relocating from Lagos. Just arrived in Dubai on employment visa — Emirates ID processing.',
    0, 0, 'tier0_passport', 'Nigerian',
    'A12345678', 'Employment', '2028-03-01',
    0, 0, 0,
    'pending', 'pending', 'pending',
    '["professional","tech"]',
    'searching',
    '["gym-goer","football"]',
    '["social","organised"]',
    '["football","data-science"]',
    'james-okafor',
    '2026-03-10', '2026-03-10'
);

-- ── Tier 0-2: Sofia Kowalski (passport KYC) ──────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    passport_number, visa_type, visa_expiry,
    gcc_score, is_premium, compliance_verified,
    kyc_status, aml_status, pep_status,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'tier0-2', 'sofia.k@outlook.com', 'Sofia Kowalski', 'SEARCHING_TENANT', '+971 54 333 4455',
    'Marketing manager from Warsaw, just started at a DMCC company. Visa stamped, awaiting Emirates ID.',
    0, 0, 'tier0_passport', 'Polish',
    'XY9876543', 'Employment', '2027-11-15',
    0, 0, 0,
    'pending', 'pending', 'pending',
    '["professional","non-smoker"]',
    'searching',
    '["yoga","runner"]',
    '["creative","organised"]',
    '["photography","yoga"]',
    'sofia-kowalski',
    '2026-03-12', '2026-03-13'
);

-- ── Tier 0-3: Ravi Menon (passport KYC) ──────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    passport_number, visa_type, visa_expiry,
    gcc_score, is_premium, compliance_verified,
    kyc_status, aml_status, pep_status,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'tier0-3', 'ravi.menon@gmail.com', 'Ravi Menon', 'SEARCHING_TENANT', '+971 55 666 7788',
    'Finance analyst from Mumbai, new to Dubai on a visit visa converting to employment. Emirates ID TBA.',
    0, 0, 'tier0_passport', 'Indian',
    'M7654321', 'Visit', '2026-06-01',
    0, 0, 0,
    'pending', 'pending', 'pending',
    '["professional","quiet"]',
    'searching',
    '["gym-goer","cycling"]',
    '["calm","analytical"]',
    '["cricket","finance-blogs"]',
    'ravi-menon',
    '2026-03-14', '2026-03-14'
);

-- ── Admin 1: Sara Al Hashimi (compliance) ─────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, slug,
    created_at, updated_at
) VALUES (
    'admin-1', 'compliance@nestmatch.ae', 'Sara Al Hashimi', 'COMPLIANCE_ADMIN', '+971 4 123 4567',
    'NestMatch UAE Head of Compliance — UAE PASS verification and RERA regulatory oversight.',
    1, 0, 'tier2_uae_pass', 'Emirati',
    0, 0, 1,
    'completed', '2024-01-01', 'completed', '2024-01-01', 'clear', '2024-01-01',
    '["admin","compliance"]',
    'sara-al-hashimi',
    '2024-01-01', '2026-03-10'
);

-- ── Admin 3: Rashid Khalil (operations) ───────────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, slug,
    created_at, updated_at
) VALUES (
    'admin-3', 'operations@nestmatch.ae', 'Rashid Khalil', 'OPERATIONS_ADMIN', '+971 4 123 4569',
    'NestMatch UAE Head of Operations — CRM, property registry, and platform integrity.',
    1, 0, 'tier2_uae_pass', 'Emirati',
    0, 0, 1,
    'completed', '2024-01-01', 'completed', '2024-01-01', 'clear', '2024-01-01',
    '["admin","operations"]',
    'rashid-khalil',
    '2024-01-01', '2026-03-10'
);

-- ── Tier 1-1: Liam O''Brien (email only, unverified) ──────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, aml_status, pep_status,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'tier1-1', 'liam.obrien@gmail.com', 'Liam O''Brien', 'SEARCHING_TENANT', '+971 50 909 1010',
    'Just landed in Dubai on a job-seeker visa. Exploring the city and sussing out neighbourhoods before committing to anything.',
    0, 0, 'tier1_unverified', 'Irish',
    0, 0, 0,
    'pending', 'pending', 'pending',
    '["new-arrival"]',
    'searching',
    '["football","gym-goer","socialising"]',
    '["social","curious","flexible"]',
    '["football","pub-quizzes","travel"]',
    'liam-obrien',
    '2026-03-12', '2026-03-12'
);

-- ── Tier 1-2: Amara Diallo (Onfido verified) ─────────────────────
INSERT INTO users (
    id, email, name, role, phone, bio,
    is_uae_pass_verified, is_id_verified, verification_tier, nationality,
    gcc_score, is_premium, compliance_verified,
    kyc_status, kyc_completed_date, aml_status, aml_completed_date, pep_status, pep_completed_date,
    keywords, resident_role,
    lifestyle_tags, personality_traits, hobbies, slug,
    created_at, updated_at
) VALUES (
    'tier1-2', 'amara.diallo@email.com', 'Amara Diallo', 'SEARCHING_TENANT', '+971 52 010 1111',
    'Freelance photographer scoping out Dubai for a potential relocation. Browsing listings before her exploratory visit next month.',
    0, 1, 'tier0_passport', 'Senegalese',
    0, 0, 1,
    'completed', '2026-03-10', 'completed', '2026-03-10', 'clear', '2026-03-10',
    '["new-expat","photographer"]',
    'searching',
    '["photography","yoga","walking"]',
    '["creative","calm","observant"]',
    '["street-photography","yoga","cooking"]',
    'amara-diallo',
    '2026-03-10', '2026-03-12'
);


-- ═══════════════════════════════════════════════════════════════════
-- PROPERTIES (14 listings: list-entry-1 through list-entry-14)
-- ═══════════════════════════════════════════════════════════════════

-- ── list-entry-1: Compliant Bed-space in Deira ───────────────────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, bills_breakdown,
    transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-1', 'landlord-3', 'agent-2',
    'Compliant Bed-space in Deira — Near Metro',
    'Al Rigga Road, Deira', 'Deira',
    '1122334455', 'TRAK-2025-DR-123', 'DM-SH-2026-DR1',
    6, 5, 1, 1,
    500, 500, 3, 1,
    'Fully legal, DLD-approved bed-space in a clean, quiet 6-person shared room. 3 mins walk to Al Rigga Metro. Daily cleaning included.',
    '["Central AC","Daily Cleaning","High-Speed Wi-Fi","Furnished"]',
    '["No smoking","Quiet hours 10PM-6AM"]',
    '["bed-space","budget","metro-access","deira"]',
    1, 'DEWA & Internet included',
    '[{"label":"Al Rigga Metro","type":"metro","walk_time":"3m","lines":["Red Line"],"line_color":"#E21836"}]',
    1, 'compliant-bed-space-in-deira-near-metro',
    '2025-10-01', '2026-03-01'
);

-- ── list-entry-2: Affordable Bed-space — International City ──────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-2', 'landlord-4', NULL,
    'Affordable Bed-space — International City',
    'England Cluster, International City', 'International City',
    '2233445566', 'TRAK-2025-IC-123', 'DM-SH-2026-IC1',
    4, 1, 1, 1,
    600, 600, 2, 4,
    'Clean, compliant shared room in International City. Direct bus to Rashidiya Metro. Perfect for budget-conscious workers.',
    '["AC","Parking","Wi-Fi"]',
    '["No smoking"]',
    '["bed-space","budget"]',
    1,
    '[{"label":"RTA Bus 367","type":"bus","walk_time":"2m","lines":["367"]}]',
    1, 'affordable-bed-space-international-city',
    '2025-11-01', '2026-03-01'
);

-- ── list-entry-3: Al Qusais Shared Room ──────────────────────────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-3', 'landlord-2', 'agent-1',
    'Al Qusais Shared Room — Close to Airport Freezone',
    'Damascus St, Al Qusais', 'Al Qusais',
    '3344556677', 'TRAK-2025-AQ-123', 'DM-SH-2026-AQ1',
    4, 2, 1, 1,
    800, 800, 4, 2,
    'Very large shared room, only 4 people max. DAFZA metro is a short walk away. Two rooms currently available.',
    '["Balcony","Gym","Wi-Fi","Central AC"]',
    '[]',
    '["bed-space","dafza"]',
    1,
    '[{"label":"DAFZA Metro","type":"metro","walk_time":"8m","lines":["Green Line"],"line_color":"#009639"}]',
    1, 'al-qusais-shared-room-close-to-airport-freezone',
    '2025-12-01', '2026-03-01'
);

-- ── list-entry-4: Twin Share Room — Bur Dubai ────────────────────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, bills_breakdown,
    transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-4', 'landlord-1', NULL,
    'Twin Share Room — Heart of Bur Dubai',
    'Mankhool Road, Bur Dubai', 'Bur Dubai',
    '4455667788', 'TRAK-2025-BD-123', 'DM-SH-2026-BD1',
    2, 1, 1, 1,
    1000, 1000, 3, 1,
    'Share a massive master bedroom with just one other person. En-suite bathroom, high ceilings. Walking distance to ADCB Metro.',
    '["En-suite","Balcony","Wi-Fi"]',
    '["Professionals only"]',
    '["shared-room","bur-dubai","twin"]',
    0, 'DEWA shared',
    '[{"label":"ADCB Metro","type":"metro","walk_time":"6m","lines":["Red Line"],"line_color":"#E21836"}]',
    1, 'twin-share-room-heart-of-bur-dubai',
    '2025-10-15', '2026-03-01'
);

-- ── list-entry-5: Al Nahda Twin Share ────────────────────────────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-5', 'landlord-4', 'agent-3',
    'Al Nahda Twin Share — Dubai/Sharjah Border',
    'Al Nahda 1, Dubai', 'Al Nahda',
    '5566778899', 'TRAK-2025-AN-123', 'DM-SH-2026-AN1',
    2, 0, 1, 1,
    1200, 1200, 2, 2,
    'Brand new building, gym and pool included. You will share a room with one other verified tenant. Completely vacant right now!',
    '["Gym","Pool","Parking"]',
    '[]',
    '["al-nahda","new-building"]',
    1,
    '[{"label":"Stadium Metro","type":"metro","walk_time":"15m","lines":["Green Line"],"line_color":"#009639"}]',
    1, 'al-nahda-twin-share-dubaisharjah-border',
    '2026-01-10', '2026-03-01'
);

-- ── list-entry-6: Discovery Gardens Shared Apartment ─────────────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-6', 'landlord-3', NULL,
    'Discovery Gardens Shared Apartment',
    'Zen Cluster, Discovery Gardens', 'Discovery Gardens',
    '6677889900', 'TRAK-2025-DG-123', 'DM-SH-2026-DG1',
    2, 1, 1, 1,
    1500, 1500, 2, 1,
    'Great community living. You get your own bed in a huge shared master room (max 2 pax per room). Metro is just outside the cluster.',
    '["Community Pool","Tennis Court","Metro Access"]',
    '[]',
    '["discovery-gardens","metro-access"]',
    1,
    '[{"label":"Discovery Gardens Metro","type":"metro","walk_time":"4m","lines":["Red Line"],"line_color":"#E21836"}]',
    1, 'discovery-gardens-shared-apartment',
    '2025-08-20', '2026-03-01'
);

-- ── list-entry-7: Private Room in JVC Villa ──────────────────────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, bills_breakdown,
    transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-7', 'landlord-4', 'agent-2',
    'Private Room in JVC Villa',
    'District 15, JVC', 'JVC',
    '7788990011', 'TRAK-2025-JVC-123', 'DM-SH-2026-JVC1',
    4, 2, 1, 1,
    1800, 1800, 4, 1,
    'Your own private room in a massive JVC villa. Shared backyard, huge kitchen. You share a bathroom with just 1 other person.',
    '["Garden","Parking","Maid Room"]',
    '["No loud parties"]',
    '["private-room","villa","jvc"]',
    0, 'DEWA & Internet split 4 ways',
    '[{"label":"J01 Bus","type":"bus","walk_time":"2m","lines":["J01"]}]',
    1, 'private-room-in-jvc-villa',
    '2025-05-15', '2026-03-01'
);

-- ── list-entry-8: Private Room — Dubai Silicon Oasis ─────────────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-8', 'landlord-1', NULL,
    'Private Room — Dubai Silicon Oasis',
    'Axis Residence, DSO', 'Dubai Silicon Oasis',
    '8899001122', 'TRAK-2025-DSO-123', 'DM-SH-2026-DS1',
    2, 1, 1, 1,
    2200, 2200, 2, 1,
    'Clean, modern private room in DSO. Perfect for tech workers. Building has a great gym and rooftop pool.',
    '["Pool","Gym","Covered Parking"]',
    '[]',
    '["private-room","dso"]',
    1,
    '[{"label":"320 Bus","type":"bus","walk_time":"1m","lines":["320"]}]',
    1, 'private-room-dubai-silicon-oasis',
    '2025-06-25', '2026-03-01'
);

-- ── list-entry-9: En-suite Private Room in Al Barsha 1 ───────────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-9', 'landlord-2', 'agent-3',
    'En-suite Private Room in Al Barsha 1',
    'Al Barsha 1, Near MOE', 'Al Barsha',
    '9900112233', 'TRAK-2025-AB-123', 'DM-SH-2026-AB1',
    3, 3, 1, 1,
    2500, 2500, 3, 0,
    'Awesome private room with en-suite. 5 mins walk to Mall of the Emirates Metro. Completely full at the moment.',
    '["En-suite","Balcony","Gym"]',
    '[]',
    '["private-room","en-suite","al-barsha"]',
    1,
    '[{"label":"MOE Metro","type":"metro","walk_time":"5m","lines":["Red Line"],"line_color":"#E21836"}]',
    1, 'en-suite-private-room-in-al-barsha-1',
    '2025-03-10', '2026-03-01'
);

-- ── list-entry-10: Premium En-Suite — Business Bay ───────────────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, bills_breakdown,
    transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-10', 'landlord-3', NULL,
    'Premium En-Suite — Business Bay Canal View',
    'Executive Towers, Business Bay', 'Business Bay',
    '0011223344', 'TRAK-2025-BB-123', 'DM-SH-2026-BB1',
    2, 1, 1, 1,
    2800, 2800, 2, 1,
    'High-floor private room overlooking the canal. Premium building amenities. You share the apartment with a verified pilot.',
    '["Pool","Gym","Canal View","En-suite"]',
    '["Professionals only"]',
    '["premium","en-suite","business-bay"]',
    0, 'Shared equally',
    '[{"label":"Business Bay Metro","type":"metro","walk_time":"7m","lines":["Red Line"],"line_color":"#E21836"}]',
    1, 'premium-en-suite-business-bay-canal-view',
    '2025-04-18', '2026-03-01'
);

-- ── list-entry-11: Luxury JLT Private Room ───────────────────────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-11', 'landlord-4', 'agent-2',
    'Luxury JLT Private Room — Cluster D',
    'Cluster D, JLT', 'JLT',
    '1122334455', 'TRAK-2025-JLT-123', 'DM-SH-2026-JL1',
    3, 1, 1, 1,
    3200, 3200, 3, 2,
    'Upgraded luxury apartment in JLT. Sweeping views of the golf course and lakes. Two empty private rooms available for immediate move-in.',
    '["Lake View","Gym","Premium Furnishings"]',
    '[]',
    '["luxury","jlt","lake-view","private-room"]',
    1,
    '[{"label":"DMCC Metro","type":"metro","walk_time":"8m","lines":["Red Line"],"line_color":"#E21836"}]',
    1, 'luxury-jlt-private-room-cluster-d',
    '2026-02-05', '2026-03-01'
);

-- ── list-entry-12: Ultra-Premium Marina En-Suite ─────────────────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, bills_breakdown,
    transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-12', 'landlord-1', 'agent-1',
    'Ultra-Premium Marina En-Suite — Ocean View',
    'Princess Tower, Dubai Marina', 'Dubai Marina',
    '2233445566', 'TRAK-2025-DM-123', 'DM-SH-2026-DM1',
    2, 1, 1, 1,
    3500, 3500, 2, 1,
    'The absolute best of NestMatch. 3500 AED gets you an ocean-facing massive en-suite in the Marina. Full cleaning, all bills, gym, and pool included.',
    '["Sea View","En-suite","Daily Cleaning","Concierge","Pool","Gym"]',
    '["No pets"]',
    '["ultra-premium","sea-view","marina","en-suite"]',
    1, 'Everything included',
    '[{"label":"Dubai Marina Tram","type":"tram","walk_time":"3m"},{"label":"DMCC Metro","type":"metro","walk_time":"5m","lines":["Red Line"],"line_color":"#E21836"}]',
    1, 'ultra-premium-marina-en-suite-ocean-view',
    '2025-01-10', '2026-03-01'
);

-- ── list-entry-13: Premium Studio — Downtown Dubai (coming soon) ─
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-13', 'landlord-1', NULL,
    'Premium Studio — Downtown Dubai',
    'Boulevard Point, Downtown Dubai', 'Downtown Dubai',
    '3344556688', 'TRAK-2026-DT-001', 'DM-SH-2026-DT1',
    1, 0, 1, 0,
    4500, 4500, 1, 1,
    'Luxury studio with full Burj Khalifa view. Launching on NestMatch next month.',
    '["Pool","Gym","Concierge","Sea View"]',
    '["No smoking","Professionals only"]',
    '["coming-soon","premium","studio","downtown"]',
    1,
    '[{"label":"Burj Khalifa Metro","type":"metro","walk_time":"4m","lines":["Red Line"],"line_color":"#E21836"}]',
    1, 'premium-studio-downtown-dubai',
    '2026-03-15', '2026-03-15'
);

-- ── list-entry-14: Shared Villa Room — Palm Jumeirah (coming soon)
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district,
    makani_number, trakheesi_permit, municipality_permit,
    max_legal_occupancy, current_occupants, is_api_verified, is_active,
    rent_per_room, deposit, total_rooms, available_rooms,
    description, amenities, house_rules, tags,
    bills_included, bills_breakdown,
    transport_chips, rera_escrow_verified, slug,
    created_at, updated_at
) VALUES (
    'list-entry-14', 'landlord-1', 'agent-1',
    'Shared Villa Room — Palm Jumeirah',
    'Garden Homes, Palm Jumeirah', 'Palm Jumeirah',
    '4455667799', 'TRAK-2026-PJ-001', 'DM-SH-2026-PJ1',
    3, 0, 1, 0,
    5500, 5500, 3, 3,
    'Private room in a stunning Palm villa with beach access. Coming to NestMatch soon — register interest now.',
    '["Private Beach","Pool","Garden","Parking","Gym"]',
    '["No parties","No pets"]',
    '["coming-soon","premium","villa","palm","beach-access"]',
    0, 'DEWA split equally',
    '[{"label":"Palm Jumeirah Monorail","type":"tram","walk_time":"6m"}]',
    1, 'shared-villa-room-palm-jumeirah',
    '2026-03-14', '2026-03-14'
);


-- ═══════════════════════════════════════════════════════════════════
-- ROOM OCCUPANCY
-- ═══════════════════════════════════════════════════════════════════

-- list-entry-1: 6 slots (5 occupied, 1 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-1-1', 'list-entry-1', 1, 'roommate-srch-0', 'occupied'),
('ro-1-2', 'list-entry-1', 2, 'roommate-srch-1', 'occupied'),
('ro-1-3', 'list-entry-1', 3, 'roommate-srch-2', 'occupied'),
('ro-1-4', 'list-entry-1', 4, 'roommate-res-new-0', 'occupied'),
('ro-1-5', 'list-entry-1', 5, 'roommate-res-new-1', 'occupied'),
('ro-1-6', 'list-entry-1', 6, NULL, 'available');

-- list-entry-2: 3 slots (1 occupied, 2 available)  [note: mockData shows 4 maxOccupancy, 1 occupied]
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-2-1', 'list-entry-2', 1, 'roommate-res-new-2', 'occupied'),
('ro-2-2', 'list-entry-2', 2, NULL, 'available'),
('ro-2-3', 'list-entry-2', 3, NULL, 'available');

-- list-entry-3: 4 rooms (2 occupied, 2 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-3-1', 'list-entry-3', 1, 'roommate-3', 'occupied'),
('ro-3-2', 'list-entry-3', 2, 'roommate-res-new-3', 'occupied'),
('ro-3-3', 'list-entry-3', 3, NULL, 'available'),
('ro-3-4', 'list-entry-3', 4, NULL, 'available');

-- list-entry-4: 2 slots (1 occupied, 1 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-4-1', 'list-entry-4', 1, 'roommate-6', 'occupied'),
('ro-4-2', 'list-entry-4', 2, NULL, 'available');

-- list-entry-5: 2 slots (0 occupied, 2 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-5-1', 'list-entry-5', 1, NULL, 'available'),
('ro-5-2', 'list-entry-5', 2, NULL, 'available');

-- list-entry-6: 2 slots (1 occupied, 1 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-6-1', 'list-entry-6', 1, 'roommate-7', 'occupied'),
('ro-6-2', 'list-entry-6', 2, NULL, 'available');

-- list-entry-7: 3 slots (2 occupied, 1 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-7-1', 'list-entry-7', 1, 'roommate-8', 'occupied'),
('ro-7-2', 'list-entry-7', 2, 'roommate-9', 'occupied'),
('ro-7-3', 'list-entry-7', 3, NULL, 'available');

-- list-entry-8: 2 slots (1 occupied, 1 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-8-1', 'list-entry-8', 1, 'roommate-4', 'occupied'),
('ro-8-2', 'list-entry-8', 2, NULL, 'available');

-- list-entry-9: 3 slots (3 occupied, 0 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-9-1', 'list-entry-9', 1, 'roommate-10', 'occupied'),
('ro-9-2', 'list-entry-9', 2, 'roommate-srch-3', 'occupied'),
('ro-9-3', 'list-entry-9', 3, 'tier1-2', 'occupied');

-- list-entry-10: 2 slots (1 occupied, 1 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-10-1', 'list-entry-10', 1, 'roommate-5', 'occupied'),
('ro-10-2', 'list-entry-10', 2, NULL, 'available');

-- list-entry-11: 3 slots (1 occupied, 2 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-11-1', 'list-entry-11', 1, 'roommate-1', 'occupied'),
('ro-11-2', 'list-entry-11', 2, NULL, 'available'),
('ro-11-3', 'list-entry-11', 3, NULL, 'available');

-- list-entry-12: 2 slots (1 occupied, 1 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-12-1', 'list-entry-12', 1, 'roommate-2', 'occupied'),
('ro-12-2', 'list-entry-12', 2, NULL, 'available');

-- list-entry-13: 1 slot (0 occupied, 1 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-13-1', 'list-entry-13', 1, NULL, 'available');

-- list-entry-14: 3 slots (0 occupied, 3 available)
INSERT INTO room_occupancy (id, property_id, room_number, tenant_id, status) VALUES
('ro-14-1', 'list-entry-14', 1, NULL, 'available'),
('ro-14-2', 'list-entry-14', 2, NULL, 'available'),
('ro-14-3', 'list-entry-14', 3, NULL, 'available');
PRAGMA foreign_keys = ON;
