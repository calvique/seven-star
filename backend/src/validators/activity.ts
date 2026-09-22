import { z } from 'zod';

export const createActivitySchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().min(1, 'Description is required'),
    shortDescription: z.string().max(500).optional(),
    category: z.enum(['sports', 'cultural', 'academic', 'club', 'community', 'leadership', 'creative', 'other']),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'one-time']).default('weekly'),
    schedule: z.object({
      dayOfWeek: z.number().min(0).max(6).optional(),
      startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
      endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
      startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
      endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    }).optional(),
    location: z.string().optional(),
    coordinatorId: z.string().optional(),
    maxParticipants: z.number().min(1).optional(),
    gradeLevel: z.array(z.number().min(0).max(12)).optional(),
    images: z.array(z.string().url()).optional(),
    documents: z.array(z.string().url()).optional(),
    isActive: z.boolean().default(true),
    isPublished: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

export const updateActivitySchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    description: z.string().optional(),
    shortDescription: z.string().max(500).optional(),
    category: z.enum(['sports', 'cultural', 'academic', 'club', 'community', 'leadership', 'creative', 'other']).optional(),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'one-time']).optional(),
    schedule: z.object({
      dayOfWeek: z.number().min(0).max(6).optional(),
      startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
      endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
      startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
      endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    }).optional(),
    location: z.string().optional(),
    coordinatorId: z.string().optional(),
    maxParticipants: z.number().min(1).optional(),
    gradeLevel: z.array(z.number().min(0).max(12)).optional(),
    images: z.array(z.string().url()).optional(),
    documents: z.array(z.string().url()).optional(),
    isActive: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Activity ID is required'),
  }),
});