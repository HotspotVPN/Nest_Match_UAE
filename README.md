# NestMatch UAE

**Version:** 1.4.1  
**Status:** Active Development | [Product History](docs/HISTORY.md) | [Technical Architecture](docs/ARCHITECTURE.md)

---

## 🏛️ Project Vision
NestMatch UAE is a **compliance-first PropTech platform** engineered specifically for the unique regulatory landscape of the United Arab Emirates. It solves the friction between high-density shared housing and strict legal enforcement by integrating identity, government data, and fintech commitments into a single, premium ecosystem.

---

## 🚀 Key Ecosystem Features

### 🛡️ The Compliance Engine (God Mode)
The platform features an **Operations CRM with "God Mode" capabilities**, allowing for active enforcement of UAE laws:
- **Direct DLD Sync:** Automatically fetches and locks `maxLegalOccupancy` via Makani validation.
- **Dynamic Suspension:** One-click suspension of listings for compliance breaches.
- **Legal Audit Rails:** Force-audits against the DLD registry to ensure data integrity.

### 👤 Blind Match & GCC Score
To promote **cultural harmony** and eliminate bias, NestMatch UAE uses a "Blind Match" discovery flow:
- **Anonymized Profiles:** Names, photos, and nationalities are hidden until a contract is requested.
- **Good Conduct Certificate (GCC):** A performance-based trust score (0-100) calculated from payment reliability, long-term residency, and peer reviews.

### 💳 Commitment Hold (Ghosting Prevention)
The unique **Two-Way Commitment Hold** system (50 AED) protects both landlords and tenants:
- **RERA-Compliant:** Framed as a "Platform Abuse Penalty Authorization" to ensure legality.
- **Stripe Integration:** Pre-authorized holds are voided automatically upon viewing completion.

### 📄 Deal-Closing Hub
A complete post-viewing lifecycle:
- **Contract Wizard:** 3-step digital bridge (Terms → Ejari Verification → Deposit).
- **Maintenance Kanban:** Institutional-grade ticketing for tenants and landlords.
- **Rent Ledger:** Localized cheque-based payment tracking (ENBD, ADCB, Wio, etc.).

---

## 🛠️ Tech Stack & Build Status

| Layer | Technology | Status |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite 7 | Active |
| **Logic** | Role-Based Access (Landlord/Agent/Searching/Residing) | Verified |
| **Integrations** | UAE PASS (Identity), DLD/Makani (Occupancy), Stripe (Hold) | Mocked/API-Ready |
| **Database** | Prisma (Investor-Ready Schema), MockData v2.0 | Scaled |
| **Deployment** | Vercel (Auto-Sync) | Live |

---

## 📖 Complete Project Record
For the full chronological development history and technical deep-dives, please refer to the persistent records in our documentation folder:

- [**Full Project History (Phases 0-20)**](docs/HISTORY.md): A step-by-step log of every milestone achieved.
- [**Technical Architecture & Compliance Logic**](docs/ARCHITECTURE.md): Deep-dive into the regulatory rails and fintech logic.
- [**Build Walkthrough**](docs/WALKTHROUGH.md): Verification checkmarks and technical specs.

---

*Built to provide a safer, compliant, and transparent housing market in the UAE.*  
*Copyright © 2026 NestMatch UAE Team.*
