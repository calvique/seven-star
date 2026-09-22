import mongoose, { Document, Schema, Model } from 'mongoose';

export type FacilityCategory = 'academic' | 'sports' | 'laboratory' | 'library' | 'hostel' | 'transport' | 'cafeteria' | 'medical' | 'auditorium' | 'playground' | 'other';

export interface IFacility extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: FacilityCategory;
  location?: string;
  capacity?: number;
  features: string[];
  images: {
    url: string;
    alt?: string;
    caption?: string;
    isCover: boolean;
  }[];
  specifications?: Record<string, string>;
  isActive: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  publishedBy?: mongoose.Types.ObjectId;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const facilitySchema = new Schema<IFacility>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
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
      enum: ['academic', 'sports', 'laboratory', 'library', 'hostel', 'transport', 'cafeteria', 'medical', 'auditorium', 'playground', 'other'],
      required: true,
    },
    location: String,
    capacity: Number,
    features: [String],
    images: [{
      url: { type: String, required: true },
      alt: String,
      caption: String,
      isCover: { type: Boolean, default: false },
    }],
    specifications: Schema.Types.Mixed,
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

facilitySchema.index({ slug: 1 });
facilitySchema.index({ category: 1, isPublished: 1, isActive: 1 });
facilitySchema.index({ isActive: 1, isPublished: 1 });

facilitySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  // Ensure only one cover image
  const coverCount = this.images.filter(img => img.isCover).length;
  if (coverCount > 1) {
    this.images.forEach((img, i) => {
      img.isCover = i === 0;
    });
  } else if (coverCount === 0 && this.images.length > 0) {
    this.images[0].isCover = true;
  }
  next();
});

export const Facility: Model<IFacility> = mongoose.model<IFacility>('Facility', facilitySchema);