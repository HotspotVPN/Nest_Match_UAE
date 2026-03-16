---
name: nestmatch-security-audit
description: >
  Security audit for NestMatch UAE code changes. Run at end of every
  session or when the user says "security check", "audit this",
  or "check for issues". Covers secrets, input sanitisation,
  KYC exposure, and accidental fintech reintroduction.
allowed-tools: Read, Grep, Glob, Bash
---

# NestMatch Security Audit

Run these seven checks in order. Report findings per check.

## Check 1: Leaked secrets
Grep all frontend files for: API_KEY, SECRET, TOKEN, STRIPE,
hardcoded AE (IBAN prefix), hardcoded +971 phone numbers in code
(not mockData). Flag anything not behind import.meta.env.

## Check 2: SQL parameterisation
Search backend/src for any string concatenation into SQL queries.
All D1 queries must use .bind() parameterisation.

## Check 3: KYC data exposure
Search for r2_key, kyc_documents, passport_number, emiratesId.
Confirm none appear in: console.log, response bodies without auth,
or the IMAGES R2 bucket (must be KYC_DOCS only).

## Check 4: Identity masking
Search for emiratesId, passport_number, uaePassId rendering in JSX.
Every render must pass through a masking function.
Flag any raw display.

## Check 5: Accidental fintech
Grep for: stripe, escrow, DirectDebit, BankDetails, payment_intent,
card_hold, rent_collect, cheque, rent_ledger in src/.
These must not exist anywhere except as deleted references in git history.

## Check 6: Rate limiting
Check backend/src/routes/auth.ts for rate limiting middleware.
Flag if missing on /login, /register, /uae-pass-callback.

## Check 7: TypeScript
Run: npx tsc --noEmit
Report exact error count. Zero is the only passing score.

## Output format
PASS or FAIL per check. Summary line.
If any FAIL: list file + line number + fix required.
