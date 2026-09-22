import { z } from 'zod';

export const createStudentSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    admissionNumber: z.string().min(1, 'Admission number is required').max(20, 'Admission number too long'),
    rollNumber: z.string().max(20, 'Roll number too long').optional(),
    classId: z.string().min(1, 'Class is required'),
    section: z.string().max(5, 'Section too long').optional(),
    dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
    gender: z.enum(['male', 'female', 'other']),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    nationality: z.string().default('Nepali'),
    religion: z.string().optional(),
    motherTongue: z.string().optional(),
    fatherName: z.string().min(1, 'Father name is required').max(100, 'Father name too long'),
    fatherOccupation: z.string().optional(),
    fatherPhone: z.string().optional(),
    motherName: z.string().min(1, 'Mother name is required').max(100, 'Mother name too long'),
    motherOccupation: z.string().optional(),
    motherPhone: z.string().optional(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
    guardianRelation: z.string().optional(),
    permanentAddress: z.string().min(1, 'Permanent address is required'),
    temporaryAddress: z.string().optional(),
    previousSchool: z.string().optional(),
    previousClass: z.string().optional(),
    academicYear: z.string().min(1, 'Academic year is required'),
  }),
});

export const updateStudentSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    rollNumber: z.string().max(20).optional(),
    section: z.string().max(5).optional(),
    dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    nationality: z.string().optional(),
    religion: z.string().optional(),
    motherTongue: z.string().optional(),
    fatherName: z.string().max(100).optional(),
    fatherOccupation: z.string().optional(),
    fatherPhone: z.string().optional(),
    motherName: z.string().max(100).optional(),
    motherOccupation: z.string().optional(),
    motherPhone: z.string().optional(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
    guardianRelation: z.string().optional(),
    permanentAddress: z.string().optional(),
    temporaryAddress: z.string().optional(),
    previousSchool: z.string().optional(),
    previousClass: z.string().optional(),
    status: z.enum(['active', 'inactive', 'graduated', 'transferred', 'dropped']).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Student ID is required'),
  }),
});

export const promoteStudentSchema = z.object({
  body: z.object({
    newClassId: z.string().min(1, 'New class is required'),
    newSection: z.string().max(5).optional(),
    newRollNumber: z.string().max(20).optional(),
    newAcademicYear: z.string().min(1, 'Academic year is required'),
  }),
  params: z.object({
    id: z.string().min(1, 'Student ID is required'),
  }),
});