# NestMatch UAE

**Version:** 2.11.0
**Status:** Investor Demo Live
**Live URL:** https://nest-match-uae.vercel.app
**Backend:** https://nest-match-uae.pushkar-nagela.workers.dev

---

## What is NestMatch UAE?

NestMatch UAE is a **compliance-first property discovery platform** for Dubai shared housing. It connects verified tenants with RERA-licensed landlords and agents, digitises the official DLD Property Viewing Agreement, and generates demand intelligence that DLD cannot obtain elsewhere.

---

## Three-Tier Verification System

| Tier | Name | Identity | Access |
|---|---|---|---|
| **Tier 0** | Explorer | Email/Google, no documents | Browse listings only |
| **Tier 1** | Verified | Passport + UAE visa uploaded | Browse, request viewings, chat, sign DLD viewing agreements |
| **Tier 2** | Gold | UAE PASS (Emirates ID) | Full access — tenancy applications, contracts, GCC tracking |

---

## Key Features

### Signup Funnel
- Split signup: /register → /register/tenant or /register/landlord
- Tenant path: UAE PASS + Google + email, tier progression display
- Landlord path: UAE PASS primary, requirements checklist
- Query param targeting: ?role=landlord highlights landlord column

### For Tenants
- Browse 14 verified Dubai listings with real property images across 15 districts
- Filter by district, budget (AED 500–15,000), amenities, transport, occupancy
- Grid + list view with occupancy bars and transport chips
- DLD Property Viewing Agreement — digitally signed (DLD/RERA/RL/LP/P210)
- GCC Score (Good Conduct Certificate) — circular progress ring
- Roommate Match Score — compatibility based on lifestyle and personality
- Passport KYC upload for new arrivals (Tier 1)

### For Landlords & Agents
- My Properties page: Active + Coming Soon tabs, occupancy bars, action buttons
- Coming Soon listings: pre-market properties with "Launch & Advertise" flow
- Portfolio dashboard with occupancy tracking
- Viewing requests from verified tenants with accept/decline
- Auto-generated DLD Viewing Agreement pre-filled with Makani, Trakheesi, BRN
- Applicant review with full profiles, GCC scores, lifestyle tags
- RERA licence display on all managed listings

### For Platform Admins
- Viewing Analytics Dashboard — demand by district, status distribution, agreement log
- CRM with 6 tabs: Landlords, RERA Agents, Gold Tenants, Verified Tenants, Explorers, Properties
- Compliance dashboard with Passport KYC approve/reject
- Platform IDs (LND-, AGT-, TNT-G-, TNT-V-, TNT-E-)

---

## Demo Accounts

**Password for all demo accounts:** `demo2026`

### Landlords
| Name | Email | Tier |
|---|---|---|
| Ahmed Al Maktoum | ahmed@nestmatch.ae | Gold |
| Fatima Hassan | fatima@nestmatch.ae | Gold |

### Letting Agents
| Name | Email | BRN |
|---|---|---|
| Khalid Al Rashid | khalid@dubaipropertygroup.ae | RERA-BRN-2025-12345 |
| Tariq Mahmood | tariq@agency.ae | RERA-BRN-33333 |

### Tenants — Gold (UAE PASS)
| Name | Email | GCC |
|---|---|---|
| Priya Sharma | priya@nestmatch.ae | 85 |
| Marcus Chen | marcus.chen@email.com | 70 |
| Aisha Patel | aisha.patel@email.com | 92 |
| James Morrison | james.morrison@email.com | 0 |

### Tenants — Verified (Passport KYC)
| Name | Email | Nationality | KYC Status |
|---|---|---|---|
| James Okafor | james@nestmatch.ae | Nigerian | Pending |
| Sofia Kowalski | sofia@nestmatch.ae | Polish | Approved |
| Ravi Menon | ravi.menon@gmail.com | Indian | No docs |

### Tenants — Explorer (Browse Only)
| Name | Email |
|---|---|
| Liam O'Brien | liam@nestmatch.ae |
| Amara Diallo | amara.diallo@email.com |

### Platform Admin
| Name | Email | Role |
|---|---|---|
| Sara Al Hashimi | compliance@nestmatch.ae | Head of Compliance |
| Rashid Khalil | operations@nestmatch.ae | Head of Operations |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 7 |
| Styling | Vanilla CSS + CSS variables |
| Icons | lucide-react |
| Routing | react-router-dom v7 |
| Backend | Cloudflare Workers + Hono (deployed, 23+ endpoints) |
| Database | Cloudflare D1 (SQLite at edge, 32 users + 14 properties seeded) |
| Storage | Cloudflare R2 (images, KYC docs, avatars) |
| Frontend Deploy | Vercel (auto-deploy on push) |
| Backend Deploy | Cloudflare Workers |

---

### Legal
- Privacy Policy (/privacy) — UAE Federal Law No. 45 of 2021
- Terms of Use (/terms) — legal boundary statements
- Footer disclaimer on all public pages

---

## Out of Scope (by design)

These features are intentionally excluded — NestMatch does not hold the required licences:

| Feature | Licence Required | Status |
|---|---|---|
| Payment processing | CBUAE / DIFC | Not held |
| Escrow / deposit holding | CBUAE | Not held |
| Rent collection | CBUAE | Not held |
| Tenancy contract drafting | RERA broker licence | Not held |

NestMatch facilitates property discovery, identity verification, and the official DLD viewing agreement only. All tenancy contracts are prepared by RERA-licensed brokers.

---

## Project Documentation

| Document | Description |
|---|---|
| [CHANGELOG](docs/CHANGELOG.md) | Version history and what changed |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | System design, routes, API, auth tiers |
| [DECISIONS](docs/DECISIONS.md) | Why things were built, removed, or changed |
| [COMPLIANCE](docs/COMPLIANCE.md) | Legal scope, licence gaps, data handling |
| [PRODUCT_ROADMAP](docs/PRODUCT_ROADMAP.md) | What's built, what's next |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

---

*Built for Dubai's shared housing market under Dubai Law No. 4 of 2026.*
*Copyright 2026 NestMatch UAE.*
