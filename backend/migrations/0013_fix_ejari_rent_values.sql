-- Fix annual_rent to reflect ROOM rents (co-living)
-- Not whole-unit rents
-- NestMatch is co-living — tenants rent rooms, not apartments

-- Priya: En-Suite Room A — AED 3,500/month = AED 42,000/year
UPDATE ejari_documents
SET annual_rent = 42000
WHERE id = 'ejari-ahmed-1';

-- Marcus: Standard Room B — AED 3,200/month = AED 38,400/year
UPDATE ejari_documents
SET annual_rent = 38400
WHERE id = 'ejari-ahmed-2';

-- Aisha: En-Suite Room C — AED 3,800/month = AED 45,600/year
UPDATE ejari_documents
SET annual_rent = 45600
WHERE id = 'ejari-ahmed-3';

-- James (expired): Standard Room — AED 3,000/month = AED 36,000/year
UPDATE ejari_documents
SET annual_rent = 36000
WHERE id = 'ejari-ahmed-4';

-- Liam: Standard Room — AED 2,700/month = AED 32,400/year
UPDATE ejari_documents
SET annual_rent = 32400
WHERE id = 'ejari-fatima-1';
