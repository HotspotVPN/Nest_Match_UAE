# NestMatch UAE

**Version:** 1.2.0  
**Status:** Active Development

---

## Product Summary

NestMatch UAE is a compliance-first PropTech platform designed exclusively for the United Arab Emirates market. Built with React 19, Vite, and TypeScript, it provides a safe, transparent, and legally compliant way for residents to find housing and roommates — fully aligned with DLD, RERA, and Dubai Municipality regulations.

---

## What We Are Catering To

- **Residents & Expatriates:** Seeking verified, compliant housing and compatible roommates.
- **Landlords & Property Managers:** Leasing to verified individuals in accordance with local occupancy regulations.
- **Real Estate Agents:** Listing RERA-approved properties with built-in compliance enforcement.
- **Operations Teams:** Running active compliance enforcement through a dedicated CRM.

---

## What We Are Combating

- **Illegal Subletting:** Preventing unauthorized partitioning and unapproved subleasing.
- **Overcrowding:** Enforcing strict occupancy limits via DLD API (not self-reported).
- **Scams & Fraud:** Eliminating unverified listings and fake profiles.
- **Viewing "Ghosting":** Utilizing a Two-Way Commitment Hold (50 AED penalty system).
- **Discrimination:** Blind Match anonymizes name, photo, and nationality — only GCC Score & lifestyle visible.

---

## Government Affiliations & Integrations

- **UAE PASS:** Every user is a verified UAE resident or citizen (Tier 2 verification).
- **Makani Numbers:** Precise 10-digit location codes mandatory on all listings.
- **RERA / Trakheesi Permits:** All listings require valid DLD/RERA advertising permits.
- **Occupancy Enforcement:** DLD API (mocked) fetches `maxLegalOccupancy` — platform never self-calculates.
- **Ejari Registration:** Contract wizard integrates Ejari verification before lease finalization.
- **PDPL Compliance:** Landlords only see aggregate GCC data — no raw personal data sharing.

---

## Business & Commercial Features

- **Commercial Leasing Terms:** Accepted Cheques (1, 2, 4, 6, 12), Utility distributions (DEWA & Wi-Fi), Ejari handler, Maintenance responsibility.
- **Smart Rent Estimates (Daleel):** Makani-level DLD rental market price recommendations shown post-verification.
- **Active CRM Enforcement:** Operations "God Mode" — suspend listings, search by Makani/district, force DLD audits.
- **Rent Ledger & Cheque Tracker:** Full payment schedule tracking per tenancy with Stripe pay simulation.
- **Maintenance Ticketing:** Tenant submission + Landlord Kanban board (Reported / In Progress / Resolved).
- **Contract Management Hub:** 3-step Contract Wizard (Commercial Agreement → Ejari Verification → Security Deposit).

---

## Development Phases

### Phase 0: Planning & Architecture
- Cloned existing Nest_Match repository
- Analyzed existing codebase (types, data, pages, components)
- Wrote implementation plan for UAE pivot
- Got user approval on implementation plan

### Phase 1: Database Schema & Type System
- Replaced UK types with UAE-specific types (`AuthMethod`, `BankDetails`, etc.)
- Added UAE PASS identity fields (`uaePassId`, `emiratesId`)
- Added property compliance fields (`makaniNumber`, `trakheesiPermit`, `municipalityPermit`, `maxLegalOccupancy`)
- Created `ViewingBooking` model with Stripe hold fields
- Created `PropertyRating` model (star-only, no text — defamation-safe)
- Updated currency helpers from GBP → AED
- Rebuilt mock data with UAE-localized users, properties, and addresses

### Phase 2: Authentication — UAE PASS OAuth Flow
- Removed email/password and Google SSO login
- Created "Login with UAE PASS" button and simulated OAuth flow
- Updated `AuthContext` for UAE PASS identity
- Role selection onboarding (Searching Roommate, Landlord, Agent)
- Lifestyle profile builder for Searching Roommates

### Phase 3: Landlord Dashboard & Property Compliance Engine
- Built multi-step "Add Property" form (Makani, Municipality Permit, Occupancy)
- Backend validation: hide listing when `currentOccupants >= maxLegalOccupancy`
- Applicant Review UI with GCC score sorting
- "Share Anonymized Profile with Residing Roommates" toggle

### Phase 4: Discovery Feed & Blind Match Flow
- Searching Roommate discovery feed with budget/location filters
- Occupancy cap enforced in search results
- Residing Roommate "Incoming Applicants" inbox
- Anonymized profiles: hide name/photo/nationality, show lifestyle + GCC only
- Thumbs up/down feedback to landlord

### Phase 5: Two-Way Commitment Hold (Viewing Booking FinTech)
- "Book Viewing" button on property detail page
- Checkout modal explaining 50 AED hold mechanism
- Stripe Elements card input (simulated)
- Landlord acceptance UI with penalty agreement checkbox
- Viewing Resolution UI (Completed / Tenant No-Show / Landlord No-Show)

### Phase 6: Ratings & Good Conduct Certificate (GCC)
- Post-tenancy rating UI: 3 star sliders only (AC, Amenities, Maintenance)
- GCC score calculation logic (12-month lease + zero complaints = +20 pts)
- Gold "Verified GCC" profile badge for scores > 80

### Phase 8: Regulatory Architecture Pivot ✅
- Updated type system for tiered auth (`isUaePassVerified`, `isIdVerified`)
- Created `mockDldService.ts` (`verifySharedHousingPermit`, `verifyTrakheesiPermit`)
- Created `mockStripeService.ts` (Platform Abuse Penalty hold authorization)
- Created `schema.prisma` (investor-ready Prisma schema)
- Updated `AuthContext.tsx` (tiered verification, `loginWithEmail`)
- Updated `LoginPage.tsx` (email/Google Tier 1 + UAE PASS Tier 2)
- Updated `AddPropertyPage.tsx` (removed manual occupancy, added DLD API verification)
- Updated `ListingDetailPage.tsx` (DLD badge, Tier 2 gate on booking)
- Updated `ProfilePage.tsx` (verification tier indicator, Onfido fallback)
- Updated `ViewingsPage.tsx` (Platform Abuse Penalty language)
- Updated `Navbar.tsx` (verification tier badge)

### Phase 9: Commercial & CRM Advanced Workflows ✅
- Upgraded `AddPropertyPage.tsx` (Cheques, DEWA/Wi-Fi, Ejari, Maintenance, Daleel Estimate)
- Upgraded `CustomerDatabasePage.tsx` (Suspend Listing, Force Audit, Makani/district search)
- Upgraded `ListingDetailPage.tsx` (Stripe Checkout UI for Platform Abuse Penalty)
- Upgraded `ViewingsPage.tsx` (Resolution Actions: Completed, Tenant No-Show, Landlord No-Show)

### Phase 10: UX Refinement & Chat Integration ✅
- Upgraded `ListingDetailPage.tsx` (Anonymous Reviews UI, "X people stayed here" stat)
- Implemented `ChatPage.tsx` (split-pane messenger with channels and message threads)
- Added `/chat` route and Chat button to `Navbar.tsx`

### Phase 11: Landlord Interactive Edit Mode ✅
- Configured `isOwner` logic (`currentUser?.id === listing.landlord_id`)
- Made "Occupancy Status" clickable for owners (ResidingTenantsModal)
- Implemented deep links to Google Maps for "Transport" chips
- Built inline raw-value editing for rent amount in the Price Card
- Created editable tag interface for Amenities + Pending Tenant Recommendations
- Expanded "Bills & Utilities" into interactive toggleable tags (Water, Wi-Fi, DEWA, etc.)
- Made Landlord Profile card fully clickable → routes to `/profile/:id`

### Phase 12: Analytics & Reporting ✅
- Added "Analytics" tab to `CustomerDatabasePage.tsx`
- Calculated 5 KPI Metrics: Total Vacancy, Properties with Openings, User Liquidity, Active Viewings, Penalty Revenue
- Rendered visual Supply/Demand Ratio progress bar

### Phase 13: Database Overhaul & Browse Filter Refinement ✅
- Overhauled `mockData.ts` with 12 properties at price points: 500, 600, 800, 1000, 1200, 1500, 1800, 2200, 2500, 2800, 3200, 3500 AED
- Categorized into Legal Bed-spaces, Shared Rooms, Private Rooms, and Premium En-suites
- Implemented dual-bound budget filtering (`budgetMin` / `budgetMax`) in `BrowsePage.tsx`
- Updated DISTRICTS: Deira, International City, Bur Dubai, Al Nahda, JVC, Dubai Marina, JLT

### Phase 14: The Good Conduct Certificate (GCC) Hub ✅
- Created `GccDashboardPage.tsx` with circular progress gauge
- Renders "Premium GCC Status Achieved" for scores > 80
- Added "Score Factors" section (Identity KYC, No Disputes, On-Time Rent, Cleaning Reviews)
- Added "Download Official Certificate (PDF)" button with toast notification
- Registered `/gcc` route in `App.tsx`
- Linked from `ProfilePage.tsx` GCC score block
- PDPL-compliant: landlords only see aggregate data

### Phase 15: In-App Messaging & Ejari Closing ✅
- Created `ChatPage.tsx` mirroring UK app split-pane messenger logic
- Left Pane: active ChatChannels with avatar and property focus
- Right Pane: message thread with input and Send logic
- "Request Tenancy Contract" button visible for COMPLETED viewings
- Ejari Registration modal triggering `verifyEjariRegistration` from `mockDldService.ts`

### Phase 16: Contract Management Hub ✅
- Removed Ejari/Contract logic from `ChatPage.tsx`
- Created `ContractManagerPage.tsx` with 3-step wizard
- Registered `/contracts/:viewingId` route (secured to Landlord/Agent + associated Tenant)
- Updated `ViewingsPage.tsx` with "Proceed to Lease Setup" for COMPLETED viewings
- Step 1: Commercial Agreement (rent terms, DEWA split, checkbox sign-offs)
- Step 2: Ejari Verification (calls `mockDldService.ts`, locks on success)
- Step 3: Financial Closing (Stripe checkout simulation for Security Deposit)

### Phase 17: Maintenance Ticketing Engine ✅
- Added `MaintenanceTicket` mock data to `mockData.ts`
- Created `MaintenancePage.tsx` and registered `/maintenance` route
- Added "Maintenance" link to `Navbar.tsx`
- Tenant View: Submit New Ticket form (Category, Urgency, Description) + Ticket List
- Landlord/Agent View: Kanban Board (Reported → In Progress → Resolved) + Chat deep-link

### Phase 18: Rent Ledger & Cheque Tracker ✅
- Added `RentLedger` mock data to `mockData.ts`
- Created `RentLedgerPage.tsx` and registered `/ledger` route
- Added "View Payment Schedule" button to `ProfilePage.tsx`
- Tenant View: Next Payment Due card, chronological cheque/installment table, Stripe Pay simulation
- Landlord/Agent View: Portfolio-wide ledger with "Send Reminder" toast

### Phase 19: UX Polish & Communication Fixes ✅
- Implemented clickable participant dropdown in `ChatPage.tsx` header
- Expanded `chatChannels` in `mockData.ts` across landlord's full property portfolio
- Refactored `ResidingDashboardPage.tsx` to be Landlord/Agent-only, filtered by viewing bookings
- Corrected Navbar: moved "Applicants" link from Tenant → Landlord/Agent section
- Restored corrupted `mockData.ts` exports (`viewings`, `payments`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript |
| Build Tool | Vite 7 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Payments | Stripe (Simulated) |
| Gov APIs | DLD / Makani (Mocked) |
| Identity | UAE PASS (Mocked) |
| ORM Schema | Prisma (Investor-Ready) |
| Deployment | Vercel |

---

*Built to provide a safer, compliant, and transparent housing market in the UAE.*
