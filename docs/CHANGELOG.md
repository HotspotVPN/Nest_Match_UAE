# Changelog — NestMatch UAE

All notable changes to this project are documented here.
Format: ## [version] — date · what changed · why

## [2.1.0] — 2026-03-16 · DLD Digital Signing + Analytics

### Session 4: DocuSign-style viewing agreements + analytics dashboard

### Added
- Expanded ViewingStatus: AGREEMENT_SENT, AGENT_SIGNED, FULLY_SIGNED,
  NO_SHOW_TENANT, NO_SHOW_LANDLORD
- DigitalSignature and ViewingAgreementRecord types
- ViewingAgreementModal: 3-screen flow (generate DLD form → signing
  tracker with 5-step progress → HTML5 canvas signature pad)
- Viewing outcome tracking on FULLY_SIGNED viewings
- ViewingAnalyticsPage (/analytics): stat cards, status distribution,
  district demand, agreement log table, government data section
- LeaseHandoffCard: download agreement, find RERA broker, continue chat
- Analytics nav link for operations + compliance admins
- 3 mock agreements (fully_signed, agent_signed, sent) in demo data

### Removed
- ContractManagerPage.tsx — DELETED (replaced by LeaseHandoffCard)
- /contracts route removed from App.tsx

### Changed
- ResidingDashboardPage: removed blind matching, shows real applicant
  names/avatars with full profile visibility
- ViewingsPage: added agreement-stage UI, outcome tracking, no-show picker

---

## [2.0.0] — 2026-03-16 · Investor Demo Release

### Sessions 1–3 complete. Production build on Vercel.

### Added
- Smart API fallback layer (src/services/api.ts): health-checks
  backend with 3s timeout, caches result 30s, falls back to
  mock data silently if Workers are down
- 18 API endpoints across Properties, Users, Auth, Viewings,
  Ratings, Payments categories
- Landlord Dashboard (/dashboard): summary cards, portfolio grid,
  viewing requests table with Accept/Decline/Complete
- GCC Score circular SVG progress ring on roommate profiles
- Roommate Match Score — Jaccard similarity on lifestyle_tags,
  personality_traits, hobbies
- District chip filter UI on Browse page (12 districts)
- Dual-handle budget range slider (AED 500–15,000)
- Amenity multi-select chips, transport line filters
- Sort: Top Rated, Price Low/High, Newest, Available First
- Grid + List view toggle on Browse
- Occupancy bar per listing card (colour-coded)
- Transport chips (metro line, bus) on listing cards
- Tier badge display (Tier 1/2) on profiles
- RERA license display on landlord/agent profiles
- Coloured lifestyle tags on roommate profiles
- Location overview section with lat/lng coordinates
- .env.production created for Cloudflare Workers URL

### Removed — permanent, do not reintroduce
- src/services/mockStripeService.ts — DELETED
  Reason: no DIFC/CBUAE licence for payment processing
- src/pages/ContractManagerPage.tsx — DELETED
  Reason: not a RERA-licensed broker, cannot draft leases
- /contract route — REMOVED from App.tsx
- DirectDebitMandate interface — REMOVED from types
- BankDetails on User interface — REMOVED
- Finance Admin (admin-2) quick-login — REMOVED
- "50 AED Platform Abuse Penalty" — ALL references removed
- Stripe card elements, escrow displays, penalty captures — ALL removed
- "Proceed to Lease Setup" button — REMOVED

### Fixed
- All mock data IDs standardised to list-entry-X format
- Viewing bookings, payments, chat channels, ratings all
  use consistent IDs
- User→Property links corrected for all 5 roommate personas
- Duplicate placements removed from list-entry-3
- Missing helper functions added: getUserById, getListingById,
  getViewingsForUser, getChatChannelsForUser, getMessagesForChannel,
  getPaymentsForUser, getPaymentsForListing, getMaintenanceForListing,
  getRentLedgerForTenant
- ViewingsPanel rewritten to use correct ViewingBooking fields
- AccountingPage: fixed missing import and tds_reference errors
- TypeScript: zero errors across entire codebase

### Infrastructure
- Production URL: https://nest-match-uae.vercel.app
- Backend URL: https://nest-match-uae.pushkar-nagela.workers.dev
- Cloudflare D1: nestmatch-uae database
- Cloudflare R2: nestmatch-property-images, nestmatch-kyc-documents,
  nestmatch-avatars

---

## [1.5.3] — 2026-03 · UK Styling + Mock Data Switch

- Applied UK-style design patterns to UAE version
- Switched to mock data for demo stability

## [1.5.2] — 2026-03 · D1 Database Instantiation

- Cloudflare D1 database setup and migration system
- Initial schema: users, properties, viewing_bookings, ratings

## [1.0.0] — 2026-03 · Initial UAE Build

- Forked and adapted from NestMatch UK
- UAE-specific type system: Makani, Trakheesi, Ejari, UAE PASS
- 12+ Dubai property listings across 15 districts
- Three admin personas: compliance, finance, operations
- Compliance dashboard, Customer CRM, Treasury dashboard
- UAE PASS OAuth flow (mocked)
- Dubai Law No. 4 of 2026 shared housing compliance layer
