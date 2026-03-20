-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK for Migration 0014: ID Format Migration
-- WARNING: Does NOT restore deleted non-canonical users/properties.
-- ═══════════════════════════════════════════════════════════════════

PRAGMA foreign_keys = OFF;

UPDATE users SET id = 'landlord-1' WHERE id = 'L001';
UPDATE users SET id = 'landlord-2' WHERE id = 'L002';
UPDATE users SET id = 'agent-1' WHERE id = 'A001';
UPDATE users SET id = 'agent-2' WHERE id = 'A002';
UPDATE users SET id = 'roommate-1' WHERE id = 'S001';
UPDATE users SET id = 'roommate-2' WHERE id = 'S002';
UPDATE users SET id = 'roommate-7' WHERE id = 'S003';
UPDATE users SET id = 'roommate-6' WHERE id = 'S004';
UPDATE users SET id = 'tier0-1' WHERE id = 'S005';
UPDATE users SET id = 'tier0-2' WHERE id = 'S006';
UPDATE users SET id = 'tier0-3' WHERE id = 'S007';
UPDATE users SET id = 'tier1-1' WHERE id = 'S008';
UPDATE users SET id = 'tier1-2' WHERE id = 'S009';
UPDATE users SET id = 'admin-1' WHERE id = 'ADM001';
UPDATE users SET id = 'admin-3' WHERE id = 'ADM002';

UPDATE properties SET id = 'list-entry-1' WHERE id = 'P001';
UPDATE properties SET id = 'list-entry-2' WHERE id = 'P002';
UPDATE properties SET id = 'list-entry-3' WHERE id = 'P003';
UPDATE properties SET id = 'list-entry-4' WHERE id = 'P004';
UPDATE properties SET id = 'list-entry-5' WHERE id = 'P005';
UPDATE properties SET id = 'list-entry-6' WHERE id = 'P006';
UPDATE properties SET id = 'list-entry-7' WHERE id = 'P007';
UPDATE properties SET id = 'list-entry-8' WHERE id = 'P008';
UPDATE properties SET id = 'list-entry-9' WHERE id = 'P009';
UPDATE properties SET id = 'list-entry-10' WHERE id = 'P010';
UPDATE properties SET id = 'list-entry-11' WHERE id = 'P011';
UPDATE properties SET id = 'list-entry-12' WHERE id = 'P012';

UPDATE properties SET landlord_id = 'landlord-1' WHERE landlord_id = 'L001';
UPDATE properties SET landlord_id = 'landlord-2' WHERE landlord_id = 'L002';
UPDATE properties SET agent_id = 'agent-1' WHERE agent_id = 'A001';
UPDATE properties SET agent_id = 'agent-2' WHERE agent_id = 'A002';

UPDATE users SET current_property_id = 'list-entry-11' WHERE current_property_id = 'P011';
UPDATE users SET current_property_id = 'list-entry-12' WHERE current_property_id = 'P012';
UPDATE users SET current_property_id = 'list-entry-3' WHERE current_property_id = 'P003';
UPDATE users SET current_property_id = 'list-entry-8' WHERE current_property_id = 'P008';
UPDATE users SET current_property_id = 'list-entry-10' WHERE current_property_id = 'P010';
UPDATE users SET managed_by_agent_id = 'agent-1' WHERE managed_by_agent_id = 'A001';
UPDATE users SET managed_by_agent_id = 'agent-2' WHERE managed_by_agent_id = 'A002';

UPDATE room_occupancy SET property_id = 'list-entry-1' WHERE property_id = 'P001';
UPDATE room_occupancy SET property_id = 'list-entry-2' WHERE property_id = 'P002';
UPDATE room_occupancy SET property_id = 'list-entry-3' WHERE property_id = 'P003';
UPDATE room_occupancy SET property_id = 'list-entry-4' WHERE property_id = 'P004';
UPDATE room_occupancy SET property_id = 'list-entry-5' WHERE property_id = 'P005';
UPDATE room_occupancy SET property_id = 'list-entry-6' WHERE property_id = 'P006';
UPDATE room_occupancy SET property_id = 'list-entry-7' WHERE property_id = 'P007';
UPDATE room_occupancy SET property_id = 'list-entry-8' WHERE property_id = 'P008';
UPDATE room_occupancy SET property_id = 'list-entry-9' WHERE property_id = 'P009';
UPDATE room_occupancy SET property_id = 'list-entry-10' WHERE property_id = 'P010';
UPDATE room_occupancy SET property_id = 'list-entry-11' WHERE property_id = 'P011';
UPDATE room_occupancy SET property_id = 'list-entry-12' WHERE property_id = 'P012';
UPDATE room_occupancy SET tenant_id = 'roommate-1' WHERE tenant_id = 'S001';
UPDATE room_occupancy SET tenant_id = 'roommate-2' WHERE tenant_id = 'S002';
UPDATE room_occupancy SET tenant_id = 'roommate-7' WHERE tenant_id = 'S003';
UPDATE room_occupancy SET tenant_id = 'roommate-6' WHERE tenant_id = 'S004';
UPDATE room_occupancy SET tenant_id = 'tier1-2' WHERE tenant_id = 'S009';

UPDATE viewing_bookings SET tenant_id = 'roommate-1' WHERE tenant_id = 'S001';
UPDATE viewing_bookings SET tenant_id = 'roommate-7' WHERE tenant_id = 'S003';
UPDATE viewing_bookings SET tenant_id = 'tier0-2' WHERE tenant_id = 'S006';
UPDATE viewing_bookings SET landlord_id = 'landlord-1' WHERE landlord_id = 'L001';
UPDATE viewing_bookings SET landlord_id = 'landlord-2' WHERE landlord_id = 'L002';
UPDATE viewing_bookings SET property_id = 'list-entry-8' WHERE property_id = 'P008';
UPDATE viewing_bookings SET property_id = 'list-entry-10' WHERE property_id = 'P010';
UPDATE viewing_bookings SET property_id = 'list-entry-11' WHERE property_id = 'P011';
UPDATE viewing_bookings SET property_id = 'list-entry-12' WHERE property_id = 'P012';

UPDATE agreement_signatures SET signer_id = 'landlord-1' WHERE signer_id = 'L001';
UPDATE agreement_signatures SET signer_id = 'roommate-1' WHERE signer_id = 'S001';
UPDATE agreement_signatures SET signer_id = 'roommate-7' WHERE signer_id = 'S003';

UPDATE inbox_messages SET user_id = 'roommate-1' WHERE user_id = 'S001';
UPDATE inbox_messages SET user_id = 'roommate-7' WHERE user_id = 'S003';
UPDATE inbox_messages SET user_id = 'landlord-1' WHERE user_id = 'L001';
UPDATE inbox_messages SET user_id = 'agent-1' WHERE user_id = 'A001';
UPDATE inbox_messages SET user_id = 'tier1-1' WHERE user_id = 'S008';
UPDATE inbox_messages SET user_id = 'admin-1' WHERE user_id = 'ADM001';
UPDATE inbox_messages SET sender_id = 'landlord-1' WHERE sender_id = 'L001';
UPDATE inbox_messages SET sender_id = 'landlord-2' WHERE sender_id = 'L002';
UPDATE inbox_messages SET sender_id = 'roommate-1' WHERE sender_id = 'S001';
UPDATE inbox_messages SET sender_id = 'roommate-2' WHERE sender_id = 'S002';
UPDATE inbox_messages SET sender_id = 'roommate-7' WHERE sender_id = 'S003';
UPDATE inbox_messages SET sender_id = 'tier0-1' WHERE sender_id = 'S005';
UPDATE inbox_messages SET sender_id = 'tier1-1' WHERE sender_id = 'S008';
UPDATE inbox_messages SET property_id = 'list-entry-8' WHERE property_id = 'P008';
UPDATE inbox_messages SET property_id = 'list-entry-10' WHERE property_id = 'P010';
UPDATE inbox_messages SET property_id = 'list-entry-11' WHERE property_id = 'P011';
UPDATE inbox_messages SET property_id = 'list-entry-12' WHERE property_id = 'P012';

UPDATE ejari_documents SET uploaded_by = 'landlord-1' WHERE uploaded_by = 'L001';
UPDATE ejari_documents SET uploaded_by = 'landlord-2' WHERE uploaded_by = 'L002';
UPDATE ejari_documents SET tenant_user_id = 'roommate-1' WHERE tenant_user_id = 'S001';
UPDATE ejari_documents SET tenant_user_id = 'roommate-2' WHERE tenant_user_id = 'S002';
UPDATE ejari_documents SET tenant_user_id = 'roommate-7' WHERE tenant_user_id = 'S003';
UPDATE ejari_documents SET tenant_user_id = 'roommate-6' WHERE tenant_user_id = 'S004';
UPDATE ejari_documents SET tenant_user_id = 'tier1-1' WHERE tenant_user_id = 'S008';
UPDATE ejari_documents SET property_id = 'list-entry-8' WHERE property_id = 'P008';
UPDATE ejari_documents SET property_id = 'list-entry-9' WHERE property_id = 'P009';
UPDATE ejari_documents SET property_id = 'list-entry-10' WHERE property_id = 'P010';
UPDATE ejari_documents SET property_id = 'list-entry-11' WHERE property_id = 'P011';

UPDATE properties SET current_occupants = (
  SELECT COUNT(*) FROM room_occupancy
  WHERE room_occupancy.property_id = properties.id
  AND room_occupancy.status = 'occupied'
);

PRAGMA foreign_keys = ON;
