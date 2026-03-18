# NestMatch UAE — Product Director Briefing (UPDATED)

**Version:** 2.0
**Date:** 17 March 2026
**Status:** ALIGNED WITH IMPLEMENTATION
**Classification:** CONFIDENTIAL

---

## 1. PURPOSE

This document is the **SINGLE SOURCE OF TRUTH** for all demo data in NestMatch UAE. It supersedes the previous briefing document (v1.0) which had diverged from implementation.

**CRITICAL:** All teams (Frontend, Backend, QA, Business) MUST reference this document. The login page demo personas are the canonical list.

---

## 2. TIER SYSTEM

NestMatch uses a 3-tier verification system:

| Tier | Name | Code Value | Verification Method | Capabilities |
|------|------|------------|---------------------|--------------|
| 0 | Explorer | `tier0_passport` | Email/Google OAuth | Browse (48hr delay), blurred profiles, locked contacts |
| 1 | Verified | `tier1_unverified` | Emirates ID + Passport | Request viewings, chat, sign DLD agreements |
| 2 | Gold | `tier2_uae_pass` | UAE PASS OAuth | All Tier 1 + auto-Premium, priority support, full access |

### Premium vs Tier (Important Distinction)

- **Tier** = Verification level (identity)
- **Premium** = Subscription status (payment)

A Tier 1 user can pay for Premium (AED 79/mo). A Tier 2 (Gold) user gets Premium automatically for free.

---

## 3. CANONICAL DEMO PERSONAS (15 Total)

### 3.1 Landlords (2)

| ID | Name | Tier | Properties | Email | Demo Purpose |
|----|------|------|------------|-------|--------------|
| landlord-1 | Ahmed Al Maktoum | Gold | 8 units (Marina, JBR, Downtown) | ahmed@nestmatch.ae | Primary landlord, full dashboard |
| landlord-2 | Fatima Hassan | Gold | JLT & Business Bay | fatima@nestmatch.ae | Secondary landlord |

### 3.2 Letting Agents (2)

| ID | Name | Tier | Agency | Email | Demo Purpose |
|----|------|------|--------|-------|--------------|
| agent-1 | Khalid Al Rashid | Gold | Dubai Property Group | khalid@dubaipropertygroup.ae | RERA-verified agent |
| agent-2 | Tariq Mahmood | Gold | Prime Real Estate | tariq@agency.ae | Multi-property agent |

### 3.3 Tier 2 Gold Tenants (4)

| ID | Name | Status | Location | Email | Demo Purpose |
|----|------|--------|----------|-------|--------------|
| roommate-1 | Priya Sharma | Residing | JLT | priya@nestmatch.ae | Gold resident, full visibility, can review applicants |
| roommate-2 | Marcus Chen | Residing | Marina | marcus.chen@email.com | Gold resident, applicant reviews |
| roommate-7 | Aisha Patel | Searching | — | aisha.patel@email.com | Gold searching, Premium, GCC 92 |
| roommate-6 | James Morrison | Searching | — | james.morrison@email.com | Gold searching, relocating from London |

### 3.4 Tier 1 Verified Tenants (2)

| ID | Name | Status | Email | Demo Purpose |
|----|------|--------|-------|--------------|
| tier1-1 | Liam O'Brien | Searching | liam@nestmatch.ae | Verified tier, job-seeker visa |
| tier1-2 | Amara Diallo | Searching | amara.diallo@email.com | Verified tier, exploratory visit |

### 3.5 Tier 0 Explorer Tenants (3)

| ID | Name | Status | Email | Demo Purpose |
|----|------|--------|-------|--------------|
| tier0-1 | James Okafor | Searching | james@nestmatch.ae | Explorer, pending KYC |
| tier0-2 | Sofia Kowalski | Searching | sofia@nestmatch.ae | Explorer, approved KYC |
| tier0-3 | Ravi Menon | Searching | ravi.menon@gmail.com | Explorer, no docs yet |

### 3.6 Platform Admins (2)

| ID | Name | Role | Email | Demo Purpose |
|----|------|------|-------|--------------|
| admin-1 | Sara Al Hashimi | Head of Compliance | compliance@nestmatch.ae | Compliance dashboard |
| admin-3 | Rashid Khalil | Head of Operations | operations@nestmatch.ae | Operations dashboard |

**Password for all accounts:** `demo2026`

---

## 4. PROFILE VISIBILITY RULES

| Viewer Type | Name | Photo | Nationality | Other Data |
|-------------|------|-------|-------------|------------|
| Non-Premium Seeker | BLURRED | BLURRED | HIDDEN | Lifestyle tags only |
| Premium Searching Seeker | Visible | Visible | MASKED | Full profile minus nationality |
| Premium Residing Tenant | Visible | Visible | VISIBLE | Full profile (safety requirement) |
| Landlord/Agent | Visible | Visible | VISIBLE | Full + GCC Score |

### Why Nationality Masking?

Searching tenants see "Nationality: [Hidden]" for other occupants to prevent discrimination. Residing tenants see full nationality because they have a safety interest in knowing who will be living with them.

---

## 5. KEY DEMO SCENARIOS

### Scenario 1: Explorer Onboarding (Sofia)
1. Login as Sofia (Tier 0)
2. Browse listings — 48hr delay badge visible
3. Click occupant profile — BLURRED
4. Click "Contact Landlord" — LOCKED, upgrade prompt
5. Click "Request Viewing" — verification prompt

### Scenario 2: Premium Seeker (Aisha)
1. Login as Aisha (Tier 2 Gold, Premium)
2. View occupant profiles — name/photo visible
3. Check nationality — shows "[Hidden]" (masked)
4. Request viewing — success
5. Sign DLD agreement — signature flow

### Scenario 3: Resident Reviewing Applicants (Priya)
1. Login as Priya (Tier 2 Gold, Residing)
2. Go to "Applicants" for her property
3. View applicant profiles — FULL visibility including nationality
4. Submit review (4 predefined options)
5. See GCC Score impact

### Scenario 4: Landlord Dashboard (Ahmed)
1. Login as Ahmed (Landlord)
2. View all applicants with GCC Scores
3. See resident feedback aggregates
4. Confirm/reject viewing requests
5. Generate DLD agreement

---

## 6. TECHNICAL REFERENCE

### API Base URL
```
https://nest-match-uae.pushkar-nagela.workers.dev
```

### Key Endpoints
```
POST /api/auth/login
GET  /api/properties
GET  /api/properties/:id
GET  /api/agreements/:id
POST /api/agreements
PATCH /api/agreements/:id/sign
```

### Frontend Demo URL
```
https://nest-match-uae.vercel.app
```

---

## 7. KNOWN ISSUES / TECH DEBT

| ID | Issue | Priority | When |
|----|-------|----------|------|
| TD-001 | `tier1_unverified` naming confusing | Low | Post-demo |
| TD-002 | All emails use @nestmatch.ae | Low | Post-demo |
| TD-003 | 25+ orphaned users in database | Medium | Post-demo |
| TD-006 | Previous briefing doc out of sync | High | This document resolves it |

---

## 8. CHANGE LOG

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | March 2026 | Initial briefing (diverged from implementation) |
| 2.0 | 17 March 2026 | **REALIGNED** with login page canonical list |

---

*This document is the single source of truth. If implementation differs, file a bug.*

---

**Document Owner:** Product Director
**Review Cycle:** Before each sprint
**Distribution:** Business Strategy, Frontend, Backend, QA
