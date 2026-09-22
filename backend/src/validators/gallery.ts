import { z } from 'zod';

const imageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  alt: z.string().optional(),
  caption: z.string().optional(),
  order: z.number().default(0),
});

export const createGallerySchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().optional(),
    category: z.enum(['academic', 'sports', 'cultural', 'events', 'facilities', 'achievements', 'trips', 'alumni', 'general']).default('general'),
    images: z.array(imageSchema).min(1, 'At least one image required'),
    coverImage: z.string().url('Invalid cover image URL').optional(),
    eventDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    location: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

export const updateGallerySchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    description: z.string().optional(),
    category: z.enum(['academic', 'sports', 'cultural', 'events', 'facilities', 'achievements', 'trips', 'alumni', 'general']).optional(),
    images: z.array(imageSchema).optional(),
    coverImage: z.string().url('Invalid cover image URL').optional().nullable(),
    eventDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional().nullable(),
    location: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Gallery ID is required'),
  }),
});