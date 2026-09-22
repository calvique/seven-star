import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  class: mongoose.Types.ObjectId;
  teacher?: mongoose.Types.ObjectId;
  credits: number;
  isCore: boolean;
  description?: string;
  syllabus?: string;
  academicYear: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    credits: {
      type: Number,
      default: 1,
      min: 1,
    },
    isCore: {
      type: Boolean,
      default: true,
    },
    description: String,
    syllabus: String,
    academicYear: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

subjectSchema.index({ code: 1, class: 1, academicYear: 1 }, { unique: true });
subjectSchema.index({ class: 1 });
subjectSchema.index({ teacher: 1 });
subjectSchema.index({ isActive: 1 });

export const Subject: Model<ISubject> = mongoose.model<ISubject>('Subject', subjectSchema);