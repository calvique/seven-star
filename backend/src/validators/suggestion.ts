import { z } from 'zod';

export const createSuggestionSchema = z.object({
  body: z.object({
    name: z.string().max(100).optional(),
    email: z.string().email('Invalid email').optional(),
    phone: z.string().optional(),
    category: z.enum(['general', 'academic', 'facility', 'teacher', 'activity', 'administration', 'safety', 'food', 'transport', 'other']).default('general'),
    subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
    message: z.string().min(1, 'Message is required').max(5000, 'Message too long'),
    isAnonymous: z.boolean().default(false),
    attachments: z.array(z.string().url()).optional(),
  }),
});

export const updateSuggestionSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'in-review', 'resolved', 'rejected', 'implemented']).optional(),
    assignedTo: z.string().optional(),
    response: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Suggestion ID is required'),
  }),
});