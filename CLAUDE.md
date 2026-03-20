# NestMatch UAE — Claude Code Project Context

## 🚦 PROJECT STATUS (update every session)

| Field | Value |
|-------|-------|
| **Gate** | G6 — Pre-Demo (feature development complete) |
| **Version** | v2.13.0 |
| **Last Session** | 20 Mar 2026 — ID Format Migration (48+ columns, 22 tables) |
| **Blockers** | None — demo ready |
| **Next Priority** | QA testing, then Phase 2C (DocuSign integration) |
| **Risk Level** | 🟢 Green — no licence-requiring features in scope |

**Quick Context:**
- Frontend: React 19 + TypeScript + Vite → Vercel
- Backend: Cloudflare Workers + Hono + D1 + R2
- 15 canonical personas (LOCKED)
- 12 canonical properties (LOCKED)

---

## Project

NestMatch UAE is a compliance-first property discovery platform for Dubai shared housing.
Frontend: React 19 + TypeScript + Vite on Vercel.
Backend: Cloudflare Workers + Hono + D1 + R2.

**Live URLs:**
- Frontend: https://nest-match-uae.vercel.app
- Backend: https://nest-match-uae.pushkar-nagela.workers.dev
- Repo: https://github.com/HotspotVPN/Nest_Match_UAE

**Current version:** v2.13.0

---

## Hard constraints (never violate)

- No payment processing (no CBUAE/DIFC licence)
- No lease/tenancy contract drafting (no RERA broker licence)
- No escrow, deposit holding, rent collection
- Star-only ratings (no text — UAE Cybercrime Law)

### Listing compliance rules (Law No. 4 of 2026)

- NestMatch lists ROOMS, not bed-spaces
- Maximum occupancy per bedroom: 1 tenant
- Never create listings with "twin share", "shared bedroom",
  "bed-space", or any language implying multiple people per room
- Shared COMMON AREAS are fine (kitchen, bathroom, living room)
- Shared BEDROOMS are never compliant
- maxLegalOccupancy = number of bedrooms (1 person each)
- Occupancy display always shows "X/[total rooms]" not "X/[total beds]"
- This is the grey market NestMatch exists to eliminate —
  bed-space listings on our platform destroy compliance credibility
- Identity fields always masked in UI (Emirates ID, passport, UAE PASS ID)
- KYC docs in R2 KYC_DOCS bucket only (never IMAGES bucket)
- Occupancy count can NEVER go below 0 or above maxLegalOccupancy
- Never set verification_tier to 'gold' without UAE PASS OAuth completing

### Legal pages (never remove)

- src/pages/PrivacyPolicyPage.tsx — UAE Federal Law No. 45 compliance
- src/pages/TermsPage.tsx — legal boundary statements
- src/components/Footer.tsx — contains legal disclaimer
- The footer disclaimer "NestMatch is not a property management
  company, RERA-licensed broker, or financial services provider"
  must appear on every public page. Never remove or weaken this text.

### Anonymisation rules (premium features)

- Occupant profiles shown to searchers must NEVER include:
  name, photo, nationality, employer, exact age, contact info
- Occupant profiles may include: lifestyle tags, work schedule,
  noise preference, shared space habits, age RANGE, GCC Score,
  move-in date, match score
- Rejection reasons are predefined code strings only —
  'schedule', 'lifestyle', 'noise', 'habits'
- Never allow free-text rejection reasons (discrimination risk)
- Resident review signals are advisory — landlord has final authority

### Premium Features (no licence required)

- Premium tenant matching: occupant profiles, resident reviews
- GCC Score gamification: review points, rejection penalties
- Premium = Tier 2 Gold automatically (no payment until CBUAE licence)
- NEVER store free-text rejection reasons — predefined codes only

### TODO: Coming Soon Listings (premium feature, not yet built)

- Add 'coming_soon' as a Listing status value in types/index.ts
- Coming Soon = pre-market listings visible only to Tier 2 Gold users
- Landlords can list properties before they're publicly available
- Verified/premium tenants get early access to browse these
- Browse page: "Coming Soon" filter/section for premium users
- Standard users see a locked/blurred preview with upgrade CTA
- This is NOT "coming soon" placeholder text — it's a product feature

## Deleted files (never recreate)

- src/services/mockStripeService.ts
- src/pages/ContractManagerPage.tsx

---

## Verification Tier System

| Internal Value | Display Label | Identity | Access |
|---|---|---|---|
| `tier1_unverified` | Tier 0 — Explorer | Email/Google, no documents | Browse only |
| `tier0_passport` | Tier 1 — Verified | Passport + visa OR Emirates ID uploaded | Viewings, chat, sign DLD agreements |
| `tier2_uae_pass` | Tier 2 — Gold | UAE PASS OAuth (Emirates ID) | Full access — applications, contracts, GCC |

**Source of truth for display labels:** `src/utils/accessControl.ts` → `getTierLabel()`
**Source of truth for colours:** `src/utils/accessControl.ts` → `getTierColor()`

Never hardcode tier strings. Always use these functions.

---

## Frontend Architecture

### Key directories

```
src/pages/           — one file per route
src/components/      — reusable UI (Navbar, ChatPanel, ViewingsPanel,
                       ViewingAgreementModal, LeaseHandoffCard,
                       DemoControls, Toast, UAEPassOverlay, PassportKycModal,
                       ComplianceFlow, InboxBadge, ProtectedRoute)
src/contexts/        — AuthContext, DemoStateContext, ToastContext
src/data/            — mockData.ts (fallback when backend is down)
src/services/        — api.ts (smart fallback), apiMappers.ts
src/types/           — index.ts (single source of truth for all types)
src/utils/           — accessControl.ts (tier gating + display labels)
```

### Routes (all in App.tsx)

```
/                    → HomePage (public)
/login               → LoginPage (public)
/register            → RegisterLandingPage (public)
/register/tenant     → TenantSignupPage (public)
/register/landlord   → LandlordSignupPage (public)
/browse              → BrowsePage (public)
/how-it-works        → HowItWorksPage (public)
/listing/:id         → ListingDetailPage (public, supports slug or ID)
/profile/:id?        → ProfilePage (authenticated)
/viewings            → ViewingsPage (authenticated)
/chat                → ChatPage (authenticated)
/maintenance         → MaintenancePage (roommate)
/inbox               → InboxPage (authenticated)
/ejari               → EjariDocumentsPage (authenticated)
/dashboard           → LandlordDashboardPage (landlord/agent)
/residing-dashboard  → ResidingDashboardPage (landlord/agent)
/analytics           → ViewingAnalyticsPage (operations/compliance admin)
/compliance          → CompliancePage (compliance admin)
/customers           → CustomerDatabasePage (operations admin)
/gcc                 → GccDashboardPage (authenticated)
/add-property        → AddPropertyPage (landlord/agent)
/my-properties       → MyPropertiesPage (landlord/agent)
/privacy             → PrivacyPolicyPage (public)
/terms               → TermsPage (public)
```

### Premium Status (layered on top of tiers)

| Status | Who | Access |
|---|---|---|
| Standard | All users by default | Normal platform features per tier |
| Premium | Tier 2 Gold users (auto-granted) | See occupant profiles, review applicants, GCC Score boost |

Premium status is NOT a tier — it's an overlay. A Tier 2 Gold user
is automatically premium. A Tier 1 Verified user must upgrade to
Tier 2 first. Tier 0 Explorers cannot access premium features.

### Slug routing

All listings and users have a `slug` field generated from their name/title.
Lookup pattern: try slug first, fall back to ID.

```tsx
const listing = listings.find(l => l.slug === id || l.id === id);
```

### Foundation systems (available to all components)

- **DemoStateContext** (`useDemoState()`): Mutable state layer over mockData.
- **ToastContext** (`useToast()`): `showToast(message, type)` where type = 'success' | 'error' | 'info' | 'warning'. Auto-dismiss 4s.
- **DemoControls**: Floating bottom-right panel for persona switching + quick actions.
- **UAEPassOverlay**: Reusable mock UAE PASS authentication modal.
- **ProtectedRoute**: Auth guard — redirects to /login?return=... if not authenticated.

### API fallback pattern

1. Frontend health-checks backend on first API call (3s timeout)
2. Result cached for 30 seconds
3. If backend live → real D1 data via apiMappers.ts
4. If backend down → mock data from src/data/mockData.ts
5. Zero UI disruption either way

---

## Backend Architecture — Cloudflare D1 State Machines

The backend is NOT just CRUD. Every major entity has a state machine.
Before building any backend route, read the relevant state machine here.

### Room occupancy states

```
available → pending_approval → occupied → notice_given → available
available → viewing_confirmed → occupied
occupied → removed_by_landlord → available
```

Every state transition MUST:
1. Write to room_occupancy (current state)
2. Write to occupancy_events (audit log — never delete)
3. Update properties.current_occupants count
4. Never go below 0 or above maxLegalOccupancy

### Viewing states

```
PENDING → CONFIRMED → AGREEMENT_SENT → AGENT_SIGNED →
FULLY_SIGNED → COMPLETED | NO_SHOW_TENANT | NO_SHOW_LANDLORD | CANCELLED
```

Every state transition MUST:
1. Write to viewing_bookings (current state)
2. Write to viewing_events (audit log)
3. If FULLY_SIGNED: trigger room_occupancy → pending_approval

### User verification states

```
explorer → verified (passport upload) → gold (UAE PASS)
explorer → verified (emirates_id upload) → gold (UAE PASS)
```

Every state transition MUST:
1. Write to users.verification_tier
2. Write to kyc_documents (if document uploaded)
3. Write to verification_events (audit log)

### D1 Tables (24 built)

**Core tables (migration 0001-0003):**
users, properties, room_occupancy, viewing_bookings,
property_ratings, maintenance_tickets, chat_channels,
chat_messages, applications, rent_ledgers

**State machine tables (migration 0004):**
oauth_tokens, kyc_documents, occupancy_events,
viewing_agreements, agreement_signatures,
tenancy_events, verification_events

**Feature tables (migration 0008-0011):**
inbox_messages, ejari_documents

**Schema additions (migration 0005):**
slug columns on users and properties

### API Routes (28+ built)

| Category | Routes |
|---|---|
| Auth | POST /register, /login, GET /me, POST /auth/google, /auth/uae-pass |
| Properties | GET /, GET /:id, POST / |
| Users | GET /me, PATCH /me, GET /:id |
| Viewings | GET /, POST /, PATCH /:id/accept, /:id/decline |
| Agreements | GET /:id, POST /, PATCH /:id/sign |
| KYC | POST /upload, GET /my-documents, PATCH /:id/review |
| Occupancy | PATCH /rooms/:num, POST /notice, /move-out |
| GCC | POST /users/:id/recalculate-gcc |
| Ratings | GET /:propertyId/ratings, POST /:propertyId/ratings |
| Payments | GET /, POST / |
| Inbox | GET /, GET /unread-count, PATCH /:id/read, POST /mark-all-read, PATCH /:id/action |
| Ejari | GET /, GET /stats/summary, GET /:id, POST / |
| Maintenance | GET / |
| Chat | GET /channels |

### Rule for Claude Code

Never build a frontend feature that requires a missing backend route. Either:
A) Use mock data fallback and add `// TODO: wire to [route]`
B) Ask the user before proceeding

Never silently build a fake implementation that looks real but writes nowhere.

---

## After every code change

Run: `npx tsc --noEmit` — zero errors required.

---

## Git Rules — read carefully, never deviate

### NEVER do these without explicit user confirmation:

- git commit
- git push
- git add (as part of a commit flow)

### ALWAYS do this instead:

When a session's work is complete, present this summary
and WAIT for the user to say "yes commit" or "commit and push":

```
READY TO COMMIT — please confirm

Version bump: v[X.X.X] → v[X.X.X]
Branch: [current branch]
Remote: [git remote -v output]

Files changed:
  [list every modified/created/deleted file]

Commit message:
  "Session [N] — [feature]: [one line summary]"

Docs that will be updated before committing:
  - docs/CHANGELOG.md → [what will be added]
  - docs/PRODUCT_ROADMAP.md → [what will be ticked]
  - README.md → [what will change, if anything]

Type "confirm commit" to proceed.
Type "confirm commit and push" to commit + push to Vercel.
```

### When user confirms commit only:

1. Update docs/CHANGELOG.md with this session's changes
2. Update docs/PRODUCT_ROADMAP.md — tick completed items
3. Update README.md if routes, users, stack, or setup changed
4. Run npx tsc --noEmit — must be zero errors
5. git add -A
6. git commit -m "[message]"
7. Report: "Committed. Run 'confirm push' when ready to deploy."

### When user confirms commit AND push:

1-6. Same as above
7. git push origin [branch]
8. Report: "Pushed. Vercel will auto-deploy —
   check vercel.com/dashboard to confirm build passes."

### Version numbering rule

PATCH (v2.0.x) — bug fixes, copy changes, style tweaks
MINOR (v2.x.0) — new feature, new page, new component
MAJOR (vx.0.0) — phase unlock (e.g. wallet system, RERA licence)

### README.md update rules

The README must always reflect:
- Current version number at the top
- Accurate demo login list (all tiers shown)
- Correct live URLs (Vercel + Workers)
- Accurate feature list (nothing removed from code
  should appear as a feature)
- Removed features listed under "Out of scope" section

### Branch safety

Before any commit, always run:
  git remote -v
  git branch --show-current
Show the output to the user so they can confirm
they are on the right branch before proceeding.
Never push to main without user seeing the remote URL first.

---

## Docs Maintenance — mandatory on every commit

The `/docs` folder in this repo is a living product record.
Every session that changes the product MUST update the relevant
docs file before committing. This is non-negotiable.

### Rule

If you built it, changed it, or deleted it — document it.
The docs folder is the source of truth for any new developer,
investor, or legal reviewer reading this repo cold.

### Files to maintain

- docs/CHANGELOG.md — every version bump and what changed
- docs/ARCHITECTURE.md — current tech stack and system design
- docs/DECISIONS.md — why things were removed or changed
- docs/PRODUCT_ROADMAP.md — what's built, what's next
- docs/COMPLIANCE.md — legal constraints and what's in scope

### On every commit, update at minimum:

- CHANGELOG.md with what changed this session
- DECISIONS.md if anything was deleted or a constraint was hit

---

## Superpowers Integration

Superpowers is installed. Its skills trigger automatically.
NestMatch-specific overrides that take precedence over
any Superpowers skill:

### brainstorming skill override

When brainstorming fires before any new feature:
- Always check the Constraints section of this file first
- Any feature touching payments, escrow, rent collection,
  or tenancy contracts must be flagged immediately
  as out of scope — do not brainstorm implementation,
  brainstorm alternatives that stay in scope
- Save design docs to docs/superpowers/specs/ as instructed

### subagent-driven-development override

When dispatching subagents:
- Every subagent must receive the hard constraints
  section from this CLAUDE.md in its context
- No subagent may create, restore, or reference
  mockStripeService.ts or ContractManagerPage.tsx
- Each subagent must run npx tsc --noEmit on completion

### systematic-debugging override

When debugging:
- Check accessControl.ts getTierLabel() FIRST
  for any tier display bug — this is the source of truth
- Never hardcode tier strings as a debugging fix

### finishing-a-development-branch override

When finishing a branch:
- Always update docs/CHANGELOG.md before merge
- Always present the git remote -v output to the
  user before any push
- Never auto-push — wait for explicit confirmation

### verification-before-completion override

Before marking any task complete:
- npx tsc --noEmit must return zero errors
- grep for 'mockStripeService\|ContractManager' in src/
  must return nothing
- Both must pass or the task is not complete

---

## DATA MODEL GOVERNANCE (MANDATORY)

This section was added after the Data Model Deviation Incident of 17 March 2026.
All Claude Code sessions MUST follow these rules.

### CANONICAL DEMO DATA (LOCKED — DO NOT MODIFY)

#### 15 Approved Personas

| ID | Name | Role | Tier | Email |
|----|------|------|------|-------|
| L001 | Ahmed Al Maktoum | Landlord | tier2_uae_pass | ahmed@nestmatch.ae |
| L002 | Fatima Hassan | Landlord | tier2_uae_pass | fatima@nestmatch.ae |
| A001 | Khalid Al Rashid | Agent | tier2_uae_pass | khalid@dubaipropertygroup.ae |
| A002 | Tariq Mahmood | Agent | tier2_uae_pass | tariq@agency.ae |
| S001 | Priya Sharma | Residing Tenant | tier2_uae_pass | priya@nestmatch.ae |
| S002 | Marcus Chen | Residing Tenant | tier2_uae_pass | marcus.chen@email.com |
| S003 | Aisha Patel | Searching Tenant | tier2_uae_pass | aisha.patel@email.com |
| S004 | James Morrison | Searching Tenant | tier2_uae_pass | james.morrison@email.com |
| S005 | James Okafor | Searching Tenant | tier0_passport | james@nestmatch.ae |
| S006 | Sofia Kowalski | Searching Tenant | tier0_passport | sofia@nestmatch.ae |
| S007 | Ravi Menon | Searching Tenant | tier0_passport | ravi.menon@gmail.com |
| S008 | Liam O'Brien | Searching Tenant | tier1_unverified | liam@nestmatch.ae |
| S009 | Amara Diallo | Searching Tenant | tier1_unverified | amara.diallo@email.com |
| ADM001 | Sara Al Hashimi | Compliance Admin | tier2_uae_pass | compliance@nestmatch.ae |
| ADM002 | Rashid Khalil | Operations Admin | tier2_uae_pass | operations@nestmatch.ae |

**This list is FINAL. Do not add, remove, or modify without explicit Product Director approval.**

### APPROVAL GATES

#### STOP — These Actions Require Explicit Approval BEFORE Execution:

1. **Adding users to D1 or mockData** — even one user requires approval
2. **Removing users from D1 or mockData** — must list which users and why
3. **Changing user attributes** — tier, email, ID, or role changes
4. **Adding properties to D1 or mockData** — must list ID, address, landlord
5. **Running D1 migrations that INSERT or UPDATE user/property data** — show exact SQL first, wait for "approved"

#### OK — These Actions Can Proceed Without Approval:

- Reading existing data
- Fixing bugs that don't change data structure
- Adding new API routes
- UI changes that don't affect data model
- TypeScript type fixes

### HOW TO REQUEST APPROVAL

```
DATA MODEL CHANGE REQUEST

Current state:
  - Users in canonical list: 15
  - Properties in canonical list: 12

Proposed change:
  - Action: [ADD/REMOVE/MODIFY]
  - Target: [User/Property]
  - Details: [Exact names, IDs, values]

Reason: [Why this change is needed]

Waiting for explicit approval before proceeding.
```

### IF ASKED TO "ADD MORE DATA"

STOP and ask:
> "The canonical demo list has 15 personas. Do you want me to:
> A) Use existing personas from the canonical list (recommended)
> B) Add new personas (requires your approval of names, tiers, IDs)"

### TIER SYSTEM REFERENCE

| Code Value | Display Label | Access Level |
|------------|---------------|--------------|
| `tier0_passport` | Tier 0 — Explorer | Browse only, blurred profiles, locked contacts |
| `tier1_unverified` | Tier 1 — Verified | Request viewings, chat, sign agreements |
| `tier2_uae_pass` | Tier 2 — Gold | All access, auto-Premium, priority support |

**Note:** `tier1_unverified` displays as "Verified" — known naming inconsistency (see docs/TECH_DEBT.md TD-001).

---

## How Claude Code should handle ambiguous instructions

When an instruction could be interpreted multiple ways,
or when building it would require decisions that affect
other parts of the system, STOP and ask before building.

Examples that require clarification before proceeding:
- Any change to room_occupancy must ask:
  "Should this write to occupancy_events audit log?"
- Any new API route must ask:
  "Does this route need auth middleware?"
- Any user state change must ask:
  "Should this write to verification_events?"

Never silently make these decisions.
Never build a feature that looks complete but
writes to no persistent storage.

---

## Agent Coordination Protocol

### File boundaries

- **Frontend agent** owns: `src/`, `public/`, `index.html`, `vite.config.ts`,
  `tsconfig.json`, `package.json` (root), `.env.*`
- **Backend agent** owns: `backend/` (all files within)
- **Shared** (both read, coordinate before editing): `CLAUDE.md`,
  `docs/`, `README.md`, `vercel.json`, `.gitignore`
- **Never cross boundaries** — frontend agent must not edit
  `backend/src/` files, backend agent must not edit `src/` files

### Coordination points

- `src/services/api.ts` — frontend reads this; backend defines
  the routes it calls. If backend adds/changes a route, frontend
  must update api.ts to match.
- `src/types/index.ts` — frontend source of truth for types.
  Backend must match these shapes in API responses.
- `backend/src/types.ts` — backend source of truth for Env bindings.
  Frontend does not read this directly.
- `src/services/apiMappers.ts` — maps D1 snake_case to frontend
  camelCase. Must be updated when backend schema changes.

### Progress reporting format

Each agent reports progress as:

```
[AGENT] [STATUS] [FILE] — [what changed]
Example:
[FRONTEND] DONE src/pages/BrowsePage.tsx — added Coming Soon filter
[BACKEND] DONE backend/src/routes/kyc.ts — added PATCH review endpoint
[FRONTEND] BLOCKED — waiting for backend /api/agreements route
```

### Deployment Coordination

**Frontend deploy (Vercel):**
- Triggered by: git push to main
- Agent must: Run `npm run build` first, verify no errors
- Notify: Backend agent of new frontend version

**Backend deploy (Cloudflare):**
- Triggered by: `wrangler deploy`
- Agent must: Run migrations first, verify D1 updated
- Notify: Frontend agent of new API version

**Simultaneous deploy:**
- Both agents coordinate timing
- Backend deploys first (to avoid 404s)
- Frontend deploys 30s later (after backend health check passes)

---

## SESSION PROTOCOL (NEW — FRAMEWORK ADDITION)

Every Claude Code session MUST follow this protocol.
See `docs/SESSION_PROTOCOL.md` for full details.

### Session Start Ritual

1. Read this CLAUDE.md completely
2. Check PROJECT STATUS table at top
3. Read `docs/SESSION_LOG.md` for last session summary
4. Run `npx tsc --noEmit` to verify clean state
5. Announce: "Session started. Last session: [X]. Current gate: [Y]. Ready for instructions."

### Session End Ritual

1. Run `npx tsc --noEmit` — must be zero errors
2. Run `grep -r 'mockStripeService\|ContractManager' src/` — must be empty
3. Update PROJECT STATUS table at top of this file
4. Append session summary to `docs/SESSION_LOG.md`
5. Present commit summary (per Git Rules above)

### Context Persistence

If session is interrupted or context is compacted:
- Read `/mnt/transcripts/` for conversation history
- Read `docs/SESSION_LOG.md` for structured state
- Re-verify with `npx tsc --noEmit` before resuming

---

## PRE-DEPLOY CHECKLIST (NEW — FRAMEWORK ADDITION)

Before any deployment to production (Vercel or Cloudflare), ALL items must pass:

### Code Quality

- [ ] `npx tsc --noEmit` returns zero errors
- [ ] `npm run build` completes successfully
- [ ] `grep -r 'mockStripeService\|ContractManager' src/` returns nothing
- [ ] No `console.log` statements in production code (except error handlers)
- [ ] No hardcoded tier strings (all use `getTierLabel()`)

### Compliance

- [ ] Footer disclaimer present on all public pages
- [ ] No payment/escrow/contract features added
- [ ] No bed-space language in any listing
- [ ] Identity fields masked in UI
- [ ] KYC docs only in R2 KYC_DOCS bucket

### Data Integrity

- [ ] No new users added without approval
- [ ] No new properties added without approval
- [ ] Canonical 15 personas unchanged
- [ ] All state transitions write to audit logs

### Documentation

- [ ] CHANGELOG.md updated
- [ ] DECISIONS.md updated (if constraints hit)
- [ ] README.md version number matches
- [ ] SESSION_LOG.md updated

### Git Safety

- [ ] `git remote -v` shown to user
- [ ] `git branch --show-current` shown to user
- [ ] User explicitly confirmed "commit and push"

---

## RISK-GATED FEATURES (NEW — FRAMEWORK ADDITION)

Some features require extra scrutiny before implementation.

### 🔴 RED — Never Build (licence required)

- Payment processing
- Escrow / deposit holding
- Rent collection
- Tenancy contract drafting
- Security deposit management

If a feature request touches these, STOP immediately and say:
> "This feature requires [CBUAE/RERA] licence. Out of scope. Would you like me to brainstorm an alternative that stays in scope?"

### 🟡 YELLOW — Build with Caution

- Anything touching verification_tier
- Anything modifying room_occupancy counts
- Anything with legal implications (agreements, signatures)
- Anything that could store PII beyond what's already stored

For yellow features:
1. Present risk assessment before building
2. Get explicit "proceed" from user
3. Add extra audit logging
4. Document in DECISIONS.md

### 🟢 GREEN — Build Freely

- UI improvements
- Bug fixes
- New pages that don't touch restricted data
- Performance optimizations
- Documentation updates

---

## STAKEHOLDER APPROVALS (NEW — FRAMEWORK ADDITION)

Track approvals for major decisions.

### Approval Log

| Date | Decision | Approved By | Gate |
|------|----------|-------------|------|
| 17 Mar 2026 | Lock 15 canonical personas | Product Director | G3 |
| 17 Mar 2026 | Lock 12 canonical properties | Product Director | G3 |
| 17 Mar 2026 | Discard Session 9E (tier value change) | Product Director | G6 |
| 18 Mar 2026 | Phase 2A (ComplianceFlow) approved | Product Director | G6 |
| 18 Mar 2026 | Phase 2B (Inbox) approved | Product Director | G6 |
| 19 Mar 2026 | Ejari Document Storage approved | Product Director | G6 |

### Who Approves What

| Decision Type | Approver | How to Request |
|---------------|----------|----------------|
| Data model changes | Product Director | DATA MODEL CHANGE REQUEST format |
| New features | Product Director | Feature spec in docs/superpowers/specs/ |
| Compliance changes | Legal | Email + DECISIONS.md entry |
| Infrastructure changes | Tech Lead | Architecture doc update |

---

## Quick Reference (NEW — FRAMEWORK ADDITION)

### Commands to run before any commit

```bash
npx tsc --noEmit
npm run build
grep -r 'mockStripeService\|ContractManager' src/
git remote -v
git branch --show-current
```

### Files to update on every commit

- docs/CHANGELOG.md
- docs/SESSION_LOG.md
- PROJECT STATUS table (top of this file)

### Files to update when constraints are hit

- docs/DECISIONS.md
- docs/COMPLIANCE.md

### Never recreate these files

- src/services/mockStripeService.ts
- src/pages/ContractManagerPage.tsx
