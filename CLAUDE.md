# NestMatch UAE — Claude Code Project Context

## Project
NestMatch UAE is a compliance-first property discovery platform for Dubai shared housing.
Frontend: React 19 + TypeScript + Vite on Vercel.
Backend: Cloudflare Workers + Hono + D1 + R2.

**Live URLs:**
- Frontend: https://nest-match-uae.vercel.app
- Backend: https://nest-match-uae.pushkar-nagela.workers.dev
- Repo: https://github.com/HotspotVPN/Nest_Match_UAE

**Current version:** v2.6.0

---

## Hard constraints (never violate)
- No payment processing (no CBUAE/DIFC licence)
- No lease/tenancy contract drafting (no RERA broker licence)
- No escrow, deposit holding, rent collection
- Star-only ratings (no text — UAE Cybercrime Law)
- Identity fields always masked in UI (Emirates ID, passport, UAE PASS ID)
- KYC docs in R2 KYC_DOCS bucket only (never IMAGES bucket)
- Occupancy count can NEVER go below 0 or above maxLegalOccupancy
- Never set verification_tier to 'gold' without UAE PASS OAuth completing

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
                       DemoControls, Toast, UAEPassOverlay, PassportKycModal)
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
/profile/:id?        → ProfilePage (authenticated, supports slug or ID)
/viewings            → ViewingsPage (authenticated)
/chat                → ChatPage (authenticated)
/maintenance         → MaintenancePage (roommate)
/dashboard           → LandlordDashboardPage (landlord/agent)
/residing-dashboard  → ResidingDashboardPage (landlord/agent)
/analytics           → ViewingAnalyticsPage (operations/compliance admin)
/compliance          → CompliancePage (compliance admin)
/customers           → CustomerDatabasePage (operations admin)
/gcc                 → GccDashboardPage (authenticated)
/wallet              → LandlordWalletPage (landlord/agent)
/add-property        → AddPropertyPage (landlord/agent)
/ledger              → RentLedgerPage (authenticated)
```

### Slug routing
All listings and users have a `slug` field generated from their name/title.
Lookup pattern: try slug first, fall back to ID.
```tsx
const listing = listings.find(l => l.slug === id || l.id === id);
```

### Foundation systems (available to all components)
- **DemoStateContext** (`useDemoState()`): Mutable state layer over mockData. Holds viewingOverrides, tierOverrides, kycSubmissions, occupancyOverrides, applicantDecisions, etc. Components read mockData first, then check demoState for overrides.
- **ToastContext** (`useToast()`): `showToast(message, type)` where type = 'success' | 'error' | 'info' | 'warning'. Auto-dismiss 4s. Use for all user feedback.
- **DemoControls**: Floating bottom-right panel for persona switching + quick actions. Renders when authenticated.
- **UAEPassOverlay**: Reusable mock UAE PASS authentication modal. Used in landlord signup and tenant Tier 2 upgrade.

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

### D1 Tables (all built)

**Core tables (migration 0001-0003):**
users, properties, room_occupancy, viewing_bookings,
property_ratings, maintenance_tickets, chat_channels,
chat_messages, applications, rent_ledgers

**State machine tables (migration 0004):**
oauth_tokens, kyc_documents, occupancy_events,
viewing_agreements, agreement_signatures,
tenancy_events, verification_events

**Schema additions (migration 0005):**
slug columns on users and properties

### API Routes (23 built)

| Category | Route | Status |
|---|---|---|
| Auth | POST /register, /login, GET /me | Built |
| Auth OAuth | POST /auth/google, /auth/uae-pass | Built (mock) |
| Properties | GET /, GET /:id, POST / | Built |
| Users | GET /me, PATCH /me, GET /:id | Built |
| Viewings | GET /, POST /, PATCH /:id/accept, /:id/decline | Built |
| KYC | POST /upload, GET /my-documents, PATCH /:id/review | Built |
| Occupancy | PATCH /rooms/:num, POST /notice, /move-out | Built |
| GCC | POST /users/:id/recalculate-gcc | Built |
| Ratings | GET /:propertyId/ratings, POST /:propertyId/ratings | Built |
| Payments | GET /, POST / | Built |

### API routes NOT yet built
```
POST /api/agreements           (create DLD viewing agreement in D1)
PATCH /api/agreements/:id/sign (persist signature to D1)
POST /api/tenancy/move-in      (confirm tenant moves in)
```

### Rule for Claude Code
Never build a frontend feature that requires one of the
missing routes above. If a frontend action needs backend
data that doesn't exist, either:
A) Use mock data fallback (already implemented) and
   add a `// TODO: wire to [route]` comment
B) Ask the user before proceeding
Never silently build a fake implementation that looks
real but writes nowhere.

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
