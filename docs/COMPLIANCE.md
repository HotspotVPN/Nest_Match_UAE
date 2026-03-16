# Compliance Reference — NestMatch UAE

## What NestMatch is legally authorised to do

### Identity verification
- UAE PASS OAuth (Tier 2): official UAE digital identity
- Passport + residence visa upload and R2 storage (Tier 0)
- Display of verification status to landlords/agents

### Property discovery
- Listing, browsing, and filtering of shared housing
- Display of Makani numbers, Trakheesi permits, Municipality permits
- Occupancy status per DLD shared housing regulations

### Viewing coordination
- Scheduling viewings between tenant and landlord/agent
- Generating and collecting digital signatures on the official
  DLD Property Viewing Agreement (DLD/RERA/RL/LP/P210/No.3/Vr.4)
- Recording viewing outcomes (completed / no-show)
- Analytics on viewing demand by district

### Post-viewing handoff
- Providing tenants and landlords with their signed DLD agreement
- Directing parties to RERA-licensed brokers for tenancy contracts
- Linking to DLD broker search (dubailand.gov.ae)

---

## What requires licences NestMatch does not currently hold

| Activity | Licence Required | Status |
|---|---|---|
| Payment processing | CBUAE / DIFC | Not held — out of scope |
| Escrow / deposit holding | CBUAE | Not held — out of scope |
| Rent collection | CBUAE | Not held — out of scope |
| Tenancy contract drafting | RERA broker licence | Not held — out of scope |
| Property management | RERA | Not held — future phase |

---

## Relevant UAE regulations

### Dubai Law No. 4 of 2026
Governs shared housing in Dubai. NestMatch aligns listings
with occupancy caps and permit requirements defined here.

### RERA Circular No. 3 of 2021
Mechanism for service fee collection — not applicable to NestMatch
(applies to jointly-owned property management companies only).

### DLD/RERA/RL/LP/P210/No.3/Vr.4 (August 2022)
Official Property Viewing Agreement form. NestMatch digitises
this form. Both parties sign digitally. Record kept in platform.

### UAE Federal Decree-Law No. 34 of 2021 (Cybercrime Law)
Governs digital communications and data. Property ratings in
NestMatch are star-sliders only — no text fields — to avoid
defamation risk under this law.

### UAE Federal Law No. 45 of 2021 (Personal Data Protection)
Governs processing of personal data including nationality.
KYC documents (passport, visa) stored in private R2 bucket only.
Identity fields masked in UI. Legal review pending on nationality
display in applicant review.

---

## Identity data handling rules

| Field | Storage | Display rule |
|---|---|---|
| Emirates ID number | D1 users table | Masked: 784-****-*****-1 |
| Passport number | D1 + R2 KYC_DOCS | Masked: A1**** |
| UAE PASS ID | D1 users table | Masked in all UI |
| Passport scan | R2 KYC_DOCS (private) | Never displayed, admin only |
| Visa page scan | R2 KYC_DOCS (private) | Never displayed, admin only |
| Nationality | D1 users table | Displayed — legal review pending |

---

## Files permanently deleted (do not recreate)

| File | Reason |
|---|---|
| src/services/mockStripeService.ts | No CBUAE licence |
| src/pages/ContractManagerPage.tsx | No RERA broker licence |
| DirectDebitMandate interface | No fintech licence |
| BankDetails on User type | No fintech licence |
