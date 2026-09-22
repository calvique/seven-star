import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IClass extends Document {
  name: string;
  code: string;
  level: 'pre-primary' | 'primary' | 'lower-secondary' | 'secondary' | 'higher-secondary';
  grade: number;
  section?: string;
  capacity: number;
  currentStrength: number;
  classTeacher?: mongoose.Types.ObjectId;
  subjects: mongoose.Types.ObjectId[];
  academicYear: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    level: {
      type: String,
      enum: ['pre-primary', 'primary', 'lower-secondary', 'secondary', 'higher-secondary'],
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 0,
      max: 12,
    },
    section: {
      type: String,
      trim: true,
      uppercase: true,
    },
    capacity: {
      type: Number,
      default: 40,
      min: 1,
    },
    currentStrength: {
      type: Number,
      default: 0,
      min: 0,
    },
    classTeacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    subjects: [{
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    }],
    academicYear: {
      type: String,
      required: true,
    },
    description: String,
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

classSchema.index({ code: 1 });
classSchema.index({ grade: 1, section: 1, academicYear: 1 }, { unique: true });
classSchema.index({ level: 1 });
classSchema.index({ isActive: 1 });

classSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'class',
});

export const Class: Model<IClass> = mongoose.model<IClass>('Class', classSchema);