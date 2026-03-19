# Changelog — NestMatch UAE

All notable changes to this project are documented here.
Format: ## [version] — date · what changed · why

## [2.12.0] — 2026-03-19 · Ejari Documents + CORS Fix + Auth Fix

### Backend Session 11 + Frontend Session 15 + Critical Fixes

### Added — Ejari Document Storage
- ejari_documents table (migration 0011) — stores uploaded Ejari certificates
- 5 demo Ejari documents seeded (migration 0012) for Ahmed (4) and Fatima (1)
- Room-level rent values (migration 0013) — AED 2,700–3,800/mo
- 4 API routes: GET /api/ejari, GET /api/ejari/stats/summary,
  GET /api/ejari/:id, POST /api/ejari
- Route order: /stats/summary registered before /:id (Hono requirement)
- EjariDocumentsPage.tsx — stats bar, Active/Expired tabs, document cards
- Ejari nav link for landlords, agents, AND residing tenants
- Legal disclaimer: "NestMatch does not draft, manage, verify, or file
  tenancy contracts or Ejari registrations"

### Fixed — CORS (P0 blocker)
- ALLOWED_ORIGIN in wrangler.toml: nestmatch-uae → nest-match-uae
  (production Vercel URL has hyphens — this blocked ALL browser API calls)
- cors.ts fallback origin also corrected

### Fixed — Auth Login Crash
- loginWithEmail: after API login, fetches full profile via /api/auth/me
  (login response only returns {id, email, role, tier} — missing name, type,
  verification_tier causing Navbar crash on currentUser.name)
- Session restore on page load: same /me enrichment applied
- Mock data merge ensures complete User object for frontend rendering

### Fixed — EjariDocumentsPage
- formatCurrency null guard (tenant stats endpoint returns null)
- Stats bar hidden for tenants (only landlords/agents see aggregate stats)

### Compliance
- Zero "contracts" references as feature names in source code
- "Ejari" naming used consistently (not "contracts")
- Disclaimer present on Ejari page

---

## [2.11.1] — 2026-03-19 · Inbox Data Alignment — Match Canonical Seed

### Migration 0010: Additional inbox messages to match PD-approved seed

### Added
- 8 additional inbox messages seeded to D1 (migration 0010)
- Khalid Al Rashid: 2 messages (sign agreement action, chat from Liam)
- Liam O'Brien: 2 messages (upgrade to Gold action, welcome update)
- Aisha Patel: 2 additional (viewing confirmed, Gold benefits)
- Ahmed Al Maktoum: 2 additional (Marcus chat, March analytics)

### D1 Inbox State (15 total)
- roommate-1 (Priya): 3 messages, 1 unread
- roommate-7 (Aisha): 3 messages, 2 unread
- landlord-1 (Ahmed): 4 messages, 1 unread
- agent-1 (Khalid): 2 messages, 2 unread
- tier1-1 (Liam): 2 messages, 1 unread
- admin-1 (Sara): 1 message, 1 unread

### Process Note
- Migration 0010 created and applied after PD review
- Commit gated on explicit PD approval per governance rules

---

## [2.11.0] — 2026-03-19 · Inbox System — Phase 2B (Backend + Frontend)

### Sessions 10 + 14: Full inbox infrastructure

### Backend
- Created inbox_messages table (migration 0008)
- Seeded 7 demo messages for Priya (3), Ahmed (2), Aisha (1), Sara (1)
- Built 5 inbox routes: GET /api/inbox, GET /api/inbox/unread-count,
  PATCH /api/inbox/:id/read, POST /api/inbox/mark-all-read,
  PATCH /api/inbox/:id/action
- Registered in index.ts, deployed to Workers

### Frontend
- InboxPage.tsx: 3-tab inbox (Actions, Messages, Updates) with unread badges
- InboxBadge.tsx: bell icon with red unread count, polls every 30s
- Added to Navbar (next to avatar) and App.tsx routes
- api.ts: getInbox, getUnreadCount, markInboxRead, markAllInboxRead methods
- Click message → marks as read, CTA buttons navigate to relevant pages
- Empty states per tab, loading spinner

### Data
- 7 seeded messages across 4 users (action/message/update categories)
- Priya: 1 unread action (sign agreement), 2 read items
- Ahmed: 1 unread action (review viewing request), 1 read update
- Aisha: 1 unread update
- Sara: 1 unread action (KYC review)

---

## [2.10.0] — 2026-03-19 · ComplianceFlow Component — Phase 2A

### Session 13: Animated compliance verification sequence for booking flow

### Added
- ComplianceFlow.tsx: 6-step animated compliance verification sequence
  - Step 1: UAE PASS KYC verification
  - Step 2: RERA Trakheesi permit check (shows permit number)
  - Step 3: Makani geo-verification (shows Makani + district)
  - Step 4: Law No. 4 of 2026 compliance check
  - Step 5: DocuSign envelope preparation
  - Step 6: Registry bridge ready
- Steps auto-advance at 1.5s intervals with progress bar
- Global @keyframes spin in index.css

### Changed
- ListingDetailPage booking modal: replaced simple spinner with ComplianceFlow
- Booking "Confirm" button no longer uses setTimeout — ComplianceFlow onComplete handles transition

### Not Built (Phase 2B — deferred)
- Inbox/Notifications page
- InboxBadge component

---

## [2.9.2] — 2026-03-18 · Auth Guard, Empty States, Governance Docs

### Session 12A: Final demo fixes — auth protection + filtered empty states

### Added
- ProtectedRoute component: redirects unauthenticated users to /login?return=...
- 11 routes wrapped with ProtectedRoute (viewings, chat, profile, dashboard, etc.)
- Filtered viewings empty state: "No viewings in this category" + Browse CTA
- docs/CLAUDE_MD_GOVERNANCE.md — standalone data governance reference

### Fixed
- TC-4: Filtered viewings with 0 results no longer show blank page
- TC-7: Direct URL access to protected routes redirects to login with return path
- TC-7b: After login, user returns to original destination (not default /browse)

### Tested (local, 18 March 2026)
- TC-4: PASS — Sofia → /viewings → Completed filter → empty state visible
- TC-7: PASS — Incognito → /viewings → redirect to /login?return=%2Fviewings
- TC-7b: PASS — Login as Priya → redirected to /viewings (not /browse)

---

## [2.9.1] — 2026-03-18 · Signature Wiring, Data Governance, Demo Polish

### Sessions 9D + 11D + 9F: Signature persistence, tier alignment, governance docs

### Added
- PATCH /api/agreements/:id/sign — signature persistence route (backend deployed)
- POST /api/agreements — DLD agreement creation route (backend deployed)
- GET /api/agreements/:id — agreement with signatures and property details (backend)
- api.signAgreement(), api.createAgreement(), api.getAgreement() in frontend api.ts
- ViewingAgreementModal wired to real API with DemoStateContext fallback
- Loading states (Loader2 spinners) on Generate and Sign buttons
- docs/TECH_DEBT.md — comprehensive tech debt register (6 items)
- docs/incidents/2026-03-17_data_model_deviation.md — incident postmortem
- docs/PRODUCT_DIRECTOR_BRIEFING_v2.md — canonical 15-persona reference
- CLAUDE.md Data Model Governance section — approval gates, canonical persona list

### Fixed
- Amara Diallo tier: tier0_passport → tier1_unverified (mockData + D1 aligned)
- Backend agreements.ts: full rewrite from stub (GET only) to 3 routes (GET + POST + PATCH)
- User ID `user.user_id` → `user.sub` to match JWTPayload type in backend routes

### Verified
- All 15 canonical personas: tiers match between mockData, D1, and LoginPage
- Signature flow: Priya (tenant) + Ahmed (broker) → FULLY_SIGNED in production
- TypeScript: zero errors (frontend + backend)

---

## [2.9.0] — 2026-03-17 · Seed Viewings + D1 CHECK Constraint Fix

### Session 9C: Backend D1 seeding for demo viewing data

### Added
- backend/migrations/0007_seed_viewings.sql — seed migration for demo viewings
- 5 viewing_bookings: Priya (3), Aisha (1), Sofia (1) across 4 properties
- 4 viewing_agreements: draft, fully_signed (x2), agent_signed
- 5 agreement_signatures: broker + tenant placeholder signatures
- Priya: COMPLETED + CONFIRMED + PENDING (full lifecycle demo)
- Aisha: FULLY_SIGNED with both parties' signatures
- Sofia: AGREEMENT_SENT with broker-only signature

### Fixed
- viewing_bookings CHECK constraint expanded from 6 → 12 status values
  (added AGREEMENT_SENT, AGENT_SIGNED, FULLY_SIGNED, NO_SHOW_TENANT,
  NO_SHOW_LANDLORD, CANCELLED — now matches frontend ViewingStatus type)
- signer_role values: 'agent' → 'broker' to match D1 CHECK constraint
- outcome values: 'viewing_completed' → 'attended' to match D1 CHECK constraint
- D1 demo emails synced: ahmed@, fatima@, priya@, james@, sofia@, liam@ all @nestmatch.ae
- All 32 users confirmed password_hash = 'demo2026'

### Production D1 State
- viewing_bookings: 5 rows
- viewing_agreements: 4 rows
- agreement_signatures: 5 rows
- GET /api/viewings returns 3 viewings for Priya (CONFIRMED, PENDING, COMPLETED)
- All 9 demo logins verified via /api/auth/login

### Note
- PATCH /api/agreements/:id/sign route NOT YET BUILT
- New signatures from browser canvas go to DemoStateContext (session-only)
- Pre-seeded signatures in D1 persist across refresh

---

## [2.8.1] — 2026-03-17 · QA Fixes + Demo Polish

### Session 11: Frontend QA fixes for investor demo readiness

### Fixed
- Demo password auto-fill: clicking a persona now fills both email AND password fields (demo2026)
- Demo emails aligned to backend D1: ahmed@, fatima@, priya@, james@, sofia@, liam@ all @nestmatch.ae
- Default auth password changed from 'pass123' to 'demo2026' (matches production D1)
- Max Legal Occupancy wording: "X persons" → "X rooms (1 tenant per room)" (Law No. 4 compliance)
- Console error spam: all mock fallback logs changed from console.error to console.info with purple [NestMatch] prefix
- Listing detail scroll: pages now scroll to top when navigating between listings
- Login return path: all 3 login handlers (email, UAE PASS, Google mock) respect ?return= query param
- Viewings empty state: added "Browse Properties →" CTA button

### Changed
- quickLogin no longer auto-submits — fills form fields, investor clicks Sign In for control
- handleEmailLogin now passes actual password field value instead of relying on default
- Demo hint added below persona list: "Click any persona — password auto-fills"
- README.md demo accounts table updated with new emails and demo2026 password note

### Verified
- Nav consistency: correct per role (tenant/landlord/compliance/operations/logged-out)
- API mapper: zero hardcoded title overrides, direct pass-through confirmed
- Stripe/penalty remnants: zero matches in active source code
- TypeScript: zero errors (npx tsc --noEmit)

---

## [2.8.0] — 2026-03-17 · Property Images, Compliance Fix, Mock Data, Route Cleanup

### Frontend 10-Fix + Compliance Session

### Added
- Unsplash property images on all 14 listings (3 per property by district tier)
- Image rendering on BrowsePage (grid + list cards) and ListingDetailPage (hero)
- 5 mock viewing bookings (Priya: 3, Aisha: 1, Sofia: 1) across all statuses
- 3 mock chat channels + 9 messages (Priya↔Ahmed, Priya↔Fatima, Aisha↔Ahmed)
- API retry guard: health check logs fallback mode, skips fetch when backend down
- 401 handler in apiFetch: clears token, redirects to /login?return=

### Fixed
- Health check now hits /api/health (was hitting / root)
- Token key standardized to 'nm_token' (was 'nestmatch_token')
- vercel.json SPA rewrite destination: /index.html (was /)
- All bed-space/twin-share listings rewritten to private rooms (Law No. 4 compliance)
- maxLegalOccupancy = rooms (1 tenant each), not beds
- Section comments: "Legal Bed-spaces" → "Budget Private Rooms"
- Chat channel "Al Nahda Twin Share" → "Al Nahda Private Room"

### Removed (legal compliance — no CBUAE/RERA licence)
- /ledger route + RentLedgerPage.tsx — DELETED
- /wallet route + LandlordWalletPage.tsx — DELETED
- /treasury route + TreasuryPage.tsx — DELETED
- All nav links to ledger/wallet/treasury removed

### Changed
- CLAUDE.md: added listing compliance rules (rooms not beds, 1 tenant/room)
- All 'bed-space' tags replaced with 'private-room' across mockData

---

## [2.7.2] — 2026-03-17 · Backend Production Deploy + Full D1 Seed

### Session 9B: Backend incremental fixes + production deployment

### Added
- /api/health endpoint returning status, timestamp, version
- agreements.ts route: GET /api/agreements/:id with signatures join
- maintenance.ts route: GET /api/maintenance (tenant's tickets)
- chat.ts route: GET /api/chat/channels (user's channels)
- AppEnv shared type in types.ts for consistent Hono Variables typing
- D1 database_id in wrangler.toml for remote operations
- maintenance_tickets table created on production D1
- Full production seed: 32 users + 14 properties + 38 room_occupancy

### Fixed
- CORS: OPTIONS preflight now returns headers (was bare 204)
- Auth login: accepts demo password for seeded users (no bcrypt in demo)
- Auth Google: wrapped in try/catch for schema mismatch resilience
- TypeScript: zero errors — all route files use AppEnv type
- Chat route: uses participants LIKE query matching actual schema
- All middleware files: JWTPayload properly imported from types.ts

### Production state
- 32 users across all tiers (Gold, Verified, Explorer)
- 14 properties across 14 Dubai districts (11 active, 3 coming soon/inactive)
- All auth endpoints working (login, Google OAuth, UAE PASS)
- CORS configured for nest-match-uae.vercel.app

---

## [2.7.1] — 2026-03-17 · Backend Integration, CORS Fix, D1 Seed, Agent Protocol

### Backend integration verified end-to-end
- CORS middleware fixed: OPTIONS preflight now returns proper headers
  (was creating bare Response without CORS headers)
- localhost:* allowed in dev, production origin preserved
- BrowsePage wired to api.getProperties() with mock fallback + console logs
- D1 seed migration 0006: all 32 users, 14 properties, 38 room_occupancy
  rows copied from mockData to D1 — full parity
- Backend Stripe files deleted: mockStripe.ts, mockStripeService.ts
- viewings.ts: all Stripe hold/void calls removed
- Agent Coordination Protocol added to CLAUDE.md (file boundaries,
  coordination points, progress reporting, deployment coordination)

### Verified integration state
- Frontend (port 5177) → Backend (port 8788) → D1: all connected
- CORS: Access-Control-Allow-Origin correctly mirrors localhost origin
- API returns 11 active properties from D1 (3 inactive/coming-soon filtered)
- Auth flow: register → login → JWT → authenticated endpoints all working

---

## [2.7.0] — 2026-03-17 · Legal Pages, My Properties, Coming Soon Listings

### Session 9A: Legal, footer, route fixes + landlord property management

### Added
- Footer component on all public pages with legal disclaimer
  ("NestMatch is not a property management company, RERA-licensed
  broker, or financial services provider")
- PrivacyPolicyPage (/privacy) — UAE Federal Law No. 45 compliance
- TermsPage (/terms) — legal boundary statements
- vercel.json SPA rewrite rule for direct URL access on Vercel
- MyPropertiesPage (/my-properties) — landlord's own properties with
  Active/Coming Soon/All tabs, stat cards, occupancy bars, action buttons
- listing_status field on Listing type ('active'|'coming_soon'|'draft'|'suspended')
- 2 Coming Soon listings: Downtown Dubai Studio + Palm Jumeirah Villa
  with 'coming-soon' tags and amber badges
- "Launch & Advertise" button on Coming Soon properties (simulated)
- "Register Interest" button on Coming Soon listing detail pages
- Coming Soon banner on listing detail for pre-market properties
- Dashboard link added to landlord/agent navbar

### Changed
- Landlord navbar: "Properties" (/browse) → "My Properties" (/my-properties)
- My Properties shows only landlord's own/managed listings (filtered)
- Coming Soon listings hidden from public /browse page
- Homepage search bar: "Search by area, building, or district..." (removed
  "AI-powered search coming soon" — that was placeholder text, not the feature)

### Removed
- "AI-powered search coming soon" hint text from homepage
- "(coming soon)" text from HowItWorksPage

### Docs
- CLAUDE.md: legal pages constraint, anonymisation rules, premium features,
  Coming Soon Listings TODO, premium status table, new routes
- DECISIONS.md: to be updated with coming soon feature decision

---

## [2.6.0] — 2026-03-16 · Tier Renumbering + Demo Journeys

### Tier 3 → Tier 2 rename
- Renamed "Tier 3 — Gold" to "Tier 2 — Gold" across entire codebase
- Sequential tier system: 0 (Explorer) → 1 (Verified) → 2 (Gold)
- Removed reserved Tier 2 concept — no gap in numbering
- String enum values unchanged ('explorer', 'verified', 'gold')
- Access control logic unchanged — display numbers only

### Demo journey wiring
- DemoStateContext: mutable state layer over mockData for demo flows
- ToastContext + Toast component: success/error/info/warning notifications
- DemoControls: floating persona switcher with quick actions
- UAEPassOverlay: reusable UAE PASS mock authentication modal
- TenantSignupPage: Google mock picker + email form with loading states
- LandlordSignupPage: UAE PASS overlay + email fallback
- PassportKycModal: simulated upload with 3s auto-approve
- ListingDetailPage: Tier 0 block modal with upgrade invitation
- ViewingsPage: loading states on all action buttons
- ProfilePage: UAE PASS upgrade via overlay

### Files changed (23 replacements across 10 source files)
- src/utils/accessControl.ts: getTierLabel 'gold' → "Tier 2 — Gold"
- src/components/DemoControls.tsx, UAEPassOverlay.tsx
- src/pages/HowItWorksPage.tsx, LandlordSignupPage.tsx, LoginPage.tsx,
  ProfilePage.tsx, RegisterLandingPage.tsx, TenantSignupPage.tsx
- docs/CHANGELOG.md, DECISIONS.md

---

## [2.5.0] — 2026-03-16 · Homepage Revamp, Signup Funnel, Legal Cleanup

### Session 9: Homepage rewrite, split signup pages, legal audit

### Added
- RegisterLandingPage (/register): two-column split signup landing with
  tenant left / landlord right, OR divider, ?role= query param highlighting
- TenantSignupPage (/register/tenant): UAE PASS + Google + email auth form
  with tier progression info panel (Explorer → Verified → Gold)
- LandlordSignupPage (/register/landlord): UAE PASS primary + email fallback
  with requirements amber box (Trakheesi, Makani, Municipality permit)
- Homepage search bar hero CTA: glass-effect input bar with "I'm looking
  for a room in Dubai..." placeholder, "AI-powered search coming soon" hint
- Homepage Section 2: compliance engine tiles + three stakeholder cards
  (Landlords purple, Residents teal, Room Seekers amber)
- Logged-out navbar: Browse Properties | How it Works | [Sign Up] button
- LoginPage: "Don't have an account? Sign up →" link to /register

### Removed — legal compliance
- "We automate Ejari, contracts, rent ledgers" — no RERA broker licence
- "Ejari-aligned Sub-leases" — not built, not licensed
- "Legal Contract Builder" — not built, not licensed
- "Verified Payment History" — no CBUAE licence
- "Secure Deposit Escrow" — no CBUAE licence
- "Wallet & Ledger Tracking" — no CBUAE licence
- "Join 5,000+ residents and 200+ property operators" — aspirational
- "Powered by UAE PASS" badge — no official endorsement received
- "DLD & Municipality Aligned" badge — no attestation received
- Purple gradient CTA section ("Ready for a more professional...")
- "Launch Dashboard" and "Browse Legal Rooms" buttons

### Changed
- Homepage reduced from 4+ scroll sections to exactly 2
- NestMatch OS flow: "Search → Verify Identity → Book Viewing →
  Sign DLD Agreement → Move In" (legally accurate journey description)
- Tenant signup now includes UAE PASS button alongside Google/email
  (residents with Emirates ID use UAE PASS for Tier 2 — Gold)
- Logged-out navbar: "Login with UAE PASS" replaced with "Sign Up"

---

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
  "Browse Only" → "Verified" (Tier 1), "Fully Verified" → "Gold" (Tier 2)
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
