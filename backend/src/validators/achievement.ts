import { z } from 'zod';

export const createAchievementSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().min(1, 'Description is required'),
    category: z.enum(['academic', 'sports', 'cultural', 'leadership', 'community', 'innovation', 'arts', 'other']),
    level: z.enum(['school', 'district', 'provincial', 'national', 'international']).default('school'),
    studentId: z.string().optional(),
    teacherId: z.string().optional(),
    classId: z.string().optional(),
    team: z.string().optional(),
    eventName: z.string().optional(),
    eventDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
    position: z.string().optional(),
    award: z.string().optional(),
    certificateUrl: z.string().url('Invalid certificate URL').optional(),
    images: z.array(z.string().url()).optional(),
    isPublished: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

export const updateAchievementSchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    description: z.string().optional(),
    category: z.enum(['academic', 'sports', 'cultural', 'leadership', 'community', 'innovation', 'arts', 'other']).optional(),
    level: z.enum(['school', 'district', 'provincial', 'national', 'international']).optional(),
    studentId: z.string().optional().nullable(),
    teacherId: z.string().optional().nullable(),
    classId: z.string().optional().nullable(),
    team: z.string().optional(),
    eventName: z.string().optional(),
    eventDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    position: z.string().optional(),
    award: z.string().optional(),
    certificateUrl: z.string().url('Invalid certificate URL').optional().nullable(),
    images: z.array(z.string().url()).optional(),
    isPublished: z.boolean().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Achievement ID is required'),
  }),
});