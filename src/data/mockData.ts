import type { User, Listing, Payment, ViewingBooking, ChatChannel, ChatMessage, PropertyRating, MaintenanceTicket, RentLedger, KycDocument } from '@/types';

// ─── Slug Generator ──────────────────────────────────────────
export function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

// ─── Helpers ──────────────────────────────────────────────────
export function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(amount);
}

export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' });
}

export function starDisplay(rating: number): string {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
}

// ─── USERS ────────────────────────────────────────────────────
export const users: User[] = [
    // ── Landlord 1: Ahmed Al Maktoum ──────────────────────────
    {
        id: 'L001', type: 'landlord', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1990-00001', emiratesId: '784-1990-1234567-1',
        isUaePassVerified: true, isIdVerified: false, verification_tier: 'tier2_uae_pass',
        name: 'Ahmed Al Maktoum', email: 'ahmed@nestmatch.ae', avatar: '', nationality: 'Emirati',
        bio: 'Experienced property investor managing 8 units across Dubai Marina, JBR, and Downtown. I believe in providing well-maintained, fully compliant shared housing. All my properties are Municipality-permitted and RERA-registered.',
        keywords: ['professional', 'responsive', 'compliant', 'long-term', 'premium'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-11-10', aml_status: 'completed', aml_completed_date: '2025-11-10', pep_status: 'clear', pep_completed_date: '2025-11-10', verified: true },
        phone: '+971 50 123 4567', linkedin_url: '#demo-profile',
        rating: 4.8, total_reviews: 31,
        bank_details: { account_name: 'Al Maktoum Properties LLC', iban: 'AE07033300000*****01', swift_code: 'BOMLAEAD', bank_name: 'Mashreq Bank' },
        deposits: { held: 24000, released: 18000, total: 42000 },
        monthly_income: 28000, managed_by_agent: 'A001',
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        bank_linked: true, created_at: '2025-10-01', updated_at: '2026-03-10',
    },
    // ── Landlord 2: Fatima Hassan ──────────────────────────────
    {
        id: 'L002', type: 'landlord', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1985-00002', emiratesId: '784-1985-2345678-2',
        isUaePassVerified: true, isIdVerified: false, verification_tier: 'tier2_uae_pass',
        name: 'Fatima Hassan', email: 'fatima@nestmatch.ae', avatar: '', nationality: 'Emirati',
        bio: 'Property owner in JLT and Business Bay. I focus on creating comfortable shared living spaces for young professionals. Quick maintenance responses and transparent communication.',
        keywords: ['professional', 'transparent', 'tenant-friendly', 'modern'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-12-05', aml_status: 'completed', aml_completed_date: '2025-12-05', pep_status: 'clear', pep_completed_date: '2025-12-05', verified: true },
        phone: '+971 55 234 5678', rating: 4.9, total_reviews: 12,
        bank_details: { account_name: 'Fatima Hassan', iban: 'AE260260001000*****02', swift_code: 'EABORAEAD', bank_name: 'Emirates NBD' },
        deposits: { held: 12000, released: 6000, total: 18000 },
        monthly_income: 14000,
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2025-11-15', updated_at: '2026-03-08',
    },
    // ── Letting Agent 1: Khalid Al Rashid ─────────────────────
    {
        id: 'A001', type: 'letting_agent', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1988-00003', emiratesId: '784-1988-3456789-3',
        isUaePassVerified: true, isIdVerified: false, verification_tier: 'tier2_uae_pass',
        name: 'Khalid Al Rashid', email: 'khalid@dubaipropertygroup.ae', avatar: '', nationality: 'Emirati',
        bio: 'RERA-certified property broker with 6 years managing shared housing portfolios in Dubai. Specializing in compliant co-living setups. I handle tenant relations, viewings, and Municipality permit coordination.',
        keywords: ['RERA-certified', 'professional', 'shared-housing', 'responsive', 'compliant'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-10-15', aml_status: 'completed', aml_completed_date: '2025-10-15', pep_status: 'clear', pep_completed_date: '2025-10-15', verified: true },
        phone: '+971 56 345 6789', rating: 4.7, total_reviews: 52,
        agency_name: 'Dubai Property Group', rera_license: 'RERA-BRN-2025-12345',
        managed_landlords: ['L001'], managed_properties: ['P003', 'P012'],
        commission_rate: 5,
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2025-09-01', updated_at: '2026-03-10',
    },
    // ── Residing Roommate 1: Priya Sharma ─────────────────────
    {
        id: 'S001', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1995-00004', emiratesId: '784-1995-4567890-4',
        isUaePassVerified: true, isIdVerified: false, verification_tier: 'tier2_uae_pass',
        name: 'Priya Sharma', email: 'priya@nestmatch.ae', avatar: '', nationality: 'Indian',
        bio: 'UX Designer at a fintech startup in DIFC. Love weekend brunches at Dubai Marina, yoga at sunrise, and cooking elaborate Indian meals. I keep common areas spotless and believe communication is key.',
        keywords: ['non-smoker', 'early-bird', 'professional', 'clean', 'social', 'yoga'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-12-01', aml_status: 'completed', aml_completed_date: '2025-12-01', pep_status: 'clear', pep_completed_date: '2025-12-01', verified: true },
        phone: '+971 52 456 7890', instagram_handle: '@priya.dubai',
        rating: 4.9, total_reviews: 3,
        preferences: { budget_min: 3000, budget_max: 4500, move_in_date: '2025-12-15', duration: '12_months', schedule: 'early_bird', location_keywords: ['near-metro', 'marina', 'walkable'], lifestyle_keywords: ['non-smoker', 'social', 'clean'] },
        current_house_id: 'P011', rent_monthly: 3200, deposit: 3200,

        good_conduct_certificate: { id: 'gcc-1', tenant_id: 'S001', issued_by_landlord: 'L002', property_id: 'P011', tenancy_start: '2025-12-15', tenancy_end: '2026-12-15', rating: 5, payment_reliability: 'excellent', property_care: 'excellent', issued_at: '2026-02-20', verified: true },
        is_verified: true, has_gcc: true, gccScore: 85, isPremium: true,
        is_paid: true, bank_linked: true, has_secure_deposit: true,
        resident_role: 'residing', tenancy_duration_months: 14,
        kyc_steps: [{ id: 'id_upload', label: 'Emirates ID', status: 'completed' }, { id: 'liveness', label: 'Liveness Check', status: 'completed' }, { id: 'aml_check', label: 'AML Background', status: 'completed' }],
        lifestyle_tags: ['yoga', 'gym-goer', 'runner', 'swimmer'],
        personality_traits: ['extroverted', 'social', 'organised', 'early-riser'],
        hobbies: ['cooking', 'interior-design', 'reading', 'brunch-culture', 'hiking'],
        local_recommendations: [
            { name: 'Dubai Marina Walk', category: 'activity', description: 'Beautiful waterfront promenade — perfect for morning jogs', distance: '3 min walk' },
            { name: 'Bluewaters Island', category: 'landmark', description: 'The Ain Dubai observation wheel and beachfront dining', distance: '10 min walk' },
        ],
        created_at: '2025-11-20', updated_at: '2026-03-05',
    },
    // ── Residing Roommate 2: Marcus Chen ──────────────────────
    {
        id: 'S002', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1993-00005', emiratesId: '784-1993-5678901-5',
        isUaePassVerified: true, isIdVerified: false, verification_tier: 'tier2_uae_pass',
        name: 'Marcus Chen', email: 'marcus.chen@email.com', avatar: '', nationality: 'Singaporean',
        bio: 'Software engineer working remotely for a climate tech company in Singapore. Quiet during work hours, love hitting the gym in the evenings and exploring Dubai\'s food scene on weekends. Big fan of board games and cycling.',
        keywords: ['professional', 'quiet', 'gym-goer', 'non-smoker', 'tech', 'foodie'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-11-25', aml_status: 'completed', aml_completed_date: '2025-11-25', pep_status: 'clear', pep_completed_date: '2025-11-25', verified: true },
        phone: '+971 54 567 8901', instagram_handle: '@marcus.dxb',
        rating: 4.6, total_reviews: 2,
        preferences: { budget_min: 3000, budget_max: 4000, move_in_date: '2025-11-01', duration: '12_months', schedule: 'varies', location_keywords: ['near-metro', 'gym-nearby', 'restaurants'], lifestyle_keywords: ['quiet', 'gym-goer', 'professional'] },
        current_house_id: 'P012', rent_monthly: 3500, deposit: 3500,

        is_verified: true, has_gcc: true, gccScore: 70, isPremium: false,
        is_paid: true, bank_linked: true, has_secure_deposit: true,
        resident_role: 'residing', tenancy_duration_months: 16,
        kyc_steps: [{ id: 'id_upload', label: 'Emirates ID', status: 'completed' }, { id: 'liveness', label: 'Liveness Check', status: 'completed' }, { id: 'aml_check', label: 'AML Background', status: 'completed' }],
        lifestyle_tags: ['gym-goer', 'cyclist', 'rock-climbing'],
        personality_traits: ['introverted', 'curious', 'analytical', 'night-owl'],
        hobbies: ['board-games', 'cycling', 'coding', 'food-vlogger', 'photography'],
        local_recommendations: [
            { name: 'Fitness First Marina', category: 'sport', description: 'Premium gym with pool and sauna, never too busy mornings', distance: '5 min walk' },
            { name: 'Tresind Studio', category: 'food', description: 'Michelin-starred Indian fine dining — incredible tasting menu', distance: '15 min drive' },
        ],
        created_at: '2025-10-25', updated_at: '2026-03-05',
    },
    // ── Searching Roommate 1: James Morrison ──────────────────
    {
        id: 'S004', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1992-00009', emiratesId: '784-1992-9012345-9',
        isUaePassVerified: true, isIdVerified: false, verification_tier: 'tier2_uae_pass',
        name: 'James Morrison', email: 'james.morrison@email.com', avatar: '', nationality: 'British',
        bio: 'Data analyst relocating from London to Dubai for a new role at an AI company in DIFC. Love long-distance cycling, dim sum, and quiet evenings. Looking for a tidy, professional household near the Metro.',
        keywords: ['non-smoker', 'quiet', 'professional', 'tidy', 'cyclist', 'reader'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2026-02-20', aml_status: 'completed', aml_completed_date: '2026-02-20', pep_status: 'clear', pep_completed_date: '2026-02-20', verified: true },
        phone: '+971 55 901 2345',
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        resident_role: 'searching',
        preferences: { budget_min: 3000, budget_max: 4500, move_in_date: '2026-04-01', duration: '12_months', schedule: 'early_bird', location_keywords: ['near-metro', 'red-line', 'quiet-area'], lifestyle_keywords: ['non-smoker', 'quiet', 'tidy'] },
        lifestyle_tags: ['cyclist', 'swimming', 'running'],
        personality_traits: ['introverted', 'analytical', 'reader', 'calm'],
        hobbies: ['cycling', 'reading', 'data-viz', 'desert-drives'],
        created_at: '2026-02-20', updated_at: '2026-03-08',
    },
    // ── Searching Roommate 2: Aisha Patel ─────────────────────
    {
        id: 'S003', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1991-00010', emiratesId: '784-1991-0123456-0',
        isUaePassVerified: true, isIdVerified: false, verification_tier: 'tier2_uae_pass',
        name: 'Aisha Patel', email: 'aisha.patel@email.com', avatar: '', nationality: 'British-Indian',
        bio: 'Strategy consultant at McKinsey. Previous NestMatch tenant in London with 18 months verified tenancy and an excellent GCC. Relocating to Dubai — looking for a quiet, premium household.',
        keywords: ['non-smoker', 'professional', 'quiet', 'experienced-tenant', 'long-term'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-05-10', aml_status: 'completed', aml_completed_date: '2025-05-10', pep_status: 'clear', pep_completed_date: '2025-05-10', verified: true },
        phone: '+971 50 012 3456',
        is_verified: true, has_gcc: true, gccScore: 92, isPremium: true,
        resident_role: 'searching', tenancy_duration_months: 18,
        good_conduct_certificate: { id: 'gcc-aisha', tenant_id: 'S003', issued_by_landlord: 'landlord-prev', property_id: 'listing-prev', tenancy_start: '2024-08-01', tenancy_end: '2026-02-01', rating: 5, payment_reliability: 'excellent', property_care: 'excellent', issued_at: '2026-02-10', verified: true },
        preferences: { budget_min: 4000, budget_max: 6000, move_in_date: '2026-03-15', duration: '12_months', schedule: 'early_bird', location_keywords: ['downtown', 'near-metro', 'premium'], lifestyle_keywords: ['quiet', 'professional', 'non-smoker'] },
        lifestyle_tags: ['pilates', 'runner', 'tennis'],
        personality_traits: ['introverted', 'organised', 'analytical', 'calm'],
        hobbies: ['brunch-culture', 'bookshops', 'travel-planning', 'podcasts'],
        created_at: '2025-05-10', updated_at: '2026-03-08',
    },
    {
        id: 'A002', type: 'letting_agent', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1990-00201', emiratesId: '784-1990-3333333-3',
        isUaePassVerified: true, isIdVerified: false, verification_tier: 'tier2_uae_pass',
        name: 'Tariq Mahmood', email: 'tariq@agency.ae', avatar: '', nationality: 'Pakistani',
        bio: 'RERA certified broker.',
        agency_name: 'Prime Real Estate', rera_license: 'RERA-BRN-33333',
        keywords: ['compliant'], phone: '+971 50 333 4444',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-01-01', aml_status: 'completed', aml_completed_date: '2025-01-01', pep_status: 'clear', pep_completed_date: '2025-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2025-01-01', updated_at: '2026-03-01',
    },
    // ── Tier 0 Demo Users (Passport KYC, no Emirates ID) ────────
    {
        id: 'S005', type: 'roommate', auth_method: 'google',
        isUaePassVerified: false, isIdVerified: false,
        verification_tier: 'tier0_passport',
        name: 'James Okafor', email: 'james@nestmatch.ae', avatar: '',
        bio: 'Data engineer relocating from Lagos. Just arrived in Dubai on employment visa — Emirates ID processing.',
        nationality: 'Nigerian', passport_number: 'A12345678',
        visa_type: 'Employment', visa_expiry: '2028-03-01',
        keywords: ['professional', 'tech'], phone: '+971 52 111 2233',
        compliance: { kyc_status: 'pending', aml_status: 'pending', pep_status: 'pending', verified: false },
        is_verified: false, has_gcc: false, gccScore: 0, isPremium: false,
        resident_role: 'searching',
        preferences: { budget_min: 2500, budget_max: 4000, move_in_date: '2026-04-01', duration: 'flexible', schedule: 'varies' },
        kyc_documents: [
            { id: 'kyc-t0-1a', user_id: 'S005', doc_type: 'passport', r2_key: 'kyc/S005/passport.jpg', uploaded_at: '2026-03-10', review_status: 'pending' },
            { id: 'kyc-t0-1b', user_id: 'S005', doc_type: 'visa_page', r2_key: 'kyc/S005/visa.jpg', uploaded_at: '2026-03-10', review_status: 'pending' },
        ] as KycDocument[],
        lifestyle_tags: ['gym-goer', 'football'], personality_traits: ['social', 'organised'],
        hobbies: ['football', 'data-science'], created_at: '2026-03-10', updated_at: '2026-03-10',
    },
    {
        id: 'S006', type: 'roommate', auth_method: 'email',
        isUaePassVerified: false, isIdVerified: false,
        verification_tier: 'tier0_passport',
        name: 'Sofia Kowalski', email: 'sofia@nestmatch.ae', avatar: '',
        bio: 'Marketing manager from Warsaw, just started at a DMCC company. Visa stamped, awaiting Emirates ID.',
        nationality: 'Polish', passport_number: 'XY9876543',
        visa_type: 'Employment', visa_expiry: '2027-11-15',
        keywords: ['professional', 'non-smoker'], phone: '+971 54 333 4455',
        compliance: { kyc_status: 'pending', aml_status: 'pending', pep_status: 'pending', verified: false },
        is_verified: false, has_gcc: false, gccScore: 0, isPremium: false,
        resident_role: 'searching',
        preferences: { budget_min: 3000, budget_max: 5000, move_in_date: '2026-04-15', duration: '12_months', schedule: 'early_bird' },
        kyc_documents: [
            { id: 'kyc-t0-2a', user_id: 'S006', doc_type: 'passport', r2_key: 'kyc/S006/passport.jpg', uploaded_at: '2026-03-12', review_status: 'approved' },
            { id: 'kyc-t0-2b', user_id: 'S006', doc_type: 'visa_page', r2_key: 'kyc/S006/visa.jpg', uploaded_at: '2026-03-12', review_status: 'approved' },
        ] as KycDocument[],
        lifestyle_tags: ['yoga', 'runner'], personality_traits: ['creative', 'organised'],
        hobbies: ['photography', 'yoga'], created_at: '2026-03-12', updated_at: '2026-03-13',
    },
    {
        id: 'S007', type: 'roommate', auth_method: 'google',
        isUaePassVerified: false, isIdVerified: false,
        verification_tier: 'tier0_passport',
        name: 'Ravi Menon', email: 'ravi.menon@gmail.com', avatar: '',
        bio: 'Finance analyst from Mumbai, new to Dubai on a visit visa converting to employment. Emirates ID TBA.',
        nationality: 'Indian', passport_number: 'M7654321',
        visa_type: 'Visit', visa_expiry: '2026-06-01',
        keywords: ['professional', 'quiet'], phone: '+971 55 666 7788',
        compliance: { kyc_status: 'pending', aml_status: 'pending', pep_status: 'pending', verified: false },
        is_verified: false, has_gcc: false, gccScore: 0, isPremium: false,
        resident_role: 'searching',
        preferences: { budget_min: 2000, budget_max: 3500, move_in_date: '2026-04-01', duration: '6_months', schedule: 'early_bird' },
        kyc_documents: [] as KycDocument[],
        lifestyle_tags: ['gym-goer', 'cycling'], personality_traits: ['calm', 'analytical'],
        hobbies: ['cricket', 'finance-blogs'], created_at: '2026-03-14', updated_at: '2026-03-14',
    },
    // ── Admin Users ───────────────────────────────────────────
    {
        id: 'ADM001', type: 'compliance', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-ADMIN-001', isUaePassVerified: true, isIdVerified: false, verification_tier: 'tier2_uae_pass',
        name: 'Sara Al Hashimi', email: 'compliance@nestmatch.ae', avatar: '', nationality: 'Emirati',
        bio: 'NestMatch UAE Head of Compliance — UAE PASS verification and RERA regulatory oversight.',
        keywords: ['admin', 'compliance'], phone: '+971 4 123 4567',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2024-01-01', aml_status: 'completed', aml_completed_date: '2024-01-01', pep_status: 'clear', pep_completed_date: '2024-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2024-01-01', updated_at: '2026-03-10',
    },
    {
        id: 'ADM002', type: 'operations', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-ADMIN-003', isUaePassVerified: true, isIdVerified: false, verification_tier: 'tier2_uae_pass',
        name: 'Rashid Khalil', email: 'operations@nestmatch.ae', avatar: '', nationality: 'Emirati',
        bio: 'NestMatch UAE Head of Operations — CRM, property registry, and platform integrity.',
        keywords: ['admin', 'operations'], phone: '+971 4 123 4569',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2024-01-01', aml_status: 'completed', aml_completed_date: '2024-01-01', pep_status: 'clear', pep_completed_date: '2024-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2024-01-01', updated_at: '2026-03-10',
    },
    // ── Tier 1 Demo Users (Email-only, no UAE PASS) ───────────
    {
        id: 'S008', type: 'roommate', auth_method: 'email',
        isUaePassVerified: false, isIdVerified: false, verification_tier: 'tier1_unverified',
        name: 'Liam O\'Brien', email: 'liam@nestmatch.ae', avatar: '', nationality: 'Irish',
        bio: 'Just landed in Dubai on a job-seeker visa. Exploring the city and sussing out neighbourhoods before committing to anything.',
        keywords: ['new-arrival'], phone: '+971 50 909 1010',
        compliance: { kyc_status: 'pending', aml_status: 'pending', pep_status: 'pending', verified: false },
        is_verified: false, has_gcc: false, gccScore: 0, isPremium: false,
        resident_role: 'searching',
        preferences: { budget_min: 2000, budget_max: 4000, move_in_date: '2026-05-01', duration: 'flexible', schedule: 'varies' },
        lifestyle_tags: ['football', 'gym-goer', 'socialising'],
        personality_traits: ['social', 'curious', 'flexible'],
        hobbies: ['football', 'pub-quizzes', 'travel'],
        created_at: '2026-03-12', updated_at: '2026-03-12',
    },
    {
        id: 'S009', type: 'roommate', auth_method: 'google',
        isUaePassVerified: false, isIdVerified: false, verification_tier: 'tier1_unverified',
        name: 'Amara Diallo', email: 'amara.diallo@email.com', avatar: '', nationality: 'Senegalese',
        bio: 'Freelance photographer scoping out Dubai for a potential relocation. Browsing listings before her exploratory visit next month.',
        keywords: ['new-expat', 'photographer'], phone: '+971 52 010 1111',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2026-03-10', aml_status: 'completed', aml_completed_date: '2026-03-10', pep_status: 'clear', pep_completed_date: '2026-03-10', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        resident_role: 'searching',
        preferences: { budget_min: 2500, budget_max: 4500, move_in_date: '2026-04-15', duration: '12_months', schedule: 'early_bird' },
        lifestyle_tags: ['photography', 'yoga', 'walking'],
        personality_traits: ['creative', 'calm', 'observant'],
        hobbies: ['street-photography', 'yoga', 'cooking'],
        created_at: '2026-03-10', updated_at: '2026-03-12',
    },
];

// ─── Auto-generate slugs for all users ───────────────────────
users.forEach(u => { if (!u.slug) u.slug = generateSlug(u.name); });

// ─── LISTINGS ─────────────────────────────────────────────────
export const listings: Listing[] = [
    // ── AED 500 - 800: Budget Private Rooms ─────────────────────────────────────────
    {
        id: 'P001', landlord_id: 'L001', letting_agent_id: 'A002',
        title: 'Private Room in Shared Apartment — Deira, Near Metro',
        address: 'Al Rigga Road, Deira', district: 'Deira', rent_per_room: 500, total_rooms: 3, available_rooms: 3,
        images: ['https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=500&fit=crop'], description: 'Clean, municipality-permitted private room in a 3-bedroom shared apartment. 3 mins walk to Al Rigga Metro. Daily cleaning included. One tenant per room.',
        amenities: ['Central AC', 'Daily Cleaning', 'High-Speed Wi-Fi', 'Furnished'],
        house_rules: ['No smoking', 'Quiet hours 10PM-6AM'],
        bills_included: true, bills_breakdown: 'DEWA & Internet included', deposit: 500,
        current_roommates: [],
        occupancy_status: [
            { room_number: 1, tenant_id: null, status: 'available' },
            { room_number: 2, tenant_id: null, status: 'available' },
            { room_number: 3, tenant_id: null, status: 'available' }
        ],
        tags: ['private-room', 'budget', 'metro-access', 'deira'],
        listing_status: 'active',
        makaniNumber: '1122334455', trakheesiPermit: 'TRAK-2025-DR-123', municipalityPermit: 'DM-SH-2026-DR1',
        maxLegalOccupancy: 3, currentOccupants: 0, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'Al Rigga Metro', type: 'metro', walk_time: '3m', lines: ['Red Line'], line_color: '#E21836' }],
        rera_escrow_verified: true, location: { lat: 25.263, lng: 55.321, nearest_metro: { name: 'Al Rigga', line: 'Red Line', walk_mins: 3 }, nearby_amenities: ['Al Ghurair Centre', 'Rigga Night Market'], area_description: 'Deira — Historic commercial hub with unbeatable metro connections.' },
        rating: 4.2, total_reviews: 12, created_at: '2025-10-01', updated_at: '2026-03-01',
    },
    {
        id: 'P002', landlord_id: 'L002',
        title: 'Private Room — International City',
        address: 'England Cluster, International City', district: 'International City', rent_per_room: 600, total_rooms: 2, available_rooms: 2,
        images: ['https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=500&fit=crop'], description: 'Affordable private room in a municipality-permitted shared apartment. Direct bus to Rashidiya Metro. One tenant per room.',
        amenities: ['AC', 'Parking', 'Wi-Fi'], house_rules: ['No smoking'], bills_included: true, deposit: 600,
        current_roommates: [],
        occupancy_status: [{ room_number: 1, tenant_id: null, status: 'available' }, { room_number: 2, tenant_id: null, status: 'available' }],
        tags: ['private-room', 'budget'], listing_status: 'active', makaniNumber: '2233445566', trakheesiPermit: 'TRAK-2025-IC-123', municipalityPermit: 'DM-SH-2026-IC1',
        maxLegalOccupancy: 2, currentOccupants: 0, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'RTA Bus 367', type: 'bus', walk_time: '2m', lines: ['367'] }], rera_escrow_verified: true,
        location: { lat: 25.163, lng: 55.407, nearby_amenities: ['Dragon Mart'], area_description: 'International City — highly affordable community living.' },
        rating: 4.0, total_reviews: 8, created_at: '2025-11-01', updated_at: '2026-03-01',
    },
    {
        id: 'P003', landlord_id: 'L002', letting_agent_id: 'A001',
        title: 'Private Room — Al Qusais, Near Airport Freezone',
        address: 'Damascus St, Al Qusais', district: 'Al Qusais', rent_per_room: 800, total_rooms: 4, available_rooms: 4,
        images: ['https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=500&fit=crop'], description: 'Spacious private room near DAFZA metro. One tenant per room — fully compliant with municipality occupancy limits.',
        amenities: ['Balcony', 'Gym', 'Wi-Fi', 'Central AC'], house_rules: [], bills_included: true, deposit: 800,
        current_roommates: [],
        occupancy_status: [{ room_number: 1, tenant_id: null, status: 'available' }, { room_number: 2, tenant_id: null, status: 'available' }, { room_number: 3, tenant_id: null, status: 'available' }, { room_number: 4, tenant_id: null, status: 'available' }],
        tags: ['private-room', 'dafza'], listing_status: 'active', makaniNumber: '3344556677', trakheesiPermit: 'TRAK-2025-AQ-123', municipalityPermit: 'DM-SH-2026-AQ1',
        maxLegalOccupancy: 4, currentOccupants: 0, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'DAFZA Metro', type: 'metro', walk_time: '8m', lines: ['Green Line'], line_color: '#009639' }], rera_escrow_verified: true,
        location: { lat: 25.267, lng: 55.378, nearby_amenities: ['DAFZA'], area_description: 'Al Qusais — great for freezone workers.' },
        rating: 4.5, total_reviews: 5, created_at: '2025-12-01', updated_at: '2026-03-01',
    },

    // ── AED 1000 - 1500: Private Rooms (Mid-Tier) ───────────────────────────────
    {
        id: 'P004', landlord_id: 'L001',
        title: 'Private Room — Heart of Bur Dubai',
        address: 'Mankhool Road, Bur Dubai', district: 'Bur Dubai', rent_per_room: 1000, total_rooms: 3, available_rooms: 1,
        images: ['https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=500&fit=crop'], description: 'Spacious private room in a shared apartment. En-suite bathroom, high ceilings. Walking distance to ADCB Metro. One tenant per room.',
        amenities: ['En-suite', 'Balcony', 'Wi-Fi'], house_rules: ['Professionals only'], bills_included: false, bills_breakdown: 'DEWA shared', deposit: 1000,
        current_roommates: ['S004'],
        occupancy_status: [{ room_number: 1, tenant_id: 'S004', status: 'occupied' }, { room_number: 2, tenant_id: null, status: 'available' }],
        tags: ['private-room', 'bur-dubai'], listing_status: 'active', makaniNumber: '4455667788', trakheesiPermit: 'TRAK-2025-BD-123', municipalityPermit: 'DM-SH-2026-BD1',
        maxLegalOccupancy: 2, currentOccupants: 1, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'ADCB Metro', type: 'metro', walk_time: '6m', lines: ['Red Line'], line_color: '#E21836' }], rera_escrow_verified: true,
        location: { lat: 25.250, lng: 55.300, nearby_amenities: ['BurJuman'], area_description: 'Bur Dubai — historic and incredibly well-connected.' },
        rating: 4.6, total_reviews: 4, created_at: '2025-10-15', updated_at: '2026-03-01',
    },
    {
        id: 'P005', landlord_id: 'L002', letting_agent_id: 'A002',
        title: 'Private Room — Al Nahda, Dubai/Sharjah Border',
        address: 'Al Nahda 1, Dubai', district: 'Al Nahda', rent_per_room: 1200, total_rooms: 2, available_rooms: 2,
        images: ['https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=500&fit=crop'], description: 'Brand new building with gym and pool included. Private room in a shared apartment. One verified tenant per room.',
        amenities: ['Gym', 'Pool', 'Parking'], house_rules: [], bills_included: true, deposit: 1200,
        current_roommates: [],
        occupancy_status: [{ room_number: 1, tenant_id: null, status: 'available' }, { room_number: 2, tenant_id: null, status: 'available' }],
        tags: ['al-nahda', 'new-building'], listing_status: 'active', makaniNumber: '5566778899', trakheesiPermit: 'TRAK-2025-AN-123', municipalityPermit: 'DM-SH-2026-AN1',
        maxLegalOccupancy: 2, currentOccupants: 0, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'Stadium Metro', type: 'metro', walk_time: '15m', lines: ['Green Line'], line_color: '#009639' }], rera_escrow_verified: true,
        location: { lat: 25.291, lng: 55.364, nearby_amenities: ['Sahara Centre'], area_description: 'Al Nahda — great value on the border.' },
        rating: 4.8, total_reviews: 2, created_at: '2026-01-10', updated_at: '2026-03-01',
    },
    {
        id: 'P006', landlord_id: 'L001',
        title: 'Private Room — Discovery Gardens',
        address: 'Zen Cluster, Discovery Gardens', district: 'Discovery Gardens', rent_per_room: 1500, total_rooms: 2, available_rooms: 1,
        images: ['https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=500&fit=crop'], description: 'Great community living. Private room in a shared apartment — one tenant per room. Metro is just outside the cluster.',
        amenities: ['Community Pool', 'Tennis Court', 'Metro Access'], house_rules: [], bills_included: true, deposit: 1500,
        current_roommates: ['S003'],
        occupancy_status: [{ room_number: 1, tenant_id: 'S003', status: 'occupied' }, { room_number: 2, tenant_id: null, status: 'available' }],
        tags: ['discovery-gardens', 'metro-access'], listing_status: 'active', makaniNumber: '6677889900', trakheesiPermit: 'TRAK-2025-DG-123', municipalityPermit: 'DM-SH-2026-DG1',
        maxLegalOccupancy: 2, currentOccupants: 1, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'Discovery Gardens Metro', type: 'metro', walk_time: '4m', lines: ['Red Line'], line_color: '#E21836' }], rera_escrow_verified: true,
        location: { lat: 25.040, lng: 55.140, nearby_amenities: ['Ibn Battuta Mall'], area_description: 'Discovery Gardens — lush, green, affordable.' },
        rating: 4.4, total_reviews: 9, created_at: '2025-08-20', updated_at: '2026-03-01',
    },

    // ── AED 1800 - 2500: Private Rooms (Budger / Mid-Tier) ────────────────────
    {
        id: 'P007', landlord_id: 'L002', letting_agent_id: 'A002',
        title: 'Private Room in JVC Villa',
        address: 'District 15, JVC', district: 'JVC', rent_per_room: 1800, total_rooms: 4, available_rooms: 4,
        images: ['https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1598928506311-c55ece5ffa7d?w=800&h=500&fit=crop'], description: 'Your own private room in a massive JVC villa. Shared backyard, huge kitchen. You share a bathroom with just 1 other person.',
        amenities: ['Garden', 'Parking', 'Maid Room'], house_rules: ['No loud parties'], bills_included: false, bills_breakdown: 'DEWA & Internet split 4 ways', deposit: 1800,
        current_roommates: [],
        occupancy_status: [{ room_number: 1, tenant_id: null, status: 'available' }, { room_number: 2, tenant_id: null, status: 'available' }, { room_number: 3, tenant_id: null, status: 'available' }],
        tags: ['private-room', 'villa', 'jvc'], listing_status: 'active', makaniNumber: '7788990011', trakheesiPermit: 'TRAK-2025-JVC-123', municipalityPermit: 'DM-SH-2026-JVC1',
        maxLegalOccupancy: 4, currentOccupants: 0, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'J01 Bus', type: 'bus', walk_time: '2m', lines: ['J01'] }], rera_escrow_verified: true,
        location: { lat: 25.060, lng: 55.210, nearby_amenities: ['Circle Mall'], area_description: 'Jumeirah Village Circle — the heart of new Dubai.' },
        rating: 4.1, total_reviews: 6, created_at: '2025-05-15', updated_at: '2026-03-01',
    },
    {
        id: 'P008', landlord_id: 'L001',
        title: 'Private Room — Dubai Silicon Oasis',
        address: 'Axis Residence, DSO', district: 'Dubai Silicon Oasis', rent_per_room: 2200, total_rooms: 2, available_rooms: 2,
        images: ['https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1598928506311-c55ece5ffa7d?w=800&h=500&fit=crop'], description: 'Clean, modern private room in DSO. Perfect for tech workers. Building has a great gym and rooftop pool.',
        amenities: ['Pool', 'Gym', 'Covered Parking'], house_rules: [], bills_included: true, deposit: 2200,
        current_roommates: [],
        occupancy_status: [{ room_number: 1, tenant_id: null, status: 'available' }, { room_number: 2, tenant_id: null, status: 'available' }],
        tags: ['private-room', 'dso'], listing_status: 'active', makaniNumber: '8899001122', trakheesiPermit: 'TRAK-2025-DSO-123', municipalityPermit: 'DM-SH-2026-DS1',
        maxLegalOccupancy: 2, currentOccupants: 0, isActive: true, isApiVerified: true,
        transport_chips: [{ label: '320 Bus', type: 'bus', walk_time: '1m', lines: ['320'] }], rera_escrow_verified: true,
        location: { lat: 25.120, lng: 55.380, nearby_amenities: ['Silicon Oasis Mall'], area_description: 'DSO — the tech hub of Dubai.' },
        rating: 4.7, total_reviews: 11, created_at: '2025-06-25', updated_at: '2026-03-01',
    },
    {
        id: 'P009', landlord_id: 'L002', letting_agent_id: 'A002',
        title: 'En-suite Private Room in Al Barsha 1',
        address: 'Al Barsha 1, Near MOE', district: 'Al Barsha', rent_per_room: 2500, total_rooms: 3, available_rooms: 2,
        images: ['https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1598928506311-c55ece5ffa7d?w=800&h=500&fit=crop'], description: 'Awesome private room with en-suite. 5 mins walk to Mall of the Emirates Metro. Completely full at the moment.',
        amenities: ['En-suite', 'Balcony', 'Gym'], house_rules: [], bills_included: true, deposit: 2500,
        current_roommates: ['S009'],
        occupancy_status: [{ room_number: 1, tenant_id: null, status: 'available' }, { room_number: 2, tenant_id: null, status: 'available' }, { room_number: 3, tenant_id: 'S009', status: 'occupied' }],
        tags: ['private-room', 'en-suite', 'al-barsha'], listing_status: 'active', makaniNumber: '9900112233', trakheesiPermit: 'TRAK-2025-AB-123', municipalityPermit: 'DM-SH-2026-AB1',
        maxLegalOccupancy: 3, currentOccupants: 1, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'MOE Metro', type: 'metro', walk_time: '5m', lines: ['Red Line'], line_color: '#E21836' }], rera_escrow_verified: true,
        location: { lat: 25.117, lng: 55.200, nearby_amenities: ['Mall of the Emirates'], area_description: 'Al Barsha — central, bustling, affordable.' },
        rating: 4.9, total_reviews: 14, created_at: '2025-03-10', updated_at: '2026-03-01',
    },

    // ── AED 2800 - 3500: Premium Private En-suites ────────────────────────────
    {
        id: 'P010', landlord_id: 'L001',
        title: 'Premium En-Suite — Business Bay Canal View',
        address: 'Executive Towers, Business Bay', district: 'Business Bay', rent_per_room: 2800, total_rooms: 2, available_rooms: 2,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop'], description: 'High-floor private room overlooking the canal. Premium building amenities. You share the apartment with a verified pilot.',
        amenities: ['Pool', 'Gym', 'Canal View', 'En-suite'], house_rules: ['Professionals only'], bills_included: false, bills_breakdown: 'Shared equally', deposit: 2800,
        current_roommates: [],
        occupancy_status: [{ room_number: 1, tenant_id: null, status: 'available' }, { room_number: 2, tenant_id: null, status: 'available' }],
        tags: ['premium', 'en-suite', 'business-bay'], listing_status: 'active', makaniNumber: '0011223344', trakheesiPermit: 'TRAK-2025-BB-123', municipalityPermit: 'DM-SH-2026-BB1',
        maxLegalOccupancy: 2, currentOccupants: 0, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'Business Bay Metro', type: 'metro', walk_time: '7m', lines: ['Red Line'], line_color: '#E21836' }], rera_escrow_verified: true,
        location: { lat: 25.185, lng: 55.265, nearby_amenities: ['Bay Avenue', 'Dubai Mall'], area_description: 'Business Bay — the commercial heart of Dubai.' },
        rating: 4.6, total_reviews: 7, created_at: '2025-04-18', updated_at: '2026-03-01',
    },
    {
        id: 'P011', landlord_id: 'L002', letting_agent_id: 'A002',
        title: 'Luxury JLT Private Room — Cluster D',
        address: 'Cluster D, JLT', district: 'JLT', rent_per_room: 3200, total_rooms: 3, available_rooms: 2,
        images: ['https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1598928506311-c55ece5ffa7d?w=800&h=500&fit=crop'], description: 'Upgraded luxury apartment in JLT. Sweeping views of the golf course and lakes. Two empty private rooms available for immediate move-in.',
        amenities: ['Lake View', 'Gym', 'Premium Furnishings'], house_rules: [], bills_included: true, deposit: 3200,
        current_roommates: ['S001'],
        occupancy_status: [{ room_number: 1, tenant_id: 'S001', status: 'occupied' }, { room_number: 2, tenant_id: null, status: 'available' }, { room_number: 3, tenant_id: null, status: 'available' }],
        tags: ['luxury', 'jlt', 'lake-view', 'private-room'], listing_status: 'active', makaniNumber: '1122334455', trakheesiPermit: 'TRAK-2025-JLT-123', municipalityPermit: 'DM-SH-2026-JL1',
        maxLegalOccupancy: 3, currentOccupants: 1, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'DMCC Metro', type: 'metro', walk_time: '8m', lines: ['Red Line'], line_color: '#E21836' }], rera_escrow_verified: true,
        location: { lat: 25.070, lng: 55.150, nearest_metro: { name: 'DMCC', line: 'Red Line', walk_mins: 8 }, nearby_amenities: ['JLT Park'], area_description: 'JLT — thriving lakeside community.' },
        rating: 4.8, total_reviews: 15, created_at: '2026-02-05', updated_at: '2026-03-01',
    },
    {
        id: 'P012', landlord_id: 'L001', letting_agent_id: 'A001',
        title: 'Ultra-Premium Marina En-Suite — Ocean View',
        address: 'Princess Tower, Dubai Marina', district: 'Dubai Marina', rent_per_room: 3500, total_rooms: 2, available_rooms: 1,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop'], description: 'The absolute best of NestMatch. 3500 AED gets you an ocean-facing massive en-suite in the Marina. Full cleaning, all bills, gym, and pool included.',
        amenities: ['Sea View', 'En-suite', 'Daily Cleaning', 'Concierge', 'Pool', 'Gym'], house_rules: ['No pets'], bills_included: true, bills_breakdown: 'Everything included', deposit: 3500,
        current_roommates: ['S002'],
        occupancy_status: [{ room_number: 1, tenant_id: 'S002', status: 'occupied' }, { room_number: 2, tenant_id: null, status: 'available' }],
        tags: ['ultra-premium', 'sea-view', 'marina', 'en-suite'], listing_status: 'active', makaniNumber: '2233445566', trakheesiPermit: 'TRAK-2025-DM-123', municipalityPermit: 'DM-SH-2026-DM1',
        maxLegalOccupancy: 2, currentOccupants: 1, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'Dubai Marina Tram', type: 'tram', walk_time: '3m' }, { label: 'DMCC Metro', type: 'metro', walk_time: '5m', lines: ['Red Line'], line_color: '#E21836' }], rera_escrow_verified: true,
        location: { lat: 25.080, lng: 55.140, nearest_metro: { name: 'DMCC', line: 'Red Line', walk_mins: 5 }, nearby_amenities: ['JBR Beach', 'Dubai Marina Mall'], area_description: 'Dubai Marina — iconic waterfront living.' },
        rating: 5.0, total_reviews: 24, created_at: '2025-01-10', updated_at: '2026-03-01',
    },

];

// ─── Auto-generate slugs for all listings ────────────────────
listings.forEach(l => { if (!l.slug) l.slug = generateSlug(l.title); });

// ─── VIEWING BOOKINGS ─────────────────────────────────────────
export const viewingBookings: ViewingBooking[] = [
    {
        id: 'view-1', property_id: 'P012', searcher_id: 'S004', landlord_id: 'L001',
        requested_date: '2026-03-20T14:00:00Z', time_slot: '2:00 PM - 2:30 PM',
        status: 'FULLY_SIGNED',
        agreement: {
            id: 'va-1', viewing_id: 'view-1', agreement_number: 'NM-VA-2026-IEW01',
            generated_at: '2026-03-11T09:00:00Z',
            broker_orn: 'ORN-54321', broker_company: 'Dubai Property Group', broker_brn: 'RERA-BRN-2025-12345',
            signatures: [
                { signer_id: 'A001', signer_name: 'Khalid Al Rashid', signer_role: 'broker', signed_at: '2026-03-11T10:00:00Z', signature_data: 'data:image/png;base64,demo_sig_1', ip_simulated: '192.168.1.42' },
                { signer_id: 'S004', signer_name: 'James Morrison', signer_role: 'tenant', signed_at: '2026-03-11T14:30:00Z', signature_data: 'data:image/png;base64,demo_sig_2', ip_simulated: '192.168.1.87' },
            ],
            status: 'fully_signed',
        },
        created_at: '2026-03-10', updated_at: '2026-03-11',
    },
    {
        id: 'view-2', property_id: 'P008', searcher_id: 'S003', landlord_id: 'L001',
        requested_date: '2026-03-22T10:00:00Z', time_slot: '10:00 AM - 10:30 AM',
        status: 'PENDING_LANDLORD_APPROVAL', created_at: '2026-03-11', updated_at: '2026-03-11',
    },
    {
        id: 'vb-priya-1', property_id: 'P012', searcher_id: 'S001', landlord_id: 'L001',
        requested_date: '2026-03-22T10:00:00Z', time_slot: '10:00 AM - 10:30 AM',
        status: 'CONFIRMED', created_at: '2026-03-15', updated_at: '2026-03-16',
    },
    {
        id: 'vb-priya-2', property_id: 'P011', searcher_id: 'S001', landlord_id: 'L002',
        requested_date: '2026-03-25T14:00:00Z', time_slot: '2:00 PM - 2:30 PM',
        status: 'PENDING', created_at: '2026-03-17', updated_at: '2026-03-17',
    },
    {
        id: 'vb-priya-3', property_id: 'P010', searcher_id: 'S001', landlord_id: 'L001',
        requested_date: '2026-03-10T11:00:00Z', time_slot: '11:00 AM - 11:30 AM',
        status: 'COMPLETED', resolution_date: '2026-03-10', created_at: '2026-03-05', updated_at: '2026-03-10',
    },
    {
        id: 'vb-aisha-1', property_id: 'P008', searcher_id: 'S003', landlord_id: 'L001',
        requested_date: '2026-03-22T10:00:00Z', time_slot: '10:00 AM - 10:30 AM',
        status: 'FULLY_SIGNED',
        agreement: {
            id: 'va-aisha-1', viewing_id: 'vb-aisha-1', agreement_number: 'NM-VA-2026-ISH01',
            generated_at: '2026-03-15T09:00:00Z',
            signatures: [
                { signer_id: 'L001', signer_name: 'Ahmed Al Maktoum', signer_role: 'broker', signed_at: '2026-03-15T10:00:00Z', signature_data: 'data:image/png;base64,demo', ip_simulated: '192.168.1.50' },
                { signer_id: 'S003', signer_name: 'Aisha Patel', signer_role: 'tenant', signed_at: '2026-03-15T14:00:00Z', signature_data: 'data:image/png;base64,demo', ip_simulated: '192.168.1.60' },
            ],
            status: 'fully_signed',
        },
        created_at: '2026-03-14', updated_at: '2026-03-15',
    },
    {
        id: 'vb-sofia-1', property_id: 'P012', searcher_id: 'S006', landlord_id: 'L001',
        requested_date: '2026-03-24T16:00:00Z', time_slot: '4:00 PM - 4:30 PM',
        status: 'AGREEMENT_SENT',
        agreement: {
            id: 'va-sofia-1', viewing_id: 'vb-sofia-1', agreement_number: 'NM-VA-2026-SOF01',
            generated_at: '2026-03-17T11:00:00Z',
            signatures: [],
            status: 'sent',
        },
        created_at: '2026-03-16', updated_at: '2026-03-17',
    },
];

// --- PAYMENTS ---
export const payments: Payment[] = [
    { id: 'pay-1', listing_id: 'P011', payer_id: 'S001', payee_id: 'L002', type: 'deposit', amount: 3200, due_date: '2025-12-15', paid_date: '2025-12-15', status: 'completed', method: 'bank_transfer', reference: 'NM-AE-DEP-001', created_at: '2025-12-15', updated_at: '2025-12-15' },
    { id: 'pay-2', listing_id: 'P012', payer_id: 'S002', payee_id: 'L001', type: 'deposit', amount: 3500, due_date: '2025-11-01', paid_date: '2025-11-01', status: 'completed', method: 'bank_transfer', reference: 'NM-AE-DEP-002', created_at: '2025-11-01', updated_at: '2025-11-01' },
];

// --- CHAT CHANNELS ---
// channel_type: 'property' = co-tenants + landlord within a property (post-tenancy)
// channel_type: 'viewing'  = tenant ↔ landlord/agent for viewing enquiries (pre-tenancy)
export const chatChannels: ChatChannel[] = [
    // ── Property Chats (post-tenancy, day-to-day house comms) ──
    {
        id: 'ch-prop-p011', listing_id: 'P011', name: 'JLT Cluster D — House Chat',
        channel_type: 'property',
        participants: ['S001', 'L002', 'A002'],
        created_at: '2025-12-16',
        last_message: { id: 'msg-prop-p011-3', channel_id: 'ch-prop-p011', sender_id: 'A002', message_type: 'text', content: 'Quarterly deep cleaning is scheduled for 25 March. Please keep common areas clear.', read_by: ['A002', 'S001'], created_at: '2026-03-18T11:00:00Z' },
    },
    {
        id: 'ch-prop-p012', listing_id: 'P012', name: 'Princess Tower — House Chat',
        channel_type: 'property',
        participants: ['S002', 'L001', 'A001'],
        created_at: '2025-12-15',
        last_message: { id: 'msg-5', channel_id: 'ch-prop-p012', sender_id: 'S001', message_type: 'text', content: 'AC filter replaced. Quick response!', read_by: ['S001', 'A001'], created_at: '2026-03-10T14:30:00Z' },
    },
    // ── Viewing Chats (pre-tenancy, property enquiries) ──
    {
        id: 'ch-priya-ahmed', listing_id: 'P012', name: 'Marina — Priya & Ahmed',
        channel_type: 'viewing',
        participants: ['S001', 'L001'],
        created_at: '2026-03-15',
        last_message: { id: 'msg-pa-4', channel_id: 'ch-priya-ahmed', sender_id: 'L001', message_type: 'text', content: 'Viewing confirmed for Saturday at 10 AM. Please bring your Emirates ID.', read_by: ['L001'], created_at: '2026-03-17T10:30:00Z' },
    },
    {
        id: 'ch-priya-fatima', listing_id: 'P011', name: 'JLT — Priya & Fatima',
        channel_type: 'viewing',
        participants: ['S001', 'L002'],
        created_at: '2026-03-17',
        last_message: { id: 'msg-pf-2', channel_id: 'ch-priya-fatima', sender_id: 'L002', message_type: 'text', content: 'I will review your viewing request and get back to you shortly.', read_by: ['L002', 'S001'], created_at: '2026-03-17T09:00:00Z' },
    },
    {
        id: 'ch-aisha-ahmed', listing_id: 'P008', name: 'DSO — Aisha & Ahmed',
        channel_type: 'viewing',
        participants: ['S003', 'L001'],
        created_at: '2026-03-14',
        last_message: { id: 'msg-aa-3', channel_id: 'ch-aisha-ahmed', sender_id: 'L001', message_type: 'text', content: 'Your DLD Viewing Agreement has been generated. Please sign at your convenience.', read_by: ['L001'], created_at: '2026-03-16T16:00:00Z' },
    },
];

export const chatMessages: ChatMessage[] = [
    // ── Property Chat: P011 JLT (Priya's home) ──
    { id: 'msg-prop-p011-1', channel_id: 'ch-prop-p011', sender_id: 'S001', message_type: 'text', content: 'Hi! Just moved in. The place looks great. One question — is the gym on the 3rd floor or ground?', read_by: ['S001', 'L002', 'A002'], created_at: '2025-12-17T10:00:00Z' },
    { id: 'msg-prop-p011-2', channel_id: 'ch-prop-p011', sender_id: 'A002', message_type: 'text', content: 'Welcome Priya! Gym is on the ground floor — access card is the same as your apartment key. Let me know if you need anything.', read_by: ['S001', 'A002'], created_at: '2025-12-17T10:15:00Z' },
    { id: 'msg-prop-p011-3', channel_id: 'ch-prop-p011', sender_id: 'A002', message_type: 'text', content: 'Quarterly deep cleaning is scheduled for 25 March. Please keep common areas clear.', read_by: ['A002', 'S001'], created_at: '2026-03-18T11:00:00Z' },
    // ── Property Chat: P012 Princess Tower (Marcus's home) ──
    { id: 'msg-1', channel_id: 'ch-prop-p012', sender_id: 'S001', message_type: 'text', content: 'Hi everyone! The AC in the living room is making a weird noise again.', read_by: ['S001', 'S002', 'A001'], created_at: '2026-03-08T09:00:00Z' },
    { id: 'msg-2', channel_id: 'ch-prop-p012', sender_id: 'A001', message_type: 'text', content: 'Thanks for flagging, Priya. I will schedule a technician for tomorrow.', read_by: ['S001', 'S002', 'A001'], created_at: '2026-03-08T09:15:00Z' },
    { id: 'msg-3', channel_id: 'ch-prop-p012', sender_id: 'A001', message_type: 'maintenance_request', content: 'Maintenance Request: AC unit service — Living Room. Technician confirmed for 9 Mar, 10AM.', read_by: ['S001', 'S002', 'A001'], created_at: '2026-03-08T09:30:00Z' },
    { id: 'msg-4', channel_id: 'ch-prop-p012', sender_id: 'S002', message_type: 'text', content: 'Great, thanks Khalid! I will be working from home so I can let them in.', read_by: ['S001', 'S002', 'A001'], created_at: '2026-03-08T10:00:00Z' },
    { id: 'msg-5', channel_id: 'ch-prop-p012', sender_id: 'S001', message_type: 'text', content: 'AC filter has been replaced. Thanks for the quick response!', read_by: ['S001', 'A001'], created_at: '2026-03-10T14:30:00Z' },
    // ── Viewing Chat: Priya ↔ Ahmed (Marina enquiry) ──
    { id: 'msg-pa-1', channel_id: 'ch-priya-ahmed', sender_id: 'S001', message_type: 'text', content: 'Hi, I saw the Marina listing. Is Room 3 still available?', read_by: ['S001', 'L001'], created_at: '2026-03-15T14:00:00Z' },
    { id: 'msg-pa-2', channel_id: 'ch-priya-ahmed', sender_id: 'L001', message_type: 'text', content: 'Yes, Room 3 is available. Would you like to schedule a viewing?', read_by: ['S001', 'L001'], created_at: '2026-03-15T14:15:00Z' },
    { id: 'msg-pa-3', channel_id: 'ch-priya-ahmed', sender_id: 'S001', message_type: 'text', content: 'Yes please! Saturday morning works for me.', read_by: ['S001', 'L001'], created_at: '2026-03-15T14:20:00Z' },
    { id: 'msg-pa-4', channel_id: 'ch-priya-ahmed', sender_id: 'L001', message_type: 'text', content: 'Viewing confirmed for Saturday at 10 AM. Please bring your Emirates ID.', read_by: ['L001'], created_at: '2026-03-17T10:30:00Z' },
    // ── Viewing Chat: Priya ↔ Fatima (JLT enquiry) ──
    { id: 'msg-pf-1', channel_id: 'ch-priya-fatima', sender_id: 'S001', message_type: 'text', content: 'Hi Fatima, I submitted a viewing request for the JLT property.', read_by: ['S001', 'L002'], created_at: '2026-03-17T08:30:00Z' },
    { id: 'msg-pf-2', channel_id: 'ch-priya-fatima', sender_id: 'L002', message_type: 'text', content: 'I will review your viewing request and get back to you shortly.', read_by: ['L002', 'S001'], created_at: '2026-03-17T09:00:00Z' },
    // ── Viewing Chat: Aisha ↔ Ahmed (DSO enquiry) ──
    { id: 'msg-aa-1', channel_id: 'ch-aisha-ahmed', sender_id: 'L001', message_type: 'text', content: 'Welcome Aisha! Your viewing at the DSO property has been confirmed.', read_by: ['L001', 'S003'], created_at: '2026-03-14T11:00:00Z' },
    { id: 'msg-aa-2', channel_id: 'ch-aisha-ahmed', sender_id: 'S003', message_type: 'text', content: 'Thank you! Looking forward to it.', read_by: ['L001', 'S003'], created_at: '2026-03-14T11:05:00Z' },
    { id: 'msg-aa-3', channel_id: 'ch-aisha-ahmed', sender_id: 'L001', message_type: 'text', content: 'Your DLD Viewing Agreement has been generated. Please sign at your convenience.', read_by: ['L001'], created_at: '2026-03-16T16:00:00Z' },
];

// ─── PROPERTY RATINGS (Star-only, UAE defamation safe) ────────
export const propertyRatings: PropertyRating[] = [
    { id: 'pr-1', property_id: 'P011', tenant_id: 'S001', acQuality: 5, amenities: 5, maintenanceSpeed: 4, created_at: '2026-02-15' },
    { id: 'pr-2', property_id: 'P012', tenant_id: 'S002', acQuality: 4, amenities: 5, maintenanceSpeed: 5, created_at: '2026-02-20' },
];

// ─── Phase 17: MAINTENANCE TICKETS ────────────────────────────
export const maintenanceTickets: MaintenanceTicket[] = [
    { id: 'mt-1', property_id: 'P011', tenant_id: 'S001', issue_type: 'AC/Cooling', urgency: 'Medium', status: 'In Progress', description: 'AC unit in living room is leaking water and making a noise.', created_at: '2026-03-08T09:00:00Z' },
    { id: 'mt-2', property_id: 'P012', tenant_id: 'S002', issue_type: 'Plumbing', urgency: 'Emergency', status: 'Reported', description: 'Master bathroom toilet is overflowing, water is spreading fast!', created_at: '2026-03-12T19:30:00Z' },
];

// ─── Phase 18: RENT LEDGERS ───────────────────────────────────
export const rentLedgers: RentLedger[] = [
    {
        id: 'ledger-1',
        property_id: 'P011',
        tenant_id: 'S001',
        landlord_id: 'L002',
        total_rent: 38400,
        installments: [
            { id: 'inst-1a', due_date: '2025-12-15', amount: 10500, status: 'Paid', method: 'Cheque' },
            { id: 'inst-1b', due_date: '2026-03-15', amount: 10500, status: 'Upcoming', method: 'Stripe' },
            { id: 'inst-1c', due_date: '2026-06-15', amount: 10500, status: 'Upcoming', method: 'Cheque' },
            { id: 'inst-1d', due_date: '2026-09-15', amount: 10500, status: 'Upcoming', method: 'Cheque' },
        ],
    },
    {
        id: 'ledger-2',
        property_id: 'P012',
        tenant_id: 'S002',
        landlord_id: 'L001',
        total_rent: 42000,
        installments: [
            { id: 'inst-2a', due_date: '2025-12-15', amount: 10500, status: 'Paid', method: 'Cheque' },
            { id: 'inst-2b', due_date: '2026-03-15', amount: 10500, status: 'Upcoming', method: 'Stripe' },
            { id: 'inst-2c', due_date: '2026-06-15', amount: 10500, status: 'Upcoming', method: 'Cheque' },
            { id: 'inst-2d', due_date: '2026-09-15', amount: 10500, status: 'Upcoming', method: 'Cheque' },
        ],
    },
];

// ─── Lookup Helpers ──────────────────────────────────────────
export function getUserById(id: string): User | undefined {
    return users.find(u => u.id === id);
}

export function getListingById(id: string): Listing | undefined {
    return listings.find(l => l.id === id);
}

export function getViewingsForUser(userId: string): ViewingBooking[] {
    return viewingBookings.filter(v => {
        if (v.searcher_id === userId || v.landlord_id === userId) return true;
        const listing = listings.find(l => l.id === v.property_id);
        if (listing?.letting_agent_id === userId) return true;
        return false;
    });
}

export function getChatChannelsForUser(userId: string): ChatChannel[] {
    return chatChannels.filter(ch => ch.participants.includes(userId));
}

export function getMessagesForChannel(channelId: string): ChatMessage[] {
    return chatMessages.filter(m => m.channel_id === channelId);
}

export function getPaymentsForUser(userId: string): Payment[] {
    return payments.filter(p => p.payer_id === userId || p.payee_id === userId);
}

export function getPaymentsForListing(listingId: string): Payment[] {
    return payments.filter(p => p.listing_id === listingId);
}

export function getMaintenanceForListing(listingId: string): MaintenanceTicket[] {
    return maintenanceTickets.filter(t => t.property_id === listingId);
}

export function getRentLedgerForTenant(tenantId: string): RentLedger | undefined {
    return rentLedgers.find(l => l.tenant_id === tenantId);
}

// ─── Slug Lookup Helpers ─────────────────────────────────────
export function getListingBySlug(slug: string): Listing | undefined {
    return listings.find(l => l.slug === slug);
}

export function getUserBySlug(slug: string): User | undefined {
    return users.find(u => u.slug === slug);
}

// ─── EJARI DOCUMENTS ─────────────────────────────────────────
export interface MockEjariDocument {
    id: string;
    uploaded_by: string;        // landlord user ID
    property_id: string;
    ejari_number: string;
    contract_start_date: string;
    contract_end_date: string;
    annual_rent: number;
    landlord_name: string;
    tenant_name: string;
    tenant_user_id: string;     // tenant user ID
    ejari_status: 'active' | 'expired';
    uploaded_at: string;
    property_title?: string;
    property_district?: string;
}

export const ejariDocuments: MockEjariDocument[] = [
    // Ahmed's contracts
    { id: 'ejari-ahmed-1', uploaded_by: 'L001', property_id: 'P010', ejari_number: 'EJ-2026-001234', contract_start_date: '2025-12-15', contract_end_date: '2026-12-14', annual_rent: 85000, landlord_name: 'Ahmed Al Maktoum', tenant_name: 'Priya Sharma', tenant_user_id: 'S001', ejari_status: 'active', uploaded_at: '2026-02-18', property_title: 'Premium En-Suite — Business Bay Canal View', property_district: 'Business Bay' },
    { id: 'ejari-ahmed-2', uploaded_by: 'L001', property_id: 'P010', ejari_number: 'EJ-2026-001235', contract_start_date: '2026-01-01', contract_end_date: '2026-12-31', annual_rent: 78000, landlord_name: 'Ahmed Al Maktoum', tenant_name: 'Marcus Chen', tenant_user_id: 'S002', ejari_status: 'active', uploaded_at: '2026-02-28', property_title: 'Premium En-Suite — Business Bay Canal View', property_district: 'Business Bay' },
    { id: 'ejari-ahmed-3', uploaded_by: 'L001', property_id: 'P011', ejari_number: 'EJ-2026-001567', contract_start_date: '2026-04-01', contract_end_date: '2027-03-31', annual_rent: 92000, landlord_name: 'Ahmed Al Maktoum', tenant_name: 'Aisha Patel', tenant_user_id: 'S003', ejari_status: 'active', uploaded_at: '2026-03-18', property_title: 'Luxury JLT Private Room — Cluster D', property_district: 'JLT' },
    { id: 'ejari-ahmed-4', uploaded_by: 'L001', property_id: 'P009', ejari_number: 'EJ-2025-008765', contract_start_date: '2024-06-01', contract_end_date: '2025-05-31', annual_rent: 72000, landlord_name: 'Ahmed Al Maktoum', tenant_name: 'James Morrison', tenant_user_id: 'S004', ejari_status: 'expired', uploaded_at: '2024-06-05', property_title: 'Spacious Room — Silicon Oasis', property_district: 'Silicon Oasis' },
    // Fatima's contracts
    { id: 'ejari-fatima-1', uploaded_by: 'L002', property_id: 'P008', ejari_number: 'EJ-2026-003456', contract_start_date: '2026-02-01', contract_end_date: '2027-01-31', annual_rent: 65000, landlord_name: 'Fatima Hassan', tenant_name: 'Liam O Brien', tenant_user_id: 'S008', ejari_status: 'active', uploaded_at: '2026-02-03', property_title: 'Ultra-Premium Marina En-Suite', property_district: 'Dubai Marina' },
];

/** Get ejari documents visible to a given user (landlord sees uploaded, tenant sees own) */
export function getEjariForUser(userId: string): MockEjariDocument[] {
    return ejariDocuments.filter(d => d.uploaded_by === userId || d.tenant_user_id === userId);
}

// ─── Chat Auto-Creation (Priority 3) ────────────────────────
export function getOrCreateChatChannel(tenantId: string, landlordId: string, propertyId: string): ChatChannel {
    const existing = chatChannels.find(ch =>
        ch.participants.includes(tenantId) &&
        ch.participants.includes(landlordId) &&
        ch.listing_id === propertyId
    );
    if (existing) return existing;

    const listing = getListingById(propertyId);
    const newChannel: ChatChannel = {
        id: `ch-auto-${Date.now()}`,
        listing_id: propertyId,
        name: listing?.title || 'Chat',
        channel_type: 'viewing',
        participants: [tenantId, landlordId],
        created_at: new Date().toISOString(),
    };
    chatChannels.push(newChannel);
    return newChannel;
}
