import mongoose, { Document, Schema, Model } from 'mongoose';

export type DownloadCategory = 'admission' | 'academic' | 'exam' | 'result' | 'calendar' | 'form' | 'policy' | 'circular' | 'syllabus' | 'other';

export interface IDownload extends Document {
  title: string;
  slug: string;
  description?: string;
  category: DownloadCategory;
  file: {
    url: string;
    name: string;
    type: string;
    size: number;
  };
  thumbnail?: string;
  isPublic: boolean;
  targetAudience: ('all' | 'students' | 'teachers' | 'parents' | 'staff')[];
  downloadCount: number;
  publishedBy: mongoose.Types.ObjectId;
  publishedAt?: Date;
  expiresAt?: Date;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const downloadSchema = new Schema<IDownload>(
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
    description: String,
    category: {
      type: String,
      enum: ['admission', 'academic', 'exam', 'result', 'calendar', 'form', 'policy', 'circular', 'syllabus', 'other'],
      default: 'other',
    },
    file: {
      url: { type: String, required: true },
      name: { type: String, required: true },
      type: { type: String, required: true },
      size: { type: Number, required: true },
    },
    thumbnail: String,
    isPublic: {
      type: Boolean,
      default: true,
    },
    targetAudience: [{
      type: String,
      enum: ['all', 'students', 'teachers', 'parents', 'staff'],
      default: 'all',
    }],
    downloadCount: {
      type: Number,
      default: 0,
    },
    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publishedAt: Date,
    expiresAt: Date,
    tags: [String],
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

downloadSchema.index({ slug: 1 });
downloadSchema.index({ category: 1, isPublic: 1, publishedAt: -1 });
downloadSchema.index({ publishedAt: -1 });
downloadSchema.index({ tags: 1 });

downloadSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.isModified('isPublic') && this.isPublic && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const Download: Model<IDownload> = mongoose.model<IDownload>('Download', downloadSchema);