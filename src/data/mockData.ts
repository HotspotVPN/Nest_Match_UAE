import type { User, Listing, Payment, ViewingBooking, ChatChannel, ChatMessage, PropertyRating } from '@/types';

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
        id: 'landlord-1', type: 'landlord', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1990-00001', emiratesId: '784-1990-1234567-1',
        name: 'Ahmed Al Maktoum', email: 'ahmed.almaktoum@nestmatch.ae', avatar: '',
        bio: 'Experienced property investor managing 8 units across Dubai Marina, JBR, and Downtown. I believe in providing well-maintained, fully compliant shared housing. All my properties are Municipality-permitted and RERA-registered.',
        keywords: ['professional', 'responsive', 'compliant', 'long-term', 'premium'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-11-10', aml_status: 'completed', aml_completed_date: '2025-11-10', pep_status: 'clear', pep_completed_date: '2025-11-10', verified: true },
        phone: '+971 50 123 4567', linkedin_url: '#demo-profile',
        rating: 4.8, total_reviews: 31,
        bank_details: { account_name: 'Al Maktoum Properties LLC', iban: 'AE07033300000*****01', swift_code: 'BOMLAEAD', bank_name: 'Mashreq Bank' },
        deposits: { held: 24000, released: 18000, total: 42000 },
        monthly_income: 28000, managed_by_agent: 'agent-1',
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        bank_linked: true, created_at: '2025-10-01', updated_at: '2026-03-10',
    },
    // ── Landlord 2: Fatima Hassan ──────────────────────────────
    {
        id: 'landlord-2', type: 'landlord', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1985-00002', emiratesId: '784-1985-2345678-2',
        name: 'Fatima Hassan', email: 'fatima.hassan@nestmatch.ae', avatar: '',
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
        id: 'agent-1', type: 'letting_agent', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1988-00003', emiratesId: '784-1988-3456789-3',
        name: 'Khalid Al Rashid', email: 'khalid@dubaipropertygroup.ae', avatar: '',
        bio: 'RERA-certified property broker with 6 years managing shared housing portfolios in Dubai. Specializing in compliant co-living setups. I handle tenant relations, viewings, and Municipality permit coordination.',
        keywords: ['RERA-certified', 'professional', 'shared-housing', 'responsive', 'compliant'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-10-15', aml_status: 'completed', aml_completed_date: '2025-10-15', pep_status: 'clear', pep_completed_date: '2025-10-15', verified: true },
        phone: '+971 56 345 6789', rating: 4.7, total_reviews: 52,
        agency_name: 'Dubai Property Group', rera_license: 'RERA-BRN-2025-12345',
        managed_landlords: ['landlord-1'], managed_properties: ['listing-1', 'listing-2', 'listing-3'],
        commission_rate: 5,
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2025-09-01', updated_at: '2026-03-10',
    },
    // ── Residing Roommate 1: Priya Sharma ─────────────────────
    {
        id: 'roommate-1', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1995-00004', emiratesId: '784-1995-4567890-4',
        name: 'Priya Sharma', email: 'priya.sharma@email.com', avatar: '',
        bio: 'UX Designer at a fintech startup in DIFC. Love weekend brunches at Dubai Marina, yoga at sunrise, and cooking elaborate Indian meals. I keep common areas spotless and believe communication is key.',
        keywords: ['non-smoker', 'early-bird', 'professional', 'clean', 'social', 'yoga'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-12-01', aml_status: 'completed', aml_completed_date: '2025-12-01', pep_status: 'clear', pep_completed_date: '2025-12-01', verified: true },
        phone: '+971 52 456 7890', instagram_handle: '@priya.dubai',
        rating: 4.9, total_reviews: 3,
        preferences: { budget_min: 3000, budget_max: 4500, move_in_date: '2025-12-15', duration: '12_months', schedule: 'early_bird', location_keywords: ['near-metro', 'marina', 'walkable'], lifestyle_keywords: ['non-smoker', 'social', 'clean'] },
        current_house_id: 'listing-1', rent_monthly: 3500, deposit: 3500,
        direct_debit: { id: 'dd-1', status: 'active', bank_name: 'Wio Bank', iban_last4: '7823', created_at: '2025-12-15', next_payment_date: '2026-04-15', amount: 3500 },
        good_conduct_certificate: { id: 'gcc-1', tenant_id: 'roommate-1', issued_by_landlord: 'landlord-1', property_id: 'listing-1', tenancy_start: '2025-12-15', tenancy_end: '2026-12-15', rating: 5, payment_reliability: 'excellent', property_care: 'excellent', issued_at: '2026-02-20', verified: true },
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
        id: 'roommate-2', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1993-00005', emiratesId: '784-1993-5678901-5',
        name: 'Marcus Chen', email: 'marcus.chen@email.com', avatar: '',
        bio: 'Software engineer working remotely for a climate tech company in Singapore. Quiet during work hours, love hitting the gym in the evenings and exploring Dubai\'s food scene on weekends. Big fan of board games and cycling.',
        keywords: ['professional', 'quiet', 'gym-goer', 'non-smoker', 'tech', 'foodie'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-11-25', aml_status: 'completed', aml_completed_date: '2025-11-25', pep_status: 'clear', pep_completed_date: '2025-11-25', verified: true },
        phone: '+971 54 567 8901', instagram_handle: '@marcus.dxb',
        rating: 4.6, total_reviews: 2,
        preferences: { budget_min: 3000, budget_max: 4000, move_in_date: '2025-11-01', duration: '12_months', schedule: 'varies', location_keywords: ['near-metro', 'gym-nearby', 'restaurants'], lifestyle_keywords: ['quiet', 'gym-goer', 'professional'] },
        current_house_id: 'listing-1', rent_monthly: 3500, deposit: 3500,
        direct_debit: { id: 'dd-2', status: 'active', bank_name: 'ADCB', iban_last4: '3456', created_at: '2025-11-01', next_payment_date: '2026-04-15', amount: 3500 },
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
    // ── Residing Roommate 3: Elena Rodriguez ──────────────────
    {
        id: 'roommate-3', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1996-00006', emiratesId: '784-1996-6789012-6',
        name: 'Elena Rodriguez', email: 'elena.rodriguez@email.com', avatar: '',
        bio: 'Marketing coordinator at a sustainability startup in Dubai Design District. Love exploring the city — weekend markets, art galleries, and trying every coffee shop I can find.',
        keywords: ['non-smoker', 'social', 'professional', 'clean', 'creative', 'coffee-lover'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2026-01-15', aml_status: 'completed', aml_completed_date: '2026-01-15', pep_status: 'clear', pep_completed_date: '2026-01-15', verified: true },
        phone: '+971 58 678 9012',
        is_verified: true, has_gcc: false, gccScore: 30, isPremium: false,
        resident_role: 'residing', tenancy_duration_months: 4, gcc_eligible_date: '2026-07-15',
        current_house_id: 'listing-2', rent_monthly: 3000, deposit: 3000,
        direct_debit: { id: 'dd-3', status: 'active', bank_name: 'Emirates NBD', iban_last4: '1122', created_at: '2026-01-15', next_payment_date: '2026-04-15', amount: 3000 },
        preferences: { budget_min: 2500, budget_max: 3500, move_in_date: '2026-01-15', duration: '12_months', schedule: 'varies', location_keywords: ['walkable', 'cafes', 'galleries'], lifestyle_keywords: ['social', 'clean', 'creative'] },
        lifestyle_tags: ['walking', 'yoga', 'dance'],
        personality_traits: ['extroverted', 'creative', 'traveller', 'empathetic'],
        hobbies: ['coffee-tasting', 'street-photography', 'gallery-hopping', 'salsa-dancing'],
        local_recommendations: [
            { name: 'Alserkal Avenue', category: 'culture', description: 'Contemporary art district — free gallery exhibitions', distance: '10 min drive' },
            { name: 'La Mer Beach', category: 'activity', description: 'Beautiful beachfront with vibrant restaurants and water sports', distance: '15 min drive' },
        ],
        created_at: '2026-01-15', updated_at: '2026-03-08',
    },
    // ── Residing Roommate 4: Omar Khalil ──────────────────────
    {
        id: 'roommate-4', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1994-00007', emiratesId: '784-1994-7890123-7',
        name: 'Omar Khalil', email: 'omar.khalil@email.com', avatar: '',
        bio: 'Bartender and music producer. I work late shifts so I\'m quiet during the day. Love cooking Middle Eastern breakfasts on Friday mornings. 9 months in the flat and loving JLT.',
        keywords: ['night-owl', 'musician', 'clean', 'friendly', 'non-smoker', 'creative'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-06-01', aml_status: 'completed', aml_completed_date: '2025-06-01', pep_status: 'clear', pep_completed_date: '2025-06-01', verified: true },
        phone: '+971 50 789 0123',
        is_verified: true, has_gcc: true, gccScore: 60, isPremium: false,
        resident_role: 'residing', tenancy_duration_months: 9,
        current_house_id: 'listing-2', rent_monthly: 3000, deposit: 3000,
        direct_debit: { id: 'dd-4', status: 'active', bank_name: 'FAB', iban_last4: '8844', created_at: '2025-06-01', next_payment_date: '2026-04-01', amount: 3000 },
        good_conduct_certificate: { id: 'gcc-omar', tenant_id: 'roommate-4', issued_by_landlord: 'landlord-2', property_id: 'listing-2', tenancy_start: '2025-06-01', tenancy_end: '2026-06-01', rating: 4, payment_reliability: 'excellent', property_care: 'good', issued_at: '2026-02-01', verified: true },
        lifestyle_tags: ['gym-goer', 'swimming', 'football'],
        personality_traits: ['extroverted', 'comedian', 'social', 'night-owl'],
        hobbies: ['music-production', 'cooking-arabic', 'football', 'desert-camping'],
        created_at: '2025-06-01', updated_at: '2026-03-08',
    },
    // ── Residing Roommate 5: Yuki Tanaka ──────────────────────
    {
        id: 'roommate-5', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1997-00008', emiratesId: '784-1997-8901234-8',
        name: 'Yuki Tanaka', email: 'yuki.tanaka@email.com', avatar: '',
        bio: 'Japanese architect working on EXPO City Dubai projects. Living in Business Bay for 6 months. Love the canal walks, weekend brunches, and the Dubai Design Week scene.',
        keywords: ['non-smoker', 'professional', 'design', 'organised', 'quiet'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-09-01', aml_status: 'completed', aml_completed_date: '2025-09-01', pep_status: 'clear', pep_completed_date: '2025-09-01', verified: true },
        phone: '+971 52 890 1234',
        is_verified: true, has_gcc: false, gccScore: 40, isPremium: true,
        resident_role: 'residing', tenancy_duration_months: 6, gcc_eligible_date: '2026-03-01',
        current_house_id: 'listing-3', rent_monthly: 4000, deposit: 4000,
        direct_debit: { id: 'dd-5', status: 'active', bank_name: 'ADCB', iban_last4: '5678', created_at: '2025-09-01', next_payment_date: '2026-04-01', amount: 4000 },
        lifestyle_tags: ['runner', 'cycling', 'swimming'],
        personality_traits: ['introverted', 'creative', 'organised', 'calm'],
        hobbies: ['architecture-walks', 'photography', 'japanese-cooking', 'design-exhibitions'],
        created_at: '2025-09-01', updated_at: '2026-03-08',
    },
    // ── Searching Roommate 1: James Morrison ──────────────────
    {
        id: 'roommate-6', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1992-00009', emiratesId: '784-1992-9012345-9',
        name: 'James Morrison', email: 'james.morrison@email.com', avatar: '',
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
        id: 'roommate-7', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1991-00010', emiratesId: '784-1991-0123456-0',
        name: 'Aisha Patel', email: 'aisha.patel@email.com', avatar: '',
        bio: 'Strategy consultant at McKinsey. Previous NestMatch tenant in London with 18 months verified tenancy and an excellent GCC. Relocating to Dubai — looking for a quiet, premium household.',
        keywords: ['non-smoker', 'professional', 'quiet', 'experienced-tenant', 'long-term'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-05-10', aml_status: 'completed', aml_completed_date: '2025-05-10', pep_status: 'clear', pep_completed_date: '2025-05-10', verified: true },
        phone: '+971 50 012 3456',
        is_verified: true, has_gcc: true, gccScore: 92, isPremium: true,
        resident_role: 'searching', tenancy_duration_months: 18,
        good_conduct_certificate: { id: 'gcc-aisha', tenant_id: 'roommate-7', issued_by_landlord: 'landlord-prev', property_id: 'listing-prev', tenancy_start: '2024-08-01', tenancy_end: '2026-02-01', rating: 5, payment_reliability: 'excellent', property_care: 'excellent', issued_at: '2026-02-10', verified: true },
        preferences: { budget_min: 4000, budget_max: 6000, move_in_date: '2026-03-15', duration: '12_months', schedule: 'early_bird', location_keywords: ['downtown', 'near-metro', 'premium'], lifestyle_keywords: ['quiet', 'professional', 'non-smoker'] },
        lifestyle_tags: ['pilates', 'runner', 'tennis'],
        personality_traits: ['introverted', 'organised', 'analytical', 'calm'],
        hobbies: ['brunch-culture', 'bookshops', 'travel-planning', 'podcasts'],
        created_at: '2025-05-10', updated_at: '2026-03-08',
    },
    // ── Searching Roommate 3: David Müller ────────────────────
    {
        id: 'roommate-8', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1989-00011', emiratesId: '784-1989-1234567-1',
        name: 'David Müller', email: 'david.muller@email.com', avatar: '',
        bio: 'German expat, senior engineer at a fintech company. Multi-year verified track record — 30 months total tenancy. Looking for a premium, well-managed property. I value transparency.',
        keywords: ['non-smoker', 'professional', 'elite-tenant', 'long-term', 'quiet', 'tech'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2024-02-01', aml_status: 'completed', aml_completed_date: '2024-02-01', pep_status: 'clear', pep_completed_date: '2024-02-01', verified: true },
        phone: '+971 56 123 4567',
        is_verified: true, has_gcc: true, gccScore: 95, isPremium: true,
        resident_role: 'searching', tenancy_duration_months: 30,
        good_conduct_certificate: { id: 'gcc-david', tenant_id: 'roommate-8', issued_by_landlord: 'landlord-prev-3', property_id: 'listing-prev-3', tenancy_start: '2024-02-01', tenancy_end: '2026-02-01', rating: 5, payment_reliability: 'excellent', property_care: 'excellent', issued_at: '2026-02-10', verified: true },
        preferences: { budget_min: 4500, budget_max: 7000, move_in_date: '2026-04-01', duration: '12_months', schedule: 'early_bird', location_keywords: ['near-metro', 'premium', 'downtown'], lifestyle_keywords: ['professional', 'quiet', 'premium'] },
        lifestyle_tags: ['cycling', 'gym-goer', 'hiking'],
        personality_traits: ['introverted', 'analytical', 'organised', 'calm'],
        hobbies: ['cycling', 'mechanical-keyboards', 'craft-coffee', 'desert-hiking'],
        created_at: '2024-02-01', updated_at: '2026-03-08',
    },
    // ── Searching Roommate 4: Sophie Laurent ──────────────────
    {
        id: 'roommate-9', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1994-00012', emiratesId: '784-1994-2345678-2',
        name: 'Sophie Laurent', email: 'sophie.laurent@email.com', avatar: '',
        bio: 'French expat working in fashion PR at a Dubai Media City agency. First time on NestMatch — excited to find a vibrant, social household near the beach.',
        keywords: ['non-smoker', 'professional', 'creative', 'social', 'fashion'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2026-02-15', aml_status: 'completed', aml_completed_date: '2026-02-15', pep_status: 'clear', pep_completed_date: '2026-02-15', verified: true },
        phone: '+971 52 234 5678',
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        resident_role: 'searching',
        preferences: { budget_min: 3000, budget_max: 5000, move_in_date: '2026-04-01', duration: '12_months', schedule: 'varies', location_keywords: ['marina', 'jbr', 'beach'], lifestyle_keywords: ['social', 'creative', 'fashion'] },
        lifestyle_tags: ['yoga', 'swimming', 'dance'],
        personality_traits: ['extroverted', 'creative', 'social', 'stylish'],
        hobbies: ['fashion', 'french-cooking', 'beach-clubs', 'art-exhibitions'],
        created_at: '2026-02-15', updated_at: '2026-03-08',
    },
    // ── Searching Roommate 5: Raj Krishnan ────────────────────
    {
        id: 'roommate-10', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1990-00013', emiratesId: '784-1990-3456789-3',
        name: 'Raj Krishnan', email: 'raj.krishnan@email.com', avatar: '',
        bio: 'NHS-trained doctor now working at Cleveland Clinic Abu Dhabi. Relocating to Dubai for a new role at Mediclinic. Calm, respectful, and adaptable to different routines.',
        keywords: ['non-smoker', 'professional', 'quiet', 'clean', 'vegetarian', 'doctor'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2026-02-25', aml_status: 'completed', aml_completed_date: '2026-02-25', pep_status: 'clear', pep_completed_date: '2026-02-25', verified: true },
        phone: '+971 55 345 6789',
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        resident_role: 'searching',
        preferences: { budget_min: 2500, budget_max: 3500, move_in_date: '2026-04-15', duration: '12_months', schedule: 'varies', location_keywords: ['healthcare-city', 'near-metro', 'quiet-area'], lifestyle_keywords: ['quiet', 'vegetarian', 'clean'] },
        lifestyle_tags: ['yoga', 'meditation', 'walking'],
        personality_traits: ['introverted', 'calm', 'reader', 'empathetic'],
        hobbies: ['meditation', 'cooking-indian', 'journaling', 'cricket'],
        created_at: '2026-02-25', updated_at: '2026-03-08',
    },
    // ── Admin Users ───────────────────────────────────────────
    {
        id: 'admin-1', type: 'compliance', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-ADMIN-001', name: 'Compliance Admin', email: 'compliance@nestmatch.ae', avatar: '',
        bio: 'NestMatch UAE compliance controller — UAE PASS verification and CBUAE regulatory oversight.',
        keywords: ['admin', 'compliance'], phone: '+971 4 123 4567',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2024-01-01', aml_status: 'completed', aml_completed_date: '2024-01-01', pep_status: 'clear', pep_completed_date: '2024-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2024-01-01', updated_at: '2026-03-10',
    },
    {
        id: 'admin-2', type: 'finance', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-ADMIN-002', name: 'Finance Admin', email: 'finance@nestmatch.ae', avatar: '',
        bio: 'NestMatch UAE financial controller — RERA escrow and rent reconciliation.',
        keywords: ['admin', 'finance'], phone: '+971 4 123 4568',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2024-01-01', aml_status: 'completed', aml_completed_date: '2024-01-01', pep_status: 'clear', pep_completed_date: '2024-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2024-01-01', updated_at: '2026-03-10',
    },
    {
        id: 'admin-3', type: 'operations', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-ADMIN-003', name: 'Operations Admin', email: 'operations@nestmatch.ae', avatar: '',
        bio: 'NestMatch UAE operations — CRM, property registry, and user management.',
        keywords: ['admin', 'operations'], phone: '+971 4 123 4569',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2024-01-01', aml_status: 'completed', aml_completed_date: '2024-01-01', pep_status: 'clear', pep_completed_date: '2024-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2024-01-01', updated_at: '2026-03-10',
    },
];

// ─── LISTINGS ─────────────────────────────────────────────────
export const listings: Listing[] = [
    {
        id: 'listing-1', landlord_id: 'landlord-1', letting_agent_id: 'agent-1',
        title: 'Premium Marina View — 3BR Shared Apartment',
        address: 'Princess Tower, Dubai Marina, Dubai',
        district: 'Dubai Marina',
        rent_per_room: 3500, total_rooms: 3, available_rooms: 1,
        images: [], description: 'Stunning 3-bedroom apartment on the 45th floor of Princess Tower with panoramic Marina views. Fully furnished with premium amenities. Walking distance to Dubai Marina Mall and JBR Beach.',
        amenities: ['Pool', 'Gym', 'Concierge', 'Parking', 'Balcony', 'Sea View', 'Central AC'],
        house_rules: ['No smoking', 'No pets', 'Quiet hours 11PM-7AM', 'Guests must register at reception'],
        bills_included: true, bills_breakdown: 'DEWA + Internet + Chiller included',
        deposit: 3500, current_roommates: ['roommate-1', 'roommate-2'],
        occupancy_status: [
            { room_number: 1, tenant_id: 'roommate-1', status: 'occupied' },
            { room_number: 2, tenant_id: 'roommate-2', status: 'occupied' },
            { room_number: 3, tenant_id: null, status: 'available' },
        ],
        tags: ['premium', 'sea-view', 'furnished', 'marina'],
        makaniNumber: '2567834901', trakheesiPermit: 'TRAK-2025-DM-78901',
        municipalityPermit: 'DM-SH-2026-001234', maxLegalOccupancy: 3, currentOccupants: 2, isActive: true,
        transport_chips: [
            { label: 'DMCC Metro', type: 'metro', walk_time: '5m', lines: ['Red Line'], line_color: '#E21836' },
            { label: 'Dubai Marina Tram', type: 'tram', walk_time: '3m' },
            { label: 'RTA Bus F55A', type: 'bus', walk_time: '2m', lines: ['F55A'] },
        ],
        financial_ledger: { property_id: 'listing-1', total_rent_due: 10500, amount_collected: 7000, collective_status_percent: 67, status: 'partial', last_updated: '2026-03-01', residents: [
            { user_id: 'roommate-1', name: 'Priya Sharma', monthly_share: 3500, payment_status: 'Paid', deposit_held: true, has_rera_escrow: true },
            { user_id: 'roommate-2', name: 'Marcus Chen', monthly_share: 3500, payment_status: 'Paid', deposit_held: true, has_rera_escrow: true },
        ]},
        rera_escrow_verified: true,
        location: { lat: 25.0800, lng: 55.1400, nearest_metro: { name: 'DMCC', line: 'Red Line', walk_mins: 5 }, nearby_amenities: ['Dubai Marina Mall', 'JBR Beach', 'Bluewaters Island'], area_description: 'Dubai Marina — the vibrant waterfront community with world-class dining and entertainment.' },
        rating: 4.8, total_reviews: 5,
        property_ratings: [
            { id: 'pr-1', property_id: 'listing-1', tenant_id: 'roommate-1', acQuality: 5, amenities: 5, maintenanceSpeed: 4, created_at: '2026-02-15' },
            { id: 'pr-2', property_id: 'listing-1', tenant_id: 'roommate-2', acQuality: 4, amenities: 5, maintenanceSpeed: 5, created_at: '2026-02-20' },
        ],
        created_at: '2025-10-15', updated_at: '2026-03-10',
    },
    {
        id: 'listing-2', landlord_id: 'landlord-2',
        title: 'Modern JLT Shared Living — Lake View',
        address: 'Cluster D, Jumeirah Lakes Towers, Dubai',
        district: 'JLT',
        rent_per_room: 3000, total_rooms: 3, available_rooms: 1,
        images: [], description: 'Modern 3-bedroom apartment in JLT Cluster D overlooking the lake. Great community feel with direct access to JLT Park and the Metro. Perfect for young professionals.',
        amenities: ['Pool', 'Gym', 'Lake View', 'Parking', 'Central AC', 'Balcony'],
        house_rules: ['No smoking', 'Quiet hours 10PM-7AM', 'Clean shared areas after use'],
        bills_included: false, bills_breakdown: 'DEWA split equally, Internet AED 300/month shared',
        deposit: 3000, current_roommates: ['roommate-3', 'roommate-4'],
        occupancy_status: [
            { room_number: 1, tenant_id: 'roommate-3', status: 'occupied' },
            { room_number: 2, tenant_id: 'roommate-4', status: 'occupied' },
            { room_number: 3, tenant_id: null, status: 'available' },
        ],
        tags: ['lake-view', 'metro-access', 'affordable', 'jlt'],
        makaniNumber: '3478912056', trakheesiPermit: 'TRAK-2025-JLT-56789',
        municipalityPermit: 'DM-SH-2026-002345', maxLegalOccupancy: 3, currentOccupants: 2, isActive: true,
        transport_chips: [
            { label: 'DMCC Metro', type: 'metro', walk_time: '8m', lines: ['Red Line'], line_color: '#E21836' },
            { label: 'JLT Metro', type: 'metro', walk_time: '12m', lines: ['Red Line'], line_color: '#E21836' },
        ],
        rera_escrow_verified: true,
        location: { lat: 25.0700, lng: 55.1500, nearest_metro: { name: 'DMCC', line: 'Red Line', walk_mins: 8 }, nearby_amenities: ['JLT Park', 'Cluster D Retail', 'Marina Walk'], area_description: 'JLT — affordable lakeside living with excellent Metro connectivity.' },
        rating: 4.5, total_reviews: 3, created_at: '2025-11-20', updated_at: '2026-03-08',
    },
    {
        id: 'listing-3', landlord_id: 'landlord-1', letting_agent_id: 'agent-1',
        title: 'Downtown Dubai — Burj Khalifa District',
        address: 'Boulevard Point, Downtown Dubai',
        district: 'Downtown Dubai',
        rent_per_room: 4500, total_rooms: 2, available_rooms: 1,
        images: [], description: 'Luxury 2-bedroom in Boulevard Point with direct Burj Khalifa views. Steps from Dubai Mall and the Dubai Fountain. Premium shared living for discerning professionals.',
        amenities: ['Pool', 'Gym', 'Burj View', 'Concierge', 'Valet Parking', 'Central AC'],
        house_rules: ['No smoking', 'No pets', 'Professional tenants only'],
        bills_included: true, deposit: 4500,
        current_roommates: ['roommate-5'],
        occupancy_status: [
            { room_number: 1, tenant_id: 'roommate-5', status: 'occupied' },
            { room_number: 2, tenant_id: null, status: 'available' },
        ],
        tags: ['premium', 'burj-view', 'downtown', 'luxury'],
        makaniNumber: '1234567890', trakheesiPermit: 'TRAK-2025-DT-34567',
        municipalityPermit: 'DM-SH-2026-003456', maxLegalOccupancy: 2, currentOccupants: 1, isActive: true,
        transport_chips: [
            { label: 'Burj Khalifa/Dubai Mall Metro', type: 'metro', walk_time: '6m', lines: ['Red Line'], line_color: '#E21836' },
        ],
        rera_escrow_verified: true,
        location: { lat: 25.1972, lng: 55.2744, nearest_metro: { name: 'Burj Khalifa/Dubai Mall', line: 'Red Line', walk_mins: 6 }, nearby_amenities: ['Dubai Mall', 'Dubai Fountain', 'SoukAl Bahar'], area_description: 'Downtown Dubai — the heart of the city with iconic landmarks.' },
        rating: 4.9, total_reviews: 2, created_at: '2025-09-01', updated_at: '2026-03-10',
    },
    {
        id: 'listing-4', landlord_id: 'landlord-2',
        title: 'Business Bay Canal View — Great Value',
        address: 'Executive Towers, Business Bay, Dubai',
        district: 'Business Bay',
        rent_per_room: 2800, total_rooms: 3, available_rooms: 0,
        images: [], description: 'Spacious 3-bedroom in Executive Towers with Dubai Water Canal views. Walking distance to Bay Avenue shops and restaurants. Great value for the location.',
        amenities: ['Pool', 'Gym', 'Canal View', 'Parking', 'Central AC'],
        house_rules: ['No smoking', 'Quiet hours 10PM-7AM', 'No overnight guests without notice'],
        bills_included: false, deposit: 2800,
        current_roommates: ['roommate-res-1', 'roommate-res-2', 'roommate-res-3'],
        occupancy_status: [
            { room_number: 1, tenant_id: 'roommate-res-1', status: 'occupied' },
            { room_number: 2, tenant_id: 'roommate-res-2', status: 'occupied' },
            { room_number: 3, tenant_id: 'roommate-res-3', status: 'occupied' },
        ],
        tags: ['canal-view', 'affordable', 'business-bay'],
        makaniNumber: '4567890123', trakheesiPermit: 'TRAK-2025-BB-45678',
        municipalityPermit: 'DM-SH-2026-004567', maxLegalOccupancy: 3, currentOccupants: 3, isActive: false,
        transport_chips: [
            { label: 'Business Bay Metro', type: 'metro', walk_time: '7m', lines: ['Red Line'], line_color: '#E21836' },
        ],
        rera_escrow_verified: true,
        location: { lat: 25.1850, lng: 55.2650, nearest_metro: { name: 'Business Bay', line: 'Red Line', walk_mins: 7 }, nearby_amenities: ['Bay Avenue', 'Dubai Water Canal', 'Downtown Dubai'], area_description: 'Business Bay — rising commercial heart with canal-side living.' },
        rating: 4.3, total_reviews: 4, created_at: '2025-08-01', updated_at: '2026-03-08',
    },
    {
        id: 'listing-5', landlord_id: 'landlord-1', letting_agent_id: 'agent-1',
        title: 'JBR Beachfront — Walk to the Beach',
        address: 'Sadaf Tower, JBR, Dubai',
        district: 'JBR',
        rent_per_room: 4000, total_rooms: 3, available_rooms: 2,
        images: [], description: 'Beachfront 3-bedroom in Sadaf Tower with direct beach access. The Walk at JBR is right at your doorstep — restaurants, shops, and the beach lifestyle.',
        amenities: ['Beach Access', 'Pool', 'Gym', 'Sea View', 'Central AC', 'Parking'],
        house_rules: ['No smoking inside', 'Keep balcony clean', 'Register guests at reception'],
        bills_included: true, deposit: 4000,
        current_roommates: ['roommate-res-4'],
        occupancy_status: [
            { room_number: 1, tenant_id: 'roommate-res-4', status: 'occupied' },
            { room_number: 2, tenant_id: null, status: 'available' },
            { room_number: 3, tenant_id: null, status: 'available' },
        ],
        tags: ['beachfront', 'premium', 'jbr', 'sea-view'],
        makaniNumber: '5678901234', trakheesiPermit: 'TRAK-2025-JBR-67890',
        municipalityPermit: 'DM-SH-2026-005678', maxLegalOccupancy: 3, currentOccupants: 1, isActive: true,
        transport_chips: [
            { label: 'Dubai Marina Tram', type: 'tram', walk_time: '5m' },
            { label: 'JBR Tram Stop', type: 'tram', walk_time: '2m' },
        ],
        rera_escrow_verified: true,
        location: { lat: 25.0770, lng: 55.1340, nearest_tram: { name: 'JBR Tram', walk_mins: 2 }, nearby_amenities: ['The Walk at JBR', 'The Beach', 'Ain Dubai'], area_description: 'JBR — the iconic beachfront community with unbeatable lifestyle.' },
        rating: 4.7, total_reviews: 6, created_at: '2025-07-15', updated_at: '2026-03-10',
    },
    {
        id: 'listing-6', landlord_id: 'landlord-2',
        title: 'Al Barsha Studio-Style Shared — Near MOE',
        address: 'Al Barsha 1, Dubai',
        district: 'Al Barsha',
        rent_per_room: 2200, total_rooms: 3, available_rooms: 2,
        images: [], description: 'Affordable shared living near Mall of the Emirates. Great Metro connectivity and family-friendly neighbourhood. Perfect for budget-conscious professionals.',
        amenities: ['Pool', 'Gym', 'Parking', 'Central AC', 'Laundry'],
        house_rules: ['No smoking', 'Quiet hours 10PM-7AM', 'Shared kitchen cleaning rota'],
        bills_included: false, deposit: 2200,
        current_roommates: ['roommate-res-5'],
        occupancy_status: [
            { room_number: 1, tenant_id: 'roommate-res-5', status: 'occupied' },
            { room_number: 2, tenant_id: null, status: 'available' },
            { room_number: 3, tenant_id: null, status: 'available' },
        ],
        tags: ['affordable', 'near-moe', 'metro-access'],
        makaniNumber: '6789012345', trakheesiPermit: 'TRAK-2025-AB-78901',
        municipalityPermit: 'DM-SH-2026-006789', maxLegalOccupancy: 4, currentOccupants: 1, isActive: true,
        transport_chips: [
            { label: 'Mall of the Emirates Metro', type: 'metro', walk_time: '10m', lines: ['Red Line'], line_color: '#E21836' },
        ],
        rera_escrow_verified: true,
        location: { lat: 25.1175, lng: 55.2000, nearest_metro: { name: 'Mall of the Emirates', line: 'Red Line', walk_mins: 10 }, nearby_amenities: ['Mall of the Emirates', 'Ski Dubai', 'Al Barsha Park'], area_description: 'Al Barsha — accessible, affordable community near major landmarks.' },
        rating: 4.1, total_reviews: 2, created_at: '2025-12-01', updated_at: '2026-03-08',
    },
];

// ─── VIEWING BOOKINGS ─────────────────────────────────────────
export const viewingBookings: ViewingBooking[] = [
    {
        id: 'view-1', property_id: 'listing-1', searcher_id: 'roommate-6', landlord_id: 'landlord-1',
        requested_date: '2026-03-20T14:00:00Z', time_slot: '2:00 PM - 2:30 PM',
        status: 'CONFIRMED', stripe_hold_id: 'pi_mock_001', hold_amount: 50,
        landlord_agreed_penalty: true, created_at: '2026-03-10', updated_at: '2026-03-11',
    },
    {
        id: 'view-2', property_id: 'listing-3', searcher_id: 'roommate-7', landlord_id: 'landlord-1',
        requested_date: '2026-03-22T10:00:00Z', time_slot: '10:00 AM - 10:30 AM',
        status: 'PENDING_LANDLORD_APPROVAL', stripe_hold_id: 'pi_mock_002', hold_amount: 50,
        landlord_agreed_penalty: false, created_at: '2026-03-11', updated_at: '2026-03-11',
    },
    {
        id: 'view-3', property_id: 'listing-5', searcher_id: 'roommate-9', landlord_id: 'landlord-1',
        requested_date: '2026-03-18T16:00:00Z', time_slot: '4:00 PM - 4:30 PM',
        status: 'COMPLETED', stripe_hold_id: 'pi_mock_003', hold_amount: 50,
        landlord_agreed_penalty: true, resolution_date: '2026-03-18',
        created_at: '2026-03-08', updated_at: '2026-03-18',
    },
    {
        id: 'view-4', property_id: 'listing-2', searcher_id: 'roommate-10', landlord_id: 'landlord-2',
        requested_date: '2026-03-25T11:00:00Z', time_slot: '11:00 AM - 11:30 AM',
        status: 'PENDING', hold_amount: 50,
        landlord_agreed_penalty: false, created_at: '2026-03-12', updated_at: '2026-03-12',
    },
];

// ─── PAYMENTS ─────────────────────────────────────────────────
export const payments: Payment[] = [
    { id: 'pay-1', listing_id: 'listing-1', payer_id: 'roommate-1', payee_id: 'landlord-1', type: 'rent', amount: 3500, due_date: '2026-03-15', paid_date: '2026-03-14', status: 'completed', method: 'direct_debit', reference: 'NM-AE-2026-03-001', rera_escrow_ref: 'RERA-ESC-001', rera_escrow_status: 'held', created_at: '2026-03-01', updated_at: '2026-03-14' },
    { id: 'pay-2', listing_id: 'listing-1', payer_id: 'roommate-2', payee_id: 'landlord-1', type: 'rent', amount: 3500, due_date: '2026-03-15', paid_date: '2026-03-15', status: 'completed', method: 'direct_debit', reference: 'NM-AE-2026-03-002', rera_escrow_ref: 'RERA-ESC-002', rera_escrow_status: 'held', created_at: '2026-03-01', updated_at: '2026-03-15' },
    { id: 'pay-3', listing_id: 'listing-2', payer_id: 'roommate-3', payee_id: 'landlord-2', type: 'rent', amount: 3000, due_date: '2026-03-15', status: 'pending', method: 'bank_transfer', reference: 'NM-AE-2026-03-003', created_at: '2026-03-01', updated_at: '2026-03-01' },
    { id: 'pay-4', listing_id: 'listing-1', payer_id: 'roommate-1', payee_id: 'landlord-1', type: 'deposit', amount: 3500, due_date: '2025-12-15', paid_date: '2025-12-15', status: 'completed', method: 'bank_transfer', reference: 'NM-AE-DEP-001', rera_escrow_ref: 'RERA-DEP-001', rera_escrow_status: 'held', created_at: '2025-12-15', updated_at: '2025-12-15' },
];

// ─── CHAT CHANNELS ────────────────────────────────────────────
export const chatChannels: ChatChannel[] = [
    {
        id: 'ch-1', listing_id: 'listing-1', name: 'Princess Tower — Marina',
        participants: ['roommate-1', 'roommate-2', 'landlord-1', 'agent-1'],
        created_at: '2025-12-15',
        last_message: { id: 'msg-latest-1', channel_id: 'ch-1', sender_id: 'roommate-1', message_type: 'text', content: 'AC filter has been replaced. Thanks for the quick response! 👍', read_by: ['roommate-1', 'agent-1'], created_at: '2026-03-10T14:30:00Z' },
    },
    {
        id: 'ch-2', listing_id: 'listing-2', name: 'JLT Cluster D — Lake View',
        participants: ['roommate-3', 'roommate-4', 'landlord-2'],
        created_at: '2026-01-15',
        last_message: { id: 'msg-latest-2', channel_id: 'ch-2', sender_id: 'landlord-2', message_type: 'announcement', content: 'DEWA maintenance scheduled for Thursday 9AM-12PM. Water may be temporarily off.', read_by: ['landlord-2'], created_at: '2026-03-09T09:00:00Z' },
    },
];

export const chatMessages: ChatMessage[] = [
    { id: 'msg-1', channel_id: 'ch-1', sender_id: 'roommate-1', message_type: 'text', content: 'Hi everyone! The AC in the living room is making a weird noise again.', read_by: ['roommate-1', 'roommate-2', 'agent-1'], created_at: '2026-03-08T09:00:00Z' },
    { id: 'msg-2', channel_id: 'ch-1', sender_id: 'agent-1', message_type: 'text', content: 'Thanks for flagging, Priya. I will schedule a technician for tomorrow.', read_by: ['roommate-1', 'roommate-2', 'agent-1'], created_at: '2026-03-08T09:15:00Z' },
    { id: 'msg-3', channel_id: 'ch-1', sender_id: 'agent-1', message_type: 'maintenance_request', content: 'Maintenance Request: AC unit service — Living Room. Technician confirmed for 9 Mar, 10AM.', read_by: ['roommate-1', 'roommate-2', 'agent-1'], created_at: '2026-03-08T09:30:00Z' },
    { id: 'msg-4', channel_id: 'ch-1', sender_id: 'roommate-2', message_type: 'text', content: 'Great, thanks Khalid! I will be working from home so I can let them in.', read_by: ['roommate-1', 'roommate-2', 'agent-1'], created_at: '2026-03-08T10:00:00Z' },
    { id: 'msg-5', channel_id: 'ch-1', sender_id: 'roommate-1', message_type: 'text', content: 'AC filter has been replaced. Thanks for the quick response! 👍', read_by: ['roommate-1', 'agent-1'], created_at: '2026-03-10T14:30:00Z' },
];

// ─── PROPERTY RATINGS (Star-only, UAE defamation safe) ────────
export const propertyRatings: PropertyRating[] = [
    { id: 'pr-1', property_id: 'listing-1', tenant_id: 'roommate-1', acQuality: 5, amenities: 5, maintenanceSpeed: 4, created_at: '2026-02-15' },
    { id: 'pr-2', property_id: 'listing-1', tenant_id: 'roommate-2', acQuality: 4, amenities: 5, maintenanceSpeed: 5, created_at: '2026-02-20' },
    { id: 'pr-3', property_id: 'listing-2', tenant_id: 'roommate-3', acQuality: 4, amenities: 4, maintenanceSpeed: 3, created_at: '2026-03-01' },
    { id: 'pr-4', property_id: 'listing-2', tenant_id: 'roommate-4', acQuality: 3, amenities: 4, maintenanceSpeed: 4, created_at: '2026-03-05' },
    { id: 'pr-5', property_id: 'listing-3', tenant_id: 'roommate-5', acQuality: 5, amenities: 5, maintenanceSpeed: 5, created_at: '2026-02-28' },
];
