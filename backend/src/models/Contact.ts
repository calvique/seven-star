import mongoose, { Document, Schema, Model } from 'mongoose';

export type ContactStatus = 'new' | 'in-progress' | 'resolved' | 'closed';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: 'admission' | 'general' | 'academic' | 'facility' | 'complaint' | 'feedback' | 'other';
  status: ContactStatus;
  assignedTo?: mongoose.Types.ObjectId;
  response?: string;
  respondedBy?: mongoose.Types.ObjectId;
  respondedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: true,
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      enum: ['admission', 'general', 'academic', 'facility', 'complaint', 'feedback', 'other'],
      default: 'general',
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'resolved', 'closed'],
      default: 'new',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    response: String,
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    respondedAt: Date,
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ category: 1, status: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

export const Contact: Model<IContact> = mongoose.model<IContact>('Contact', contactSchema);