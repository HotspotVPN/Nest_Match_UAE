---
name: nestmatch-session-close
description: >
  End-of-session checklist for NestMatch UAE. Run when the user says
  "wrap up", "end session", "commit this", or "we're done".
allowed-tools: Read, Bash, Grep
---

# Session Close

Run in this exact order. Do not skip steps.

## Step 1: TypeScript check
Run: npx tsc --noEmit
If errors exist: fix them before proceeding. Do not commit with errors.

## Step 2: Security spot-check
Run /nestmatch-security-audit
All 7 checks must pass.

## Step 3: Deleted files check
Confirm these do not exist:
- src/services/mockStripeService.ts
- src/pages/ContractManagerPage.tsx
Grep for 'ContractManager' and 'mockStripe' — must return nothing.

## Step 4: Session summary
Write a summary covering:
- What was built this session (file names + what changed)
- Key decisions made and why
- Any constraints hit or edge cases found
- Exactly what the next session should start with

## Step 5: Commit
Run:
git add -A
git commit -m "Session [N] — [feature]: [one line summary]"

## Step 6: Confirm Vercel
Remind user: "Vercel will auto-deploy from this commit.
Check vercel.com/dashboard to confirm the build passes."
