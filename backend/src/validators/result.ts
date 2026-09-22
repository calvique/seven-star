import { z } from 'zod';

export const createResultSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student is required'),
    examId: z.string().min(1, 'Exam is required'),
    subjectId: z.string().min(1, 'Subject is required'),
    classId: z.string().min(1, 'Class is required'),
    academicYear: z.string().min(1, 'Academic year is required'),
    marksObtained: z.number().min(0, 'Marks cannot be negative'),
    maxMarks: z.number().min(1, 'Max marks must be at least 1'),
    remarks: z.string().optional(),
  }),
});

export const updateResultSchema = z.object({
  body: z.object({
    marksObtained: z.number().min(0, 'Marks cannot be negative').optional(),
    maxMarks: z.number().min(1, 'Max marks must be at least 1').optional(),
    remarks: z.string().optional(),
    isPublished: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Result ID is required'),
  }),
});

export const bulkCreateResultSchema = z.object({
  body: z.object({
    examId: z.string().min(1, 'Exam is required'),
    subjectId: z.string().min(1, 'Subject is required'),
    classId: z.string().min(1, 'Class is required'),
    academicYear: z.string().min(1, 'Academic year is required'),
    results: z.array(z.object({
      studentId: z.string().min(1, 'Student is required'),
      marksObtained: z.number().min(0, 'Marks cannot be negative'),
      maxMarks: z.number().min(1, 'Max marks must be at least 1'),
      remarks: z.string().optional(),
    })).min(1, 'At least one result required'),
  }),
});

export const verifyResultSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Result ID is required'),
  }),
});

export const publishResultSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Result ID is required'),
  }),
});