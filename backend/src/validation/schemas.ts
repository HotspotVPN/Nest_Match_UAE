import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum([
    'SEARCHING_TENANT', 'RESIDING_TENANT', 'LANDLORD',
    'AGENT', 'COMPLIANCE_ADMIN', 'FINANCE_ADMIN', 'OPERATIONS_ADMIN'
  ]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createPropertySchema = z.object({
  title: z.string().min(3),
  address: z.string().min(5),
  district: z.string(),
  makani_number: z.string().length(10).regex(/^\d+$/),
  municipality_permit: z.string().min(5),
  trakheesi_permit: z.string().optional(),
  rent_per_room: z.number().int().positive(),
  deposit: z.number().int().nonnegative(),
  total_rooms: z.number().int().positive(),
  description: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  house_rules: z.array(z.string()).default([]),
  bills_included: z.boolean().default(false),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
});

export const createViewingSchema = z.object({
  property_id: z.string().uuid().or(z.string()),
  scheduled_date: z.string(), // ISO date
  time_slot: z.string(),
});

export const createRatingSchema = z.object({
  ac_quality: z.number().int().min(1).max(5),
  amenities: z.number().int().min(1).max(5),
  maintenance_speed: z.number().int().min(1).max(5),
}).strict(); // Enforce Law No. 34 (No text fields allowed)

export const createApplicationSchema = z.object({
  property_id: z.string(),
  move_in_date: z.string(),
  applicant_message: z.string().max(500).optional(),
});

export const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  lifestyle_tags: z.array(z.string()).optional(),
  personality_traits: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  preferences: z.string().optional(), // JSON encoded or structured
}).strict();
