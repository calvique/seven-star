import { z } from 'zod';

export const examSubjectSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  maxMarks: z.number().min(1, 'Max marks must be at least 1'),
  passMarks: z.number().min(0, 'Pass marks cannot be negative'),
  room: z.string().optional(),
  invigilatorId: z.string().optional(),
});

export const createExamSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
    type: z.enum(['unit-test', 'terminal', 'half-yearly', 'annual', 'pre-board', 'board', 'practical', 'assignment']),
    academicYear: z.string().min(1, 'Academic year is required'),
    classId: z.string().min(1, 'Class is required'),
    subjects: z.array(examSubjectSchema).min(1, 'At least one subject required'),
    startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
    description: z.string().optional(),
    instructions: z.string().optional(),
  }),
});

export const updateExamSchema = z.object({
  body: z.object({
    name: z.string().max(200).optional(),
    subjects: z.array(examSubjectSchema).optional(),
    startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    description: z.string().optional(),
    instructions: z.string().optional(),
    isPublished: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Exam ID is required'),
  }),
});

export const publishExamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Exam ID is required'),
  }),
});