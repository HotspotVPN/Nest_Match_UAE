// ─── NestMatch UAE Type System ─────────────────────────────────
// Compliance-first PropTech types for Dubai Law No. 4 of 2026

// ─── User Types ───────────────────────────────────────────────
export type UserType = 'roommate' | 'landlord' | 'letting_agent' | 'compliance' | 'finance' | 'operations';
export type ResidentRole = 'searching' | 'residing';
export type ComplianceStatus = 'pending' | 'completed' | 'rejected';
export type PepStatus = 'pending' | 'clear' | 'failed';
export type Duration = '6_months' | '12_months' | 'flexible';
export type Schedule = 'early_bird' | 'night_owl' | 'varies';
export type AuthMethod = 'email' | 'google' | 'uae_pass'; // Tiered: email/google = Tier 1 (browse-only), uae_pass = Tier 2 (full access)

export interface Compliance {
    kyc_status: ComplianceStatus;
    kyc_completed_date?: string;
    aml_status: ComplianceStatus;
    aml_completed_date?: string;
    pep_status: PepStatus;
    pep_completed_date?: string;
    verified: boolean;
}

export interface Preferences {
    budget_min: number;
    budget_max: number;
    move_in_date: string;
    duration: Duration;
    schedule: Schedule;
    location_keywords?: string[];
    lifestyle_keywords?: string[];
}

export interface BankDetails {
    account_name: string;
    iban: string;             // UAE IBAN format (AE + 2 check + 3 bank + 16 account)
    swift_code: string;
    bank_name: string;
}

export interface User {
    id: string;
    type: UserType;
    auth_method: AuthMethod;
    uaePassId?: string;         // Unique UAE PASS identity (Tier 2 only)
    emiratesId?: string;        // Emirates ID number
    isUaePassVerified: boolean; // Tier 2: verified via UAE PASS OAuth
    isIdVerified: boolean;      // Tier 2 alt: verified via Onfido (new expats)
    name: string;
    email: string;
    avatar: string;
    bio: string;
    keywords: string[];
    compliance: Compliance;
    phone: string;             // +971 format
    linkedin_url?: string;
    instagram_handle?: string;
    rating?: number;
    total_reviews?: number;
    // ── Verification & GCC ────────────────────────────────────
    is_verified: boolean;
    resident_role?: ResidentRole;
    has_gcc: boolean;
    gccScore: number;           // 0-100, calculated from tenancy history
    isPremium: boolean;
    tenancy_duration_months?: number;
    gcc_eligible_date?: string;
    // For roommates
    preferences?: Preferences;
    current_house_id?: string;
    rent_monthly?: number;      // AED
    deposit?: number;           // AED
    good_conduct_certificate?: GoodConductCertificate;
    // Lifestyle & personality for matching
    lifestyle_tags?: string[];
    personality_traits?: string[];
    hobbies?: string[];
    local_recommendations?: LocalRecommendation[];
    // For landlords
    bank_details?: BankDetails;
    deposits?: { held: number; released: number; total: number };
    monthly_income?: number;    // AED
    managed_by_agent?: string;
    // For letting agents
    agency_name?: string;
    rera_license?: string;      // RERA broker license (replaces ARLA/NAEA)
    managed_landlords?: string[];
    managed_properties?: string[];
    commission_rate?: number;
    // ── Fintech / Proptech ────────────────────────────────────
    kyc_steps?: KycStep[];
    is_paid?: boolean;
    bank_linked?: boolean;
    has_secure_deposit?: boolean;
    verified_income?: number;
    created_at: string;
    updated_at: string;
}

export interface LocalRecommendation {
    name: string;
    category: 'activity' | 'food' | 'landmark' | 'sport' | 'nightlife' | 'culture';
    description: string;
    distance?: string;
}

// ─── Good Conduct Certificate ─────────────────────────────────
export interface GoodConductCertificate {
    id: string;
    tenant_id: string;
    issued_by_landlord: string;
    property_id: string;
    tenancy_start: string;
    tenancy_end: string;
    rating: number;
    payment_reliability: 'excellent' | 'good' | 'average' | 'poor';
    property_care: 'excellent' | 'good' | 'average' | 'poor';
    issued_at: string;
    verified: boolean;
    // NOTE: No conduct_notes field rendered in public UI (UAE defamation law)
}

// ─── Property Rating (Defamation-Safe) ────────────────────────
// STRICT: Star sliders ONLY — NO text fields per UAE Cybercrime Law
export interface PropertyRating {
    id: string;
    property_id: string;
    tenant_id: string;
    acQuality: number;           // 1-5 stars
    amenities: number;           // 1-5 stars
    maintenanceSpeed: number;    // 1-5 stars
    created_at: string;
    // STRICTLY NO TEXT FIELDS — UAE Federal Decree-Law No. 34 of 2021
}

// ─── Listing Types ────────────────────────────────────────────
export type OccupancyStatus = 'occupied' | 'available' | 'pending_approval';

export interface RoomOccupancy {
    room_number: number;
    tenant_id: string | null;
    status: OccupancyStatus;
}

export interface LocationData {
    lat: number;
    lng: number;
    nearest_metro?: { name: string; line: string; walk_mins: number };
    nearest_tram?: { name: string; walk_mins: number };
    nearest_bus?: { routes: string[]; walk_mins: number };
    nearby_amenities: string[];
    area_description?: string;
    makani_coordinates?: string; // Makani geo-coordinates
}

export interface Listing {
    id: string;
    landlord_id: string;
    letting_agent_id?: string;
    title: string;
    address: string;
    district: string;           // Dubai district (JBR, Marina, JLT, etc.)
    rent_per_room: number;       // AED
    total_rooms: number;
    available_rooms: number;
    images: string[];
    description: string;
    amenities: string[];
    house_rules: string[];
    bills_included: boolean;
    bills_breakdown?: string;
    deposit: number;             // AED
    current_roommates: string[];
    occupancy_status: RoomOccupancy[];
    tags: string[];
    // ── UAE Compliance Fields (Law No. 4 of 2026) ─────────────
    makaniNumber: string;         // EXACTLY 10 digits
    trakheesiPermit: string;      // RERA advertising permit
    municipalityPermit: string;   // Shared housing permit
    maxLegalOccupancy: number;    // Fetched via Mock DLD API — NEVER manually entered
    currentOccupants: number;     // Must never exceed maxLegalOccupancy
    isActive: boolean;            // Auto-false when at capacity
    isApiVerified: boolean;       // true = DLD Mock API validated the permit
    // ── Transport ─────────────────────────────────────────────
    transport_chips?: TransportChip[];
    // ── Fintech / Proptech ────────────────────────────────────
    financial_ledger?: FinancialLedger;
    rera_escrow_verified: boolean;  // RERA escrow (replaces UK DPS)
    location?: LocationData;
    rating?: number;
    total_reviews?: number;
    property_ratings?: PropertyRating[];
    created_at: string;
    updated_at: string;
}

export interface TransportChip {
    label: string;
    type: 'metro' | 'tram' | 'bus' | 'walk';
    walk_time: string;
    lines?: string[];              // Metro line (Red, Green) or bus routes
    line_color?: string;           // Hex color for Dubai Metro lines
}

// ─── Viewing Types (Two-Way Commitment Hold) ──────────────────
export type ViewingStatus =
    | 'PENDING'
    | 'PENDING_LANDLORD_APPROVAL'
    | 'CONFIRMED'
    | 'AGREEMENT_SENT'
    | 'AGENT_SIGNED'
    | 'FULLY_SIGNED'
    | 'COMPLETED'
    | 'NO_SHOW_TENANT'
    | 'NO_SHOW_LANDLORD'
    | 'CANCELLED';

export interface DigitalSignature {
    signer_id: string;
    signer_name: string;
    signer_role: 'broker' | 'tenant';
    signed_at: string;
    signature_data: string;
    ip_simulated: string;
}

export interface ViewingAgreementRecord {
    id: string;
    viewing_id: string;
    agreement_number: string;
    generated_at: string;
    broker_orn?: string;
    broker_company?: string;
    broker_brn?: string;
    commercial_license?: string;
    plot_number?: string;
    building_number?: string;
    signatures: DigitalSignature[];
    status: 'draft' | 'sent' | 'agent_signed' | 'fully_signed';
    outcome?: 'attended' | 'no_show_tenant' | 'no_show_landlord';
    outcome_recorded_at?: string;
    outcome_recorded_by?: string;
}

export interface ViewingBooking {
    id: string;
    property_id: string;
    searcher_id: string;
    landlord_id: string;
    requested_date: string;
    time_slot: string;
    status: ViewingStatus;
    resolution_date?: string;
    agreement?: ViewingAgreementRecord;
    outcome_notes?: string;
    created_at: string;
    updated_at: string;
}

// ─── Chat Types ───────────────────────────────────────────────
export type MessageType = 'text' | 'maintenance_request' | 'announcement' | 'system';

export interface ChatMessage {
    id: string;
    channel_id: string;
    sender_id: string;
    message_type: MessageType;
    content: string;
    read_by: string[];
    created_at: string;
}

export interface ChatChannel {
    id: string;
    listing_id: string;
    name: string;
    participants: string[];
    created_at: string;
    last_message?: ChatMessage;
}

// ─── Application Types ────────────────────────────────────────
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export interface RoommateApproval {
    roommate_id: string;
    approved: boolean;
    approved_at?: string;
    rejection_reason?: string;
}

export interface Application {
    id: string;
    listing_id: string;
    applicant_id: string;
    landlord_id: string;
    status: ApplicationStatus;
    landlord_approved: boolean;
    existing_roommates_approved: RoommateApproval[];
    applied_at: string;
    approved_at?: string;
    rejected_at?: string;
    move_in_date: string;
    landlord_notes?: string;
    roommate_notes?: string;
    applicant_message?: string;
}

// ─── Payment Types ────────────────────────────────────────────
export type PaymentType = 'rent' | 'deposit' | 'refund';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'overdue';
export type PaymentMethod = 'bank_transfer' | 'cheque' | 'card';
export type ReraEscrowStatus = 'registered' | 'held' | 'release_requested' | 'released';

export interface Payment {
    id: string;
    listing_id: string;
    payer_id: string;
    payee_id: string;
    type: PaymentType;
    amount: number;              // AED
    due_date: string;
    paid_date?: string;
    status: PaymentStatus;
    method: PaymentMethod;
    reference: string;
    rera_escrow_ref?: string;    // RERA escrow reference (replaces UK TDS)
    rera_escrow_status?: ReraEscrowStatus;
    created_at: string;
    updated_at: string;
}

// ─── Compliance Check Types ───────────────────────────────────
export type CheckType = 'kyc' | 'aml' | 'pep';
export type CheckStatus = 'pending' | 'passed' | 'failed' | 'manual_review';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface ComplianceCheck {
    id: string;
    user_id: string;
    check_type: CheckType;
    data: Record<string, unknown>;
    status: CheckStatus;
    result: {
        score: number;
        risk_level: RiskLevel;
        flags: string[];
        message: string;
    };
    api_provider?: string;
    api_reference_id?: string;
    checked_at: string;
    expires_at?: string;
}

// ─── Fintech / Proptech Types ────────────────────────────────
export interface KycStep {
    id: 'id_upload' | 'liveness' | 'aml_check';
    label: string;
    status: 'pending' | 'completed' | 'failed';
}

export interface FinancialLedger {
    property_id: string;
    total_rent_due: number;      // AED
    amount_collected: number;    // AED
    collective_status_percent: number;
    status: 'partial' | 'full' | 'overdue';
    last_updated: string;
    residents: ResidentFinancialShare[];
}

export interface ResidentFinancialShare {
    user_id: string;
    name: string;
    monthly_share: number;       // AED
    payment_status: 'Paid' | 'Pending';
    deposit_held: boolean;
    has_rera_escrow: boolean;     // RERA escrow badge (replaces UK TDS)
    utility_status?: 'pending' | 'completed';
}

// ─── Phase 17: Maintenance Engine ────────────────────────
export type MaintenanceCategory = 'AC/Cooling' | 'Plumbing' | 'Electrical' | 'Appliances' | 'General';
export type MaintenanceUrgency = 'Low' | 'Medium' | 'Emergency';
export type MaintenanceStatus = 'Reported' | 'In Progress' | 'Resolved';

export interface MaintenanceTicket {
    id: string;
    property_id: string;
    tenant_id: string;
    issue_type: MaintenanceCategory;
    urgency: MaintenanceUrgency;
    status: MaintenanceStatus;
    description: string;
    created_at: string;
}

// ─── Phase 18: Rent Ledger ──────────────────────────────
export type RentPaymentStatus = 'Paid' | 'Upcoming' | 'Overdue';

export interface RentInstallment {
    id: string;
    due_date: string;
    amount: number;
    method: 'Cheque' | 'Stripe';
    status: RentPaymentStatus;
}

export interface RentLedger {
    id: string;
    property_id: string;
    tenant_id: string;
    landlord_id: string;
    total_rent: number;
    installments: RentInstallment[];
}
