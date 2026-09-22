import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITeacher extends Document {
  user: mongoose.Types.ObjectId;
  employeeId: string;
  designation: string;
  department: string;
  qualification: string[];
  experience: number;
  dateOfJoining: Date;
  dateOfBirth?: Date;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address: {
    permanent: string;
    temporary?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  assignedClasses: mongoose.Types.ObjectId[];
  assignedSubjects: mongoose.Types.ObjectId[];
  salary?: {
    basic: number;
    allowances: number;
    deductions: number;
  };
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    branch: string;
  };
  documents: {
    citizenship?: string;
    qualificationCertificates: string[];
    experienceLetters: string[];
    photo: string;
  };
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  status: 'active' | 'inactive' | 'on-leave' | 'terminated';
  createdAt: Date;
  updatedAt: Date;
}

const teacherSchema = new Schema<ITeacher>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    qualification: [{
      type: String,
      trim: true,
    }],
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    dateOfJoining: {
      type: Date,
      required: true,
    },
    dateOfBirth: {
      type: Date,
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
    address: {
      permanent: {
        type: String,
        required: true,
      },
      temporary: String,
    },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
    },
    assignedClasses: [{
      type: Schema.Types.ObjectId,
      ref: 'Class',
    }],
    assignedSubjects: [{
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    }],
    salary: {
      basic: { type: Number, default: 0 },
      allowances: { type: Number, default: 0 },
      deductions: { type: Number, default: 0 },
    },
    bankDetails: {
      accountNumber: String,
      bankName: String,
      branch: String,
    },
    documents: {
      citizenship: String,
      qualificationCertificates: [String],
      experienceLetters: [String],
      photo: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'on-leave', 'terminated'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

teacherSchema.index({ employeeId: 1 });
teacherSchema.index({ user: 1 });
teacherSchema.index({ department: 1 });
teacherSchema.index({ status: 1 });
teacherSchema.index({ isApproved: 1 });

teacherSchema.virtual('fullName', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name' },
});

export const Teacher: Model<ITeacher> = mongoose.model<ITeacher>('Teacher', teacherSchema);