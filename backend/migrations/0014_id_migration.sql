-- ═══════════════════════════════════════════════════════════════════
-- Migration 0014: ID Format Migration (v2.13.0)
-- NestMatch UAE — 20 March 2026
--
-- Purpose: Migrate all user and property IDs from legacy format
--          (landlord-1, roommate-7, list-entry-1) to clean role-prefixed
--          format (L001, S003, P002) for consistency, sortability, and
--          presentation readiness in legal documents.
--
-- Scope:
--   - Delete 15 non-canonical users + 2 non-canonical properties
--   - Rename 15 canonical user IDs
--   - Rename 12 canonical property IDs
--   - Update all FK references across 6 data-bearing tables
--
-- Approved by: Product Director (20 March 2026)
-- ═══════════════════════════════════════════════════════════════════

PRAGMA foreign_keys = OFF;

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 1: DELETE NON-CANONICAL DATA
-- ═══════════════════════════════════════════════════════════════════

DELETE FROM room_occupancy WHERE tenant_id IN (
  'roommate-3', 'roommate-4', 'roommate-5',
  'roommate-8', 'roommate-9', 'roommate-10',
  'roommate-srch-0', 'roommate-srch-1', 'roommate-srch-2', 'roommate-srch-3',
  'roommate-res-new-0', 'roommate-res-new-1', 'roommate-res-new-2', 'roommate-res-new-3'
);

DELETE FROM room_occupancy WHERE property_id IN ('list-entry-13', 'list-entry-14');

DELETE FROM properties WHERE id IN ('list-entry-13', 'list-entry-14');

DELETE FROM users WHERE id IN (
  'landlord-3', 'landlord-4', 'agent-3',
  'roommate-3', 'roommate-4', 'roommate-5',
  'roommate-8', 'roommate-9', 'roommate-10',
  'roommate-srch-0', 'roommate-srch-1', 'roommate-srch-2', 'roommate-srch-3',
  'roommate-res-new-0', 'roommate-res-new-1', 'roommate-res-new-2', 'roommate-res-new-3'
);

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 2: MIGRATE USER IDs (primary keys first)
-- ═══════════════════════════════════════════════════════════════════

UPDATE users SET id = 'L001' WHERE id = 'landlord-1';
UPDATE users SET id = 'L002' WHERE id = 'landlord-2';
UPDATE users SET id = 'A001' WHERE id = 'agent-1';
UPDATE users SET id = 'A002' WHERE id = 'agent-2';
UPDATE users SET id = 'S001' WHERE id = 'roommate-1';
UPDATE users SET id = 'S002' WHERE id = 'roommate-2';
UPDATE users SET id = 'S003' WHERE id = 'roommate-7';
UPDATE users SET id = 'S004' WHERE id = 'roommate-6';
UPDATE users SET id = 'S005' WHERE id = 'tier0-1';
UPDATE users SET id = 'S006' WHERE id = 'tier0-2';
UPDATE users SET id = 'S007' WHERE id = 'tier0-3';
UPDATE users SET id = 'S008' WHERE id = 'tier1-1';
UPDATE users SET id = 'S009' WHERE id = 'tier1-2';
UPDATE users SET id = 'ADM001' WHERE id = 'admin-1';
UPDATE users SET id = 'ADM002' WHERE id = 'admin-3';

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 3: MIGRATE PROPERTY IDs (primary keys)
-- ═══════════════════════════════════════════════════════════════════

UPDATE properties SET id = 'P001' WHERE id = 'list-entry-1';
UPDATE properties SET id = 'P002' WHERE id = 'list-entry-2';
UPDATE properties SET id = 'P003' WHERE id = 'list-entry-3';
UPDATE properties SET id = 'P004' WHERE id = 'list-entry-4';
UPDATE properties SET id = 'P005' WHERE id = 'list-entry-5';
UPDATE properties SET id = 'P006' WHERE id = 'list-entry-6';
UPDATE properties SET id = 'P007' WHERE id = 'list-entry-7';
UPDATE properties SET id = 'P008' WHERE id = 'list-entry-8';
UPDATE properties SET id = 'P009' WHERE id = 'list-entry-9';
UPDATE properties SET id = 'P010' WHERE id = 'list-entry-10';
UPDATE properties SET id = 'P011' WHERE id = 'list-entry-11';
UPDATE properties SET id = 'P012' WHERE id = 'list-entry-12';

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 4: UPDATE FK REFERENCES — properties table
-- ═══════════════════════════════════════════════════════════════════

UPDATE properties SET landlord_id = 'L001' WHERE landlord_id = 'landlord-1';
UPDATE properties SET landlord_id = 'L002' WHERE landlord_id = 'landlord-2';
UPDATE properties SET agent_id = 'A001' WHERE agent_id = 'agent-1';
UPDATE properties SET agent_id = 'A002' WHERE agent_id = 'agent-2';

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 5: UPDATE FK REFERENCES — users table (self-references)
-- ═══════════════════════════════════════════════════════════════════

UPDATE users SET current_property_id = 'P011' WHERE current_property_id = 'list-entry-11';
UPDATE users SET current_property_id = 'P012' WHERE current_property_id = 'list-entry-12';
UPDATE users SET current_property_id = 'P003' WHERE current_property_id = 'list-entry-3';
UPDATE users SET current_property_id = 'P008' WHERE current_property_id = 'list-entry-8';
UPDATE users SET current_property_id = 'P010' WHERE current_property_id = 'list-entry-10';
UPDATE users SET managed_by_agent_id = 'A001' WHERE managed_by_agent_id = 'agent-1';
UPDATE users SET managed_by_agent_id = 'A002' WHERE managed_by_agent_id = 'agent-2';

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 6: UPDATE FK REFERENCES — room_occupancy
-- ═══════════════════════════════════════════════════════════════════

UPDATE room_occupancy SET property_id = 'P001' WHERE property_id = 'list-entry-1';
UPDATE room_occupancy SET property_id = 'P002' WHERE property_id = 'list-entry-2';
UPDATE room_occupancy SET property_id = 'P003' WHERE property_id = 'list-entry-3';
UPDATE room_occupancy SET property_id = 'P004' WHERE property_id = 'list-entry-4';
UPDATE room_occupancy SET property_id = 'P005' WHERE property_id = 'list-entry-5';
UPDATE room_occupancy SET property_id = 'P006' WHERE property_id = 'list-entry-6';
UPDATE room_occupancy SET property_id = 'P007' WHERE property_id = 'list-entry-7';
UPDATE room_occupancy SET property_id = 'P008' WHERE property_id = 'list-entry-8';
UPDATE room_occupancy SET property_id = 'P009' WHERE property_id = 'list-entry-9';
UPDATE room_occupancy SET property_id = 'P010' WHERE property_id = 'list-entry-10';
UPDATE room_occupancy SET property_id = 'P011' WHERE property_id = 'list-entry-11';
UPDATE room_occupancy SET property_id = 'P012' WHERE property_id = 'list-entry-12';
UPDATE room_occupancy SET tenant_id = 'S001' WHERE tenant_id = 'roommate-1';
UPDATE room_occupancy SET tenant_id = 'S002' WHERE tenant_id = 'roommate-2';
UPDATE room_occupancy SET tenant_id = 'S003' WHERE tenant_id = 'roommate-7';
UPDATE room_occupancy SET tenant_id = 'S004' WHERE tenant_id = 'roommate-6';
UPDATE room_occupancy SET tenant_id = 'S009' WHERE tenant_id = 'tier1-2';

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 7: UPDATE FK REFERENCES — viewing_bookings
-- ═══════════════════════════════════════════════════════════════════

UPDATE viewing_bookings SET tenant_id = 'S001' WHERE tenant_id = 'roommate-1';
UPDATE viewing_bookings SET tenant_id = 'S003' WHERE tenant_id = 'roommate-7';
UPDATE viewing_bookings SET tenant_id = 'S006' WHERE tenant_id = 'tier0-2';
UPDATE viewing_bookings SET landlord_id = 'L001' WHERE landlord_id = 'landlord-1';
UPDATE viewing_bookings SET landlord_id = 'L002' WHERE landlord_id = 'landlord-2';
UPDATE viewing_bookings SET property_id = 'P008' WHERE property_id = 'list-entry-8';
UPDATE viewing_bookings SET property_id = 'P010' WHERE property_id = 'list-entry-10';
UPDATE viewing_bookings SET property_id = 'P011' WHERE property_id = 'list-entry-11';
UPDATE viewing_bookings SET property_id = 'P012' WHERE property_id = 'list-entry-12';

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 8: UPDATE FK REFERENCES — agreement_signatures
-- ═══════════════════════════════════════════════════════════════════

UPDATE agreement_signatures SET signer_id = 'L001' WHERE signer_id = 'landlord-1';
UPDATE agreement_signatures SET signer_id = 'S001' WHERE signer_id = 'roommate-1';
UPDATE agreement_signatures SET signer_id = 'S003' WHERE signer_id = 'roommate-7';

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 9: UPDATE FK REFERENCES — inbox_messages
-- ═══════════════════════════════════════════════════════════════════

UPDATE inbox_messages SET user_id = 'S001' WHERE user_id = 'roommate-1';
UPDATE inbox_messages SET user_id = 'S003' WHERE user_id = 'roommate-7';
UPDATE inbox_messages SET user_id = 'L001' WHERE user_id = 'landlord-1';
UPDATE inbox_messages SET user_id = 'A001' WHERE user_id = 'agent-1';
UPDATE inbox_messages SET user_id = 'S008' WHERE user_id = 'tier1-1';
UPDATE inbox_messages SET user_id = 'ADM001' WHERE user_id = 'admin-1';
UPDATE inbox_messages SET sender_id = 'L001' WHERE sender_id = 'landlord-1';
UPDATE inbox_messages SET sender_id = 'L002' WHERE sender_id = 'landlord-2';
UPDATE inbox_messages SET sender_id = 'S001' WHERE sender_id = 'roommate-1';
UPDATE inbox_messages SET sender_id = 'S002' WHERE sender_id = 'roommate-2';
UPDATE inbox_messages SET sender_id = 'S003' WHERE sender_id = 'roommate-7';
UPDATE inbox_messages SET sender_id = 'S005' WHERE sender_id = 'tier0-1';
UPDATE inbox_messages SET sender_id = 'S008' WHERE sender_id = 'tier1-1';
UPDATE inbox_messages SET property_id = 'P008' WHERE property_id = 'list-entry-8';
UPDATE inbox_messages SET property_id = 'P010' WHERE property_id = 'list-entry-10';
UPDATE inbox_messages SET property_id = 'P011' WHERE property_id = 'list-entry-11';
UPDATE inbox_messages SET property_id = 'P012' WHERE property_id = 'list-entry-12';

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 10: UPDATE FK REFERENCES — ejari_documents
-- ═══════════════════════════════════════════════════════════════════

UPDATE ejari_documents SET uploaded_by = 'L001' WHERE uploaded_by = 'landlord-1';
UPDATE ejari_documents SET uploaded_by = 'L002' WHERE uploaded_by = 'landlord-2';
UPDATE ejari_documents SET tenant_user_id = 'S001' WHERE tenant_user_id = 'roommate-1';
UPDATE ejari_documents SET tenant_user_id = 'S002' WHERE tenant_user_id = 'roommate-2';
UPDATE ejari_documents SET tenant_user_id = 'S003' WHERE tenant_user_id = 'roommate-7';
UPDATE ejari_documents SET tenant_user_id = 'S004' WHERE tenant_user_id = 'roommate-6';
UPDATE ejari_documents SET tenant_user_id = 'S008' WHERE tenant_user_id = 'tier1-1';
UPDATE ejari_documents SET property_id = 'P008' WHERE property_id = 'list-entry-8';
UPDATE ejari_documents SET property_id = 'P009' WHERE property_id = 'list-entry-9';
UPDATE ejari_documents SET property_id = 'P010' WHERE property_id = 'list-entry-10';
UPDATE ejari_documents SET property_id = 'P011' WHERE property_id = 'list-entry-11';

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 11: FIX OCCUPANCY COUNTS
-- ═══════════════════════════════════════════════════════════════════

UPDATE properties SET current_occupants = (
  SELECT COUNT(*) FROM room_occupancy
  WHERE room_occupancy.property_id = properties.id
  AND room_occupancy.status = 'occupied'
);

PRAGMA foreign_keys = ON;
