# NestMatch UAE — Technical Architecture & Compliance Logic

This document details the "Under the Hood" logic of NestMatch UAE, explaining how the platform satisfies both user needs and UAE legal requirements.

## 1. Regulatory Compliance Layer

### DLD & Makani Integration (`mockDldService.ts`)
The platform enforces occupancy limits directly via real-time data sync.
- **Mechanism:** When a landlord enters a Makani number on the `AddPropertyPage`, the system queries the DLD mock API.
- **Regulation:** Complies with Dubai Municipality and UAE Federal Housing laws.
- **Logic:** The `maxLegalOccupancy` is a read-only field fetched from the DLD; landlords cannot artificially inflate it.

### Defamation Prevention (No-Text Ratings)
- **Constraint:** UAE Cybercrime Law No. 34 of 2021 prohibits public defamation.
- **Solution:** All peer reviews are star-slider based (numerical). There are **no text areas** for reviews, preventing accidental legal exposure for users or the platform.

### Platform Abuse Penalty (RERA Compliance)
- **Mechanism:** Instead of a "Viewing Fee" (illegal under RERA), the platform implements a "Platform Abuse Penalty Authorization."
- **Logic:** A 50 AED pre-authorization hold is placed on the tenant's card via Stripe (mocked). This is strictly a conduct-based hold that is voided immediately upon viewing completion.

## 2. Trust & Identity Layer

### UAE PASS OAuth Flow
- **Identity:** All transacting users are verified via UAE PASS (`isUaePassVerified`).
- **Tiers:** 
    - **Tier 1 (Browse-Only):** Email/Google.
    - **Tier 2 (Transact-Only):** UAE PASS.
- **Privacy:** Names and photos are hidden during the "Blind Match" discovery phase to prevent bias and comply with PDPL (Personal Data Protection Law).

### Good Conduct Certificate (GCC) Algorithm
The GCC Score is a weighted average calculated based on:
1. **Tenancy Duration:** Positive weight for long-term verified leases (12+ months).
2. **Payment Reliability:** No bounced cheques or late rental payments.
3. **Property Care:** High ratings from previous landlords (Amenities care, Noise levels).
4. **Dispute Record:** Cross-referenced with mock RERA dispute registry.

## 3. Financial Infrastructure

### Escrow & Payments
- **Treasury Dashboard:** Tracks platform "Commitment Holds" vs. Captured Penalties.
- **Rent Ledger:** Simulates the UAE cheque-based payment cycle (1, 2, 4, 6 Cheque allocations).
- **Ejari Closing:** A mock hook that validates a draft Ejari number with the DLD before allowing the final Security Deposit payment.

## 4. Backend Infrastructure (Phase 21)

### API Layer (`backend/`)
- **Framework:** Hono (Node.js framework optimized for Cloudflare Workers/Edge).
- **Persistence:** Cloudflare D1 (Distributed SQLite) for low-latency data access.
- **Connectivity:** The frontend utilizes an `ApiClient` to interface with the REST API, ensuring a clean separation of concerns.

## 5. UI/UX Design System

- **Glassmorphism:** A premium, dark-mode design system utilizing HSL variables for color harmony.
- **Dynamic Routing:** Segmented profile URLs (`/profile/:id`) for scalable sharing.
- **Role-Based Views:** Conditional rendering in `Navbar.tsx` and `App.tsx` ensures Landlords, Agents, and Tenants see only pertinent tools.

---
*Technical Lead Note: This architecture is designed for REES sandbox compliance.*
