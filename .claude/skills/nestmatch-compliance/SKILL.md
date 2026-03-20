---
name: nestmatch-compliance
description: >
  NestMatch UAE compliance context. Load before any task touching
  verification tiers, DLD forms, viewing agreements, KYC uploads,
  UAE PASS, or anything involving user identity. Also load before
  any task that might accidentally reintroduce payment processing
  or lease agreement functionality.
allowed-tools: Read, Grep
---

# NestMatch Compliance Context

## Hard deleted — never recreate
- mockStripeService.ts — payment processing
- ContractManagerPage.tsx — lease drafting
- /contract route
- DirectDebitMandate, BankDetails on User type
- Any Stripe PaymentIntent, card hold, or escrow logic

## Legal lane (what we CAN build)
- DLD/RERA/RL/LP/P210/No.3/Vr.4 Property Viewing Agreement
  → digitised, pre-filled, digitally signed
- UAE PASS OAuth for Tier 2 identity
- Passport + visa page upload (R2 KYC_DOCS bucket) for Tier 0
- Viewing scheduling, outcome tracking, analytics dashboard
- RERA handoff card pointing users to licensed brokers

## Verification tiers
- tier0_passport: passport + visa in R2, can view/chat, cannot contract
- tier1_unverified: browse only
- tier2_uae_pass: full access

## Identity display rules
- Emirates ID: always mask → 784-****-*****-[last digit]
- Passport numbers: always mask → first 2 chars + **** + last 1
- UAE PASS IDs: always mask
- KYC docs: R2 KYC_DOCS bucket only, never IMAGES bucket

## After every edit
Run: npx tsc --noEmit
Zero errors required before considering task complete.
