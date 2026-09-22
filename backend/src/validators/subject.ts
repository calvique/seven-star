import { z } from 'zod';

export const createSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    code: z.string().min(1, 'Code is required').max(20, 'Code too long'),
    classId: z.string().min(1, 'Class is required'),
    teacherId: z.string().optional(),
    credits: z.number().min(1, 'Credits must be at least 1').default(1),
    isCore: z.boolean().default(true),
    description: z.string().optional(),
    syllabus: z.string().optional(),
    academicYear: z.string().min(1, 'Academic year is required'),
  }),
});

export const updateSubjectSchema = z.object({
  body: z.object({
    name: z.string().max(100).optional(),
    teacherId: z.string().optional(),
    credits: z.number().min(1).optional(),
    isCore: z.boolean().optional(),
    description: z.string().optional(),
    syllabus: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Subject ID is required'),
  }),
});