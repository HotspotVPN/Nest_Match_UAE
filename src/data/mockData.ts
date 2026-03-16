import type { User, Listing, Payment, ViewingBooking, ChatChannel, ChatMessage, PropertyRating, MaintenanceTicket, RentLedger } from '@/types';

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
        isUaePassVerified: true, isIdVerified: false,
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
        isUaePassVerified: true, isIdVerified: false,
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
        isUaePassVerified: true, isIdVerified: false,
        name: 'Khalid Al Rashid', email: 'khalid@dubaipropertygroup.ae', avatar: '',
        bio: 'RERA-certified property broker with 6 years managing shared housing portfolios in Dubai. Specializing in compliant co-living setups. I handle tenant relations, viewings, and Municipality permit coordination.',
        keywords: ['RERA-certified', 'professional', 'shared-housing', 'responsive', 'compliant'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-10-15', aml_status: 'completed', aml_completed_date: '2025-10-15', pep_status: 'clear', pep_completed_date: '2025-10-15', verified: true },
        phone: '+971 56 345 6789', rating: 4.7, total_reviews: 52,
        agency_name: 'Dubai Property Group', rera_license: 'RERA-BRN-2025-12345',
        managed_landlords: ['landlord-1'], managed_properties: ['list-entry-3', 'list-entry-12'],
        commission_rate: 5,
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2025-09-01', updated_at: '2026-03-10',
    },
    // ── Residing Roommate 1: Priya Sharma ─────────────────────
    {
        id: 'roommate-1', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1995-00004', emiratesId: '784-1995-4567890-4',
        isUaePassVerified: true, isIdVerified: false,
        name: 'Priya Sharma', email: 'priya.sharma@email.com', avatar: '',
        bio: 'UX Designer at a fintech startup in DIFC. Love weekend brunches at Dubai Marina, yoga at sunrise, and cooking elaborate Indian meals. I keep common areas spotless and believe communication is key.',
        keywords: ['non-smoker', 'early-bird', 'professional', 'clean', 'social', 'yoga'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-12-01', aml_status: 'completed', aml_completed_date: '2025-12-01', pep_status: 'clear', pep_completed_date: '2025-12-01', verified: true },
        phone: '+971 52 456 7890', instagram_handle: '@priya.dubai',
        rating: 4.9, total_reviews: 3,
        preferences: { budget_min: 3000, budget_max: 4500, move_in_date: '2025-12-15', duration: '12_months', schedule: 'early_bird', location_keywords: ['near-metro', 'marina', 'walkable'], lifestyle_keywords: ['non-smoker', 'social', 'clean'] },
        current_house_id: 'list-entry-11', rent_monthly: 3200, deposit: 3200,

        good_conduct_certificate: { id: 'gcc-1', tenant_id: 'roommate-1', issued_by_landlord: 'landlord-4', property_id: 'list-entry-11', tenancy_start: '2025-12-15', tenancy_end: '2026-12-15', rating: 5, payment_reliability: 'excellent', property_care: 'excellent', issued_at: '2026-02-20', verified: true },
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
        isUaePassVerified: true, isIdVerified: false,
        name: 'Marcus Chen', email: 'marcus.chen@email.com', avatar: '',
        bio: 'Software engineer working remotely for a climate tech company in Singapore. Quiet during work hours, love hitting the gym in the evenings and exploring Dubai\'s food scene on weekends. Big fan of board games and cycling.',
        keywords: ['professional', 'quiet', 'gym-goer', 'non-smoker', 'tech', 'foodie'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-11-25', aml_status: 'completed', aml_completed_date: '2025-11-25', pep_status: 'clear', pep_completed_date: '2025-11-25', verified: true },
        phone: '+971 54 567 8901', instagram_handle: '@marcus.dxb',
        rating: 4.6, total_reviews: 2,
        preferences: { budget_min: 3000, budget_max: 4000, move_in_date: '2025-11-01', duration: '12_months', schedule: 'varies', location_keywords: ['near-metro', 'gym-nearby', 'restaurants'], lifestyle_keywords: ['quiet', 'gym-goer', 'professional'] },
        current_house_id: 'list-entry-12', rent_monthly: 3500, deposit: 3500,

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
        isUaePassVerified: true, isIdVerified: false,
        name: 'Elena Rodriguez', email: 'elena.rodriguez@email.com', avatar: '',
        bio: 'Marketing coordinator at a sustainability startup in Dubai Design District. Love exploring the city — weekend markets, art galleries, and trying every coffee shop I can find.',
        keywords: ['non-smoker', 'social', 'professional', 'clean', 'creative', 'coffee-lover'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2026-01-15', aml_status: 'completed', aml_completed_date: '2026-01-15', pep_status: 'clear', pep_completed_date: '2026-01-15', verified: true },
        phone: '+971 58 678 9012',
        is_verified: true, has_gcc: false, gccScore: 30, isPremium: false,
        resident_role: 'residing', tenancy_duration_months: 4, gcc_eligible_date: '2026-07-15',
        current_house_id: 'list-entry-3', rent_monthly: 800, deposit: 800,

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
        isUaePassVerified: true, isIdVerified: false,
        name: 'Omar Khalil', email: 'omar.khalil@email.com', avatar: '',
        bio: 'Bartender and music producer. I work late shifts so I\'m quiet during the day. Love cooking Middle Eastern breakfasts on Friday mornings. 9 months in the flat and loving JLT.',
        keywords: ['night-owl', 'musician', 'clean', 'friendly', 'non-smoker', 'creative'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-06-01', aml_status: 'completed', aml_completed_date: '2025-06-01', pep_status: 'clear', pep_completed_date: '2025-06-01', verified: true },
        phone: '+971 50 789 0123',
        is_verified: true, has_gcc: true, gccScore: 60, isPremium: false,
        resident_role: 'residing', tenancy_duration_months: 9,
        current_house_id: 'list-entry-8', rent_monthly: 2200, deposit: 2200,

        good_conduct_certificate: { id: 'gcc-omar', tenant_id: 'roommate-4', issued_by_landlord: 'landlord-1', property_id: 'list-entry-8', tenancy_start: '2025-06-01', tenancy_end: '2026-06-01', rating: 4, payment_reliability: 'excellent', property_care: 'good', issued_at: '2026-02-01', verified: true },
        lifestyle_tags: ['gym-goer', 'swimming', 'football'],
        personality_traits: ['extroverted', 'comedian', 'social', 'night-owl'],
        hobbies: ['music-production', 'cooking-arabic', 'football', 'desert-camping'],
        created_at: '2025-06-01', updated_at: '2026-03-08',
    },
    // ── Residing Roommate 5: Yuki Tanaka ──────────────────────
    {
        id: 'roommate-5', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1997-00008', emiratesId: '784-1997-8901234-8',
        isUaePassVerified: true, isIdVerified: false,
        name: 'Yuki Tanaka', email: 'yuki.tanaka@email.com', avatar: '',
        bio: 'Japanese architect working on EXPO City Dubai projects. Living in Business Bay for 6 months. Love the canal walks, weekend brunches, and the Dubai Design Week scene.',
        keywords: ['non-smoker', 'professional', 'design', 'organised', 'quiet'],
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-09-01', aml_status: 'completed', aml_completed_date: '2025-09-01', pep_status: 'clear', pep_completed_date: '2025-09-01', verified: true },
        phone: '+971 52 890 1234',
        is_verified: true, has_gcc: false, gccScore: 40, isPremium: true,
        resident_role: 'residing', tenancy_duration_months: 6, gcc_eligible_date: '2026-03-01',
        current_house_id: 'list-entry-10', rent_monthly: 2800, deposit: 2800,

        lifestyle_tags: ['runner', 'cycling', 'swimming'],
        personality_traits: ['introverted', 'creative', 'organised', 'calm'],
        hobbies: ['architecture-walks', 'photography', 'japanese-cooking', 'design-exhibitions'],
        created_at: '2025-09-01', updated_at: '2026-03-08',
    },
    // ── Searching Roommate 1: James Morrison ──────────────────
    {
        id: 'roommate-6', type: 'roommate', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1992-00009', emiratesId: '784-1992-9012345-9',
        isUaePassVerified: true, isIdVerified: false,
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
        isUaePassVerified: true, isIdVerified: false,
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
        isUaePassVerified: true, isIdVerified: false,
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
        isUaePassVerified: true, isIdVerified: false,
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
        isUaePassVerified: true, isIdVerified: false,
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
    // ── Phase 12 Expanded Data: Landlords & Agents ────────────────────────────
    {
        id: 'landlord-3', type: 'landlord', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1980-00101', emiratesId: '784-1980-1111111-1',
        isUaePassVerified: true, isIdVerified: false,
        name: 'Saeed Sultan', email: 'saeed@example.com', avatar: '',
        bio: 'Portfolio owner in Business Bay.',
        keywords: ['compliant'], phone: '+971 50 111 2222',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-01-01', aml_status: 'completed', aml_completed_date: '2025-01-01', pep_status: 'clear', pep_completed_date: '2025-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2025-01-01', updated_at: '2026-03-01',
    },
    {
        id: 'landlord-4', type: 'landlord', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1982-00102', emiratesId: '784-1982-2222222-2',
        isUaePassVerified: true, isIdVerified: false,
        name: 'Nadia Mansour', email: 'nadia@example.com', avatar: '',
        bio: 'Owner of multiple units in JVC.',
        keywords: ['compliant'], phone: '+971 50 222 3333',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-01-01', aml_status: 'completed', aml_completed_date: '2025-01-01', pep_status: 'clear', pep_completed_date: '2025-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2025-01-01', updated_at: '2026-03-01',
    },
    {
        id: 'agent-2', type: 'letting_agent', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1990-00201', emiratesId: '784-1990-3333333-3',
        isUaePassVerified: true, isIdVerified: false,
        name: 'Tariq Mahmood', email: 'tariq@agency.ae', avatar: '',
        bio: 'RERA certified broker.',
        agency_name: 'Prime Real Estate', rera_license: 'RERA-BRN-33333',
        keywords: ['compliant'], phone: '+971 50 333 4444',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-01-01', aml_status: 'completed', aml_completed_date: '2025-01-01', pep_status: 'clear', pep_completed_date: '2025-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2025-01-01', updated_at: '2026-03-01',
    },
    {
        id: 'agent-3', type: 'letting_agent', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-784-1992-00202', emiratesId: '784-1992-4444444-4',
        isUaePassVerified: true, isIdVerified: false,
        name: 'Elena Popova', email: 'elena@agency.ae', avatar: '',
        bio: 'RERA certified broker.',
        agency_name: 'Luxury Homes', rera_license: 'RERA-BRN-44444',
        keywords: ['compliant'], phone: '+971 50 444 5555',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2025-01-01', aml_status: 'completed', aml_completed_date: '2025-01-01', pep_status: 'clear', pep_completed_date: '2025-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2025-01-01', updated_at: '2026-03-01',
    },
    // ── Phase 12 Expanded Data: Roommates ──────────────────────────────
    ...Array.from({length: 4}).map((_, i) => ({
        id: `roommate-srch-${i}`, type: 'roommate' as const, auth_method: 'uae_pass' as const,
        isUaePassVerified: true, isIdVerified: false,
        name: `Searching User ${i}`, email: `searcher${i}@example.com`, avatar: '',
        bio: '', keywords: [], phone: '',
        compliance: { kyc_status: 'completed' as const, kyc_completed_date: '2026-01-01', aml_status: 'completed' as const, aml_completed_date: '2026-01-01', pep_status: 'clear' as const, pep_completed_date: '2026-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false, resident_role: 'searching' as const,
        preferences: { budget_min: 2000, budget_max: 3000, move_in_date: '2026-05-01', duration: 'flexible' as const, schedule: 'varies' as const },
        lifestyle_tags: [], personality_traits: [], hobbies: [], created_at: '2026-01-01', updated_at: '2026-01-01'
    })),
    ...Array.from({length: 4}).map((_, i) => ({
        id: `roommate-res-new-${i}`, type: 'roommate' as const, auth_method: 'uae_pass' as const,
        isUaePassVerified: true, isIdVerified: false,
        name: `Residing User ${i}`, email: `resider${i}@example.com`, avatar: '',
        bio: '', keywords: [], phone: '',
        compliance: { kyc_status: 'completed' as const, kyc_completed_date: '2026-01-01', aml_status: 'completed' as const, aml_completed_date: '2026-01-01', pep_status: 'clear' as const, pep_completed_date: '2026-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false, resident_role: 'residing' as const,
        lifestyle_tags: [], personality_traits: [], hobbies: [], created_at: '2026-01-01', updated_at: '2026-01-01'
    })),
    // ── Admin Users ───────────────────────────────────────────
    {
        id: 'admin-1', type: 'compliance', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-ADMIN-001', isUaePassVerified: true, isIdVerified: false,
        name: 'Compliance Admin', email: 'compliance@nestmatch.ae', avatar: '',
        bio: 'NestMatch UAE compliance controller — UAE PASS verification and CBUAE regulatory oversight.',
        keywords: ['admin', 'compliance'], phone: '+971 4 123 4567',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2024-01-01', aml_status: 'completed', aml_completed_date: '2024-01-01', pep_status: 'clear', pep_completed_date: '2024-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2024-01-01', updated_at: '2026-03-10',
    },
    {
        id: 'admin-3', type: 'operations', auth_method: 'uae_pass',
        uaePassId: 'UAEPASS-ADMIN-003', isUaePassVerified: true, isIdVerified: false,
        name: 'Operations Admin', email: 'operations@nestmatch.ae', avatar: '',
        bio: 'NestMatch UAE operations — CRM, property registry, and user management.',
        keywords: ['admin', 'operations'], phone: '+971 4 123 4569',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2024-01-01', aml_status: 'completed', aml_completed_date: '2024-01-01', pep_status: 'clear', pep_completed_date: '2024-01-01', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        created_at: '2024-01-01', updated_at: '2026-03-10',
    },
    // ── Tier 1 Demo Users (Email-only, no UAE PASS) ───────────
    {
        id: 'tier1-1', type: 'roommate', auth_method: 'email',
        isUaePassVerified: false, isIdVerified: false,
        name: 'New User (Tier 1)', email: 'newuser@gmail.com', avatar: '',
        bio: 'Just arrived in Dubai — browsing shared living options before I get my Emirates ID sorted.',
        keywords: ['new-arrival'], phone: '+971 50 000 0001',
        compliance: { kyc_status: 'pending', aml_status: 'pending', pep_status: 'pending', verified: false },
        is_verified: false, has_gcc: false, gccScore: 0, isPremium: false,
        resident_role: 'searching',
        preferences: { budget_min: 2000, budget_max: 4000, move_in_date: '2026-05-01', duration: 'flexible', schedule: 'varies' },
        lifestyle_tags: ['gym-goer', 'social'],
        personality_traits: ['extroverted', 'adventurous'],
        hobbies: ['exploring', 'photography'],
        created_at: '2026-03-12', updated_at: '2026-03-12',
    },
    {
        id: 'tier1-2', type: 'roommate', auth_method: 'google',
        isUaePassVerified: false, isIdVerified: true,  // Verified via Onfido (new expat fallback)
        name: 'Onfido Verified (Tier 2 Alt)', email: 'verified.onfido@gmail.com', avatar: '',
        bio: 'New expat — verified via passport + Onfido liveness check. No Emirates ID yet but fully verified for NestMatch.',
        keywords: ['new-expat', 'onfido-verified'], phone: '+971 50 000 0002',
        compliance: { kyc_status: 'completed', kyc_completed_date: '2026-03-10', aml_status: 'completed', aml_completed_date: '2026-03-10', pep_status: 'clear', pep_completed_date: '2026-03-10', verified: true },
        is_verified: true, has_gcc: false, gccScore: 0, isPremium: false,
        resident_role: 'searching',
        preferences: { budget_min: 2500, budget_max: 4500, move_in_date: '2026-04-15', duration: '12_months', schedule: 'early_bird' },
        lifestyle_tags: ['runner', 'yoga'],
        personality_traits: ['introverted', 'calm'],
        hobbies: ['reading', 'cooking'],
        created_at: '2026-03-10', updated_at: '2026-03-12',
    },
];

// ─── LISTINGS ─────────────────────────────────────────────────
export const listings: Listing[] = [
    // ── AED 500 - 800: Legal Bed-spaces ─────────────────────────────────────────
    {
        id: 'list-entry-1', landlord_id: 'landlord-3', letting_agent_id: 'agent-2',
        title: 'Compliant Bed-space in Deira — Near Metro',
        address: 'Al Rigga Road, Deira', district: 'Deira', rent_per_room: 500, total_rooms: 3, available_rooms: 1,
        images: [], description: 'Fully legal, DLD-approved bed-space in a clean, quiet 6-person shared room. 3 mins walk to Al Rigga Metro. Daily cleaning included.',
        amenities: ['Central AC', 'Daily Cleaning', 'High-Speed Wi-Fi', 'Furnished'],
        house_rules: ['No smoking', 'Quiet hours 10PM-6AM'],
        bills_included: true, bills_breakdown: 'DEWA & Internet included', deposit: 500,
        current_roommates: ['roommate-srch-0', 'roommate-srch-1', 'roommate-srch-2', 'roommate-res-new-0', 'roommate-res-new-1'],
        occupancy_status: [
            { room_number: 1, tenant_id: 'roommate-srch-0', status: 'occupied' }, { room_number: 1, tenant_id: 'roommate-srch-1', status: 'occupied' },
            { room_number: 1, tenant_id: 'roommate-srch-2', status: 'occupied' }, { room_number: 1, tenant_id: 'roommate-res-new-0', status: 'occupied' },
            { room_number: 1, tenant_id: 'roommate-res-new-1', status: 'occupied' }, { room_number: 1, tenant_id: null, status: 'available' }
        ],
        tags: ['bed-space', 'budget', 'metro-access', 'deira'],
        makaniNumber: '1122334455', trakheesiPermit: 'TRAK-2025-DR-123', municipalityPermit: 'DM-SH-2026-DR1',
        maxLegalOccupancy: 6, currentOccupants: 5, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'Al Rigga Metro', type: 'metro', walk_time: '3m', lines: ['Red Line'], line_color: '#E21836' }],
        rera_escrow_verified: true, location: { lat: 25.263, lng: 55.321, nearest_metro: { name: 'Al Rigga', line: 'Red Line', walk_mins: 3 }, nearby_amenities: ['Al Ghurair Centre', 'Rigga Night Market'], area_description: 'Deira — Historic commercial hub with unbeatable metro connections.' },
        rating: 4.2, total_reviews: 12, created_at: '2025-10-01', updated_at: '2026-03-01',
    },
    {
        id: 'list-entry-2', landlord_id: 'landlord-4',
        title: 'Affordable Bed-space — International City',
        address: 'England Cluster, International City', district: 'International City', rent_per_room: 600, total_rooms: 2, available_rooms: 4,
        images: [], description: 'Clean, compliant shared room in International City. Direct bus to Rashidiya Metro. Perfect for budget-conscious workers.',
        amenities: ['AC', 'Parking', 'Wi-Fi'], house_rules: ['No smoking'], bills_included: true, deposit: 600,
        current_roommates: ['roommate-res-new-2'],
        occupancy_status: [{ room_number: 1, tenant_id: 'roommate-res-new-2', status: 'occupied' }, { room_number: 1, tenant_id: null, status: 'available' }, { room_number: 1, tenant_id: null, status: 'available' }],
        tags: ['bed-space', 'budget'], makaniNumber: '2233445566', trakheesiPermit: 'TRAK-2025-IC-123', municipalityPermit: 'DM-SH-2026-IC1',
        maxLegalOccupancy: 4, currentOccupants: 1, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'RTA Bus 367', type: 'bus', walk_time: '2m', lines: ['367'] }], rera_escrow_verified: true,
        location: { lat: 25.163, lng: 55.407, nearby_amenities: ['Dragon Mart'], area_description: 'International City — highly affordable community living.' },
        rating: 4.0, total_reviews: 8, created_at: '2025-11-01', updated_at: '2026-03-01',
    },
    {
        id: 'list-entry-3', landlord_id: 'landlord-2', letting_agent_id: 'agent-1',
        title: 'Al Qusais Shared Room — Close to Airport Freezone',
        address: 'Damascus St, Al Qusais', district: 'Al Qusais', rent_per_room: 800, total_rooms: 4, available_rooms: 2,
        images: [], description: 'Very large shared room, only 4 people max. DAFZA metro is a short walk away. Two rooms currently available.',
        amenities: ['Balcony', 'Gym', 'Wi-Fi', 'Central AC'], house_rules: [], bills_included: true, deposit: 800,
        current_roommates: ['roommate-res-new-3', 'roommate-3'],
        occupancy_status: [{ room_number: 1, tenant_id: 'roommate-3', status: 'occupied' }, { room_number: 2, tenant_id: 'roommate-res-new-3', status: 'occupied' }, { room_number: 3, tenant_id: null, status: 'available' }, { room_number: 4, tenant_id: null, status: 'available' }],
        tags: ['bed-space', 'dafza'], makaniNumber: '3344556677', trakheesiPermit: 'TRAK-2025-AQ-123', municipalityPermit: 'DM-SH-2026-AQ1',
        maxLegalOccupancy: 4, currentOccupants: 2, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'DAFZA Metro', type: 'metro', walk_time: '8m', lines: ['Green Line'], line_color: '#009639' }], rera_escrow_verified: true,
        location: { lat: 25.267, lng: 55.378, nearby_amenities: ['DAFZA'], area_description: 'Al Qusais — great for freezone workers.' },
        rating: 4.5, total_reviews: 5, created_at: '2025-12-01', updated_at: '2026-03-01',
    },

    // ── AED 1000 - 1500: Shared Rooms (2-3 pax) ───────────────────────────────
    {
        id: 'list-entry-4', landlord_id: 'landlord-1',
        title: 'Twin Share Room — Heart of Bur Dubai',
        address: 'Mankhool Road, Bur Dubai', district: 'Bur Dubai', rent_per_room: 1000, total_rooms: 3, available_rooms: 1,
        images: [], description: 'Share a massive master bedroom with just one other person. En-suite bathroom, high ceilings. Walking distance to ADCB Metro.',
        amenities: ['En-suite', 'Balcony', 'Wi-Fi'], house_rules: ['Professionals only'], bills_included: false, bills_breakdown: 'DEWA shared', deposit: 1000,
        current_roommates: ['roommate-6'],
        occupancy_status: [{ room_number: 1, tenant_id: 'roommate-6', status: 'occupied' }, { room_number: 1, tenant_id: null, status: 'available' }],
        tags: ['shared-room', 'bur-dubai', 'twin'], makaniNumber: '4455667788', trakheesiPermit: 'TRAK-2025-BD-123', municipalityPermit: 'DM-SH-2026-BD1',
        maxLegalOccupancy: 2, currentOccupants: 1, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'ADCB Metro', type: 'metro', walk_time: '6m', lines: ['Red Line'], line_color: '#E21836' }], rera_escrow_verified: true,
        location: { lat: 25.250, lng: 55.300, nearby_amenities: ['BurJuman'], area_description: 'Bur Dubai — historic and incredibly well-connected.' },
        rating: 4.6, total_reviews: 4, created_at: '2025-10-15', updated_at: '2026-03-01',
    },
    {
        id: 'list-entry-5', landlord_id: 'landlord-4', letting_agent_id: 'agent-3',
        title: 'Al Nahda Twin Share — Dubai/Sharjah Border',
        address: 'Al Nahda 1, Dubai', district: 'Al Nahda', rent_per_room: 1200, total_rooms: 2, available_rooms: 2,
        images: [], description: 'Brand new building, gym and pool included. You will share a room with one other verified tenant. Completely vacant right now!',
        amenities: ['Gym', 'Pool', 'Parking'], house_rules: [], bills_included: true, deposit: 1200,
        current_roommates: [],
        occupancy_status: [{ room_number: 1, tenant_id: null, status: 'available' }, { room_number: 1, tenant_id: null, status: 'available' }],
        tags: ['al-nahda', 'new-building'], makaniNumber: '5566778899', trakheesiPermit: 'TRAK-2025-AN-123', municipalityPermit: 'DM-SH-2026-AN1',
        maxLegalOccupancy: 2, currentOccupants: 0, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'Stadium Metro', type: 'metro', walk_time: '15m', lines: ['Green Line'], line_color: '#009639' }], rera_escrow_verified: true,
        location: { lat: 25.291, lng: 55.364, nearby_amenities: ['Sahara Centre'], area_description: 'Al Nahda — great value on the border.' },
        rating: 4.8, total_reviews: 2, created_at: '2026-01-10', updated_at: '2026-03-01',
    },
    {
        id: 'list-entry-6', landlord_id: 'landlord-3',
        title: 'Discovery Gardens Shared Apartment',
        address: 'Zen Cluster, Discovery Gardens', district: 'Discovery Gardens', rent_per_room: 1500, total_rooms: 2, available_rooms: 1,
        images: [], description: 'Great community living. You get your own bed in a huge shared master room (max 2 pax per room). Metro is just outside the cluster.',
        amenities: ['Community Pool', 'Tennis Court', 'Metro Access'], house_rules: [], bills_included: true, deposit: 1500,
        current_roommates: ['roommate-7'],
        occupancy_status: [{ room_number: 1, tenant_id: 'roommate-7', status: 'occupied' }, { room_number: 1, tenant_id: null, status: 'available' }],
        tags: ['discovery-gardens', 'metro-access'], makaniNumber: '6677889900', trakheesiPermit: 'TRAK-2025-DG-123', municipalityPermit: 'DM-SH-2026-DG1',
        maxLegalOccupancy: 2, currentOccupants: 1, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'Discovery Gardens Metro', type: 'metro', walk_time: '4m', lines: ['Red Line'], line_color: '#E21836' }], rera_escrow_verified: true,
        location: { lat: 25.040, lng: 55.140, nearby_amenities: ['Ibn Battuta Mall'], area_description: 'Discovery Gardens — lush, green, affordable.' },
        rating: 4.4, total_reviews: 9, created_at: '2025-08-20', updated_at: '2026-03-01',
    },

    // ── AED 1800 - 2500: Private Rooms (Budger / Mid-Tier) ────────────────────
    {
        id: 'list-entry-7', landlord_id: 'landlord-4', letting_agent_id: 'agent-2',
        title: 'Private Room in JVC Villa',
        address: 'District 15, JVC', district: 'JVC', rent_per_room: 1800, total_rooms: 4, available_rooms: 1,
        images: [], description: 'Your own private room in a massive JVC villa. Shared backyard, huge kitchen. You share a bathroom with just 1 other person.',
        amenities: ['Garden', 'Parking', 'Maid Room'], house_rules: ['No loud parties'], bills_included: false, bills_breakdown: 'DEWA & Internet split 4 ways', deposit: 1800,
        current_roommates: ['roommate-8', 'roommate-9'],
        occupancy_status: [{ room_number: 1, tenant_id: 'roommate-8', status: 'occupied' }, { room_number: 2, tenant_id: 'roommate-9', status: 'occupied' }, { room_number: 3, tenant_id: null, status: 'available' }],
        tags: ['private-room', 'villa', 'jvc'], makaniNumber: '7788990011', trakheesiPermit: 'TRAK-2025-JVC-123', municipalityPermit: 'DM-SH-2026-JVC1',
        maxLegalOccupancy: 4, currentOccupants: 2, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'J01 Bus', type: 'bus', walk_time: '2m', lines: ['J01'] }], rera_escrow_verified: true,
        location: { lat: 25.060, lng: 55.210, nearby_amenities: ['Circle Mall'], area_description: 'Jumeirah Village Circle — the heart of new Dubai.' },
        rating: 4.1, total_reviews: 6, created_at: '2025-05-15', updated_at: '2026-03-01',
    },
    {
        id: 'list-entry-8', landlord_id: 'landlord-1',
        title: 'Private Room — Dubai Silicon Oasis',
        address: 'Axis Residence, DSO', district: 'Dubai Silicon Oasis', rent_per_room: 2200, total_rooms: 2, available_rooms: 1,
        images: [], description: 'Clean, modern private room in DSO. Perfect for tech workers. Building has a great gym and rooftop pool.',
        amenities: ['Pool', 'Gym', 'Covered Parking'], house_rules: [], bills_included: true, deposit: 2200,
        current_roommates: ['roommate-4'],
        occupancy_status: [{ room_number: 1, tenant_id: 'roommate-4', status: 'occupied' }, { room_number: 2, tenant_id: null, status: 'available' }],
        tags: ['private-room', 'dso'], makaniNumber: '8899001122', trakheesiPermit: 'TRAK-2025-DSO-123', municipalityPermit: 'DM-SH-2026-DS1',
        maxLegalOccupancy: 2, currentOccupants: 1, isActive: true, isApiVerified: true,
        transport_chips: [{ label: '320 Bus', type: 'bus', walk_time: '1m', lines: ['320'] }], rera_escrow_verified: true,
        location: { lat: 25.120, lng: 55.380, nearby_amenities: ['Silicon Oasis Mall'], area_description: 'DSO — the tech hub of Dubai.' },
        rating: 4.7, total_reviews: 11, created_at: '2025-06-25', updated_at: '2026-03-01',
    },
    {
        id: 'list-entry-9', landlord_id: 'landlord-2', letting_agent_id: 'agent-3',
        title: 'En-suite Private Room in Al Barsha 1',
        address: 'Al Barsha 1, Near MOE', district: 'Al Barsha', rent_per_room: 2500, total_rooms: 3, available_rooms: 0,
        images: [], description: 'Awesome private room with en-suite. 5 mins walk to Mall of the Emirates Metro. Completely full at the moment.',
        amenities: ['En-suite', 'Balcony', 'Gym'], house_rules: [], bills_included: true, deposit: 2500,
        current_roommates: ['roommate-10', 'roommate-srch-3', 'tier1-2'],
        occupancy_status: [{ room_number: 1, tenant_id: 'roommate-10', status: 'occupied' }, { room_number: 2, tenant_id: 'roommate-srch-3', status: 'occupied' }, { room_number: 3, tenant_id: 'tier1-2', status: 'occupied' }],
        tags: ['private-room', 'en-suite', 'al-barsha'], makaniNumber: '9900112233', trakheesiPermit: 'TRAK-2025-AB-123', municipalityPermit: 'DM-SH-2026-AB1',
        maxLegalOccupancy: 3, currentOccupants: 3, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'MOE Metro', type: 'metro', walk_time: '5m', lines: ['Red Line'], line_color: '#E21836' }], rera_escrow_verified: true,
        location: { lat: 25.117, lng: 55.200, nearby_amenities: ['Mall of the Emirates'], area_description: 'Al Barsha — central, bustling, affordable.' },
        rating: 4.9, total_reviews: 14, created_at: '2025-03-10', updated_at: '2026-03-01',
    },

    // ── AED 2800 - 3500: Premium Private En-suites ────────────────────────────
    {
        id: 'list-entry-10', landlord_id: 'landlord-3',
        title: 'Premium En-Suite — Business Bay Canal View',
        address: 'Executive Towers, Business Bay', district: 'Business Bay', rent_per_room: 2800, total_rooms: 2, available_rooms: 1,
        images: [], description: 'High-floor private room overlooking the canal. Premium building amenities. You share the apartment with a verified pilot.',
        amenities: ['Pool', 'Gym', 'Canal View', 'En-suite'], house_rules: ['Professionals only'], bills_included: false, bills_breakdown: 'Shared equally', deposit: 2800,
        current_roommates: ['roommate-5'],
        occupancy_status: [{ room_number: 1, tenant_id: 'roommate-5', status: 'occupied' }, { room_number: 2, tenant_id: null, status: 'available' }],
        tags: ['premium', 'en-suite', 'business-bay'], makaniNumber: '0011223344', trakheesiPermit: 'TRAK-2025-BB-123', municipalityPermit: 'DM-SH-2026-BB1',
        maxLegalOccupancy: 2, currentOccupants: 1, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'Business Bay Metro', type: 'metro', walk_time: '7m', lines: ['Red Line'], line_color: '#E21836' }], rera_escrow_verified: true,
        location: { lat: 25.185, lng: 55.265, nearby_amenities: ['Bay Avenue', 'Dubai Mall'], area_description: 'Business Bay — the commercial heart of Dubai.' },
        rating: 4.6, total_reviews: 7, created_at: '2025-04-18', updated_at: '2026-03-01',
    },
    {
        id: 'list-entry-11', landlord_id: 'landlord-4', letting_agent_id: 'agent-2',
        title: 'Luxury JLT Private Room — Cluster D',
        address: 'Cluster D, JLT', district: 'JLT', rent_per_room: 3200, total_rooms: 3, available_rooms: 2,
        images: [], description: 'Upgraded luxury apartment in JLT. Sweeping views of the golf course and lakes. Two empty private rooms available for immediate move-in.',
        amenities: ['Lake View', 'Gym', 'Premium Furnishings'], house_rules: [], bills_included: true, deposit: 3200,
        current_roommates: ['roommate-1'],
        occupancy_status: [{ room_number: 1, tenant_id: 'roommate-1', status: 'occupied' }, { room_number: 2, tenant_id: null, status: 'available' }, { room_number: 3, tenant_id: null, status: 'available' }],
        tags: ['luxury', 'jlt', 'lake-view', 'private-room'], makaniNumber: '1122334455', trakheesiPermit: 'TRAK-2025-JLT-123', municipalityPermit: 'DM-SH-2026-JL1',
        maxLegalOccupancy: 3, currentOccupants: 1, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'DMCC Metro', type: 'metro', walk_time: '8m', lines: ['Red Line'], line_color: '#E21836' }], rera_escrow_verified: true,
        location: { lat: 25.070, lng: 55.150, nearest_metro: { name: 'DMCC', line: 'Red Line', walk_mins: 8 }, nearby_amenities: ['JLT Park'], area_description: 'JLT — thriving lakeside community.' },
        rating: 4.8, total_reviews: 15, created_at: '2026-02-05', updated_at: '2026-03-01',
    },
    {
        id: 'list-entry-12', landlord_id: 'landlord-1', letting_agent_id: 'agent-1',
        title: 'Ultra-Premium Marina En-Suite — Ocean View',
        address: 'Princess Tower, Dubai Marina', district: 'Dubai Marina', rent_per_room: 3500, total_rooms: 2, available_rooms: 1,
        images: [], description: 'The absolute best of NestMatch. 3500 AED gets you an ocean-facing massive en-suite in the Marina. Full cleaning, all bills, gym, and pool included.',
        amenities: ['Sea View', 'En-suite', 'Daily Cleaning', 'Concierge', 'Pool', 'Gym'], house_rules: ['No pets'], bills_included: true, bills_breakdown: 'Everything included', deposit: 3500,
        current_roommates: ['roommate-2'],
        occupancy_status: [{ room_number: 1, tenant_id: 'roommate-2', status: 'occupied' }, { room_number: 2, tenant_id: null, status: 'available' }],
        tags: ['ultra-premium', 'sea-view', 'marina', 'en-suite'], makaniNumber: '2233445566', trakheesiPermit: 'TRAK-2025-DM-123', municipalityPermit: 'DM-SH-2026-DM1',
        maxLegalOccupancy: 2, currentOccupants: 1, isActive: true, isApiVerified: true,
        transport_chips: [{ label: 'Dubai Marina Tram', type: 'tram', walk_time: '3m' }, { label: 'DMCC Metro', type: 'metro', walk_time: '5m', lines: ['Red Line'], line_color: '#E21836' }], rera_escrow_verified: true,
        location: { lat: 25.080, lng: 55.140, nearest_metro: { name: 'DMCC', line: 'Red Line', walk_mins: 5 }, nearby_amenities: ['JBR Beach', 'Dubai Marina Mall'], area_description: 'Dubai Marina — iconic waterfront living.' },
        rating: 5.0, total_reviews: 24, created_at: '2025-01-10', updated_at: '2026-03-01',
    },
];

// ─── VIEWING BOOKINGS ─────────────────────────────────────────
export const viewingBookings: ViewingBooking[] = [
    {
        id: 'view-1', property_id: 'list-entry-12', searcher_id: 'roommate-6', landlord_id: 'landlord-1',
        requested_date: '2026-03-20T14:00:00Z', time_slot: '2:00 PM - 2:30 PM',
        status: 'FULLY_SIGNED',
        agreement: {
            id: 'va-1', viewing_id: 'view-1', agreement_number: 'NM-VA-2026-IEW01',
            generated_at: '2026-03-11T09:00:00Z',
            broker_orn: 'ORN-54321', broker_company: 'Dubai Property Group', broker_brn: 'RERA-BRN-2025-12345',
            signatures: [
                { signer_id: 'agent-1', signer_name: 'Khalid Al Rashid', signer_role: 'broker', signed_at: '2026-03-11T10:00:00Z', signature_data: 'data:image/png;base64,demo_sig_1', ip_simulated: '192.168.1.42' },
                { signer_id: 'roommate-6', signer_name: 'James Morrison', signer_role: 'tenant', signed_at: '2026-03-11T14:30:00Z', signature_data: 'data:image/png;base64,demo_sig_2', ip_simulated: '192.168.1.87' },
            ],
            status: 'fully_signed',
        },
        created_at: '2026-03-10', updated_at: '2026-03-11',
    },
    {
        id: 'view-2', property_id: 'list-entry-8', searcher_id: 'roommate-7', landlord_id: 'landlord-1',
        requested_date: '2026-03-22T10:00:00Z', time_slot: '10:00 AM - 10:30 AM',
        status: 'PENDING_LANDLORD_APPROVAL', created_at: '2026-03-11', updated_at: '2026-03-11',
    },
    {
        id: 'view-3', property_id: 'list-entry-4', searcher_id: 'roommate-9', landlord_id: 'landlord-1',
        requested_date: '2026-03-18T16:00:00Z', time_slot: '4:00 PM - 4:30 PM',
        status: 'COMPLETED', resolution_date: '2026-03-18',
        created_at: '2026-03-08', updated_at: '2026-03-18',
    },
    {
        id: 'view-4', property_id: 'list-entry-9', searcher_id: 'roommate-10', landlord_id: 'landlord-2',
        requested_date: '2026-03-25T11:00:00Z', time_slot: '11:00 AM - 11:30 AM',
        status: 'PENDING', created_at: '2026-03-12', updated_at: '2026-03-12',
    },
    {
        id: 'view-5', property_id: 'list-entry-1', searcher_id: 'roommate-srch-0', landlord_id: 'landlord-3',
        requested_date: '2026-03-20T14:00:00Z', time_slot: '2:00 PM - 2:30 PM',
        status: 'AGENT_SIGNED',
        agreement: {
            id: 'va-5', viewing_id: 'view-5', agreement_number: 'NM-VA-2026-IEW05',
            generated_at: '2026-03-11T08:00:00Z',
            broker_orn: 'ORN-33333', broker_company: 'Prime Real Estate',
            signatures: [
                { signer_id: 'landlord-3', signer_name: 'Saeed Sultan', signer_role: 'broker', signed_at: '2026-03-11T09:00:00Z', signature_data: 'data:image/png;base64,demo_sig_3', ip_simulated: '192.168.1.55' },
            ],
            status: 'agent_signed',
        },
        created_at: '2026-03-10', updated_at: '2026-03-11',
    },
    {
        id: 'view-6', property_id: 'list-entry-6', searcher_id: 'roommate-srch-1', landlord_id: 'landlord-3',
        requested_date: '2026-03-22T10:00:00Z', time_slot: '10:00 AM - 10:30 AM',
        status: 'AGREEMENT_SENT',
        agreement: {
            id: 'va-6', viewing_id: 'view-6', agreement_number: 'NM-VA-2026-IEW06',
            generated_at: '2026-03-12T10:00:00Z',
            signatures: [],
            status: 'sent',
        },
        created_at: '2026-03-11', updated_at: '2026-03-11',
    },
    {
        id: 'view-7', property_id: 'list-entry-1', searcher_id: 'roommate-srch-2', landlord_id: 'landlord-3',
        requested_date: '2026-03-18T16:00:00Z', time_slot: '4:00 PM - 4:30 PM',
        status: 'CANCELLED', resolution_date: '2026-03-18', created_at: '2026-03-08', updated_at: '2026-03-18',
    },
    {
        id: 'view-8', property_id: 'list-entry-2', searcher_id: 'roommate-srch-3', landlord_id: 'landlord-4',
        requested_date: '2026-03-25T11:00:00Z', time_slot: '11:00 AM - 11:30 AM',
        status: 'CANCELLED', resolution_date: '2026-03-18', created_at: '2026-03-12', updated_at: '2026-03-12',
    },
    {
        id: 'view-9', property_id: 'list-entry-5', searcher_id: 'roommate-srch-0', landlord_id: 'landlord-4',
        requested_date: '2026-03-26T11:00:00Z', time_slot: '11:00 AM - 11:30 AM',
        status: 'COMPLETED', resolution_date: '2026-03-26', created_at: '2026-03-12', updated_at: '2026-03-26',
    },
    {
        id: 'view-10', property_id: 'list-entry-1', searcher_id: 'roommate-srch-1', landlord_id: 'landlord-3',
        requested_date: '2026-03-27T11:00:00Z', time_slot: '10:00 AM - 10:30 AM',
        status: 'PENDING', created_at: '2026-03-12', updated_at: '2026-03-12',
    },
];

// --- PAYMENTS ---
export const payments: Payment[] = [
    { id: 'pay-1', listing_id: 'list-entry-11', payer_id: 'roommate-1', payee_id: 'landlord-4', type: 'deposit', amount: 3200, due_date: '2025-12-15', paid_date: '2025-12-15', status: 'completed', method: 'bank_transfer', reference: 'NM-AE-DEP-001', created_at: '2025-12-15', updated_at: '2025-12-15' },
    { id: 'pay-2', listing_id: 'list-entry-12', payer_id: 'roommate-2', payee_id: 'landlord-1', type: 'deposit', amount: 3500, due_date: '2025-11-01', paid_date: '2025-11-01', status: 'completed', method: 'bank_transfer', reference: 'NM-AE-DEP-002', created_at: '2025-11-01', updated_at: '2025-11-01' },
    { id: 'pay-3', listing_id: 'list-entry-3', payer_id: 'roommate-3', payee_id: 'landlord-2', type: 'deposit', amount: 800, due_date: '2026-01-15', paid_date: '2026-01-15', status: 'completed', method: 'bank_transfer', reference: 'NM-AE-DEP-003', created_at: '2026-01-15', updated_at: '2026-01-15' },
    { id: 'pay-4', listing_id: 'list-entry-8', payer_id: 'roommate-4', payee_id: 'landlord-1', type: 'deposit', amount: 2200, due_date: '2025-06-01', paid_date: '2025-06-01', status: 'completed', method: 'bank_transfer', reference: 'NM-AE-DEP-004', created_at: '2025-06-01', updated_at: '2025-06-01' },
];

// --- CHAT CHANNELS ---
export const chatChannels: ChatChannel[] = [
    {
        id: 'ch-1', listing_id: 'list-entry-12', name: 'Princess Tower - Marina',
        participants: ['roommate-2', 'landlord-1', 'agent-1'],
        created_at: '2025-12-15',
        last_message: { id: 'msg-latest-1', channel_id: 'ch-1', sender_id: 'roommate-1', message_type: 'text', content: 'AC filter replaced. Quick response!', read_by: ['roommate-1', 'agent-1'], created_at: '2026-03-10T14:30:00Z' },
    },
    {
        id: 'ch-2', listing_id: 'list-entry-3', name: 'Al Qusais - DAFZA',
        participants: ['roommate-3', 'roommate-res-new-3', 'landlord-2'],
        created_at: '2026-01-15',
        last_message: { id: 'msg-latest-2', channel_id: 'ch-2', sender_id: 'landlord-2', message_type: 'announcement', content: 'DEWA maintenance Thursday 9AM-12PM.', read_by: ['landlord-2'], created_at: '2026-03-09T09:00:00Z' },
    },
    {
        id: 'ch-3', listing_id: 'list-entry-10', name: 'Executive Towers - Business Bay',
        participants: ['roommate-5', 'landlord-3'],
        created_at: '2026-02-01',
        last_message: { id: 'msg-latest-3', channel_id: 'ch-3', sender_id: 'landlord-1', message_type: 'text', content: 'Confirming your tenancy renewal for next month.', read_by: ['landlord-1', 'roommate-5'], created_at: '2026-03-11T10:00:00Z' },
    },
    {
        id: 'ch-4', listing_id: 'list-entry-1', name: 'Al Rigga Sublease',
        participants: ['roommate-srch-1', 'landlord-3'],
        created_at: '2026-03-10',
        last_message: { id: 'msg-latest-4', channel_id: 'ch-4', sender_id: 'roommate-srch-1', message_type: 'text', content: 'Hi, is this room still available?', read_by: ['landlord-3'], created_at: '2026-03-11T15:20:00Z' },
    },
    {
        id: 'ch-5', listing_id: 'list-entry-5', name: 'Al Nahda Twin Share',
        participants: ['roommate-srch-0', 'landlord-4'],
        created_at: '2026-03-12',
        last_message: { id: 'msg-latest-5', channel_id: 'ch-5', sender_id: 'landlord-4', message_type: 'text', content: 'Let me know if you are coming for the viewing.', read_by: [], created_at: '2026-03-12T08:00:00Z' },
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
    { id: 'pr-1', property_id: 'list-entry-11', tenant_id: 'roommate-1', acQuality: 5, amenities: 5, maintenanceSpeed: 4, created_at: '2026-02-15' },
    { id: 'pr-2', property_id: 'list-entry-12', tenant_id: 'roommate-2', acQuality: 4, amenities: 5, maintenanceSpeed: 5, created_at: '2026-02-20' },
    { id: 'pr-3', property_id: 'list-entry-3', tenant_id: 'roommate-3', acQuality: 4, amenities: 4, maintenanceSpeed: 3, created_at: '2026-03-01' },
    { id: 'pr-4', property_id: 'list-entry-8', tenant_id: 'roommate-4', acQuality: 3, amenities: 4, maintenanceSpeed: 4, created_at: '2026-03-05' },
    { id: 'pr-5', property_id: 'list-entry-10', tenant_id: 'roommate-5', acQuality: 5, amenities: 5, maintenanceSpeed: 5, created_at: '2026-02-28' },
];

// ─── Phase 17: MAINTENANCE TICKETS ────────────────────────────
export const maintenanceTickets: MaintenanceTicket[] = [
    { id: 'mt-1', property_id: 'list-entry-11', tenant_id: 'roommate-1', issue_type: 'AC/Cooling', urgency: 'Medium', status: 'In Progress', description: 'AC unit in living room is leaking water and making a noise.', created_at: '2026-03-08T09:00:00Z' },
    { id: 'mt-2', property_id: 'list-entry-12', tenant_id: 'roommate-2', issue_type: 'Plumbing', urgency: 'Emergency', status: 'Reported', description: 'Master bathroom toilet is overflowing, water is spreading fast!', created_at: '2026-03-12T19:30:00Z' },
    { id: 'mt-3', property_id: 'list-entry-3', tenant_id: 'roommate-3', issue_type: 'Appliances', urgency: 'Low', status: 'Resolved', description: 'Washing machine door gets stuck sometimes.', created_at: '2026-03-01T14:20:00Z' },
];

// ─── Phase 18: RENT LEDGERS ───────────────────────────────────
export const rentLedgers: RentLedger[] = [
    {
        id: 'ledger-1',
        property_id: 'list-entry-11',
        tenant_id: 'roommate-1',
        landlord_id: 'landlord-4',
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
        property_id: 'list-entry-12',
        tenant_id: 'roommate-2',
        landlord_id: 'landlord-1',
        total_rent: 42000,
        installments: [
            { id: 'inst-2a', due_date: '2025-12-15', amount: 10500, status: 'Paid', method: 'Cheque' },
            { id: 'inst-2b', due_date: '2026-03-15', amount: 10500, status: 'Upcoming', method: 'Stripe' },
            { id: 'inst-2c', due_date: '2026-06-15', amount: 10500, status: 'Upcoming', method: 'Cheque' },
            { id: 'inst-2d', due_date: '2026-09-15', amount: 10500, status: 'Upcoming', method: 'Cheque' },
        ],
    },
    {
        id: 'ledger-3',
        property_id: 'list-entry-3',
        tenant_id: 'roommate-3',
        landlord_id: 'landlord-2',
        total_rent: 36000,
        installments: [
            { id: 'inst-3a', due_date: '2026-01-15', amount: 6000, status: 'Paid', method: 'Cheque' },
            { id: 'inst-3b', due_date: '2026-03-15', amount: 6000, status: 'Overdue', method: 'Cheque' },
            { id: 'inst-3c', due_date: '2026-05-15', amount: 6000, status: 'Upcoming', method: 'Cheque' },
            { id: 'inst-3d', due_date: '2026-07-15', amount: 6000, status: 'Upcoming', method: 'Stripe' },
            { id: 'inst-3e', due_date: '2026-09-15', amount: 6000, status: 'Upcoming', method: 'Cheque' },
            { id: 'inst-3f', due_date: '2026-11-15', amount: 6000, status: 'Upcoming', method: 'Cheque' },
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
    return viewingBookings.filter(v => v.searcher_id === userId || v.landlord_id === userId);
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
