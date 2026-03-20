import type { Listing, User, PropertyRating } from '@/types';
import { listings as mockListings } from '@/data/mockData';

/**
 * Robust JSON parser for SQLite fields which are stored as text.
 */
function safeJsonParse<T>(data: any, fallback: T): T {
  if (!data) return fallback;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn("MAPPING_ERROR: Failed to parse JSON string:", data);
      return fallback;
    }
  }
  return data as T;
}

// 1) Types that match your Cloudflare D1 (SQLite) Schema exactly
export interface ApiRoomListing {
  id: string;
  landlord_id: string;
  agent_id?: string;
  title: string;
  address: string;
  district: string;
  makani_number: string;
  trakheesi_permit?: string;
  municipality_permit?: string;
  max_legal_occupancy: number;
  current_occupants: number;
  is_api_verified: number; // SQLite boolean (0 or 1)
  is_active: number;
  rent_per_room: number;
  deposit: number;
  total_rooms: number;
  available_rooms: number;
  description?: string;
  amenities: string | string[];     // JSON Array in D1
  house_rules: string | string[];   // JSON Array in D1
  tags: string | string[];          // JSON Array in D1
  bills_included: number;
  bills_breakdown?: string;
  transport_chips?: string | any[]; // JSON Array in D1
  location_lat?: number;
  location_lng?: number;
  location_data?: string | any;     // JSON Object in D1
  rera_escrow_verified: number;
  created_at: string;
  updated_at: string;
}

export interface ApiRoommateProfile {
  id: string;
  email: string;
  uae_pass_id?: string;
  emirates_id?: string;
  is_uae_pass_verified: number;
  is_id_verified: number;
  role: string;
  name: string;
  phone?: string;
  avatar_key?: string;
  bio?: string;
  lifestyle_tags?: string | string[];     // JSON Array
  personality_traits?: string | string[]; // JSON Array
  hobbies?: string | string[];            // JSON Array
  keywords?: string | string[];           // JSON Array
  gcc_score: number;
  is_premium: number;
  bank_linked: number;
  kyc_status: 'pending' | 'completed' | 'rejected';
  aml_status: 'pending' | 'completed' | 'rejected';
  pep_status: 'pending' | 'clear' | 'failed';
  compliance_verified: number;
  resident_role?: 'searching' | 'residing';
  preferences?: string | any;             // JSON Object
  current_property_id?: string;
  rent_monthly?: number;
  deposit?: number;
  bank_details?: string | any;            // JSON Object
  created_at: string;
  updated_at: string;
}

/**
 * mapApiRoomListingToListing
 * Precisely bridges D1 snake_case SQLite results to Frontend camelCase Listing type.
 */
export function mapApiRoomListingToListing(api: ApiRoomListing): Listing {
  // Use API images if available, otherwise fall back to mock data images for the same property ID
  const apiImages = (api as any).images;
  const images = (apiImages && apiImages.length > 0)
    ? apiImages
    : (mockListings.find(m => m.id === api.id)?.images || []);

  return {
    id: api.id,
    landlord_id: api.landlord_id,
    letting_agent_id: api.agent_id,

    title: api.title,
    address: api.address,
    district: api.district,

    rent_per_room: api.rent_per_room,
    total_rooms: api.total_rooms,
    available_rooms: api.available_rooms,

    images: images,

    description: api.description || '',
    amenities: safeJsonParse<string[]>(api.amenities, []),
    house_rules: safeJsonParse<string[]>(api.house_rules, []),

    bills_included: Boolean(api.bills_included),
    bills_breakdown: api.bills_breakdown,
    deposit: api.deposit,

    current_roommates: mockListings.find(m => m.id === api.id)?.current_roommates || [],
    occupancy_status: mockListings.find(m => m.id === api.id)?.occupancy_status || [],

    tags: safeJsonParse<string[]>(api.tags, []),

    makaniNumber: api.makani_number,
    trakheesiPermit: api.trakheesi_permit || '',
    municipalityPermit: api.municipality_permit || '',
    maxLegalOccupancy: api.max_legal_occupancy,
    currentOccupants: api.current_occupants,
    isActive: Boolean(api.is_active),
    isApiVerified: Boolean(api.is_api_verified),

    transport_chips: safeJsonParse<any[]>(api.transport_chips, []),

    financial_ledger: undefined,
    rera_escrow_verified: Boolean(api.rera_escrow_verified),

    location: {
      lat: api.location_lat || 25.07, // Marina default
      lng: api.location_lng || 55.13,
      nearby_amenities: [],
      ...safeJsonParse<any>(api.location_data, {})
    },

    rating: (api as any).rating,
    total_reviews: (api as any).total_reviews,
    property_ratings: (api as any).property_ratings || [],

    created_at: api.created_at,
    updated_at: api.updated_at,
  };
}

/**
 * mapApiRoommateToUser
 * Maps D1 User table row back to the Frontend User type.
 */
export function mapApiRoommateToUser(api: ApiRoommateProfile): User {
  const prefs = safeJsonParse<any>(api.preferences, {});

  return {
    id: api.id,
    type: (api.role.includes('ADMIN') ? 'operations' : 
          api.role === 'LANDLORD' ? 'landlord' : 
          api.role === 'AGENT' ? 'letting_agent' : 'roommate') as any,
    auth_method: api.uae_pass_id ? 'uae_pass' : 'email',
    uaePassId: api.uae_pass_id,
    emiratesId: api.emirates_id,
    isUaePassVerified: Boolean(api.is_uae_pass_verified),
    isIdVerified: Boolean(api.is_id_verified),
    verification_tier: api.is_uae_pass_verified ? 'tier2_uae_pass' as const : api.is_id_verified ? 'tier0_passport' as const : 'tier1_unverified' as const,

    name: api.name,
    email: api.email,
    avatar: api.avatar_key || '', // R2 path
    bio: api.bio || '',
    keywords: safeJsonParse<string[]>(api.keywords, []),

    compliance: {
      kyc_status: api.kyc_status,
      aml_status: api.aml_status,
      pep_status: api.pep_status,
      verified: Boolean(api.compliance_verified),
    },

    phone: api.phone || '',
    is_verified: Boolean(api.compliance_verified),
    resident_role: api.resident_role || 'searching',
    has_gcc: (api.gcc_score || 0) >= 80,
    gccScore: api.gcc_score || 0,
    isPremium: Boolean(api.is_premium),

    preferences: {
      budget_min: prefs.budget_min || 0,
      budget_max: prefs.budget_max || 10000,
      move_in_date: prefs.move_in_date || '',
      duration: prefs.duration || 'flexible',
      schedule: prefs.schedule || 'varies',
      location_keywords: prefs.location_keywords || [],
      lifestyle_keywords: prefs.lifestyle_keywords || [],
    },

    current_house_id: api.current_property_id,
    rent_monthly: api.rent_monthly,
    deposit: api.deposit,
    bank_details: safeJsonParse<any>(api.bank_details, undefined),

    lifestyle_tags: safeJsonParse<string[]>(api.lifestyle_tags, []),
    personality_traits: safeJsonParse<string[]>(api.personality_traits, []),
    hobbies: safeJsonParse<string[]>(api.hobbies, []),

    created_at: api.created_at || new Date().toISOString(),
    updated_at: api.updated_at || new Date().toISOString(),
  };
}
