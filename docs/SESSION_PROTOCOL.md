# NestMatch UAE — Session Protocol

## Purpose

This document defines how Claude Code sessions should start, run, and end to maintain continuity across sessions. It supplements CLAUDE.md with operational procedures.

---

## Session Start Ritual

Every Claude Code session MUST begin with these steps in order:

### Step 1: Read Context (30 seconds)

1. Read CLAUDE.md completely
2. Check PROJECT STATUS table at top
3. Note current gate, version, blockers
4. Note last session summary

### Step 2: Check Session Log (15 seconds)

```bash
cat docs/SESSION_LOG.md | tail -50
```

Review what was built last, what was left incomplete, any warnings.

### Step 3: Verify Clean State (15 seconds)

```bash
npx tsc --noEmit
```

If errors exist: DO NOT proceed. Report to user and ask whether to fix first.

### Step 4: Announce Ready

```
Session started.
Last session: [summary from SESSION_LOG.md]
Current gate: [from PROJECT STATUS]
Current version: [from PROJECT STATUS]
Blockers: [from PROJECT STATUS or "none"]

Ready for instructions.
```

---

## During Session

### Progress Reporting

```
[FRONTEND] DONE src/pages/BrowsePage.tsx — added Coming Soon filter
[BACKEND] DONE backend/src/routes/kyc.ts — added PATCH review endpoint
[FRONTEND] BLOCKED — waiting for backend /api/agreements route
```

### When You Hit a Constraint

```
CONSTRAINT HIT

Constraint: [quote from CLAUDE.md]
Your request: [what user asked for]
Impact: [what cannot be built]

Alternatives:
A) [alternative 1]
B) [alternative 2]

Which would you prefer?
```

### When You Need Approval

Use the DATA MODEL CHANGE REQUEST format from CLAUDE.md.

### When You're Uncertain

```
CLARIFICATION NEEDED

Your instruction: "[quote]"

I could interpret this as:
A) [interpretation 1]
B) [interpretation 2]

Which did you mean?
```

---

## Session End Ritual

### Step 1: Verification

```bash
npx tsc --noEmit
```

Must return zero errors.

### Step 2: Constraint Check

```bash
grep -r 'mockStripeService\|ContractManager' src/
```

Must return nothing.

### Step 3: Update PROJECT STATUS

Edit the PROJECT STATUS table at top of CLAUDE.md.

### Step 4: Update Session Log

Append to `docs/SESSION_LOG.md` using the template below.

### Step 5: Present Commit Summary

```
READY TO COMMIT — please confirm

Version bump: v[X.X.X] → v[X.X.X]
Branch: [branch]
Remote: [remote URL]

Files changed:
  [list all]

Commit message:
  "[message]"

Docs updated:
  - CHANGELOG.md
  - SESSION_LOG.md
  - PRODUCT_ROADMAP.md
  - README.md

Type "confirm commit" or "confirm commit and push".
```

### Step 6: Wait for Confirmation

DO NOT commit until user explicitly says "confirm commit" or similar.

---

## Context Recovery

If session is interrupted or context is compacted:

1. Read `docs/SESSION_LOG.md` for last session entry
2. Run `npx tsc --noEmit` and `git status` and `git log --oneline -5`
3. Announce what you found and ask whether to continue

---

## Emergency Procedures

### Accidental Commit

Report immediately. Offer `git reset --soft HEAD~1` but wait for approval.

### Accidental Push

Report immediately. Offer revert commit as safest option. Wait for approval.

### Forbidden File Created

Remove immediately. Report to user. Apologise.

### Compliance Boundary Hit

STOP. Report the boundary. Offer alternatives that stay in scope.

---

## Session Log Template

```markdown
## Session: [DATE]

### Summary
[One paragraph]

### Files Changed
- [file] — [what changed]

### Decisions Made
- [Decision]: [rationale]

### Left Incomplete
- [ ] [Task] — [reason]

### Warnings for Next Session
- [Context needed]

### Commit
- Version: v[X.X.X]
- Message: "[message]"
- Pushed: Yes/No
```

---

*Version 1.0 — 19 March 2026*
