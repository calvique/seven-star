import { z } from 'zod';

export const createDownloadSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().optional(),
    category: z.enum(['admission', 'academic', 'exam', 'result', 'calendar', 'form', 'policy', 'circular', 'syllabus', 'other']).default('other'),
    file: z.object({
      url: z.string().url('Invalid file URL'),
      name: z.string().min(1, 'File name is required'),
      type: z.string().min(1, 'File type is required'),
      size: z.number().min(1, 'File size is required'),
    }),
    thumbnail: z.string().url('Invalid thumbnail URL').optional(),
    isPublic: z.boolean().default(true),
    targetAudience: z.array(z.enum(['all', 'students', 'teachers', 'parents', 'staff'])).default(['all']),
    expiresAt: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    tags: z.array(z.string()).optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

export const updateDownloadSchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    description: z.string().optional(),
    category: z.enum(['admission', 'academic', 'exam', 'result', 'calendar', 'form', 'policy', 'circular', 'syllabus', 'other']).optional(),
    file: z.object({
      url: z.string().url('Invalid file URL'),
      name: z.string(),
      type: z.string(),
      size: z.number(),
    }).optional(),
    thumbnail: z.string().url('Invalid thumbnail URL').optional().nullable(),
    isPublic: z.boolean().optional(),
    targetAudience: z.array(z.enum(['all', 'students', 'teachers', 'parents', 'staff'])).optional(),
    expiresAt: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional().nullable(),
    tags: z.array(z.string()).optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Download ID is required'),
  }),
});