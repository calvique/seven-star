import mongoose, { Document, Schema, Model } from 'mongoose';

export type ExamType = 'unit-test' | 'terminal' | 'half-yearly' | 'annual' | 'pre-board' | 'board' | 'practical' | 'assignment';

export interface IExam extends Document {
  name: string;
  type: ExamType;
  academicYear: string;
  class: mongoose.Types.ObjectId;
  subjects: {
    subject: mongoose.Types.ObjectId;
    date: Date;
    startTime: string;
    endTime: string;
    maxMarks: number;
    passMarks: number;
    room?: string;
    invigilator?: mongoose.Types.ObjectId;
  }[];
  startDate: Date;
  endDate: Date;
  isPublished: boolean;
  publishedAt?: Date;
  publishedBy?: mongoose.Types.ObjectId;
  description?: string;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const examSchema = new Schema<IExam>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['unit-test', 'terminal', 'half-yearly', 'annual', 'pre-board', 'board', 'practical', 'assignment'],
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    subjects: [{
      subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      maxMarks: {
        type: Number,
        required: true,
        min: 1,
      },
      passMarks: {
        type: Number,
        required: true,
        min: 0,
      },
      room: String,
      invigilator: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
      },
    }],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    description: String,
    instructions: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

examSchema.index({ academicYear: 1, class: 1, type: 1 });
examSchema.index({ startDate: 1, endDate: 1 });
examSchema.index({ isPublished: 1 });

export const Exam: Model<IExam> = mongoose.model<IExam>('Exam', examSchema);