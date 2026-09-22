import { z } from 'zod';

export const createClassSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    code: z.string().min(1, 'Code is required').max(20, 'Code too long'),
    level: z.enum(['pre-primary', 'primary', 'lower-secondary', 'secondary', 'higher-secondary']),
    grade: z.number().min(0, 'Grade must be at least 0').max(12, 'Grade cannot exceed 12'),
    section: z.string().max(5, 'Section too long').optional(),
    capacity: z.number().min(1, 'Capacity must be at least 1').default(40),
    classTeacherId: z.string().optional(),
    subjectIds: z.array(z.string()).optional(),
    academicYear: z.string().min(1, 'Academic year is required'),
    description: z.string().optional(),
  }),
});

export const updateClassSchema = z.object({
  body: z.object({
    name: z.string().max(100).optional(),
    section: z.string().max(5).optional(),
    capacity: z.number().min(1).optional(),
    classTeacherId: z.string().optional(),
    subjectIds: z.array(z.string()).optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Class ID is required'),
  }),
});