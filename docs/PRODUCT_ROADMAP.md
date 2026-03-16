# Product Roadmap — NestMatch UAE

## Current: v2.1.0 — Investor Demo (March 2026)

### Completed
- [x] UAE-specific type system and mock data (15 districts, 12+ listings)
- [x] Three-tier verification: UAE PASS, passport KYC, unverified
- [x] Browse page with district filters, occupancy bars, transport chips
- [x] Listing detail with Makani, Trakheesi, DLD permit display
- [x] Landlord dashboard: portfolio, viewings, applicant review
- [x] Roommate profile: GCC score ring, match score, lifestyle tags
- [x] Smart API fallback (backend down → mock data, zero disruption)
- [x] Cloudflare D1 + R2 + Workers backend deployed
- [x] Vercel frontend deployed
- [x] Sessions 1-3: fintech removed, browse overhauled, profiles polished
- [x] Session 4: DLD Viewing Agreement digital signing
- [x] HTML5 canvas signature pad for broker + tenant
- [x] Viewing outcome tracking (completed / no-show)
- [x] Viewing analytics dashboard (/analytics)
- [x] LeaseHandoffCard replacing ContractManagerPage
- [x] Full applicant profile visibility (blind match removed)

### Planned (Session 5)
- [ ] Three-tier verification UI overhaul
- [ ] PassportKycModal for Tier 0 new arrivals
- [ ] Login page three-path entry (UAE PASS / New Arrival / Browse)
- [ ] Compliance dashboard Passport KYC tab

---

## Near-term (post-funding, no new licences required)

### Corporate relocation channel
- B2B onboarding for UAE employers (ADNOC, Emirates, DIFC firms)
- HR portal: bulk employee referrals → NestMatch Tier 0 flow
- Employer verification badge on tenant profiles

### University housing channel
- Student visa as valid Tier 0 KYC document
- University partnerships: NYUAD, AUS, HWU Dubai, Middlesex Dubai
- Student-specific listing filter

### Abu Dhabi expansion
- ADRA (Abu Dhabi Real Estate Authority) permit display
- Abu Dhabi districts added to browse filters
- Emirate selector in navbar

### White-label compliance API
- License the UAE PASS + passport KYC + DLD form layer
  to other UAE housing platforms
- API endpoints: /verify, /generate-dld-agreement, /sign

---

## Medium-term (requires RERA broker licence)

### Tenancy contract facilitation
- In-platform Ejari contract generation
- RERA-approved contract templates
- Digital signing on tenancy contracts (not just viewing agreements)

### Property management portal
- Maintenance ticket management
- Rent schedule display (no collection — display only until CBUAE)
- Renewal reminders

---

## Long-term — Government data product

### DLD demand intelligence API
- Viewing demand by district, property type, budget range
- Agent performance by RERA BRN
- Supply-demand gap analysis by neighbourhood
- Expat origin demand signals (nationality from Tier 0 uploads)
- Seasonal patterns

### Positioning
NestMatch maintains a complete audit trail of all signed DLD
Property Viewing Agreements. DLD sees Ejari (tenancies) but
is blind to the entire upstream demand funnel. NestMatch is
the first DLD-aligned platform building that dataset at scale.

### Post-investor pitch
- [ ] DLD/RERA data partnership conversation initiated
- [ ] Timeline and format for regulatory data sharing agreed
