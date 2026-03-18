# CLAUDE.md — Data Governance Addendum

**Added:** 17 March 2026
**Reason:** Data Model Deviation Incident prevention

This document contains the full data governance rules that are also embedded
in the project's CLAUDE.md file. This standalone copy exists for reference
by teams who don't read CLAUDE.md directly.

---

## CANONICAL DEMO DATA (LOCKED — DO NOT MODIFY)

### 15 Approved Personas

| ID | Name | Role | Tier | Email |
|----|------|------|------|-------|
| landlord-1 | Ahmed Al Maktoum | Landlord | tier2_uae_pass | ahmed@nestmatch.ae |
| landlord-2 | Fatima Hassan | Landlord | tier2_uae_pass | fatima@nestmatch.ae |
| agent-1 | Khalid Al Rashid | Agent | tier2_uae_pass | khalid@dubaipropertygroup.ae |
| agent-2 | Tariq Mahmood | Agent | tier2_uae_pass | tariq@agency.ae |
| roommate-1 | Priya Sharma | Residing Tenant | tier2_uae_pass | priya@nestmatch.ae |
| roommate-2 | Marcus Chen | Residing Tenant | tier2_uae_pass | marcus.chen@email.com |
| roommate-7 | Aisha Patel | Searching Tenant | tier2_uae_pass | aisha.patel@email.com |
| roommate-6 | James Morrison | Searching Tenant | tier2_uae_pass | james.morrison@email.com |
| tier0-1 | James Okafor | Searching Tenant | tier0_passport | james@nestmatch.ae |
| tier0-2 | Sofia Kowalski | Searching Tenant | tier0_passport | sofia@nestmatch.ae |
| tier0-3 | Ravi Menon | Searching Tenant | tier0_passport | ravi.menon@gmail.com |
| tier1-1 | Liam O'Brien | Searching Tenant | tier1_unverified | liam@nestmatch.ae |
| tier1-2 | Amara Diallo | Searching Tenant | tier1_unverified | amara.diallo@email.com |
| admin-1 | Sara Al Hashimi | Compliance Admin | tier2_uae_pass | compliance@nestmatch.ae |
| admin-3 | Rashid Khalil | Operations Admin | tier2_uae_pass | operations@nestmatch.ae |

**This list is FINAL. Do not add, remove, or modify without explicit Product Director approval.**

---

## APPROVAL GATES

### STOP — These Actions Require Explicit Approval BEFORE Execution:

1. **Adding users to D1 or mockData** — even one user requires approval
2. **Removing users from D1 or mockData** — must list which users and why
3. **Changing user attributes** — tier, email, ID, or role changes
4. **Adding properties to D1 or mockData** — must list ID, address, landlord
5. **Running D1 migrations that INSERT or UPDATE user/property data** — show exact SQL first, wait for "approved"

### OK — These Actions Can Proceed Without Approval:

- Reading existing data
- Fixing bugs that don't change data structure
- Adding new API routes
- UI changes that don't affect data model
- TypeScript type fixes

---

## HOW TO REQUEST APPROVAL

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

---

## IF ASKED TO "ADD MORE DATA"

STOP and ask:
> "The canonical demo list has 15 personas. Do you want me to:
> A) Use existing personas from the canonical list (recommended)
> B) Add new personas (requires your approval of names, tiers, IDs)"

Do NOT interpret "add demo data" as permission to create new personas.

---

## TIER SYSTEM REFERENCE

| Code Value | Display Label | Access Level |
|------------|---------------|--------------|
| `tier0_passport` | Tier 0 — Explorer | Browse only, blurred profiles, locked contacts |
| `tier1_unverified` | Tier 1 — Verified | Request viewings, chat, sign agreements |
| `tier2_uae_pass` | Tier 2 — Gold | All access, auto-Premium, priority support |

**Note:** `tier1_unverified` displays as "Verified" — known naming inconsistency (see TECH_DEBT.md TD-001).

---

*Last updated: 17 March 2026*
