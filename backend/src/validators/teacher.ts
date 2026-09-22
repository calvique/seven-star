import { z } from 'zod';

export const createTeacherSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    employeeId: z.string().min(1, 'Employee ID is required').max(20, 'Employee ID too long'),
    designation: z.string().min(1, 'Designation is required').max(100, 'Designation too long'),
    department: z.string().min(1, 'Department is required').max(100, 'Department too long'),
    qualification: z.array(z.string()).min(1, 'At least one qualification required'),
    experience: z.number().min(0, 'Experience cannot be negative').default(0),
    dateOfJoining: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
    dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    gender: z.enum(['male', 'female', 'other']),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    permanentAddress: z.string().min(1, 'Permanent address is required'),
    temporaryAddress: z.string().optional(),
    emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
    emergencyContactRelation: z.string().min(1, 'Emergency contact relation is required'),
    emergencyContactPhone: z.string().min(1, 'Emergency contact phone is required'),
    assignedClasses: z.array(z.string()).optional(),
    assignedSubjects: z.array(z.string()).optional(),
  }),
});

export const updateTeacherSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    designation: z.string().max(100).optional(),
    department: z.string().max(100).optional(),
    qualification: z.array(z.string()).optional(),
    experience: z.number().min(0).optional(),
    dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    permanentAddress: z.string().optional(),
    temporaryAddress: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactRelation: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    assignedClasses: z.array(z.string()).optional(),
    assignedSubjects: z.array(z.string()).optional(),
    status: z.enum(['active', 'inactive', 'on-leave', 'terminated']).optional(),
    salary: z.object({
      basic: z.number().min(0).optional(),
      allowances: z.number().min(0).optional(),
      deductions: z.number().min(0).optional(),
    }).optional(),
    bankDetails: z.object({
      accountNumber: z.string().optional(),
      bankName: z.string().optional(),
      branch: z.string().optional(),
    }).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Teacher ID is required'),
  }),
});

export const approveTeacherSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Teacher ID is required'),
  }),
});

export const assignClassSubjectSchema = z.object({
  body: z.object({
    classIds: z.array(z.string()).optional(),
    subjectIds: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Teacher ID is required'),
  }),
});