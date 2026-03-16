import type { 
    User, Listing, ViewingBooking, Payment, MaintenanceTicket, 
    RentLedger, ChatMessage, ChatChannel, ComplianceCheck, Application 
} from '../types';

/**
 * 🛠️ Utility Helpers (Restored for UI)
 */
export const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(amount);

export const getInitials = (name: string) => 
    name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

export const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatTime = (dateString: string) => 
    new Date(dateString).toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit', hour12: true });

/**
 * 👥 Master CRM Users (13-User Full Map)
 * This is the canonical source of truth for the UAE investor demo.
 */
export const users: User[] = [
    { 
        id: 'LND_Ahm_001', 
        name: 'Ahmed Al Maktoum', 
        email: 'ahmed@example.com', 
        role: 'landlord', 
        authTier: 2, 
        isUaePassVerified: true, 
        gccScore: 98, 
        bio: 'Legacy owner; focuses on high-end executive suites.',
        avatar: 'https://ui-avatars.com/api/?name=Ahmed+Al+Maktoum&background=0047AB&color=fff',
        phone: '+971 50 123 4567',
        has_gcc: true,
        isPremium: true,
        keywords: ['Executive', 'Legacy'],
        compliance: { kyc_status: 'completed', aml_status: 'completed', pep_status: 'clear', verified: true },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
    },
    { 
        id: 'LND_Fat_001', 
        name: 'Fatima Hassan', 
        email: 'fatima@example.com', 
        role: 'landlord', 
        authTier: 2, 
        isUaePassVerified: true, 
        gccScore: 94, 
        bio: 'Entrepreneur; prefers long-term professional female tenants.',
        avatar: 'https://ui-avatars.com/api/?name=Fatima+Hassan&background=7030A0&color=fff',
        phone: '+971 50 234 5678',
        has_gcc: true,
        isPremium: false,
        keywords: ['Strict', 'Female Only'],
        compliance: { kyc_status: 'completed', aml_status: 'completed', pep_status: 'clear', verified: true },
        created_at: '2025-01-05T00:00:00Z',
        updated_at: '2025-01-05T00:00:00Z'
    },
    { 
        id: 'CMP_Blu_001', 
        name: 'BlueSky Assets Mgt', 
        email: 'corporate@bluesky.ae', 
        role: 'landlord', 
        authTier: 2, 
        isUaePassVerified: true, 
        gccScore: 90, 
        bio: 'Corporate entity managing premium shared living spaces.',
        avatar: 'https://ui-avatars.com/api/?name=BlueSky+Assets&background=38B6FF&color=fff',
        phone: '+971 4 800 2583',
        has_gcc: true,
        isPremium: true,
        keywords: ['Corporate', 'Managed'],
        compliance: { kyc_status: 'completed', aml_status: 'completed', pep_status: 'clear', verified: true },
        created_at: '2024-12-10T00:00:00Z',
        updated_at: '2024-12-10T00:00:00Z'
    },
    { 
        id: 'LND_Nad_001', 
        name: 'Nadia Mansour', 
        email: 'nadia@example.com', 
        role: 'landlord', 
        authTier: 1, 
        isUaePassVerified: false, 
        gccScore: 85, 
        bio: 'Application in progress.',
        avatar: 'https://ui-avatars.com/api/?name=Nadia+Mansour&background=FF5757&color=fff',
        phone: '+971 50 345 6789',
        has_gcc: false,
        isPremium: false,
        keywords: ['New', 'Downtown'],
        compliance: { kyc_status: 'pending', aml_status: 'pending', pep_status: 'pending', verified: false },
        created_at: '2026-02-01T00:00:00Z',
        updated_at: '2026-02-01T00:00:00Z',
    },
    { 
        id: 'LTA_Kha_001', 
        name: 'Khalid Al Rashid', 
        email: 'khalid@eliterealty.ae', 
        role: 'agent', 
        authTier: 2, 
        isUaePassVerified: true, 
        bio: 'Luxury real estate specialist.',
        rera_license: 'BRN-88231', 
        agency_name: 'Elite Dubai Realty',
        avatar: 'https://ui-avatars.com/api/?name=Khalid+Al+Rashid&background=000000&color=fff',
        phone: '+971 52 987 6543',
        has_gcc: false,
        gccScore: 0,
        isPremium: true,
        keywords: ['RERA Certified', 'Marina'],
        compliance: { kyc_status: 'completed', aml_status: 'completed', pep_status: 'clear', verified: true },
        created_at: '2024-11-15T00:00:00Z',
        updated_at: '2024-11-15T00:00:00Z'
    },
    { 
        id: 'LTA_Tar_001', 
        name: 'Tariq Mahmood', 
        email: 'tariq@example.com', 
        role: 'agent', 
        authTier: 2, 
        isUaePassVerified: true, 
        bio: 'Business Bay and JLT expert.',
        rera_license: 'BRN-11204', 
        agency_name: 'Business Bay Brokers',
        avatar: 'https://ui-avatars.com/api/?name=Tariq+Mahmood&background=FFC000&color=000',
        phone: '+971 55 111 2233',
        has_gcc: false,
        gccScore: 0,
        isPremium: false,
        keywords: ['Reliable', 'Negotiator'],
        compliance: { kyc_status: 'completed', aml_status: 'completed', pep_status: 'clear', verified: true },
        created_at: '2025-02-20T00:00:00Z',
        updated_at: '2025-02-20T00:00:00Z'
    },
    { 
        id: 'LTA_Ele_001', 
        name: 'Elena Popova', 
        email: 'elena@bluesky.ae', 
        role: 'agent', 
        authTier: 2, 
        isUaePassVerified: true, 
        bio: 'Portfolio manager for corporate assets.',
        rera_license: 'BRN-44901', 
        agency_name: 'BlueSky Assets Mgt',
        avatar: 'https://ui-avatars.com/api/?name=Elena+Popova&background=38B6FF&color=fff',
        phone: '+971 4 222 3344',
        has_gcc: false,
        gccScore: 0,
        isPremium: true,
        keywords: ['Professional', 'Efficient'],
        compliance: { kyc_status: 'completed', aml_status: 'completed', pep_status: 'clear', verified: true },
        created_at: '2024-12-11T00:00:00Z',
        updated_at: '2024-12-11T00:00:00Z'
    },
    { 
        id: 'T_Priya_001', 
        name: 'Priya Sharma', 
        email: 'priya@example.com', 
        role: 'roommate', 
        authTier: 2, 
        isUaePassVerified: true, 
        gccScore: 96, 
        bio: 'Software engineer seeking quiet, high-trust environment.',
        keywords: ['Software Engineer', 'Quiet', 'Clean'],
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        phone: '+971 56 333 4455',
        has_gcc: true,
        isPremium: true,
        compliance: { kyc_status: 'completed', aml_status: 'completed', pep_status: 'clear', verified: true },
        created_at: '2025-06-01T00:00:00Z',
        updated_at: '2025-06-01T00:00:00Z'
    },
    { 
        id: 'T_Marcus_001', 
        name: 'Marcus Chen', 
        email: 'marcus@example.com', 
        role: 'roommate', 
        authTier: 2, 
        isUaePassVerified: true, 
        gccScore: 92, 
        bio: 'Data analyst, fitness focused.',
        keywords: ['Data Analyst', 'Gym enthusiast'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        phone: '+971 56 444 5566',
        has_gcc: true,
        isPremium: false,
        compliance: { kyc_status: 'completed', aml_status: 'completed', pep_status: 'clear', verified: true },
        created_at: '2025-07-15T00:00:00Z',
        updated_at: '2025-07-15T00:00:00Z'
    },
    { 
        id: 'T_Elena_001', 
        name: 'Elena Rodriguez', 
        email: 'elena.r@example.com', 
        role: 'roommate', 
        authTier: 2, 
        isUaePassVerified: true, 
        gccScore: 89, 
        bio: 'Creative director, loves communal living.',
        keywords: ['Creative Director', 'Social'],
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
        phone: '+971 58 555 6677',
        has_gcc: true,
        isPremium: true,
        compliance: { kyc_status: 'completed', aml_status: 'completed', pep_status: 'clear', verified: true },
        created_at: '2025-08-01T00:00:00Z',
        updated_at: '2025-08-01T00:00:00Z'
    },
    { 
        id: 'T_Aisha_001', 
        name: 'Aisha Patel', 
        email: 'aisha@example.com', 
        role: 'roommate', 
        authTier: 2, 
        isUaePassVerified: true, 
        gccScore: 97, 
        bio: 'Medical resident, night shift worker.',
        keywords: ['Medical Resident', 'Night Shift'],
        avatar: 'https://ui-avatars.com/api/?name=Aisha+Patel&background=FF8C00&color=fff',
        phone: '+971 50 666 7788',
        has_gcc: true,
        isPremium: false,
        compliance: { kyc_status: 'completed', aml_status: 'completed', pep_status: 'clear', verified: true },
        created_at: '2025-03-10T00:00:00Z',
        updated_at: '2025-03-10T00:00:00Z'
    },
    { 
        id: 'U_James_001', 
        name: 'James Morrison', 
        email: 'james@example.com', 
        role: 'roommate', 
        authTier: 2, 
        isUaePassVerified: true, 
        gccScore: 85, 
        bio: 'Executive relocated from London.',
        keywords: ['Executive', 'Downtown'],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
        phone: '+971 52 777 8899',
        has_gcc: true,
        isPremium: true,
        compliance: { kyc_status: 'completed', aml_status: 'completed', pep_status: 'clear', verified: true },
        created_at: '2026-03-01T00:00:00Z',
        updated_at: '2026-03-01T00:00:00Z'
    },
    { 
        id: 'U_Yuki_001', 
        name: 'Yuki Tanaka', 
        email: 'yuki@example.com', 
        role: 'roommate', 
        authTier: 1, 
        isUaePassVerified: false, 
        gccScore: 0,
        bio: 'New expat starting career in JLT.',
        keywords: ['New Expat', 'JLT'],
        avatar: 'https://ui-avatars.com/api/?name=Yuki+Tanaka&background=00A0A0&color=fff',
        phone: '+971 54 888 9900',
        has_gcc: false,
        compliance: { kyc_status: 'pending', aml_status: 'pending', pep_status: 'pending', verified: false },
        created_at: '2026-03-14T00:00:00Z',
        updated_at: '2026-03-14T00:00:00Z',
        isPremium: false
    }
];

/**
 * 🏠 Master Listings (RERA & Municipality Compliant)
 */
export const listings: Listing[] = [
    {
        id: 'PRP_Ahm_001',
        title: 'Marina Gate T1',
        description: 'Premium executive shared suite. Strictly regulated under Law No. 4.',
        landlord_id: 'LND_Ahm_001',
        letting_agent_id: 'LTA_Kha_001',
        rent_per_room: 2800,
        deposit: 2800,
        address: 'Marina Gate Tower 1',
        district: 'Dubai Marina',
        makaniNumber: '11223 34455',
        isApiVerified: true,
        maxLegalOccupancy: 4,
        currentOccupants: 2,
        available_rooms: 2,
        amenities: ['Gym', 'Pool'],
        house_rules: ['No smoking', 'No pets', 'Working professionals only'],
        bills_included: true,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
        current_roommates: ['T_Priya_001', 'T_Marcus_001'],
        occupancy_status: [
            { room_number: 1, status: 'occupied', tenant_id: 'T_Priya_001' },
            { room_number: 2, status: 'occupied', tenant_id: 'T_Marcus_001' },
            { room_number: 3, status: 'available', tenant_id: null },
            { room_number: 4, status: 'available', tenant_id: null }
        ],
        isActive: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'PRP_Ahm_002',
        title: 'Burj Vista Executive',
        description: 'High floor luxury living.',
        landlord_id: 'LND_Ahm_001',
        letting_agent_id: 'LTA_Kha_001',
        rent_per_room: 3500,
        deposit: 3500,
        address: 'Burj Vista Tower',
        district: 'Downtown Dubai',
        makaniNumber: '55667 88990',
        isApiVerified: true,
        maxLegalOccupancy: 3,
        currentOccupants: 1,
        available_rooms: 2,
        amenities: ['Burj View', 'Metro Link'],
        house_rules: ['Quiet hours 10pm-7am', 'No guests after midnight'],
        bills_included: true,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1e52409818?auto=format&fit=crop&q=80&w=800'],
        current_roommates: ['T_Elena_001'],
        occupancy_status: [
            { room_number: 1, status: 'occupied', tenant_id: 'T_Elena_001' },
            { room_number: 2, status: 'available', tenant_id: null },
            { room_number: 3, status: 'available', tenant_id: null }
        ],
        isActive: true,
        created_at: '2025-01-10T00:00:00Z',
        updated_at: '2025-01-10T00:00:00Z'
    },
    {
        id: 'PRP_Fat_001',
        title: 'JLT Cluster D',
        description: 'Quiet professional household.',
        landlord_id: 'LND_Fat_001',
        letting_agent_id: 'LTA_Tar_001',
        rent_per_room: 1200,
        deposit: 1200,
        address: 'Lake Terrace',
        district: 'JLT',
        makaniNumber: '22334 45566',
        isApiVerified: true,
        maxLegalOccupancy: 3,
        currentOccupants: 2,
        available_rooms: 1,
        amenities: ['Metro Access'],
        house_rules: ['Strict cleanliness', 'Female only Preferred', 'Stable employment'],
        bills_included: false,
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'],
        current_roommates: ['T_Aisha_001'],
        occupancy_status: [
            { room_number: 1, status: 'occupied', tenant_id: 'T_Aisha_001' },
            { room_number: 2, status: 'occupied', tenant_id: 'Mock_User_0' },
            { room_number: 3, status: 'available', tenant_id: null }
        ],
        isActive: true,
        created_at: '2025-02-01T00:00:00Z',
        updated_at: '2025-02-01T00:00:00Z'
    },
    {
        id: 'PRP_Fat_002',
        title: 'Executive Towers Shared',
        description: 'Business Bay co-living.',
        landlord_id: 'LND_Fat_001',
        letting_agent_id: 'LTA_Tar_001',
        rent_per_room: 1800,
        deposit: 1800,
        address: 'Executive Towers',
        district: 'Business Bay',
        makaniNumber: '99887 66554',
        isApiVerified: true,
        maxLegalOccupancy: 2,
        currentOccupants: 2,
        available_rooms: 0,
        amenities: ['Mall Access'],
        house_rules: ['No loud music', 'Recycling required'],
        bills_included: true,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
        current_roommates: [],
        occupancy_status: [
            { room_number: 1, status: 'occupied', tenant_id: 'Mock_Raj' },
            { room_number: 2, status: 'occupied', tenant_id: 'Mock_User_1' }
        ],
        isActive: false,
        created_at: '2025-02-05T00:00:00Z',
        updated_at: '2025-02-05T00:00:00Z'
    },
    {
        id: 'CMP_Blu_001_A',
        title: 'BlueSky Suite A',
        description: 'Corporate managed premium space.',
        landlord_id: 'CMP_Blu_001',
        letting_agent_id: 'LTA_Ele_001',
        rent_per_room: 3200,
        deposit: 3200,
        address: 'BlueSky Tower',
        district: 'Business Bay',
        makaniNumber: '33445 56677',
        isApiVerified: true,
        maxLegalOccupancy: 4,
        currentOccupants: 3,
        available_rooms: 1,
        amenities: ['Weekly Cleaning'],
        house_rules: ['Professional conduct', 'Workspace priority'],
        bills_included: true,
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'],
        current_roommates: [],
        occupancy_status: [
            { room_number: 1, status: 'occupied', tenant_id: 'MockUser2' },
            { room_number: 2, status: 'occupied', tenant_id: 'MockUser3' },
            { room_number: 3, status: 'occupied', tenant_id: 'MockUser4' },
            { room_number: 4, status: 'available', tenant_id: null }
        ],
        isActive: true,
        created_at: '2024-12-15T00:00:00Z',
        updated_at: '2024-12-15T00:00:00Z'
    }
];

/**
 * 📅 Viewing Bookings (Searching User Activity)
 */
export const viewingBookings: ViewingBooking[] = [
    { 
        id: 'VW_001', 
        property_id: 'PRP_Ahm_001',
        searcher_id: 'U_James_001',
        status: 'PENDING', 
        requested_date: '2026-03-20T10:00:00Z',
        hold_amount: 50,
        landlord_id: 'LND_Ahm_001',
        time_slot: '10:00 AM',
        landlord_agreed_penalty: true,
        created_at: '2026-03-14T00:00:00Z',
        updated_at: '2026-03-14T00:00:00Z'
    },
    { 
        id: 'VW_002', 
        property_id: 'CMP_Blu_001_A', 
        searcher_id: 'U_James_001', 
        status: 'ACCEPTED', 
        requested_date: '2026-03-21T14:00:00Z',
        hold_amount: 50,
        landlord_id: 'CMP_Blu_001',
        time_slot: '2:00 PM',
        landlord_agreed_penalty: true,
        created_at: '2026-03-14T00:00:00Z',
        updated_at: '2026-03-14T00:00:00Z'
    },
    { 
        id: 'VW_003', 
        property_id: 'PRP_Fat_001', 
        searcher_id: 'U_Yuki_001', 
        status: 'PENDING', 
        requested_date: '2026-03-22T09:00:00Z',
        hold_amount: 0,
        landlord_id: 'LND_Fat_001',
        time_slot: '9:00 AM',
        landlord_agreed_penalty: false,
        created_at: '2026-03-15T00:00:00Z',
        updated_at: '2026-03-15T00:00:00Z'
    }
];

/**
 * 💸 Transactions & RERA Escrow Ledger
 */
export const payments: Payment[] = [
    {
        id: 'PAY_001',
        listing_id: 'PRP_Ahm_001',
        payer_id: 'T_Priya_001',
        payee_id: 'LND_Ahm_001',
        type: 'rent',
        amount: 2800,
        due_date: '2026-04-01T00:00:00Z',
        status: 'pending',
        method: 'card',
        reference: 'RENT-APR-001',
        created_at: '2026-03-15T00:00:00Z',
        updated_at: '2026-03-15T00:00:00Z'
    }
];

export const maintenanceTickets: MaintenanceTicket[] = [];
export const rentLedgers: RentLedger[] = [];
export const chatChannels: ChatChannel[] = [];
export const chatMessages: ChatMessage[] = [];
export const complianceChecks: ComplianceCheck[] = [];
export const applications: Application[] = [];

/**
 * 🔍 Direct Access Helpers
 */
export const getPropertyById = async (id: string) => listings.find(l => l.id === id) || null;
export const getUserById = async (id: string) => users.find(u => u.id === id) || null;
