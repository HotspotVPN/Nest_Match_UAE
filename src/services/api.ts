import { mapApiRoomListingToListing, mapApiRoommateToUser } from './apiMappers';
import type { ApiRoomListing, ApiRoommateProfile } from './apiMappers';
import type { Listing, User, ViewingBooking, Payment, PropertyRating } from '@/types';
import {
    users as mockUsers, listings as mockListings, viewingBookings as mockViewings,
    payments as mockPayments, propertyRatings as mockRatings,
    getUserById as mockGetUserById, getListingById as mockGetListingById,
    getViewingsForUser as mockGetViewingsForUser, getPaymentsForUser as mockGetPaymentsForUser,
} from '@/data/mockData';

// ─── Configuration ───────────────────────────────────────────
// Production: Cloudflare Workers endpoint
// Dev: local wrangler dev server
export const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://nest-match-uae.pushkar-nagela.workers.dev';

// Track whether the backend is reachable (avoids repeated failed fetches)
let backendAvailable: boolean | null = null;
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30_000; // Re-check every 30s

// ─── Helpers ─────────────────────────────────────────────────
function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('nestmatch_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}

async function checkBackend(): Promise<boolean> {
    const now = Date.now();
    if (backendAvailable !== null && now - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
        return backendAvailable;
    }
    try {
        const res = await fetch(`${API_BASE_URL}/`, { signal: AbortSignal.timeout(3000) });
        backendAvailable = res.ok;
    } catch {
        backendAvailable = false;
    }
    lastHealthCheck = now;
    return backendAvailable;
}

/** Generic fetch with timeout, auth, and error handling */
async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers: { ...getAuthHeaders(), ...options.headers },
            signal: options.signal ?? AbortSignal.timeout(8000),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            return { ok: false, error: body.error || `HTTP ${res.status}` };
        }
        const data = await res.json();
        return { ok: true, data };
    } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
    }
}

// ─── Properties ──────────────────────────────────────────────
export const api = {
    // ── Properties ───────────────────────────────────────────
    getProperties: async (filters?: {
        district?: string;
        maxBudget?: number;
        search?: string;
    }): Promise<Listing[]> => {
        const isUp = await checkBackend();
        if (!isUp) return mockListings;

        const params = new URLSearchParams();
        if (filters?.district) params.set('district', filters.district);
        if (filters?.maxBudget) params.set('maxBudget', String(filters.maxBudget));
        if (filters?.search) params.set('search', filters.search);
        const qs = params.toString() ? `?${params}` : '';

        const res = await apiFetch<ApiRoomListing[]>(`/api/properties${qs}`);
        if (!res.ok) return mockListings;
        return res.data.map(mapApiRoomListingToListing);
    },

    getPropertyById: async (id: string): Promise<Listing | null> => {
        const isUp = await checkBackend();
        if (!isUp) return mockGetListingById(id) ?? null;

        const res = await apiFetch<ApiRoomListing>(`/api/properties/${id}`);
        if (!res.ok) return mockGetListingById(id) ?? null;
        return mapApiRoomListingToListing(res.data);
    },

    createProperty: async (data: Partial<Listing>): Promise<{ success: boolean; id?: string; error?: string }> => {
        const res = await apiFetch<{ success: boolean; id: string }>('/api/properties', {
            method: 'POST',
            body: JSON.stringify({
                title: data.title,
                address: data.address,
                district: data.district,
                makani_number: data.makaniNumber,
                municipality_permit: data.municipalityPermit,
                trakheesi_permit: data.trakheesiPermit,
                max_legal_occupancy: data.maxLegalOccupancy,
                rent_per_room: data.rent_per_room,
                deposit: data.deposit,
                total_rooms: data.total_rooms,
                available_rooms: data.available_rooms,
                description: data.description,
                amenities: JSON.stringify(data.amenities || []),
                house_rules: JSON.stringify(data.house_rules || []),
                bills_included: data.bills_included ? 1 : 0,
            }),
        });
        if (!res.ok) return { success: false, error: res.error };
        return { success: true, id: res.data.id };
    },

    // ── Users ────────────────────────────────────────────────
    getUsers: async (): Promise<User[]> => {
        const isUp = await checkBackend();
        if (!isUp) return mockUsers;

        const res = await apiFetch<ApiRoommateProfile[]>('/api/users');
        if (!res.ok) return mockUsers;
        return res.data.map(mapApiRoommateToUser);
    },

    getUserById: async (id: string): Promise<User | null> => {
        const isUp = await checkBackend();
        if (!isUp) return mockGetUserById(id) ?? null;

        const res = await apiFetch<ApiRoommateProfile>(`/api/users/${id}`);
        if (!res.ok) return mockGetUserById(id) ?? null;
        return mapApiRoommateToUser(res.data);
    },

    getMyProfile: async (): Promise<User | null> => {
        const res = await apiFetch<ApiRoommateProfile>('/api/users/me');
        if (!res.ok) return null;
        return mapApiRoommateToUser(res.data);
    },

    updateMyProfile: async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
        const res = await apiFetch<{ success: boolean }>('/api/users/me', {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
        if (!res.ok) return { success: false, error: res.error };
        return { success: true };
    },

    // ── Auth ─────────────────────────────────────────────────
    login: async (email: string, password = 'pass123'): Promise<{
        success: boolean;
        token?: string;
        user?: { id: string; email: string; role: string; tier: number };
        error?: string;
    }> => {
        const res = await apiFetch<{ token: string; user: { id: string; email: string; role: string; tier: number } }>(
            '/api/auth/login',
            { method: 'POST', body: JSON.stringify({ email, password }) },
        );
        if (!res.ok) return { success: false, error: res.error };
        localStorage.setItem('nestmatch_token', res.data.token);
        return { success: true, token: res.data.token, user: res.data.user };
    },

    register: async (data: { email: string; password: string; name: string; role?: string }): Promise<{
        success: boolean; userId?: string; error?: string;
    }> => {
        const res = await apiFetch<{ success: boolean; userId: string }>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!res.ok) return { success: false, error: res.error };
        return { success: true, userId: res.data.userId };
    },

    uaePassCallback: async (code: string): Promise<{
        success: boolean; token?: string; user?: any; error?: string;
    }> => {
        const res = await apiFetch<{ token: string; user: any }>('/api/auth/uaepass-callback', {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
        if (!res.ok) return { success: false, error: res.error };
        localStorage.setItem('nestmatch_token', res.data.token);
        return { success: true, token: res.data.token, user: res.data.user };
    },

    getSession: async (): Promise<User | null> => {
        const token = localStorage.getItem('nestmatch_token');
        if (!token) return null;
        const res = await apiFetch<any>('/api/auth/me');
        if (!res.ok) return null;
        return res.data;
    },

    // ── Viewings ─────────────────────────────────────────────
    getViewings: async (userId?: string): Promise<ViewingBooking[]> => {
        const isUp = await checkBackend();
        if (!isUp) return userId ? mockGetViewingsForUser(userId) : mockViewings;

        const res = await apiFetch<any[]>('/api/viewings');
        if (!res.ok) return userId ? mockGetViewingsForUser(userId) : mockViewings;

        return res.data.map((v: any) => ({
            id: v.id,
            property_id: v.property_id,
            searcher_id: v.tenant_id || v.searcher_id,
            landlord_id: v.landlord_id,
            requested_date: v.scheduled_date || v.requested_date,
            time_slot: v.time_slot,
            status: v.status as ViewingBooking['status'],
            resolution_date: v.resolution_date,
            created_at: v.created_at,
            updated_at: v.updated_at,
        }));
    },

    createViewing: async (data: {
        property_id: string;
        scheduled_date: string;
        time_slot: string;
    }): Promise<{ success: boolean; id?: string; error?: string }> => {
        const res = await apiFetch<{ success: boolean; id: string; holdStatus: string }>(
            '/api/viewings',
            { method: 'POST', body: JSON.stringify(data) },
        );
        if (!res.ok) return { success: false, error: res.error };
        return { success: true, id: res.data.id };
    },

    acceptViewing: async (id: string): Promise<{ success: boolean; error?: string }> => {
        const res = await apiFetch<{ success: boolean }>(`/api/viewings/${id}/accept`, { method: 'PATCH' });
        if (!res.ok) return { success: false, error: res.error };
        return { success: true };
    },

    declineViewing: async (id: string): Promise<{ success: boolean; error?: string }> => {
        const res = await apiFetch<{ success: boolean }>(`/api/viewings/${id}/decline`, { method: 'PATCH' });
        if (!res.ok) return { success: false, error: res.error };
        return { success: true };
    },

    // ── Ratings ──────────────────────────────────────────────
    getPropertyRatings: async (propertyId: string): Promise<PropertyRating[]> => {
        const isUp = await checkBackend();
        if (!isUp) return mockRatings.filter(r => r.property_id === propertyId);

        const res = await apiFetch<any[]>(`/api/properties/${propertyId}/ratings`);
        if (!res.ok) return mockRatings.filter(r => r.property_id === propertyId);

        return res.data.map((r: any) => ({
            id: r.id,
            property_id: r.property_id,
            tenant_id: r.tenant_id,
            acQuality: r.ac_quality,
            amenities: r.amenities,
            maintenanceSpeed: r.maintenance_speed,
            created_at: r.created_at,
        }));
    },

    submitRating: async (propertyId: string, rating: {
        ac_quality: number;
        amenities: number;
        maintenance_speed: number;
    }): Promise<{ success: boolean; error?: string }> => {
        const res = await apiFetch<{ success: boolean }>(`/api/properties/${propertyId}/ratings`, {
            method: 'POST',
            body: JSON.stringify(rating),
        });
        if (!res.ok) return { success: false, error: res.error };
        return { success: true };
    },

    // ── Payments ─────────────────────────────────────────────
    getPayments: async (userId?: string): Promise<Payment[]> => {
        const isUp = await checkBackend();
        if (!isUp) return userId ? mockGetPaymentsForUser(userId) : mockPayments;

        const res = await apiFetch<any[]>('/api/payments');
        if (!res.ok) return userId ? mockGetPaymentsForUser(userId) : mockPayments;

        return res.data.map((p: any) => ({
            id: p.id,
            listing_id: p.property_id || p.listing_id,
            payer_id: p.payer_id,
            payee_id: p.payee_id,
            type: p.type,
            amount: p.amount,
            due_date: p.due_date,
            paid_date: p.paid_date,
            status: p.status,
            method: p.method || 'bank_transfer',
            reference: p.reference,
            rera_escrow_ref: p.rera_escrow_ref,
            rera_escrow_status: p.rera_escrow_status,
            created_at: p.created_at,
            updated_at: p.updated_at,
        }));
    },

    createPayment: async (data: {
        property_id: string;
        payee_id: string;
        type: string;
        amount: number;
        due_date: string;
    }): Promise<{ success: boolean; id?: string; error?: string }> => {
        const res = await apiFetch<{ success: boolean; id: string }>('/api/payments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!res.ok) return { success: false, error: res.error };
        return { success: true, id: res.data.id };
    },

    // ── Utility ──────────────────────────────────────────────
    /** Force re-check backend availability */
    resetBackendCheck: () => {
        backendAvailable = null;
        lastHealthCheck = 0;
    },

    /** Check if currently using live backend or mock fallback */
    isUsingBackend: () => backendAvailable === true,
};
