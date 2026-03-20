-- RESET & SYNC DATA STRUCTURE (Law No. 4 Compliant)
DELETE FROM roommate_approvals;
DELETE FROM applications;
DELETE FROM viewing_bookings;
DELETE FROM payments;
DELETE FROM room_occupancy;
DELETE FROM properties;
DELETE FROM users;

-- 1. SEED LANDLORDS & COMPANIES
INSERT INTO users (id, email, name, role, kyc_status, aml_status, compliance_verified, is_uae_pass_verified) VALUES 
('LND_Ahm_001', 'ahmed@nestmatch.ae', 'Ahmed Al Maktoum', 'LANDLORD', 'completed', 'completed', 1, 1),
('LND_Fat_001', 'fatima@nestmatch.ae', 'Fatima Hassan', 'LANDLORD', 'completed', 'completed', 1, 1),
('CMP_Blu_001', 'blue@nestmatch.ae', 'BlueSky Assets Mgt', 'LANDLORD', 'completed', 'completed', 1, 1);

-- 2. SEED LETTING AGENTS
INSERT INTO users (id, email, name, role, rera_license, agency_name, kyc_status, compliance_verified) VALUES 
('LTA_Kha_001', 'khalid@dpg.ae', 'Khalid Al Rashid', 'AGENT', 'BRN-88231', 'Dubai Property Group', 'completed', 1),
('LTA_Tar_001', 'tariq@agents.ae', 'Tariq Mahmood', 'AGENT', 'BRN-11204', 'Mahmood Realty', 'completed', 1),
('LTA_Ele_001', 'elena@agents.ae', 'Elena Popova', 'AGENT', 'BRN-44901', 'Elena Elite Homes', 'completed', 1);

-- 3. SEED PROPERTIES (PRP_ Identifiers)
INSERT INTO properties (
    id, title, landlord_id, agent_id, address, district, 
    makani_number, trakheesi_permit, municipality_permit, max_legal_occupancy, current_occupants, 
    rent_per_room, deposit, total_rooms, available_rooms, is_api_verified, description
) VALUES 
(
    'PRP_Ahm_001', 'Marina Gate T1 - Shared Suite', 'LND_Ahm_001', 'LTA_Kha_001', 'Marina Gate, Tower 1', 'Dubai Marina', 
    '11223 34455', 'DLD-PRM-2026-001', 'MUN-2026-001', 4, 1, 
    2800, 2800, 4, 3, 1, 'Premium shared suite in the heart of Dubai Marina. High floor with palm views.'
),
(
    'PRP_Fat_001', 'JLT Cluster D - Private Room', 'LND_Fat_001', 'LTA_Tar_001', 'Bonaventure Tower, Cluster D', 'JLT', 
    '22334 45566', 'DLD-PRM-2026-002', 'MUN-2026-002', 3, 0, 
    1200, 1200, 3, 3, 1, 'Spacious private room in Cluster D. Close to the metro station and park.'
),
(
    'PRP_Blu_001', 'BlueSky Suite A - Business Bay', 'CMP_Blu_001', 'LTA_Ele_001', 'BlueSky Tower, Business Bay', 'Business Bay', 
    '33445 56677', 'DLD-PRM-2026-003', 'MUN-2026-003', 5, 2, 
    3200, 3200, 5, 3, 1, 'Modern co-living space designed for young professionals in Business Bay.'
);

-- 4. SEED ROOM OCCUPANCY
INSERT INTO room_occupancy (id, property_id, room_number, status) VALUES 
('RM_Ahm_001_1', 'PRP_Ahm_001', 1, 'occupied'),
('RM_Ahm_001_2', 'PRP_Ahm_001', 2, 'available'),
('RM_Ahm_001_3', 'PRP_Ahm_001', 3, 'available'),
('RM_Ahm_001_4', 'PRP_Ahm_001', 4, 'available'),
('RM_Fat_001_1', 'PRP_Fat_001', 1, 'available'),
('RM_Fat_001_2', 'PRP_Fat_001', 2, 'available'),
('RM_Fat_001_3', 'PRP_Fat_001', 3, 'available');
