import { z } from 'zod';

export const createNoticeSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    content: z.string().min(1, 'Content is required'),
    excerpt: z.string().max(500, 'Excerpt too long').optional(),
    category: z.enum(['general', 'academic', 'exam', 'admission', 'event', 'holiday', 'urgent', 'facility', 'sports', 'cultural']).default('general'),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    targetAudience: z.array(z.enum(['all', 'students', 'teachers', 'parents', 'staff'])).default(['all']),
    classIds: z.array(z.string()).optional(),
    expiresAt: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    attachments: z.array(z.object({
      name: z.string(),
      url: z.string().url('Invalid URL'),
      type: z.string(),
      size: z.number(),
    })).optional(),
    images: z.array(z.string().url('Invalid image URL')).optional(),
    isPublished: z.boolean().default(false),
    isPinned: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.array(z.string()).optional(),
  }),
});

export const updateNoticeSchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    content: z.string().optional(),
    excerpt: z.string().max(500).optional(),
    category: z.enum(['general', 'academic', 'exam', 'admission', 'event', 'holiday', 'urgent', 'facility', 'sports', 'cultural']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    targetAudience: z.array(z.enum(['all', 'students', 'teachers', 'parents', 'staff'])).optional(),
    classIds: z.array(z.string()).optional(),
    expiresAt: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional().nullable(),
    attachments: z.array(z.object({
      name: z.string(),
      url: z.string().url('Invalid URL'),
      type: z.string(),
      size: z.number(),
    })).optional(),
    images: z.array(z.string().url('Invalid image URL')).optional(),
    isPublished: z.boolean().optional(),
    isPinned: z.boolean().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Notice ID is required'),
  }),
});