# Product Roadmap — NestMatch UAE

## Current: v2.13.3 — Investor Demo (March 2026)

### Completed
- [x] UAE-specific type system and mock data (15 districts, 12+ listings)
- [x] Three-tier verification: UAE PASS, passport KYC, unverified
- [x] Browse page with district filters, occupancy bars, transport chips
- [x] Listing detail with Makani, Trakheesi, DLD permit display
- [x] Landlord dashboard: portfolio, viewings, applicant review
- [x] Roommate profile: GCC score ring, match score, lifestyle tags
- [x] Smart API fallback (backend down → mock data, zero disruption)
- [x] Cloudflare D1 + R2 + Workers backend deployed
- [x] Vercel frontend deployed
- [x] Sessions 1-3: fintech removed, browse overhauled, profiles polished
- [x] Session 4: DLD Viewing Agreement digital signing
- [x] HTML5 canvas signature pad for broker + tenant
- [x] Viewing outcome tracking (completed / no-show)
- [x] Viewing analytics dashboard (/analytics)
- [x] LeaseHandoffCard replacing ContractManagerPage
- [x] Full applicant profile visibility (blind match removed)

### Completed (Session 5)
- [x] Three-tier verification UI overhaul
- [x] PassportKycModal for Tier 0 new arrivals
- [x] Login page three-path entry (UAE PASS / New Arrival / Browse)
- [x] Compliance dashboard Passport KYC tab
- [x] Access control utility (canRequestViewing, canChat, canApply, etc.)
- [x] Profile page tier-aware verification status card
- [x] 3 Tier 0 demo users with passport KYC documents

### Completed (Sessions 6-7)
- [x] Navbar overhaul: dropdown removed, Profile + Sign Out always visible
- [x] Role-based navbar per user type
- [x] Browse removed from authenticated navbars
- [x] Tier naming: Explorer (T0), Verified (T1), Gold (T3)
- [x] Supply-side cards: Individual Landlord, RERA Agent, Property Company
- [x] CRM restructured: 6 tabs with Platform IDs and global search
- [x] HomePage compliance tiles + NestMatch OS flow updated
- [x] HowItWorksPage complete rewrite with tier system + viewing journey
- [x] All placeholder users replaced with real diverse personas (30+ nationalities)
- [x] README.md fully rewritten for v2.3.0
- [x] Superpowers integration in CLAUDE.md

### Completed (Session 8 — Backend)
- [x] D1 migration 0004: 7 new tables (oauth_tokens, kyc_documents, occupancy_events, viewing_agreements, agreement_signatures, tenancy_events, verification_events)
- [x] POST /api/auth/google — Google OAuth mock route
- [x] POST /api/auth/uae-pass — UAE PASS OAuth with verification_events audit
- [x] KYC routes: upload to R2, my-documents, admin review
- [x] Occupancy routes: room state machine (approve/reject/remove/notice/move-out)
- [x] GCC score recalculation route with formula
- [x] Viewing accept now creates viewing_agreements record
- [x] Frontend api.ts: 5 new endpoints with mock fallbacks
- [x] PassportKycModal + ResidingDashboard wired to real API
- [x] Backend state machines documented in CLAUDE.md
- [x] wrangler.toml name synced with Cloudflare dashboard

### Completed (Sessions 10-11 — Demo Journeys + Tier Rename)
- [x] DemoStateContext: mutable state layer over mockData for demo flows
- [x] Toast notification system (success/error/info/warning)
- [x] DemoControls floating persona switcher with quick actions
- [x] UAEPassOverlay reusable mock authentication modal
- [x] Tenant/landlord signup wiring with loading states
- [x] PassportKycModal: simulated upload with 3s auto-approve
- [x] URL slugs on all listings and users with slug-based routing
- [x] Browse vacancy filtering: hide fully occupied, vacancy badges
- [x] Chat auto-creation on viewing confirmation
- [x] Landlord maintenance tab on dashboard with ticket management
- [x] Tenant listing awareness ("You live here" badge + shortcuts)
- [x] Viewing history + GCC score factors on profile
- [x] Tier 3 → Tier 2 rename: sequential 0, 1, 2

### Completed (Session 9A — Legal + My Properties)
- [x] Footer with legal disclaimer on all public pages
- [x] Privacy Policy page (/privacy)
- [x] Terms of Use page (/terms)
- [x] vercel.json SPA rewrite rule
- [x] MyPropertiesPage (/my-properties) with Active/Coming Soon tabs
- [x] listing_status field: active, coming_soon, draft, suspended
- [x] 2 Coming Soon listings (Downtown Studio, Palm Villa)
- [x] Coming Soon hidden from /browse, visible on /my-properties
- [x] Landlord navbar: Dashboard | My Properties | Viewings | Applicants | Chat
- [x] Coming Soon banner + Register Interest on listing detail

### Completed (Session 9B — Backend Production)
- [x] /api/health endpoint
- [x] Auth login fix for demo users
- [x] Google OAuth error handling fix
- [x] CORS OPTIONS preflight fix
- [x] AppEnv TypeScript type — zero backend TS errors
- [x] Agreements route (GET /api/agreements/:id)
- [x] Maintenance route (GET /api/maintenance)
- [x] Chat route (GET /api/chat/channels)
- [x] D1 database_id in wrangler.toml
- [x] Production D1 seeded: 32 users, 14 properties, 38 rooms
- [x] All auth endpoints verified on production
- [x] Worker deployed to nest-match-uae.pushkar-nagela.workers.dev

### Completed (Sessions 11+15 — Ejari Documents + CORS + Auth Fix)
- [x] Backend: ejari_documents table + 5 demo records + 4 API routes deployed
- [x] Frontend: EjariDocumentsPage with stats, tabs, cards, legal disclaimer
- [x] Ejari nav link for landlords, agents, and residing tenants
- [x] Stats bar hidden for tenants (shows documents only)
- [x] CORS fix: ALLOWED_ORIGIN corrected to nest-match-uae.vercel.app
- [x] Auth fix: login now fetches full profile via /api/auth/me
- [x] formatCurrency null guard for tenant views

### Completed (Migration 0010 — Inbox Data Alignment)
- [x] 8 additional inbox messages seeded to match PD-approved canonical seed
- [x] Khalid (agent-1) and Liam (tier1-1) now have inbox messages
- [x] Total: 15 messages across 6 users (all smoke tested)

### Completed (Sessions 10 + 14 — Inbox System Phase 2B)
- [x] Backend: inbox_messages table + 5 API routes deployed
- [x] Backend: 7 demo messages seeded for 4 users
- [x] Frontend: InboxPage.tsx with 3-tab layout
- [x] Frontend: InboxBadge.tsx with red unread count
- [x] Frontend: Added to Navbar + App.tsx routes
- [x] Frontend: api.ts inbox methods with mock fallback

### Completed (Session 13 — ComplianceFlow Phase 2A)
- [x] ComplianceFlow.tsx: 6-step animated compliance verification
- [x] Integrated into ListingDetailPage booking modal
- [x] UAE PASS, RERA, Makani, Law No. 4, DocuSign, Registry steps
- [x] Global @keyframes spin added to index.css
- [x] Inbox deferred to Phase 2B (confirmed by PD)

### Completed (Session 12A — Auth Guard, Empty States)
- [x] ProtectedRoute component with return path preservation
- [x] 11 authenticated routes wrapped with ProtectedRoute
- [x] TC-4: Filtered viewings empty state with Browse CTA
- [x] TC-7: Direct URL access redirects to login with return path
- [x] TC-7b: Post-login return to original destination
- [x] docs/CLAUDE_MD_GOVERNANCE.md standalone governance reference
- [x] All 3 local tests passed (18 March 2026)

### Completed (Session 9D + 11D + 9F — Signatures, Governance, Alignment)
- [x] PATCH /api/agreements/:id/sign — signature persistence route (deployed)
- [x] POST /api/agreements — DLD agreement creation route (deployed)
- [x] Frontend ViewingAgreementModal wired to real API with fallback
- [x] Amara Diallo tier fixed: tier0_passport → tier1_unverified (D1 + mockData)
- [x] All 15 canonical personas verified: tiers aligned across D1, mockData, LoginPage
- [x] Data Model Governance added to CLAUDE.md (approval gates, canonical list)
- [x] Incident report: docs/incidents/2026-03-17_data_model_deviation.md
- [x] Tech debt register: docs/TECH_DEBT.md (6 items tracked)
- [x] Product Director Briefing v2: docs/PRODUCT_DIRECTOR_BRIEFING_v2.md

### Completed (Session 9C — Seed Viewings + D1 Fix)
- [x] 5 viewing_bookings seeded to production D1 (Priya 3, Aisha 1, Sofia 1)
- [x] 4 viewing_agreements seeded (draft, fully_signed x2, agent_signed)
- [x] 5 agreement_signatures seeded (broker + tenant placeholders)
- [x] viewing_bookings CHECK constraint expanded: 6 → 12 status values
- [x] D1 status values now match frontend ViewingStatus type exactly
- [x] GET /api/viewings returns real D1 data for Priya (3 viewings)
- [x] D1 demo emails synced + all 9 demo logins verified

### Completed (Session 11 — QA Fixes + Demo Polish)
- [x] Demo password auto-fill: persona click fills email + password (demo2026)
- [x] Demo emails aligned to backend D1 (@nestmatch.ae format)
- [x] Default auth password updated to demo2026
- [x] Max Legal Occupancy wording: "X rooms (1 tenant per room)"
- [x] Console error cleanup: mock fallback logs → purple info prefix
- [x] Listing detail scroll-to-top on navigation
- [x] Login return path (?return= query param) on all login handlers
- [x] Viewings empty state with Browse CTA
- [x] Nav consistency verified per role

### Completed (Session 10 — Images, Compliance, Mock Data)
- [x] Property images: Unsplash URLs on all 14 listings
- [x] Image rendering on browse cards + listing detail hero
- [x] Bed-space/twin-share compliance fix: all listings = private rooms
- [x] 5 mock viewing bookings for Priya, Aisha, Sofia
- [x] 3 mock chat channels + 9 messages
- [x] Illegal routes removed: /ledger, /wallet, /treasury
- [x] Health check → /api/health, token → nm_token
- [x] API retry guard with fallback logging
- [x] vercel.json SPA rewrite fix

### Completed (Session 9 — Homepage Revamp)
- [x] Homepage legal audit: removed all unlicensed capability claims
- [x] Homepage rewritten to 2 scroll sections (hero + compliance/stakeholders)
- [x] Search bar hero CTA with AI-powered search hint
- [x] RegisterLandingPage (/register): split tenant/landlord signup
- [x] TenantSignupPage (/register/tenant): UAE PASS + Google + email
- [x] LandlordSignupPage (/register/landlord): UAE PASS primary + email
- [x] Logged-out navbar: Browse Properties | How it Works | Sign Up
- [x] All legally problematic badges and claims removed from homepage

---

## Near-term (post-funding, no new licences required)

### Corporate relocation channel
- B2B onboarding for UAE employers (ADNOC, Emirates, DIFC firms)
- HR portal: bulk employee referrals → NestMatch Tier 0 flow
- Employer verification badge on tenant profiles

### University housing channel
- Student visa as valid Tier 0 KYC document
- University partnerships: NYUAD, AUS, HWU Dubai, Middlesex Dubai
- Student-specific listing filter

### Abu Dhabi expansion
- ADRA (Abu Dhabi Real Estate Authority) permit display
- Abu Dhabi districts added to browse filters
- Emirate selector in navbar

### White-label compliance API
- License the UAE PASS + passport KYC + DLD form layer
  to other UAE housing platforms
- API endpoints: /verify, /generate-dld-agreement, /sign

---

## Medium-term (requires RERA broker licence)

### Tenancy contract facilitation
- In-platform Ejari contract generation
- RERA-approved contract templates
- Digital signing on tenancy contracts (not just viewing agreements)

### Property management portal
- Maintenance ticket management
- Rent schedule display (no collection — display only until CBUAE)
- Renewal reminders

---

## Long-term — Government data product

### DLD demand intelligence API
- Viewing demand by district, property type, budget range
- Agent performance by RERA BRN
- Supply-demand gap analysis by neighbourhood
- Expat origin demand signals (nationality from Tier 0 uploads)
- Seasonal patterns

### Positioning
NestMatch maintains a complete audit trail of all signed DLD
Property Viewing Agreements. DLD sees Ejari (tenancies) but
is blind to the entire upstream demand funnel. NestMatch is
the first DLD-aligned platform building that dataset at scale.

### Post-investor pitch
- [ ] DLD/RERA data partnership conversation initiated
- [ ] Timeline and format for regulatory data sharing agreed
