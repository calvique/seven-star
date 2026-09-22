import { z } from 'zod';

export const createAdmissionSchema = z.object({
  body: z.object({
    academicYear: z.string().min(1, 'Academic year is required'),
    applyingForClassId: z.string().min(1, 'Class is required'),
    student: z.object({
      firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
      middleName: z.string().max(50).optional(),
      lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
      dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
      gender: z.enum(['male', 'female', 'other']),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
      nationality: z.string().default('Nepali'),
      religion: z.string().optional(),
      motherTongue: z.string().optional(),
      previousSchool: z.string().optional(),
      previousClass: z.string().optional(),
    }),
    father: z.object({
      name: z.string().min(1, 'Father name is required').max(100),
      occupation: z.string().optional(),
      phone: z.string().min(1, 'Father phone is required'),
      email: z.string().email('Invalid email').optional(),
      officeAddress: z.string().optional(),
    }),
    mother: z.object({
      name: z.string().min(1, 'Mother name is required').max(100),
      occupation: z.string().optional(),
      phone: z.string().min(1, 'Mother phone is required'),
      email: z.string().email('Invalid email').optional(),
      officeAddress: z.string().optional(),
    }),
    guardian: z.object({
      name: z.string().optional(),
      relation: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    }).optional(),
    address: z.object({
      permanent: z.object({
        province: z.string().min(1, 'Province is required'),
        district: z.string().min(1, 'District is required'),
        municipality: z.string().min(1, 'Municipality is required'),
        ward: z.string().min(1, 'Ward is required'),
        tole: z.string().min(1, 'Tole is required'),
      }),
      temporary: z.object({
        province: z.string().optional(),
        district: z.string().optional(),
        municipality: z.string().optional(),
        ward: z.string().optional(),
        tole: z.string().optional(),
      }).optional(),
    }),
    documents: z.object({
      birthCertificate: z.string().url().optional(),
      transferCertificate: z.string().url().optional(),
      markSheet: z.string().url().optional(),
      photo: z.string().url().optional(),
      citizenshipFather: z.string().url().optional(),
      citizenshipMother: z.string().url().optional(),
      ppSizePhotos: z.array(z.string().url()).optional(),
    }).optional(),
  }),
});

export const updateAdmissionSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'under-review', 'interview-scheduled', 'accepted', 'rejected', 'waitlisted', 'cancelled']).optional(),
    interviewDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    interviewNotes: z.string().optional(),
    admissionDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
    rollNumber: z.string().optional(),
    notes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Admission ID is required'),
  }),
});