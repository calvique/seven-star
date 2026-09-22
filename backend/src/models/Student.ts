import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IStudent extends Document {
  user: mongoose.Types.ObjectId;
  admissionNumber: string;
  rollNumber?: string;
  symbolNumber?: string;
  class: mongoose.Types.ObjectId;
  section?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  nationality: string;
  religion?: string;
  motherTongue?: string;
  fatherName: string;
  fatherOccupation?: string;
  fatherPhone?: string;
  motherName: string;
  motherOccupation?: string;
  motherPhone?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  address: {
    permanent: string;
    temporary?: string;
  };
  previousSchool?: string;
  previousClass?: string;
  documents: {
    birthCertificate?: string;
    transferCertificate?: string;
    markSheet?: string;
    photo: string;
    citizenship?: string;
  };
  admissionDate: Date;
  status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'dropped';
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    rollNumber: {
      type: String,
      trim: true,
    },
    symbolNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    section: {
      type: String,
      trim: true,
      uppercase: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    nationality: {
      type: String,
      default: 'Nepali',
    },
    religion: String,
    motherTongue: String,
    fatherName: {
      type: String,
      required: true,
      trim: true,
    },
    fatherOccupation: String,
    fatherPhone: String,
    motherName: {
      type: String,
      required: true,
      trim: true,
    },
    motherOccupation: String,
    motherPhone: String,
    guardianName: String,
    guardianPhone: String,
    guardianRelation: String,
    address: {
      permanent: {
        type: String,
        required: true,
      },
      temporary: String,
    },
    previousSchool: String,
    previousClass: String,
    documents: {
      birthCertificate: String,
      transferCertificate: String,
      markSheet: String,
      photo: String,
      citizenship: String,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'transferred', 'dropped'],
      default: 'active',
    },
    academicYear: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

studentSchema.index({ admissionNumber: 1 });
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ symbolNumber: 1 });
studentSchema.index({ class: 1, section: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ academicYear: 1 });

export const Student: Model<IStudent> = mongoose.model<IStudent>('Student', studentSchema);