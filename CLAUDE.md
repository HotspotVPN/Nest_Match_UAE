# NestMatch UAE — Claude Code Project Context

## Project
NestMatch UAE is a compliance-first property discovery platform for Dubai shared housing.
Frontend: React 19 + TypeScript + Vite on Vercel.
Backend: Cloudflare Workers + Hono + D1 + R2.

## Hard constraints (never violate)
- No payment processing (no CBUAE/DIFC licence)
- No lease/tenancy contract drafting (no RERA broker licence)
- No escrow, deposit holding, rent collection
- Star-only ratings (no text — UAE Cybercrime Law)
- Identity fields always masked in UI
- KYC docs in R2 KYC_DOCS bucket only (never IMAGES)

## Deleted files (never recreate)
- src/services/mockStripeService.ts
- src/pages/ContractManagerPage.tsx

## After every code change
Run: `npx tsc --noEmit` — zero errors required.

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
