# NestMatch UAE

**Version:** 1.4.2  
**Status:** Active Development | [Product Narrative (User Guide)](docs/PRODUCT_GUIDE.md) | [Full Development Log](docs/DEVELOPMENT_LOG.md)

---

## 🏛️ Project Vision & Story
NestMatch UAE is a **compliance-first PropTech platform** engineered specifically for the unique regulatory landscape of the United Arab Emirates.

**New to the project?**  
👉 [**Read our Non-Technical Product Story**](docs/PRODUCT_GUIDE.md) — This guide explains the vision, the problems we solve (overcrowding, ghosting, legal friction), and the journey from inception to a fully regulated UAE platform in plain English.

---

## 🚀 Key Ecosystem Features

### 🛡️ The Compliance Engine (God Mode)
The platform features an **Operations CRM with "God Mode" capabilities**:
- **Direct DLD Sync:** Automatically fetches and locks `maxLegalOccupancy` via Makani validation.
- **Dynamic Suspension:** One-click suspension of listings for compliance breaches.
- **Legal Audit Rails:** Force-audits against the DLD registry to ensure data integrity.

### 👤 Blind Match & GCC Score
To promote **cultural harmony** and eliminate bias, NestMatch UAE uses a "Blind Match" discovery flow:
- **Anonymized Profiles:** Names and photos are hidden to ensure people are chosen for conduct, not origin.
- **Good Conduct Certificate (GCC):** A performance-based trust score (0-100) calculated from verified residency conduct.

### 💳 Commitment Hold (Ghosting Prevention)
The unique **Two-Way Commitment Hold** system (50 AED) protects everyone's time:
- **RERA-Compliant:** Framed as a "Platform Abuse Penalty Authorization" to ensure strict legality.
- **Stripe Integration:** Pre-authorized holds are voided automatically upon viewing completion.

---

## 📖 Complete Project Documentation
Every task and decision made by **Antigravity** is preserved permanently in this repository for full transparency:

- [**Full Project Record & Development Log**](docs/DEVELOPMENT_LOG.md): Every single technical task completed since inception (Phases 0-20).
- [**Technical Architecture Deep-Dive**](docs/ARCHITECTURE.md): Detailed logic on regulatory rails, fintech code, and government integrations.
- [**Build Walkthrough**](docs/WALKTHROUGH.md): Verification checkmarks and technical specs.

---

## 🛠️ Tech Stack Summary

| Layer | Technology | Status |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite 7 | Active |
| **Logic** | Role-Based Access (Landlord/Agent/Roommate) | Verified |
| **Integrations** | UAE PASS, DLD/Makani, Stripe | Mocked/API-Ready |
| **Database** | Prisma (Investor-Ready Schema) | Scaled |
| **Deployment** | Vercel (Auto-Sync) | Live |

---

*Built to provide a safer, compliant, and transparent housing market in the UAE.*  
*Copyright © 2026 NestMatch UAE Team.*
