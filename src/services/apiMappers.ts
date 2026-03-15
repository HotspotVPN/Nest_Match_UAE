import type { Listing, User } from '@/types';

// 1) Types that match your mock API JSON
export interface ApiRoomListing {
  id: string;
  title: string;
  description?: string;
  city: string;
  district: string;
  building_name?: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  room_type: 'studio' | 'partition' | 'regular_room' | 'master_room' | 'bed_space';
  rent_per_month_aed: number;
  rent_frequency: 'monthly' | 'yearly' | 'flexible';
  bills_included: boolean;
  bills_breakdown?: string;
  security_deposit_aed: number;
  available_from: string;
  minimum_contract_months: number;
  gender_preference: 'any' | 'female_only' | 'male_only';
  nationality_preference?: string;
  amenities?: string[];
  furnishing?: 'unfurnished' | 'semi_furnished' | 'fully_furnished';
  current_roommate_count: number;
  max_legal_occupancy: number;
  roommate_ids: string[];
  is_premium: boolean;
  is_bookable: boolean;
  listing_status: 'draft' | 'active' | 'at_capacity' | 'suspended';
  makani_number?: string;
  municipality_permit?: string;
  trakheesi_permit?: string;
  is_permit_verified?: boolean;
  compliance_state?: 'compliant' | 'over_capacity' | 'missing_permit' | 'unverified_api';
}

export interface ApiRoommateProfile {
  id: string;
  full_name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  occupation?: string;
  company?: string;
  budget_min_aed?: number;
  budget_max_aed?: number;
  preferred_districts?: string[];
  lifestyle_tags?: string[];
  sleep_schedule?: string;
  guests_policy?: string;
  gcc_score?: number;
  gcc_tier?: 'Bronze' | 'Silver' | 'Gold';
  uae_pass_verified?: boolean;
  current_listing_id?: string | null;
}

/**
 * Map ApiRoomListing -> existing Listing type
 * NOTE: Fill fields your API doesn’t know about with safe defaults for demo.
 */
export function mapApiRoomListingToListing(api: ApiRoomListing): Listing {
  const now = new Date().toISOString();

  // Handle both the new API schema and existing mock data fields
  const isAtCapacity = api.listing_status === 'at_capacity';
  const isOverCapacity = api.compliance_state === 'over_capacity';
  
  const isActive = api.listing_status 
    ? (api.listing_status === 'active' && !isAtCapacity && !isOverCapacity)
    : ((api as any).isActive ?? true);

  const currentOccupants = api.current_roommate_count ?? (api as any).currentOccupants ?? 0;
  const maxLegalOccupancy = api.max_legal_occupancy ?? (api as any).maxLegalOccupancy ?? 2;

  return {
    id: api.id,
    landlord_id: (api as any).landlord_id || 'landlord-1', // Fallback for demo
    letting_agent_id: (api as any).letting_agent_id,

    title: api.title,
    address: api.address,
    district: api.district || (api as any).district,

    rent_per_room: api.rent_per_month_aed ?? (api as any).rent_per_room ?? 0,
    total_rooms: Math.max(1, maxLegalOccupancy),
    available_rooms: api.listing_status === 'at_capacity' ? 0 : (Math.max(0, maxLegalOccupancy - currentOccupants)),

    images: (api as any).images || [],

    description: api.description || (api as any).description || '',
    amenities: api.amenities || (api as any).amenities || [],
    house_rules: (api as any).house_rules || [],

    bills_included: api.bills_included ?? (api as any).bills_included ?? false,
    bills_breakdown: api.bills_breakdown || (api as any).bills_breakdown,
    deposit: api.security_deposit_aed ?? (api as any).deposit ?? 0,

    current_roommates: api.roommate_ids || (api as any).current_roommates || [],
    occupancy_status: (api as any).occupancy_status || [],

    tags: api.room_type ? [api.room_type, api.furnishing || ''].filter(Boolean) : ((api as any).tags || []),

    makaniNumber: api.makani_number || (api as any).makaniNumber || '',
    trakheesiPermit: api.trakheesi_permit || (api as any).trakheesiPermit || '',
    municipalityPermit: api.municipality_permit || (api as any).municipalityPermit || '',
    maxLegalOccupancy,
    currentOccupants,
    isActive,
    isApiVerified: !!(api.is_permit_verified ?? (api as any).isApiVerified),

    transport_chips: (api as any).transport_chips || [],

    financial_ledger: (api as any).financial_ledger,
    rera_escrow_verified: !!(api as any).rera_escrow_verified,

    location: api.coordinates
      ? {
          lat: api.coordinates.lat,
          lng: api.coordinates.lng,
          nearby_amenities: [],
        }
      : (api as any).location,

    rating: (api as any).rating,
    total_reviews: (api as any).total_reviews,
    property_ratings: (api as any).property_ratings || [],

    created_at: (api as any).created_at || now,
    updated_at: (api as any).updated_at || now,
  };
}

/**
 * Map ApiRoommateProfile -> existing User type (roommate)
 * This is a “thin” mapping for demo purposes.
 */
export function mapApiRoommateToUser(api: ApiRoommateProfile): User {
  const now = new Date().toISOString();

  return {
    id: api.id,
    type: (api as any).type || 'roommate',
    auth_method: (api as any).auth_method || 'email',
    uaePassId: (api as any).uaePassId,
    emiratesId: (api as any).emiratesId,
    isUaePassVerified: api.uae_pass_verified ?? (api as any).isUaePassVerified ?? false,
    isIdVerified: (api as any).isIdVerified ?? false,

    name: api.full_name,
    email: `${api.id}@example.com`,
    avatar: '',
    bio: api.occupation
      ? `${api.occupation} at ${api.company || 'UAE company'}.`
      : 'Roommate looking for a compliant shared home in Dubai.',
    keywords: [],

    compliance: {
      kyc_status: api.uae_pass_verified ? 'completed' : 'pending',
      aml_status: api.uae_pass_verified ? 'completed' : 'pending',
      pep_status: 'clear',
      verified: !!api.uae_pass_verified,
    },

    phone: '+971500000000',
    linkedin_url: undefined,
    instagram_handle: undefined,
    rating: undefined,
    total_reviews: undefined,

    is_verified: !!api.uae_pass_verified,
    resident_role: 'searching',
    has_gcc: (api.gcc_score || 0) >= 60,
    gccScore: Math.round((api.gcc_score || 0) * 20), // convert 0–5 to 0–100 if needed
    isPremium: api.gcc_tier === 'Gold',

    tenancy_duration_months: undefined,
    gcc_eligible_date: undefined,

    preferences: {
      budget_min: api.budget_min_aed || 2000,
      budget_max: api.budget_max_aed || 4000,
      move_in_date: new Date().toISOString().slice(0, 10),
      duration: '12_months',
      schedule: 'varies',
      location_keywords: api.preferred_districts || [],
      lifestyle_keywords: api.lifestyle_tags || [],
    },

    current_house_id: api.current_listing_id || undefined,
    rent_monthly: undefined,
    deposit: undefined,
    direct_debit: undefined,
    good_conduct_certificate: undefined,

    lifestyle_tags: api.lifestyle_tags || [],
    personality_traits: [],
    hobbies: [],
    local_recommendations: [],

    bank_details: undefined,
    deposits: undefined,
    monthly_income: undefined,
    managed_by_agent: undefined,

    agency_name: undefined,
    rera_license: undefined,
    managed_landlords: undefined,
    managed_properties: undefined,
    commission_rate: undefined,

    kyc_steps: [],
    is_paid: false,
    bank_linked: false,
    has_secure_deposit: false,
    verified_income: undefined,

    created_at: now,
    updated_at: now,
  };
}
