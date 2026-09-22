import mongoose, { Document, Schema, Model } from 'mongoose';

export type AdmissionStatus = 'pending' | 'under-review' | 'interview-scheduled' | 'accepted' | 'rejected' | 'waitlisted' | 'cancelled';

export interface IAdmission extends Document {
  admissionNumber: string;
  academicYear: string;
  applyingForClass: mongoose.Types.ObjectId;
  student: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    bloodGroup?: string;
    nationality: string;
    religion?: string;
    motherTongue?: string;
    previousSchool?: string;
    previousClass?: string;
  };
  father: {
    name: string;
    occupation?: string;
    phone: string;
    email?: string;
    officeAddress?: string;
  };
  mother: {
    name: string;
    occupation?: string;
    phone: string;
    email?: string;
    officeAddress?: string;
  };
  guardian?: {
    name: string;
    relation: string;
    phone: string;
    address?: string;
  };
  address: {
    permanent: {
      province: string;
      district: string;
      municipality: string;
      ward: string;
      tole: string;
    };
    temporary?: {
      province: string;
      district: string;
      municipality: string;
      ward: string;
      tole: string;
    };
  };
  documents: {
    birthCertificate?: string;
    transferCertificate?: string;
    markSheet?: string;
    photo?: string;
    citizenshipFather?: string;
    citizenshipMother?: string;
    ppSizePhotos?: string[];
  };
  status: AdmissionStatus;
  applicationDate: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  interviewDate?: Date;
  interviewNotes?: string;
  admissionDate?: Date;
  rollNumber?: string;
  studentUser?: mongoose.Types.ObjectId;
  studentProfile?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const admissionSchema = new Schema<IAdmission>(
  {
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    applyingForClass: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    student: {
      firstName: { type: String, required: true, trim: true },
      middleName: { type: String, trim: true },
      lastName: { type: String, required: true, trim: true },
      dateOfBirth: { type: Date, required: true },
      gender: { type: String, enum: ['male', 'female', 'other'], required: true },
      bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      nationality: { type: String, default: 'Nepali' },
      religion: String,
      motherTongue: String,
      previousSchool: String,
      previousClass: String,
    },
    father: {
      name: { type: String, required: true, trim: true },
      occupation: String,
      phone: { type: String, required: true },
      email: String,
      officeAddress: String,
    },
    mother: {
      name: { type: String, required: true, trim: true },
      occupation: String,
      phone: { type: String, required: true },
      email: String,
      officeAddress: String,
    },
    guardian: {
      name: String,
      relation: String,
      phone: String,
      address: String,
    },
    address: {
      permanent: {
        province: { type: String, required: true },
        district: { type: String, required: true },
        municipality: { type: String, required: true },
        ward: { type: String, required: true },
        tole: { type: String, required: true },
      },
      temporary: {
        province: String,
        district: String,
        municipality: String,
        ward: String,
        tole: String,
      },
    },
    documents: {
      birthCertificate: String,
      transferCertificate: String,
      markSheet: String,
      photo: String,
      citizenshipFather: String,
      citizenshipMother: String,
      ppSizePhotos: [String],
    },
    status: {
      type: String,
      enum: ['pending', 'under-review', 'interview-scheduled', 'accepted', 'rejected', 'waitlisted', 'cancelled'],
      default: 'pending',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    interviewDate: Date,
    interviewNotes: String,
    admissionDate: Date,
    rollNumber: String,
    studentUser: { type: Schema.Types.ObjectId, ref: 'User' },
    studentProfile: { type: Schema.Types.ObjectId, ref: 'Student' },
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

admissionSchema.index({ admissionNumber: 1 });
admissionSchema.index({ academicYear: 1, status: 1 });
admissionSchema.index({ applyingForClass: 1 });
admissionSchema.index({ applicationDate: -1 });
admissionSchema.index({ 'student.firstName': 1, 'student.lastName': 1 });

export const Admission: Model<IAdmission> = mongoose.model<IAdmission>('Admission', admissionSchema);