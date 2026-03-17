# Architecture — NestMatch UAE

## System Overview

NestMatch UAE is a compliance-first property discovery platform.
It connects verified tenants with RERA-licensed landlords and agents,
digitises the official DLD Property Viewing Agreement, and generates
demand intelligence that DLD cannot obtain elsewhere.

## Frontend

| Item | Detail |
|---|---|
| Framework | React 19 + TypeScript + Vite 7 |
| Styling | Vanilla CSS + CSS variables (no Tailwind) |
| Icons | lucide-react |
| Routing | react-router-dom v7 |
| Deployed | Vercel (auto-deploy on push to main) |
| URL | https://nest-match-uae.vercel.app |

### Key directories

```
src/pages/        — one file per route (26 pages)
src/components/   — reusable UI (Navbar, ChatPanel, ViewingsPanel,
                    ViewingAgreementModal, LeaseHandoffCard)
src/contexts/     — AuthContext (tiered auth state)
src/data/         — mockData.ts (fallback when backend is down)
src/services/     — api.ts (smart fallback), apiMappers.ts,
                    mockDldService.ts
src/types/        — index.ts (single source of truth for all types)
```

### Routes

| Path | Page | Access |
|---|---|---|
| / | HomePage | Public |
| /login | LoginPage | Public |
| /register | RegisterLandingPage | Public |
| /register/tenant | TenantSignupPage | Public |
| /register/landlord | LandlordSignupPage | Public |
| /browse | BrowsePage | Public |
| /listing/:id | ListingDetailPage | Public |
| /profile/:id? | ProfilePage | Authenticated |
| /viewings | ViewingsPage | Authenticated |
| /chat | ChatPage | Authenticated |
| /dashboard | LandlordDashboardPage | Landlord/Agent |
| /my-properties | MyPropertiesPage | Landlord/Agent |
| /privacy | PrivacyPolicyPage | Public |
| /terms | TermsPage | Public |
| /residing-dashboard | ResidingDashboardPage | Landlord/Agent |
| /analytics | ViewingAnalyticsPage | Operations/Compliance admin |
| /compliance | CompliancePage | Compliance admin |
| /customers | CustomerDatabasePage | Operations admin |
| /maintenance | MaintenancePage | Authenticated |
| /gcc | GccDashboardPage | Authenticated |

## Backend

| Item | Detail |
|---|---|
| Runtime | Cloudflare Workers |
| Framework | Hono |
| Database | Cloudflare D1 (SQLite at edge) |
| Storage | Cloudflare R2 (S3-compatible) |
| URL | https://nest-match-uae.pushkar-nagela.workers.dev |

### R2 Buckets

| Bucket | Purpose | Access |
|---|---|---|
| nestmatch-property-images | Public listing photos | Public |
| nestmatch-kyc-documents | Passport/visa/Emirates ID | Private (admin only) |
| nestmatch-avatars | User profile photos | Authenticated |

### D1 Tables

**Core tables:**
users, properties, room_occupancy, viewing_bookings,
property_ratings, maintenance_tickets, chat_channels,
chat_messages, applications, rent_ledgers

**State machine tables (migration 0004):**
oauth_tokens, kyc_documents, occupancy_events,
viewing_agreements, agreement_signatures,
tenancy_events, verification_events

### API Endpoints (23 total)

| Category | Endpoints | Auth |
|---|---|---|
| Auth | POST /register, /login, /uaepass-callback, GET /me | Mixed |
| Auth OAuth | POST /auth/google, POST /auth/uae-pass | Public |
| Properties | GET / (filtered), GET /:id, POST / | Public read, Tier 2 write |
| Users | GET /me, PATCH /me, GET /:id | Mixed |
| Viewings | GET /, POST /, PATCH /:id/accept, PATCH /:id/decline | Tier 2 |
| KYC | POST /upload, GET /my-documents, PATCH /:id/review | Auth + admin |
| Occupancy | PATCH /rooms/:num, POST /notice, POST /move-out | Landlord/tenant |
| GCC | POST /users/:id/recalculate-gcc | Admin/system |
| Ratings | GET /:propertyId/ratings, POST /:propertyId/ratings | Public read, Tier 2 write |
| Payments | GET /, POST / | Authenticated |

## API Fallback Pattern

1. Frontend health-checks backend on first API call (3s timeout)
2. Result cached for 30 seconds
3. If backend live → real D1 data via apiMappers.ts
4. If backend down → mock data from src/data/mockData.ts
5. Zero UI disruption either way
6. `api.isUsingBackend()` for runtime check
7. `api.resetBackendCheck()` to force re-check

## Authentication Tiers

| Tier | Method | Identity | Access |
|---|---|---|---|
| 0 | Email/Google | Passport + visa in R2 | Browse, view, chat |
| 1 | Email/Google | None | Browse only |
| 2 | UAE PASS OAuth | Emirates ID anchor | Full access |

## Legal Documents In Scope

**DLD Property Viewing Agreement**
Reference: DLD/RERA/RL/LP/P210/No.3/Vr.4 (August 2022)
Parties: Broker (First Party) + Tenant (Second Party)
Fields: ORN, BRN, Makani ID, Emirates ID or Passport No,
        Approximate Rental Budget, Property Type, Use

## Viewing Agreement Flow

```
PENDING → CONFIRMED → AGREEMENT_SENT → AGENT_SIGNED → FULLY_SIGNED
                                                         ↓
                                              COMPLETED / NO_SHOW_*
```

Digital signatures captured via HTML5 canvas, stored as base64 data URIs
in the ViewingAgreementRecord alongside simulated IP addresses.
