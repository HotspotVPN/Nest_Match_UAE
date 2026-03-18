# NestMatch UAE — Tech Debt Register

*Last Updated: 17 March 2026*
*Trigger: Data Model Deviation Incident*

---

## Overview

| Category | Items | Estimated Cleanup | Priority |
|----------|-------|-------------------|----------|
| Orphaned Users | 17+ in D1, 25+ in mockData | 2 hours | Medium |
| Orphaned Properties | 2 in D1 | 0.5 hours | Low |
| Naming Inconsistencies | 2 items | 4 hours | Low |
| Documentation Drift | 1 document | 1 hour | High (done) |
| Process Gaps | 3 items | 2 hours | Critical (done) |

**Total estimated cleanup time:** 9.5 hours (post-demo)

---

## Critical — Data Model Deviation Incident

### TD-000: Unauthorized Data Model Expansion (POSTMORTEM)
- **Severity:** Critical
- **Date Identified:** 17 March 2026
- **Status:** Resolved
- **Time to Resolve:** 4 hours
- **Root Cause:** Multiple Claude Code sessions expanded demo data from 15 personas to 40+ without Product Director approval
- **Impact:**
  - D1 database diverged from specification
  - mockData diverged from D1
  - Tier assignments became inconsistent
  - 3+ hours of alignment work required
- **Resolution:** Locked canonical 15-persona list, aligned D1 and mockData, added governance to CLAUDE.md
- **Prevention:** CLAUDE.md updated with mandatory approval gates
- **Full Report:** docs/incidents/2026-03-17_data_model_deviation.md

---

## Active Items

### TD-001: Tier Code Value Naming
- **Priority:** Low
- **Issue:** `tier1_unverified` displays as "Tier 1 — Verified" — semantically confusing
- **Impact:** Developer confusion, harder onboarding
- **Suggested Fix:** Rename to `tier1_emirates_id` across D1, types, mappers
- **When:** Post-investor demo

### TD-002: Demo Email Format
- **Priority:** Low
- **Issue:** All demo accounts use `@nestmatch.ae` domain
- **Impact:** None for demo; minor realism concern
- **Suggested Fix:** Update to realistic emails post-demo
- **When:** Post-investor demo
- **Note:** Decision was made to KEEP @nestmatch.ae for demo to avoid investors trying to verify fake emails on real domains

### TD-003: Orphaned User Records
- **Priority:** Medium
- **Issue:** 25+ users in D1/mockData not in canonical 15-persona list
- **Impact:** Confusing data, wasted storage, potential ID conflicts
- **Suggested Fix:** DELETE non-canonical users from D1, remove from mockData
- **When:** Post-investor demo
- **Users to Remove:** All users NOT in this list:
  - Ahmed Al Maktoum, Fatima Hassan, Khalid Al Rashid, Tariq Mahmood
  - Priya Sharma, Marcus Chen, Aisha Patel, James Morrison
  - James Okafor, Sofia Kowalski, Ravi Menon
  - Liam O'Brien, Amara Diallo
  - Sara Al Hashimi, Rashid Khalil
- **Orphaned IDs:** landlord-3, landlord-4, agent-3, roommate-3, roommate-4, roommate-5, roommate-8, roommate-9, roommate-10, roommate-srch-0 thru 3, roommate-res-new-0 thru 3

### TD-004: Orphaned Property Records
- **Priority:** Medium
- **Issue:** 14 properties in D1, canonical spec may be 12
- **Impact:** Inconsistent browse results between API and mock
- **Suggested Fix:** Audit properties against spec, remove extras
- **When:** Post-investor demo

### TD-005: ID Scheme Inconsistency
- **Priority:** Low
- **Issue:** User IDs use mixed schemes (tier0-1, roommate-1, landlord-1)
- **Impact:** Confusing when debugging, no clear pattern
- **Suggested Fix:** Standardize to S001/L001/A001 scheme per briefing doc
- **Recommendation:** Accept current scheme. Document it. Don't change.
- **When:** Never (accept as-is)

### TD-006: Briefing Document Out of Sync
- **Priority:** High
- **Status:** Resolved
- **Issue:** nestmatch_product_director_briefing.docx had different personas than implementation
- **Resolution:** Created docs/PRODUCT_DIRECTOR_BRIEFING_v2.md aligned with implementation

---

## Resolved Items

| ID | Issue | Resolution Date | Notes |
|----|-------|-----------------|-------|
| TD-000 | Data model deviation | 17 Mar 2026 | Governance added to CLAUDE.md |
| TD-006 | Briefing doc out of sync | 17 Mar 2026 | PRODUCT_DIRECTOR_BRIEFING_v2.md created |

---

## Cleanup Priority Order

| Priority | Item | When | Owner |
|----------|------|------|-------|
| 1 | ~~TD-006: Briefing doc~~ | Done | Product Director |
| 2 | ~~TD-000: Process gaps~~ | Done | Product Director |
| 3 | TD-003: Orphaned users | Post-demo | Backend + Frontend |
| 4 | TD-004: Orphaned properties | Post-demo | Backend |
| 5 | TD-001: Tier naming | Post-demo | Backend + Frontend |
| 6 | TD-002: Email realism | Post-demo | Backend + Frontend |
| 7 | TD-005: ID scheme | Never | N/A |

---

## Prevention Checklist (For Future Sessions)

Before any data model work, verify:

- [ ] Read CLAUDE.md governance section
- [ ] Current user count matches expected (15)
- [ ] Current property count matches expected (12-14)
- [ ] Change request format used for any additions
- [ ] Explicit approval received before INSERT/UPDATE
- [ ] D1 and mockData remain in sync

---

*Review schedule: Before each sprint*
