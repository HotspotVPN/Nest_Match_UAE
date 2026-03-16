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
