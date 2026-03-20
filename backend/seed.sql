-- backend/seed.sql

-- ─── USERS ───────────────────────────────────────────────────
-- Admin Users
INSERT INTO users (id, email, password_hash, name, role, is_uae_pass_verified, compliance_verified) VALUES
('admin-1', 'compliance@nestmatch.ae', 'pass123', 'Compliance Admin', 'COMPLIANCE_ADMIN', 1, 1),
('admin-2', 'finance@nestmatch.ae', 'pass123', 'Finance Admin', 'FINANCE_ADMIN', 1, 1),
('admin-3', 'operations@nestmatch.ae', 'pass123', 'Operations Admin', 'OPERATIONS_ADMIN', 1, 1);

-- Landlords & Agents
INSERT INTO users (id, email, password_hash, name, role, is_uae_pass_verified, bio, phone, compliance_verified, rera_license, agency_name) VALUES
('landlord-1', 'ahmed.almaktoum@nestmatch.ae', 'pass123', 'Ahmed Al Maktoum', 'LANDLORD', 1, 'Experienced property investor managing 8 units across Dubai Marina, JBR, and Downtown.', '+971 50 123 4567', 1, NULL, NULL),
('landlord-2', 'fatima.hassan@nestmatch.ae', 'pass123', 'Fatima Hassan', 'LANDLORD', 1, 'Property owner in JLT and Business Bay.', '+971 55 234 5678', 1, NULL, NULL),
('agent-1', 'khalid@dubaipropertygroup.ae', 'pass123', 'Khalid Al Rashid', 'AGENT', 1, 'RERA-certified property broker with 6 years managing shared housing portfolios in Dubai.', '+971 56 345 6789', 1, 'RERA-BRN-2025-12345', 'Dubai Property Group');

-- Roommates
INSERT INTO users (id, email, password_hash, name, role, is_uae_pass_verified, bio, phone, gcc_score, resident_role, lifestyle_tags, personality_traits, hobbies) VALUES
('roommate-1', 'priya.sharma@email.com', 'pass123', 'Priya Sharma', 'RESIDING_TENANT', 1, 'UX Designer at a fintech startup in DIFC.', '+971 52 456 7890', 85, 'residing', '["yoga", "gym-goer", "runner", "swimmer"]', '["extroverted", "social", "organised", "early-riser"]', '["cooking", "interior-design", "reading"]'),
('roommate-2', 'marcus.chen@email.com', 'pass123', 'Marcus Chen', 'RESIDING_TENANT', 1, 'Software engineer working remotely for a climate tech company in Singapore.', '+971 54 567 8901', 70, 'residing', '["gym-goer", "cyclist", "rock-climbing"]', '["introverted", "curious", "analytical", "night-owl"]', '["board-games", "cycling", "coding"]'),
('roommate-3', 'elena.rodriguez@email.com', 'pass123', 'Elena Rodriguez', 'RESIDING_TENANT', 1, 'Marketing coordinator at a sustainability startup in Dubai Design District.', '+971 58 678 9012', 30, 'residing', '["walking", "yoga", "dance"]', '["extroverted", "creative", "traveller", "empathetic"]', '["coffee-tasting", "photography"]'),
('roommate-6', 'james.morrison@email.com', 'pass123', 'James Morrison', 'SEARCHING_TENANT', 1, 'Data analyst relocating from London to Dubai.', '+971 55 901 2345', 0, 'searching', '["cyclist", "swimming", "running"]', '["introverted", "analytical", "reader", "calm"]', '["cycling", "reading"]');

-- ─── PROPERTIES ──────────────────────────────────────────────
INSERT INTO properties (
    id, landlord_id, agent_id, title, address, district, 
    makani_number, municipality_permit, max_legal_occupancy, current_occupants,
    rent_per_room, deposit, total_rooms, available_rooms, 
    is_api_verified, is_active, amenities, house_rules, description
) VALUES
('listing-1', 'landlord-1', 'agent-1', 'Premium Marina Shared Suite', 'Marina Gate Tower 1', 'Dubai Marina', '1122334455', 'DLD-SH-101', 4, 2, 4500, 2000, 4, 2, 1, 1, '["Pool", "Gym", "Ocean View", "En-suite"]', '["No smoking", "No pets"]', 'Ultra-premium Marina living.'),
('listing-2', 'landlord-2', NULL, 'Luxury JLT Private Room', 'Cluster D, JLT', 'JLT', '2233445566', 'DLD-SH-102', 3, 2, 3200, 3200, 3, 1, 1, 1, '["Lake View", "Gym", "Premium Furnishings"]', '["No smoking"]', 'Luxury apartment with lake views.'),
('listing-3', 'landlord-1', 'agent-1', 'Business Bay Executive Room', 'Executive Towers', 'Business Bay', '3344556677', 'DLD-SH-103', 2, 1, 2800, 2800, 2, 1, 1, 1, '["Canal View", "Pool", "Gym"]', '["Professionals only"]', 'High-floor private room in the heart of Business Bay.');

-- ─── VIEWING BOOKINGS ────────────────────────────────────────
INSERT INTO viewing_bookings (id, property_id, tenant_id, landlord_id, scheduled_date, time_slot, status, hold_amount, stripe_hold_id) VALUES
('view-1', 'listing-1', 'roommate-6', 'landlord-1', '2026-03-20', '2:00 PM - 2:30 PM', 'CONFIRMED', 5000, 'pi_mock_001'),
('view-2', 'listing-3', 'roommate-3', 'landlord-1', '2026-03-22', '10:00 AM - 10:30 AM', 'PENDING', 5000, 'pi_mock_002');

-- ─── RATINGS ────────────────────────────────────────────────
INSERT INTO property_ratings (id, property_id, tenant_id, ac_quality, amenities, maintenance_speed) VALUES
('pr-1', 'listing-1', 'roommate-1', 5, 5, 4),
('pr-2', 'listing-1', 'roommate-2', 4, 5, 5);
