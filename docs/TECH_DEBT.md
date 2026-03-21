# NestMatch UAE — Tech Debt Register & Incident Audit Trail

*Last Updated: 21 March 2026*
*Purpose: Complete audit trail of all technical debt, incidents, corrections, omissions, failed enhancements, production failures, and bug fixes across the NestMatch UAE development lifecycle.*

---

## Summary Dashboard

| Category | Total | Open | Resolved | Critical |
|----------|-------|------|----------|----------|
| Data Model Incidents | 2 | 0 | 2 | 1 |
| Production Bugs | 4 | 0 | 4 | 2 |
| Naming / Code Quality | 2 | 2 | 0 | 0 |
| Removed Features | 3 | 0 | 3 | 0 |
| Failed Enhancements | 2 | 1 | 1 | 0 |
| Environment Issues | 2 | 1 | 1 | 0 |
| Documentation Drift | 3 | 1 | 2 | 0 |
| **Total** | **18** | **4** | **14** | **3** |

---

## SECTION 1 — Critical Incidents (Postmortems)

### TD-000: Unauthorized Data Model Expansion (RESOLVED)
- **Severity:** Critical
- **Date Identified:** 17 March 2026
- **Date Resolved:** 17 March 2026
- **Time to Resolve:** 4 hours
- **Status:** ✅ Resolved
- **Root Cause:** Multiple Claude Code sessions expanded demo data from the approved 15 personas to 40+ users without Product Director approval. Sessions independently added users (roommate-3 through roommate-10, roommate-srch-0 through roommate-srch-3, roommate-res-new-0 through roommate-res-new-3, landlord-3, landlord-4, agent-3) that were never in the canonical specification.
- **Impact:**
  - D1 database diverged from specification (40+ users vs 15 approved)
  - mockData diverged from D1 (different users in each)
  - Tier assignments became inconsistent across data sources
  - 3+ hours of alignment work required
  - Product Director trust in automated development process damaged
- **Resolution:**
  - Locked canonical 15-persona list in CLAUDE.md
  - Aligned D1 and mockData to canonical list
  - Added mandatory DATA MODEL CHANGE REQUEST approval gates to CLAUDE.md
  - Created TECH_DEBT.md (this document) as incident artifact
  - Created docs/incidents/2026-03-17_data_model_deviation.md (full postmortem)
- **Prevention:** Governance section added to CLAUDE.md requiring explicit approval for any user/property additions, modifications, or deletions.
- **Full Report:** docs/incidents/2026-03-17_data_model_deviation.md

### TD-007: CORS Origin Mismatch — Production 403s (RESOLVED)
- **Severity:** Critical
- **Date Identified:** 19 March 2026
- **Date Resolved:** 19 March 2026 (v2.12.0)
- **Time to Resolve:** 1 hour
- **Status:** ✅ Resolved
- **Root Cause:** Cloudflare Workers CORS configuration in `wrangler.toml` and `backend/src/cors.ts` had origin set to `https://nestmatch-uae.vercel.app` but the actual Vercel deployment URL was `https://nest-match-uae.vercel.app` (with hyphens). The mismatch caused the browser to reject all cross-origin API responses with HTTP 403.
- **Impact:**
  - ALL backend API calls failed in production for an unknown period
  - Frontend silently fell back to mockData (masking the issue)
  - No user-visible breakage due to fallback pattern, but backend data was unreachable
  - Auth, viewings, inbox, ejari — all API-dependent features were running on stale mock data
- **Resolution:**
  - Updated CORS origin to `https://nest-match-uae.vercel.app` in wrangler.toml and cors.ts
  - Deployed via `wrangler deploy`
- **Prevention:** Added CORS origin verification to pre-deploy checklist. Origin must match exact Vercel deployment URL including hyphens.
- **Lesson:** The mock data fallback pattern (DEC-006) masked the failure. While this is correct UX behaviour, it meant the production API was broken without any visible error to the user. Consider adding a subtle "offline mode" indicator in future.

### TD-008: Auth Login Not Fetching Full Profile (RESOLVED)
- **Severity:** High
- **Date Identified:** 19 March 2026
- **Date Resolved:** 19 March 2026 (v2.12.0)
- **Time to Resolve:** 2 hours
- **Status:** ✅ Resolved
- **Root Cause:** The `login()` function in `AuthContext.tsx` authenticated the user and received a JWT but did not call `/api/auth/me` to fetch the full user profile. The JWT payload contained only basic fields (id, email, role), not the complete profile (name, tier, gcc_score, premium_status, etc.).
- **Impact:**
  - After login, user profile appeared blank or incomplete
  - Tier badge showed incorrect/missing information
  - GCC score, premium status, and profile details were null
  - Demo controls persona switch appeared to work but profile data was stale
- **Resolution:**
  - Added `/api/auth/me` call after successful login in AuthContext.tsx
  - Profile now fully hydrated from backend response
  - Persona switch (DemoControls) now syncs JWT with backend on each switch
- **Prevention:** Auth flows must always fetch full profile after authentication. JWT should carry minimal data; profile hydration is a separate step.

---

## SECTION 2 — Production Bug Fixes

### TD-009: Inbox Messages Not Appearing (Backend-UP Fallback) (RESOLVED)
- **Severity:** Medium
- **Date Identified:** 20 March 2026
- **Date Resolved:** 21 March 2026
- **Status:** ✅ Resolved
- **Root Cause:** InboxPage was designed to generate messages from viewing state machine data, but when the backend was UP, the real API returned only the seeded inbox_messages (7+8=15 messages). The frontend's message generation logic only ran in mock-data mode, meaning users with backend connectivity saw fewer messages than those on fallback.
- **Impact:**
  - Inconsistent inbox experience between backend-UP and backend-DOWN states
  - Some persona inboxes appeared empty when backend was live
  - Demo scenarios showed different message counts depending on backend availability
- **Resolution:**
  - InboxBadge rewritten to compute unread count from both API data and state-derived messages
  - InboxPage unified message sources regardless of backend state

### TD-010: Priya Viewing Her Own Home (Data Error) (RESOLVED)
- **Severity:** Medium
- **Date Identified:** 20 March 2026
- **Date Resolved:** 20 March 2026
- **Status:** ✅ Resolved
- **Root Cause:** Viewing booking `vb-priya-2` had Priya Sharma (S001) scheduled to view property P011 — which is the property she already resides in. A residing tenant cannot logically be viewing their own home.
- **Impact:**
  - Priya's viewings page showed a viewing for a property she already lives in
  - Broke the logical integrity of the viewing state machine demo
  - Undermined credibility during UAT review
- **Resolution:**
  - Reassigned `vb-priya-2` → `vb-ravi-1` (Ravi Menon viewing P011)
  - This is logically correct: Ravi (S007, Tier 0 Explorer) is searching and would view premium properties
  - Priya retains her completed viewing of P010 (Business Bay) which is correct history
- **Prevention:** Viewing seed data must be validated: `tenant_id` must not match any `room_occupancy.user_id` for the same property.

### TD-011: Missing Conversation Context in Inbox (RESOLVED)
- **Severity:** Low
- **Date Identified:** 20 March 2026
- **Date Resolved:** 21 March 2026
- **Status:** ✅ Resolved
- **Root Cause:** Inbox messages generated from viewing state transitions were dry system notifications ("Your viewing has been confirmed") with no chat message trail. Real-world platforms show conversation snippets alongside system notifications.
- **Impact:**
  - Inbox felt robotic and system-generated
  - No sense of human interaction or conversation flow
  - Less compelling for investor demo
- **Resolution:**
  - Added chat channel references to inbox messages where applicable
  - System notifications now include contextual details (property name, date, counterparty name)

### TD-012: Package.json Version Drift (RESOLVED)
- **Severity:** Low
- **Date Identified:** 20 March 2026 (v2.13.3)
- **Date Resolved:** 20 March 2026 (v2.13.3)
- **Status:** ✅ Resolved
- **Root Cause:** Root `package.json` version was stuck at `1.4.0` while the project had progressed to v2.13.3. Version was never updated during the major version bump from v1.x to v2.x.
- **Impact:**
  - `npm pack` and any CI/CD reading package.json would report wrong version
  - Investor/developer reviewing package.json would see outdated version
- **Resolution:** Updated package.json version from `1.4.0` to `2.13.3` (and subsequently to `2.14.0`).
- **Prevention:** Version bump checklist now includes package.json alongside README and CHANGELOG.

---

## SECTION 3 — Removed Features (Deliberate Deletions)

### TD-013: mockStripeService.ts Deletion (DEC-001)
- **Severity:** N/A (deliberate)
- **Date:** 16 March 2026 (Session 1)
- **Status:** ✅ Permanently resolved — file must NEVER be recreated
- **What Was Removed:** `src/services/mockStripeService.ts` — simulated Stripe payment flow including 50 AED "Platform Abuse Penalty" authorization, payment capture, and refund logic.
- **Why:** NestMatch does not hold a DIFC licence or CBUAE authorisation. Processing payments, holding escrow, or collecting rent without these licences creates regulatory liability. Even mock/simulated payment flows in production code imply capabilities the platform cannot legally offer.
- **What Replaced It:** Nothing. Payments are completely out of scope.
- **Audit Note:** `grep -r 'mockStripeService\|ContractManager' src/` is run before every commit to ensure these files have not been recreated.

### TD-014: ContractManagerPage.tsx Deletion (DEC-002)
- **Severity:** N/A (deliberate)
- **Date:** 16 March 2026 (Session 1)
- **Status:** ✅ Permanently resolved — file must NEVER be recreated
- **What Was Removed:** `src/pages/ContractManagerPage.tsx` and the `/contract` route — tenancy contract drafting wizard.
- **Why:** Drafting or facilitating tenancy contracts requires a RERA broker licence. NestMatch is not licensed as a property management company.
- **What Replaced It:** `LeaseHandoffCard` component — informs users the viewing is complete, points them to their RERA-licensed agent, and links to the DLD broker search at dubailand.gov.ae.

### TD-015: Ledger/Wallet/Treasury Route Removal (DEC-016)
- **Severity:** N/A (deliberate)
- **Date:** 17 March 2026 (Session 10)
- **Status:** ✅ Permanently resolved
- **What Was Removed:** `RentLedgerPage`, `LandlordWalletPage`, `TreasuryPage` and all routes/nav links.
- **Why:** These pages implied payment processing, rent collection, and financial management capabilities. NestMatch holds no CBUAE licence. Keeping dead routes that reference unlicensed features is a liability, even as UI-only placeholders.
- **What Replaced It:** Nothing. Financial features are out of scope until CBUAE licence is obtained.

---

## SECTION 4 — Active Technical Debt (Open Items)

### TD-001: Tier Code Value Naming Inconsistency (OPEN)
- **Priority:** Low (cosmetic, well-documented)
- **Date Identified:** 17 March 2026
- **Status:** 🟡 Open — deferred to post-demo
- **Issue:** The internal code value `tier1_unverified` displays as "Tier 0 — Explorer" (via `getTierLabel()`), and `tier0_passport` displays as "Tier 1 — Verified". The code values are semantically inverted relative to their display labels.
- **Impact:**
  - Developer confusion when debugging tier-related code
  - Caused DEC-017 incident where Product Director's tier swap command would have broken display labels if executed literally
  - Every new developer must learn this mapping
- **Suggested Fix:** Rename in D1 + types + mappers: `tier1_unverified` → `tier0_explorer`, `tier0_passport` → `tier1_verified`
- **When:** Post-investor demo (requires D1 migration, type changes, mapper updates, and frontend component updates across ~15 files)
- **Workaround:** `getTierLabel()` and `getTierColor()` in `src/utils/accessControl.ts` are the source of truth. Never hardcode tier display strings.

### TD-002: Demo Email Format (OPEN — Deliberate)
- **Priority:** Low
- **Date Identified:** 17 March 2026
- **Status:** 🟡 Open — deliberate decision
- **Issue:** All demo accounts use `@nestmatch.ae` domain (e.g., ahmed@nestmatch.ae, priya@nestmatch.ae).
- **Impact:** None for demo. Minor realism concern if investors inspect login credentials.
- **Decision:** Deliberately KEPT as `@nestmatch.ae` to avoid investors trying to verify fake emails on real external domains (e.g., @gmail.com, @email.com would tempt "is this a real person?" checks).
- **When:** Post-investor demo — update to realistic but clearly fake emails if needed.

### TD-016: Rollup Build Failure in Sandbox Environments (OPEN)
- **Priority:** Low (environment-only, not production)
- **Date Identified:** 21 March 2026
- **Status:** 🟡 Open — environment limitation
- **Issue:** `npm run build` fails in the Claude Code sandbox VM with `Cannot find module @rollup/rollup-linux-x64-gnu`. This is a native binary dependency issue specific to the sandbox's Linux x64 environment.
- **Impact:**
  - Cannot verify production build in sandbox
  - `npx tsc --noEmit` passes clean (TypeScript compilation works)
  - Build works correctly on Vercel (production) and local development machines
  - Does NOT affect deployed application
- **Workaround:** Use `npx tsc --noEmit` for type-checking in sandbox. Rely on Vercel build for production verification.
- **Suggested Fix:** Pre-install `@rollup/rollup-linux-x64-gnu` in sandbox environment, or use `--platform=linux` flag during npm install.

### TD-017: Git index.lock Stale File in Sandbox (OPEN)
- **Priority:** Low (environment-only)
- **Date Identified:** 21 March 2026
- **Status:** 🟡 Open — recurring sandbox issue
- **Issue:** `.git/index.lock` file persists in the sandbox VM and cannot be removed (`Operation not permitted` on rm, unlink, and Python os.remove). This blocks all git operations (commit, add, status).
- **Impact:**
  - Blocks git commits within sandbox sessions
  - Requires workaround to commit code changes
- **Workaround:** Copy `.git` directory to `/tmp/git_backup`, remove lock from copy, use `GIT_DIR=/tmp/git_backup` for all git operations. Commit succeeds with alternate GIT_DIR.
- **Suggested Fix:** Sandbox environment should clean stale lock files on session start, or grant sufficient permissions to remove them.

---

## SECTION 5 — Failed Enhancements & Corrections

### TD-018: Session 9E Tier Value Swap (DISCARDED)
- **Severity:** N/A (prevented)
- **Date:** 17 March 2026
- **Status:** ✅ Discarded — change was NOT applied
- **What Was Attempted:** Product Director command to swap tier values: S005-S007 → `tier1_unverified` and S008-S009 → `tier0_passport`.
- **Why It Failed:** Due to TD-001 (naming inconsistency), executing this swap would have INVERTED the display labels. S005-S007 would display as "Tier 0 — Explorer" (demotion) and S008-S009 would display as "Tier 1 — Verified" (promotion) — the opposite of the PD's intent.
- **Resolution:** Flagged to PD with full explanation of the naming inconsistency. PD confirmed current values are correct as-is. Session 9E changes discarded entirely. Documented as DEC-017.
- **Lesson:** TD-001 tier naming inconsistency creates real risk of incorrect changes. This is the strongest argument for resolving TD-001 post-demo.

### TD-019: Blind Match Feature Removal (DEC-005)
- **Severity:** N/A (deliberate product decision)
- **Date:** 16 March 2026 (Session 3-4)
- **Status:** ✅ Removed for demo — may be reinstated
- **What Was Changed:** The Blind Match flow (Phase 4) anonymized applicant profiles — names, photos, and nationalities hidden from current residents. Matching was based purely on GCC Score, lifestyle activities, and personality traits.
- **Why Removed:** For investor demo, showing full applicant profiles (name, nationality, etc.) to landlords is more compelling and demonstrates data richness. UAE does not have equivalent of UK Equality Act for tenant selection.
- **Legal Note:** UAE Federal Law No. 45 of 2021 (Personal Data Protection) governs how nationality data is stored and processed. Legal review pending post-demo.
- **Future:** May reinstate blind matching or add consent layer based on legal advice.

---

## SECTION 6 — Documentation Drift

### TD-006: Briefing Document Out of Sync (RESOLVED)
- **Priority:** High
- **Date Identified:** 17 March 2026
- **Date Resolved:** 17 March 2026
- **Status:** ✅ Resolved
- **Issue:** `nestmatch_product_director_briefing.docx` had different personas than implementation. Persona names, tiers, and counts diverged.
- **Resolution:** Created `docs/PRODUCT_DIRECTOR_BRIEFING_v2.md` aligned with implementation. Original DOCX preserved for audit trail.

### TD-003: Orphaned User Records (RESOLVED)
- **Priority:** Medium
- **Date Identified:** 17 March 2026
- **Date Resolved:** 20 March 2026 (v2.13.0 ID Migration)
- **Status:** ✅ Resolved
- **Issue:** 25+ users in D1/mockData not in canonical 15-persona list (landlord-3, landlord-4, agent-3, roommate-3 through roommate-10, roommate-srch-0 through roommate-srch-3, roommate-res-new-0 through roommate-res-new-3).
- **Resolution:** v2.13.0 ID Format Migration deleted all 17 non-canonical users from D1 and mockData. Migration 0014 (11 phases) cleaned the database. All surviving users mapped to L001/S001/A001/ADM001 scheme.

### TD-004: Orphaned Property Records (RESOLVED)
- **Priority:** Medium
- **Date Identified:** 17 March 2026
- **Date Resolved:** 20 March 2026 (v2.13.0 ID Migration)
- **Status:** ✅ Resolved
- **Issue:** 14 properties in D1 vs 12 in canonical spec. 2 extra properties had no owner mapping.
- **Resolution:** v2.13.0 deleted 2 non-canonical properties and migrated remaining 12 to P001-P012 scheme.

### TD-005: ID Scheme Inconsistency (RESOLVED)
- **Priority:** Low
- **Date Identified:** 17 March 2026
- **Date Resolved:** 20 March 2026 (v2.13.0 ID Migration)
- **Status:** ✅ Resolved
- **Issue:** Mixed ID schemes across users (tier0-1, roommate-1, landlord-1) and properties (list-entry-1, etc.) with no clear pattern.
- **Resolution:** v2.13.0 standardised all IDs: users → L001/L002/A001/A002/S001-S009/ADM001/ADM002, properties → P001-P012. Updated across 6 D1 tables (102 queries), mockData, and 5+ frontend components.

---

## Resolved Items Summary

| ID | Issue | Date Found | Date Resolved | Resolution |
|----|-------|------------|---------------|------------|
| TD-000 | Data model deviation (40+ users) | 17 Mar | 17 Mar | Governance added, data locked |
| TD-003 | Orphaned users (25+) | 17 Mar | 20 Mar | v2.13.0 ID migration deleted non-canonical |
| TD-004 | Orphaned properties (2 extra) | 17 Mar | 20 Mar | v2.13.0 deleted extras |
| TD-005 | Mixed ID schemes | 17 Mar | 20 Mar | v2.13.0 standardised to L/S/A/ADM + P scheme |
| TD-006 | Briefing doc drift | 17 Mar | 17 Mar | PRODUCT_DIRECTOR_BRIEFING_v2.md created |
| TD-007 | CORS origin mismatch (prod 403s) | 19 Mar | 19 Mar | Fixed origin in wrangler.toml + cors.ts |
| TD-008 | Auth login blank profiles | 19 Mar | 19 Mar | Added /api/auth/me after login |
| TD-009 | Inbox messages inconsistent | 20 Mar | 21 Mar | Unified message sources |
| TD-010 | Priya viewing own home | 20 Mar | 20 Mar | Reassigned to Ravi |
| TD-011 | Dry inbox notifications | 20 Mar | 21 Mar | Added chat context |
| TD-012 | Package.json version 1.4.0 | 20 Mar | 20 Mar | Updated to 2.13.3 |
| TD-013 | mockStripeService deletion | 16 Mar | 16 Mar | Permanent — never recreate |
| TD-014 | ContractManagerPage deletion | 16 Mar | 16 Mar | Permanent — never recreate |
| TD-015 | Ledger/Wallet/Treasury removal | 17 Mar | 17 Mar | Permanent — CBUAE required |
| TD-018 | Session 9E tier swap (discarded) | 17 Mar | 17 Mar | Prevented — TD-001 would invert labels |
| TD-019 | Blind Match removal | 16 Mar | 16 Mar | Deliberate for demo |

---

## Open Items Summary

| ID | Issue | Priority | When to Fix |
|----|-------|----------|-------------|
| TD-001 | Tier naming inconsistency | Low | Post-demo (D1 migration required) |
| TD-002 | Demo @nestmatch.ae emails | Low | Post-demo (deliberate) |
| TD-016 | Rollup build in sandbox | Low | Environment fix (not production) |
| TD-017 | Git index.lock in sandbox | Low | Environment fix (not production) |

---

## Prevention Checklist (For Future Sessions)

Before any data model work, verify:
- [ ] Read CLAUDE.md governance section
- [ ] Current user count matches expected (15)
- [ ] Current property count matches expected (12)
- [ ] DATA MODEL CHANGE REQUEST format used for any additions
- [ ] Explicit approval received before INSERT/UPDATE
- [ ] D1 and mockData remain in sync

Before any deployment:
- [ ] `npx tsc --noEmit` returns zero errors
- [ ] `grep -r 'mockStripeService\|ContractManager' src/` returns nothing
- [ ] CORS origin matches exact Vercel URL (with hyphens)
- [ ] package.json version matches CLAUDE.md version
- [ ] Auth flow includes /api/auth/me profile fetch

Before any tier-related changes:
- [ ] Verify display label via `getTierLabel()` — do NOT trust code value names
- [ ] Test with DemoControls persona switch
- [ ] Confirm both D1 and mockData are aligned

---

*Review schedule: Before each sprint*
*Next review: Post-investor demo*
