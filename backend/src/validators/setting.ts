import { z } from 'zod';

export const createSettingSchema = z.object({
  body: z.object({
    key: z.string().min(1, 'Key is required').max(100, 'Key too long'),
    value: z.unknown(),
    group: z.string().min(1, 'Group is required').max(50, 'Group too long'),
    label: z.string().min(1, 'Label is required').max(100, 'Label too long'),
    description: z.string().optional(),
    type: z.enum(['string', 'number', 'boolean', 'json', 'image', 'file', 'color', 'date', 'select']).default('string'),
    options: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).optional(),
    validation: z.string().optional(),
    isPublic: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const updateSettingSchema = z.object({
  body: z.object({
    value: z.unknown().optional(),
    label: z.string().max(100).optional(),
    description: z.string().optional(),
    type: z.enum(['string', 'number', 'boolean', 'json', 'image', 'file', 'color', 'date', 'select']).optional(),
    options: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).optional(),
    validation: z.string().optional(),
    isPublic: z.boolean().optional(),
    order: z.number().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Setting ID is required'),
  }),
});