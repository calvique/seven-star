import { z } from 'zod';

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
    message: z.string().min(1, 'Message is required').max(5000, 'Message too long'),
    category: z.enum(['admission', 'general', 'academic', 'facility', 'complaint', 'feedback', 'other']).default('general'),
  }),
});

export const updateContactSchema = z.object({
  body: z.object({
    status: z.enum(['new', 'in-progress', 'resolved', 'closed']).optional(),
    assignedTo: z.string().optional(),
    response: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Contact ID is required'),
  }),
});