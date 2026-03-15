import { mapApiRoomListingToListing, mapApiRoommateToUser } from './apiMappers';
import type { ApiRoomListing, ApiRoommateProfile } from './apiMappers';
import type { Listing, User } from '@/types';

// Vite injects the URL from the .env file. Defaults to port 8788 as per latest config.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8788';

export const api = {
    /**
     * Fetch properties from the Cloudflare Hono backend and map them to internal Listing types.
     */
    getProperties: async (): Promise<Listing[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/properties`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const rawData: ApiRoomListing[] = await response.json();
            
            // Pass through the strict mappers to handle D1 snake_case and JSON parsing
            return rawData.map(mapApiRoomListingToListing);
        } catch (error) {
            console.error("MAPPING_GATEWAY_ERROR: Failed to fetch properties:", error);
            return []; // Fail gracefully to avoid UI crashes
        }
    },

    /**
     * Fetch a single property by ID.
     */
    getPropertyById: async (id: string): Promise<Listing | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/properties/${id}`);
            if (!response.ok) {
                console.warn(`Property fetch failed for id ${id}:`, response.status);
                return null;
            }
            
            const rawData: ApiRoomListing = await response.json();
            return mapApiRoomListingToListing(rawData);
        } catch (error) {
            console.error(`MAPPING_GATEWAY_ERROR: Failed to fetch property ${id}:`, error);
            return null;
        }
    },

    /**
     * Fetch all roommate profiles.
     */
    getUsers: async (): Promise<User[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const rawData: ApiRoommateProfile[] = await response.json();
            return rawData.map(mapApiRoommateToUser);
        } catch (error) {
            console.error("MAPPING_GATEWAY_ERROR: Failed to fetch users:", error);
            return [];
        }
    },

    /**
     * Fetch a specific user by ID.
     */
    getUserById: async (id: string): Promise<User | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${id}`);
            if (!response.ok) return null;
            
            const rawData: ApiRoommateProfile = await response.json();
            return mapApiRoommateToUser(rawData);
        } catch (error) {
            console.error(`MAPPING_GATEWAY_ERROR: Failed to fetch user ${id}:`, error);
            return null;
        }
    }
};
