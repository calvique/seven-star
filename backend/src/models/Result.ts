import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IResult extends Document {
  student: mongoose.Types.ObjectId;
  exam: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  academicYear: string;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
  gradePoint?: number;
  isPass: boolean;
  rank?: number;
  percentile?: number;
  remarks?: string;
  enteredBy: mongoose.Types.ObjectId;
  enteredAt: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const resultSchema = new Schema<IResult>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    exam: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },
    maxMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    grade: {
      type: String,
      trim: true,
    },
    gradePoint: {
      type: Number,
      min: 0,
      max: 4,
    },
    isPass: {
      type: Boolean,
      default: false,
    },
    rank: {
      type: Number,
      min: 1,
    },
    percentile: {
      type: Number,
      min: 0,
      max: 100,
    },
    remarks: String,
    enteredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enteredAt: {
      type: Date,
      default: Date.now,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: Date,
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

resultSchema.index({ student: 1, exam: 1, subject: 1 }, { unique: true });
resultSchema.index({ exam: 1, subject: 1 });
resultSchema.index({ student: 1, academicYear: 1 });
resultSchema.index({ class: 1, exam: 1 });
resultSchema.index({ isPublished: 1 });

resultSchema.virtual('percentage').get(function () {
  return this.maxMarks > 0 ? (this.marksObtained / this.maxMarks) * 100 : 0;
});

export const Result: Model<IResult> = mongoose.model<IResult>('Result', resultSchema);