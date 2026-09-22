import mongoose, { Document, Schema, Model } from 'mongoose';

export type GalleryCategory = 'academic' | 'sports' | 'cultural' | 'events' | 'facilities' | 'achievements' | 'trips' | 'alumni' | 'general';

export interface IGallery extends Document {
  title: string;
  slug: string;
  description?: string;
  category: GalleryCategory;
  images: {
    url: string;
    alt?: string;
    caption?: string;
    order: number;
  }[];
  coverImage?: string;
  eventDate?: Date;
  location?: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  publishedBy?: mongoose.Types.ObjectId;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
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
      enum: ['academic', 'sports', 'cultural', 'events', 'facilities', 'achievements', 'trips', 'alumni', 'general'],
      default: 'general',
    },
    images: [{
      url: { type: String, required: true },
      alt: String,
      caption: String,
      order: { type: Number, default: 0 },
    }],
    coverImage: String,
    eventDate: Date,
    location: String,
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    views: {
      type: Number,
      default: 0,
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

gallerySchema.index({ slug: 1 });
gallerySchema.index({ category: 1, isPublished: 1, eventDate: -1 });
gallerySchema.index({ eventDate: -1 });
gallerySchema.index({ tags: 1 });

gallerySchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  this.images.sort((a, b) => a.order - b.order);
  next();
});

export const Gallery: Model<IGallery> = mongoose.model<IGallery>('Gallery', gallerySchema);