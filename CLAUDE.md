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

---

## Git Rules — read carefully, never deviate

### NEVER do these without explicit user confirmation:
- git commit
- git push
- git add (as part of a commit flow)

### ALWAYS do this instead:
When a session's work is complete, present this summary
and WAIT for the user to say "yes commit" or "commit and push":

---
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
---

### When user confirms commit only:
1. Update docs/CHANGELOG.md with this session's changes
2. Update docs/PRODUCT_ROADMAP.md — tick completed items
3. Update README.md if any of these changed:
   - New routes added
   - New demo login users added
   - Tech stack changed
   - Setup instructions changed
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

Current version: v2.3.0 (after Sessions 4-6)
Next session starts at: v2.3.0

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
- grep for 'mockStripeService\|ContractManager\|Basic\|Tier 2'
  in src/ must return nothing
- All three must pass or the task is not complete
