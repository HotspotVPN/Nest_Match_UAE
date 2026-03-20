-- migrations/0002_seed.sql

-- Insert Mock Users
INSERT INTO users (id, email, password_hash, name, role, is_uae_pass_verified, gcc_score, compliance_verified) VALUES
('u1', 'ahmed@landlord.ae', 'pass123', 'Ahmed Al Maktoum', 'LANDLORD', 1, 95, 1),
('u2', 'sarah@tenant.ae', 'pass123', 'Sarah Jenkins', 'SEARCHING_TENANT', 1, 88, 1);

-- Insert Mock Properties
INSERT INTO properties (
    id, landlord_id, title, address, district, 
    makani_number, municipality_permit, max_legal_occupancy, 
    rent_per_room, deposit, total_rooms, available_rooms, 
    is_api_verified, is_active
) VALUES
('p1', 'u1', 'Premium Marina Shared Suite', 'Marina Gate Tower 1', 'Dubai Marina', '1234567890', 'DLD-SH-001', 4, 4500, 2000, 4, 2, 1, 1),
('p2', 'u1', 'Downtown Executive Room', 'Burj Vista', 'Downtown Dubai', '0987654321', 'DLD-SH-002', 3, 5500, 2500, 3, 1, 1, 1);
