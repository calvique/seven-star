import mongoose, { Document, Schema, Model } from 'mongoose';

export type NoticeCategory = 'general' | 'academic' | 'exam' | 'admission' | 'event' | 'holiday' | 'urgent' | 'facility' | 'sports' | 'cultural';

export interface INotice extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: NoticeCategory;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: ('all' | 'students' | 'teachers' | 'parents' | 'staff')[];
  classes?: mongoose.Types.ObjectId[];
  publishedBy: mongoose.Types.ObjectId;
  publishedAt?: Date;
  expiresAt?: Date;
  attachments: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  images: string[];
  isPublished: boolean;
  isPinned: boolean;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INotice>(
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
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: ['general', 'academic', 'exam', 'admission', 'event', 'holiday', 'urgent', 'facility', 'sports', 'cultural'],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    targetAudience: [{
      type: String,
      enum: ['all', 'students', 'teachers', 'parents', 'staff'],
      default: 'all',
    }],
    classes: [{
      type: Schema.Types.ObjectId,
      ref: 'Class',
    }],
    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publishedAt: Date,
    expiresAt: Date,
    attachments: [{
      name: String,
      url: String,
      type: String,
      size: Number,
    }],
    images: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

noticeSchema.index({ slug: 1 });
noticeSchema.index({ category: 1, isPublished: 1, publishedAt: -1 });
noticeSchema.index({ publishedAt: -1 });
noticeSchema.index({ isPinned: -1, publishedAt: -1 });
noticeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

noticeSchema.pre('save', function (next) {
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

export const Notice: Model<INotice> = mongoose.model<INotice>('Notice', noticeSchema);