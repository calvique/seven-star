import mongoose, { Document, Schema, Model } from 'mongoose';

export type AchievementCategory = 'academic' | 'sports' | 'cultural' | 'leadership' | 'community' | 'innovation' | 'arts' | 'other';
export type AchievementLevel = 'school' | 'district' | 'provincial' | 'national' | 'international';

export interface IAchievement extends Document {
  title: string;
  slug: string;
  description: string;
  category: AchievementCategory;
  level: AchievementLevel;
  student?: mongoose.Types.ObjectId;
  teacher?: mongoose.Types.ObjectId;
  class?: mongoose.Types.ObjectId;
  team?: string;
  eventName?: string;
  eventDate: Date;
  position?: string;
  award?: string;
  certificateUrl?: string;
  images: string[];
  isPublished: boolean;
  publishedAt?: Date;
  publishedBy?: mongoose.Types.ObjectId;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new Schema<IAchievement>(
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
    category: {
      type: String,
      enum: ['academic', 'sports', 'cultural', 'leadership', 'community', 'innovation', 'arts', 'other'],
      required: true,
    },
    level: {
      type: String,
      enum: ['school', 'district', 'provincial', 'national', 'international'],
      default: 'school',
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    team: String,
    eventName: String,
    eventDate: {
      type: Date,
      required: true,
    },
    position: String,
    award: String,
    certificateUrl: String,
    images: [String],
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

achievementSchema.index({ slug: 1 });
achievementSchema.index({ category: 1, level: 1, isPublished: 1, eventDate: -1 });
achievementSchema.index({ student: 1, eventDate: -1 });
achievementSchema.index({ teacher: 1, eventDate: -1 });
achievementSchema.index({ eventDate: -1 });

achievementSchema.pre('save', function (next) {
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

export const Achievement: Model<IAchievement> = mongoose.model<IAchievement>('Achievement', achievementSchema);