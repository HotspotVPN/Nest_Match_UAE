# Changelog — NestMatch UAE

All notable changes to this project are documented here.
Format: ## [version] — date · what changed · why

## [2.4.0] — 2026-03-16 · D1 State Machines, OAuth, KYC, Occupancy, GCC Score

### Session 6 (Backend): State machine tables, new API routes, frontend wiring

### Added
- D1 migration 0004_state_machines.sql: 7 new tables (oauth_tokens,
  kyc_documents, occupancy_events, viewing_agreements, agreement_signatures,
  tenancy_events, verification_events) with CHECK constraints and indexes
- POST /api/auth/google — Google OAuth callback (mock), creates explorer users
- POST /api/auth/uae-pass — UAE PASS OAuth callback, sets gold tier with
  verification_events audit trail (only path to tier2_uae_pass)
- POST /api/kyc/upload — Multipart KYC doc upload to R2 KYC_DOCS bucket,
  auto-upgrades tier1_unverified to tier0_passport on passport+visa upload,
  writes verification_events
- GET /api/kyc/my-documents — Returns user's KYC docs (r2_key excluded)
- PATCH /api/kyc/:id/review — Compliance admin approve/reject
- PATCH /api/properties/:id/rooms/:roomNumber — Landlord/agent room state
  changes (approve, reject, remove, add/remove room) with occupancy_events
  audit log, occupancy bounds enforced (0 to maxLegalOccupancy)
- POST /api/properties/:id/rooms/:roomNumber/notice — Tenant move-out notice
  with 30-day minimum validation, writes tenancy_events + occupancy_events
- POST /api/properties/:id/rooms/:roomNumber/move-out — Landlord confirms
  move-out, decrements occupants, writes tenancy_events + occupancy_events
- POST /api/users/:id/recalculate-gcc — GCC score formula: +20 per tenancy,
  +10 if rating >= 4.5, +5 per completed viewing, -10 per no-show,
  -20 per early termination, capped 0-100
- Frontend api.ts: uploadKycDocument, getMyKycDocuments, updateRoomOccupancy,
  giveMoveOutNotice, recalculateGcc — all with mock fallbacks

### Changed
- PATCH /api/viewings/:id/accept now creates viewing_agreements record with
  status 'sent' and generated DLD agreement number
- PassportKycModal wired to api.uploadKycDocument() with loading state
- ResidingDashboardPage Approve/Reject buttons wired to
  api.updateRoomOccupancy() with fallback
- backend/src/index.ts: mounted 5 new route modules (auth-google,
  auth-uae-pass, kyc, occupancy via /api/properties, gcc-score)

---

## [2.3.0] — 2026-03-16 · Navbar, Tier Labels, CRM, Supply-Side

### Sessions 6-7: Navbar overhaul, tier naming, CRM restructure, public pages

### Added
- Supply-side cards on HowItWorksPage: Individual Landlord, RERA Agent, Property Company
- CRM page restructured into 6 tabs: Landlords, RERA Agents, Gold Tenants,
  Verified Tenants, Explorer Users, Properties
- Platform ID system: LND-, AGT-, TNT-G-, TNT-V-, TNT-E-, ADM-C-, ADM-O-
- Global CRM search across name, email, BRN, nationality
- HomePage compliance tiles updated (Three-Tier Identity, DLD Agreements,
  Permits, Demand Intelligence)
- "How it Works" link in navbar for logged-out users
- Superpowers integration section in CLAUDE.md

### Changed
- Tier display labels: "New Arrival" → "Explorer" (Tier 0),
  "Browse Only" → "Verified" (Tier 1), "Fully Verified" → "Gold" (Tier 3)
- Navbar: dropdown removed, Profile + Sign Out always visible
- Browse removed from all authenticated navbars
- Role-based nav: roommate/landlord/agent/compliance/operations each see
  only their relevant links
- HowItWorksPage card order: Explorer → Verified → Gold (lowest to highest)
- All hardcoded tier strings in ProfilePage replaced with getTierLabel()
- LoginPage demo logins grouped by role (Landlords, Agents, Tenants by tier, Admin)
- NestMatch OS flow: "Search → Verify Identity → Book Viewing → Sign DLD Agreement → Move In"
- All placeholder user names replaced with real culturally diverse personas
- Admin names: "Compliance Admin" → Sara Al Hashimi, "Operations Admin" → Rashid Khalil
- Nationality added to all users
- README.md fully rewritten for v2.3.0

### Fixed
- Tier label inconsistency between profile header badge and verification card
- getTierColor swapped: tier0=gray, tier1=amber (was reversed)
- Letting agents now see viewings for properties they manage

---

## [2.2.0] — 2026-03-16 · Tier 0 Passport KYC + Access Control

### Session 5: Three-tier verification overhaul for new arrivals

### Added
- VerificationTier type system: tier0_passport, tier1_unverified, tier2_uae_pass
- KycDocument and KycDocType interfaces for passport/visa document tracking
- verification_tier field on all User records
- 3 new Tier 0 demo users (James Okafor, Sofia Kowalski, Ravi Menon) with
  passport KYC documents, nationality, visa_type, visa_expiry fields
- PassportKycModal component: simulated passport + visa page upload,
  passport number input, visa type select, nationality field
- src/utils/accessControl.ts: canRequestViewing, canChat,
  canSignViewingAgreement, canSignTenancyContract, canApply, getTierLabel,
  getTierColor, plus future-phase scaffolds (wallet, tenancy portal)
- LoginPage: three-path entry (UAE PASS with teal Tier 2 badge,
  New Arrival with Google/email and amber Tier 0 badge, info list)
- Demo logins grouped by tier with colour-coded badges
- ProfilePage: verification status card per tier (amber/gray/green left border),
  KYC document status rows for Tier 0, upgrade paths for Tier 1
- CompliancePage: renamed verification tab, added Passport KYC sub-tab
  with approve/reject buttons for Tier 0 users
- ListingDetailPage: canRequestViewing gating replaces old isVerifiedForBooking,
  shows PassportKycModal for Tier 1 users

### Changed
- User interface: added verification_tier, kyc_documents, passport_number,
  visa_type, visa_expiry, nationality fields
- All existing users updated with verification_tier values
- tier1-2 (Onfido user) reclassified as tier0_passport
- Booking CTA now uses accessControl.canRequestViewing instead of
  AuthContext.isVerifiedForBooking

---

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
