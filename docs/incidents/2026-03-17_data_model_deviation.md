# NestMatch UAE — Incident Report

## Data Model Deviation Incident

**Date:** 17 March 2026
**Severity:** High
**Status:** Resolved
**Author:** Product Director

---

## Executive Summary

Multiple autonomous Claude Code sessions expanded the demo data model from the approved 15 personas to 40+ users without Product Director approval. This created cascading alignment issues between D1 (backend database), mockData (frontend fallback), and the product specification document, requiring 3+ hours of coordination to resolve.

---

## Timeline

| Time | Event |
|------|-------|
| Pre-Session | Original spec: 15 personas, 12 properties (per briefing doc) |
| Sessions 1-5 | Backend seeds D1 with users. Each session adds "more diverse personas" |
| Sessions 6-8 | Frontend mockData expanded to match growing D1 dataset |
| Session 9C | Backend migration references IDs that don't exist in mockData |
| Session 11 | Frontend reports ID mismatches. Confusion about which source is correct |
| Session 11+ | Product Director identifies 3 conflicting sources of truth |
| Resolution | Locked canonical list to login page (15 personas). Aligned both layers |

---

## Root Cause Analysis

### Primary Cause: No Approval Gate for Data Model Changes

Claude Code sessions operated autonomously with broad instructions like "add demo data" or "ensure diverse personas." Without explicit constraints, each session interpreted this as permission to CREATE new users rather than USE existing ones.

### Contributing Factors

1. **No canonical reference in CLAUDE.md**
   - The project's CLAUDE.md file did not list the approved personas
   - Engineers had no single source of truth to reference

2. **Briefing document not in repo**
   - The Product Director Briefing (nestmatch_product_director_briefing.docx) existed but was not in the codebase
   - Claude Code sessions couldn't reference it

3. **Implicit approval assumed**
   - Sessions assumed "make the demo realistic" meant "add more users"
   - No prompt asked "Should I add new personas or use existing ones?"

4. **No diff review before seeding**
   - D1 migrations ran without showing what users would be created
   - No approval step before `wrangler d1 execute`

5. **ID scheme confusion**
   - Briefing doc used S001/L001/P001 scheme
   - Implementation used tier0-1/landlord-1/list-entry-1 scheme
   - Neither was documented as canonical

---

## Impact Assessment

### Technical Impact

| Area | Before | After | Deviation |
|------|--------|-------|-----------|
| Users in D1 | 15 (spec) | 32 | +17 orphaned |
| Users in mockData | 15 (spec) | 40+ | +25 orphaned |
| Properties in D1 | 12 (spec) | 14 | +2 orphaned |
| Tier assignments | Consistent | Mixed | 5 users wrong tier |

### Time Impact

| Activity | Hours |
|----------|-------|
| Identifying the deviation | 1.0 |
| Tracing conflicting sources | 0.5 |
| Coordination between Backend/Frontend | 1.0 |
| Alignment commands and verification | 0.5 |
| Documentation and prevention | 1.0 |
| **Total** | **4.0 hours** |

### Business Impact

- Demo delay: ~4 hours
- Risk: Investor demo could have shown inconsistent data
- Trust: Confidence in autonomous Claude Code reduced

---

## Resolution

### Immediate Actions Taken

1. **Locked canonical source**: Product Director approved login page list as single source of truth
2. **D1 alignment**: Backend updating tier values to match canonical list
3. **mockData alignment**: Frontend verifying/fixing tier values
4. **Tech debt documented**: Created docs/TECH_DEBT.md tracking orphaned records

### Deferred Actions (Post-Demo)

1. DELETE 17+ orphaned users from D1
2. Remove 25+ orphaned users from mockData
3. Audit and remove orphaned properties
4. Standardize ID scheme (S001 vs tier0-1)
5. Regenerate briefing document from implementation

---

## Prevention Measures

### CLAUDE.md Updates (Mandatory)

Added Data Model Governance section to CLAUDE.md with:
- Canonical 15-persona list (locked)
- Approval gates for all data model changes
- Change request format
- Tier system reference

### Process Changes

1. **Pre-commit review**: All D1 migrations must show exact SQL before execution
2. **Canonical list in repo**: Added to CLAUDE.md and PRODUCT_DIRECTOR_BRIEFING_v2.md
3. **Session boundaries**: Each session must state what data it expects vs what it will create
4. **Diff-based seeding**: Show "Users to be created: X, Y, Z" before running

---

## Lessons Learned

1. **Autonomous agents need explicit boundaries** — "Add demo data" is too vague
2. **Single source of truth must be in the codebase** — External docs get ignored
3. **Data model changes are high-risk** — Should require same approval as schema changes
4. **Cumulative drift is invisible** — Each session's +3 users seems harmless until you have +25

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Director | — | 17 Mar 2026 | Pending |
| Backend Lead | — | — | Pending |
| Frontend Lead | — | — | Pending |

---

*This incident report is stored in docs/incidents/ for future reference.*
