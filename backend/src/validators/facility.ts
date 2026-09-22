import { z } from 'zod';

const facilityImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  alt: z.string().optional(),
  caption: z.string().optional(),
  isCover: z.boolean().default(false),
});

export const createFacilitySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
    description: z.string().min(1, 'Description is required'),
    shortDescription: z.string().max(500).optional(),
    category: z.enum(['academic', 'sports', 'laboratory', 'library', 'hostel', 'transport', 'cafeteria', 'medical', 'auditorium', 'playground', 'other']),
    location: z.string().optional(),
    capacity: z.number().min(1).optional(),
    features: z.array(z.string()).optional(),
    images: z.array(facilityImageSchema).min(1, 'At least one image required'),
    specifications: z.record(z.string()).optional(),
    isActive: z.boolean().default(true),
    isPublished: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

export const updateFacilitySchema = z.object({
  body: z.object({
    name: z.string().max(200).optional(),
    description: z.string().optional(),
    shortDescription: z.string().max(500).optional(),
    category: z.enum(['academic', 'sports', 'laboratory', 'library', 'hostel', 'transport', 'cafeteria', 'medical', 'auditorium', 'playground', 'other']).optional(),
    location: z.string().optional(),
    capacity: z.number().min(1).optional(),
    features: z.array(z.string()).optional(),
    images: z.array(facilityImageSchema).optional(),
    specifications: z.record(z.string()).optional(),
    isActive: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Facility ID is required'),
  }),
});