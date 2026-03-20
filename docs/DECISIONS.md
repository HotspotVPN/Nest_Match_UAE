# Decision Log — NestMatch UAE

Key architectural and product decisions with rationale.
Especially documents things that were deliberately removed.

---

## DEC-001 — Remove all payment processing
**Date:** 2026-03-16 (Session 1)
**Decision:** Delete mockStripeService.ts and all Stripe references
**Reason:** NestMatch does not hold a DIFC (Dubai International
Financial Centre) licence or CBUAE (Central Bank UAE) authorisation.
Processing payments, holding escrow, or collecting rent without
these licences creates regulatory liability.
**What replaced it:** Nothing. Payments are out of scope entirely.
**Do not reintroduce under any framing** (including "platform fee",
"abuse penalty", "hold", "pre-authorisation", "deposit escrow").

---

## DEC-002 — Remove lease/tenancy agreement drafting
**Date:** 2026-03-16 (Session 1)
**Decision:** Delete ContractManagerPage.tsx, remove /contract route
**Reason:** Drafting or facilitating tenancy contracts requires a
RERA broker licence. NestMatch is not licensed as a property
management company.
**What replaced it:** LeaseHandoffCard — informs users the viewing
is complete, points them to their RERA-licensed agent, and links
to the DLD broker search at dubailand.gov.ae.
**Future:** When NestMatch obtains RERA broker status, this decision
can be revisited. Document that change here.

---

## DEC-003 — DLD Viewing Agreement as core compliance feature
**Date:** 2026-03-16 (Session 4)
**Decision:** Digitise DLD/RERA/RL/LP/P210 as a digital signing flow
**Reason:** This is an official RERA form. Digitising it requires no
licence — we are generating, pre-filling, and collecting signatures
on a government-issued document. This creates a legitimate audit
trail and a government data product opportunity.
**Implementation:** ViewingAgreementModal with HTML5 canvas signature,
ViewingAgreementRecord stored with viewing data.

---

## DEC-004 — Three-tier verification system
**Date:** 2026-03-16 (planned for Session 5)
**Decision:** tier0_passport for new arrivals, tier1_unverified for
browse-only, tier2_uae_pass for full access
**Reason:** ~200,000 expats arrive in UAE annually. They have passports
and residence visas but no Emirates ID for 2-6 weeks. Excluding
them from the platform entirely loses top-of-funnel. Passport KYC
via R2 upload gives them meaningful but legally grounded access.

---

## DEC-005 — Full profile visibility on applicant review
**Date:** 2026-03-16 (Session 3, updated Session 4)
**Decision:** Show name, nationality, full profile to landlords
**Reason:** Blind Match was removed for investor demo. UAE does not
have equivalent of UK Equality Act for tenant selection.
**Relevant law:** UAE Federal Law No. 45 of 2021 (Personal Data
Protection) governs how nationality data is stored and processed.
**Legal review:** Pending post-demo consultation with legal team.
Reinstate blind matching or add consent layer based on advice.

---

## DEC-006 — Mock data as permanent fallback
**Date:** 2026-03-16 (Phase 2)
**Decision:** Keep full mock data indefinitely, not just for dev
**Reason:** Workers can go down. D1 can have cold-start latency.
The platform must always be demonstrable regardless of backend
state. The 30s health-check cache means at most one failed
request per 30 seconds before fallback kicks in.

---

## DEC-007 — Star-only property ratings (no text)
**Date:** 2026-03 (v1.0)
**Decision:** Property ratings use star sliders only — no text fields
**Reason:** UAE Federal Decree-Law No. 34 of 2021 (Cybercrime Law)
creates liability for defamatory statements. Text reviews about
landlords or properties could expose the platform. Star ratings
are objective and not subject to defamation claims.

---

## DEC-008 — Backend state machine tables before routes
**Date:** 2026-03-16 (Session 8)
**Decision:** Create all 7 D1 audit/event tables before building
any API routes that perform state transitions.
**Reason:** Every entity (rooms, viewings, verification, tenancy)
has a state machine. Without audit tables, state transitions are
invisible and non-recoverable. The tables provide a complete audit
trail for DLD/RERA inspection.

---

## DEC-009 — wrangler.toml name synced with Cloudflare
**Date:** 2026-03-16 (Session 8)
**Decision:** Changed backend/wrangler.toml `name` from
`nestmatch-uae-api` to `nest-match-uae` to match the
Cloudflare Workers dashboard.
**Reason:** Cloudflare auto-generates PRs to fix name mismatches
on Wrangler v3.109+. Keeping them in sync prevents deployment
confusion.

---

## DEC-010 — Homepage legal audit and badge removal
**Date:** 2026-03-16 (Session 9)
**Decision:** Removed "Powered by UAE PASS" and "DLD & Municipality
Aligned" badges from homepage. Removed all claims about Ejari
automation, contract building, payment processing, and escrow.
**Reason:** NestMatch has NOT received official endorsement,
approval, or compliance attestation from UAE PASS or DLD.
Displaying these badges implies endorsement that does not exist.
Claims about Ejari/contracts/payments imply capabilities that
require RERA broker and CBUAE licences NestMatch does not hold.
**What replaced it:** Factual descriptions only — "digitises
the official DLD Property Viewing Agreement", "connects
identity-verified tenants with permit-verified landlords".

---

## DEC-011 — Split signup funnel (tenant vs landlord)
**Date:** 2026-03-16 (Session 9)
**Decision:** Created separate /register/tenant and /register/landlord
routes instead of a single signup form.
**Reason:** Enables independent conversion tracking per marketplace
side, targeted acquisition campaigns (landlord email → /register/landlord,
tenant ad → /register/tenant), independent A/B testing, and SEO
optimisation per persona. This is intentional product architecture.

---

## DEC-012 — Sequential tier numbering (Tier 3 → Tier 2)
**Date:** 2026-03-16
**Decision:** Renamed Tier 3 — Gold to Tier 2 — Gold. System is
now sequential: Tier 0 (Explorer), Tier 1 (Verified), Tier 2 (Gold).
**Reason:** The gap from 1 to 3 (with Tier 2 reserved for a future
intermediate state) created confusion in investor demos and required
explanation. The string enum values ('explorer', 'verified', 'gold')
are unchanged — only display numbers were updated. If an intermediate
tier is needed later, it can be inserted with a new string value
without renumbering.

---

## DEC-015 — Bed-space listings removed (compliance)
**Date:** 2026-03-17 (Session 10)
**Decision:** All "twin share", "bed-space", and "shared bedroom"
listings rewritten as private rooms (1 tenant per room).
**Reason:** NestMatch is a compliance-first platform for Law No. 4
of 2026 which mandates occupancy limits. Bed-space arrangements are
the grey market NestMatch exists to eliminate. Showing them on the
platform contradicts the entire compliance value proposition.
**Rule:** maxLegalOccupancy = number of bedrooms. Each bedroom = 1 tenant.
Shared common areas (kitchen, bathroom, living room) are fine.

---

## DEC-016 — Illegal route removal (ledger, wallet, treasury)
**Date:** 2026-03-17 (Session 10)
**Decision:** Deleted RentLedgerPage, LandlordWalletPage, TreasuryPage
and all routes/nav links to them.
**Reason:** These pages implied payment processing, rent collection,
and financial management capabilities. NestMatch holds no CBUAE licence.
Keeping dead routes that reference unlicensed features is a liability.

---

## DEC-013 — Separate My Properties from public Browse
**Date:** 2026-03-17 (Session 9A)
**Decision:** Landlord navbar "Properties" (linked to /browse) replaced
with "My Properties" (linked to /my-properties). Browse page (/browse)
is accessible from the homepage search bar for public users only.
**Reason:** Landlords need a dedicated view of their own properties
with occupancy, actions, and Coming Soon management. Mixing their
portfolio with the public browse page conflated discovery (tenant
action) with management (landlord action).

---

## DEC-014 — Coming Soon listings as pre-market feature
**Date:** 2026-03-17 (Session 9A)
**Decision:** Added listing_status field with 'coming_soon' value.
Coming Soon listings are visible on /my-properties for landlords
and on /listing/:slug for direct access, but hidden from /browse.
**Reason:** Landlords need to prepare listings before launch.
Premium tenants will get early access in a future phase.
This is a product feature ("Coming Soon Listings"), distinct from
placeholder "coming soon" text which was removed from the UI.

---

## DEC-017 — Tier alignment: no swap needed (TD-001 naming confusion)
**Date:** 2026-03-20 (v2.13.3 PD Signoff)
**Decision:** Kept tier assignments unchanged despite PD command to swap.
The PD's command specified S005-S007 → `tier1_unverified` and
S008-S009 → `tier0_passport`. This would have INVERTED the display
labels due to TD-001 (internal value `tier1_unverified` maps to
display label "Tier 0 — Explorer", not "Tier 1").
**Current state (correct):**
- S005-S007: `tier0_passport` → displays "Tier 1 — Verified" ✓
- S008-S009: `tier1_unverified` → displays "Tier 0 — Explorer" ✓
**Reason:** The PD's intent was correct (S005-S007 should be Tier 1,
S008-S009 should be Tier 0) but the code values were backwards.
Executing the swap would have broken the display.
**Action:** Flagged to PD with explanation. PD confirmed current
values are correct. TD-001 tech debt remains open for future rename.

---

## DEC-018 — Ejari document storage model (90% Value, 0% Liability)
**Date:** 2026-03-20 (v2.13.3)
**Decision:** NestMatch stores and displays Ejari documents but never
drafts, files, modifies, or manages them.
**Reason:** Drafting or filing Ejari contracts requires RERA broker
licence. NestMatch operates as a document storage and display layer.
Landlords upload executed Ejari contracts. Tenants can view their
contracts and download PDFs. The platform adds no legal value to the
documents — it provides convenience and audit trail only.
**Compliance boundary:** "We hold the mirror, not the pen."

---

## DEC-019 — Government PDF template overlay (not scratch generation)
**Date:** 2026-03-20 (v2.13.3)
**Decision:** Use actual government PDF templates from DLD website as
base layers, with NestMatch data overlaid using pypdf + reportlab.
**Reason:** Initially built PDFs from scratch using reportlab. PD
reviewed and directed: "use the government format preferably."
Government templates preserve DLD logos, Arabic bilingual text, EJARI
watermarks, and SGS certification badges — lending authenticity and
credibility that scratch-generated documents cannot match.
**Implementation:** pypdf.PdfReader loads government PDF, reportlab
Canvas creates transparent overlay with NestMatch data at mapped
coordinates, pypdf merges overlay onto each page.
