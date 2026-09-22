import mongoose, { Document, Schema, Model } from 'mongoose';

export type ActivityCategory = 'sports' | 'cultural' | 'academic' | 'club' | 'community' | 'leadership' | 'creative' | 'other';
export type ActivityFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

export interface IActivity extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: ActivityCategory;
  frequency: ActivityFrequency;
  schedule?: {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    startDate?: Date;
    endDate?: Date;
  };
  location?: string;
  coordinator?: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  maxParticipants?: number;
  gradeLevel?: number[];
  images: string[];
  documents: string[];
  isActive: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  publishedBy?: mongoose.Types.ObjectId;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: ['sports', 'cultural', 'academic', 'club', 'community', 'leadership', 'creative', 'other'],
      required: true,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'one-time'],
      default: 'weekly',
    },
    schedule: {
      dayOfWeek: { type: Number, min: 0, max: 6 },
      startTime: String,
      endTime: String,
      startDate: Date,
      endDate: Date,
    },
    location: String,
    coordinator: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'Student',
    }],
    maxParticipants: Number,
    gradeLevel: [Number],
    images: [String],
    documents: [String],
    isActive: {
      type: Boolean,
      default: true,
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
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

activitySchema.index({ slug: 1 });
activitySchema.index({ category: 1, isPublished: 1, isActive: 1 });
activitySchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });
activitySchema.index({ coordinator: 1 });

activitySchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const Activity: Model<IActivity> = mongoose.model<IActivity>('Activity', activitySchema);