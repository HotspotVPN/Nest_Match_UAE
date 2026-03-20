-- D1 Migration: CRM Master Data Sync (13 Users, 5 Properties)

-- Clear existing to prevent duplicates during sync
DELETE FROM occupancy_status;
DELETE FROM properties;
DELETE FROM users;

-- 1. Insert All 13 Users
INSERT INTO users (id, full_name, role, auth_tier, is_uae_pass_verified, gcc_score, rera_license) VALUES 
('LND_Ahm_001', 'Ahmed Al Maktoum', 'LANDLORD', 2, 1, 98, NULL),
('LND_Fat_001', 'Fatima Hassan', 'LANDLORD', 2, 1, 94, NULL),
('CMP_Blu_001', 'BlueSky Assets Mgt', 'LANDLORD', 2, 1, 90, NULL),
('LND_Nad_001', 'Nadia Mansour', 'LANDLORD', 1, 0, 85, NULL),
('LTA_Kha_001', 'Khalid Al Rashid', 'AGENT', 2, 1, NULL, 'BRN-88231'),
('LTA_Tar_001', 'Tariq Mahmood', 'AGENT', 2, 1, NULL, 'BRN-11204'),
('LTA_Ele_001', 'Elena Popova', 'AGENT', 2, 1, NULL, 'BRN-44901'),
('T_Priya_001', 'Priya Sharma', 'TENANT', 2, 1, 96, NULL),
('T_Marcus_001', 'Marcus Chen', 'TENANT', 2, 1, 92, NULL),
('T_Elena_001', 'Elena Rodriguez', 'TENANT', 2, 1, 89, NULL),
('T_Aisha_001', 'Aisha Patel', 'TENANT', 2, 1, 97, NULL),
('U_James_001', 'James Morrison', 'TENANT', 2, 1, 85, NULL),
('U_Yuki_001', 'Yuki Tanaka', 'TENANT', 1, 0, NULL, NULL);

-- 2. Insert All 5 Properties
INSERT INTO properties (id, landlord_id, title, district, makani_number, municipality_permit, max_legal_occupancy, current_occupants, rent_per_room, is_api_verified) VALUES 
('PRP_Ahm_001', 'LND_Ahm_001', 'Marina Gate T1', 'Dubai Marina', '11223 34455', 'DLD-PRM-2026-001', 4, 2, 2800, 1),
('PRP_Ahm_002', 'LND_Ahm_001', 'Burj Vista Executive', 'Downtown Dubai', '55667 88990', 'DLD-PRM-2026-002', 3, 1, 3500, 1),
('PRP_Fat_001', 'LND_Fat_001', 'JLT Cluster D', 'JLT', '22334 45566', 'DLD-PRM-2026-003', 3, 2, 1200, 1),
('PRP_Fat_002', 'LND_Fat_001', 'Executive Towers Shared', 'Business Bay', '99887 66554', 'DLD-PRM-2026-004', 2, 2, 1800, 1),
('CMP_Blu_001_A', 'CMP_Blu_001', 'BlueSky Suite A', 'Business Bay', '33445 56677', 'DLD-PRM-2026-005', 4, 3, 3200, 1);

-- 3. Map Occupancy Grid for Verified Tenants
INSERT INTO occupancy_status (property_id, room_number, tenant_id, status) VALUES
('PRP_Ahm_001', 1, 'T_Priya_001', 'occupied'),
('PRP_Ahm_001', 2, 'T_Marcus_001', 'occupied'),
('PRP_Ahm_001', 3, NULL, 'available'),
('PRP_Ahm_001', 4, NULL, 'available'),
('PRP_Ahm_002', 1, 'T_Elena_001', 'occupied'),
('PRP_Fat_001', 1, 'T_Aisha_001', 'occupied');
