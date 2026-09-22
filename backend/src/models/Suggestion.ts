import mongoose, { Document, Schema, Model } from 'mongoose';

export type SuggestionCategory = 'general' | 'academic' | 'facility' | 'teacher' | 'activity' | 'administration' | 'safety' | 'food' | 'transport' | 'other';
export type SuggestionStatus = 'pending' | 'in-review' | 'resolved' | 'rejected' | 'implemented';

export interface ISuggestion extends Document {
  name?: string;
  email?: string;
  phone?: string;
  category: SuggestionCategory;
  subject: string;
  message: string;
  isAnonymous: boolean;
  status: SuggestionStatus;
  assignedTo?: mongoose.Types.ObjectId;
  response?: string;
  respondedBy?: mongoose.Types.ObjectId;
  respondedAt?: Date;
  priority: 'low' | 'medium' | 'high';
  attachments: string[];
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const suggestionSchema = new Schema<ISuggestion>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: String,
    category: {
      type: String,
      enum: ['general', 'academic', 'facility', 'teacher', 'activity', 'administration', 'safety', 'food', 'transport', 'other'],
      default: 'general',
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
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'in-review', 'resolved', 'rejected', 'implemented'],
      default: 'pending',
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
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    attachments: [String],
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

suggestionSchema.index({ status: 1, createdAt: -1 });
suggestionSchema.index({ category: 1, status: 1 });
suggestionSchema.index({ email: 1 });
suggestionSchema.index({ createdAt: -1 });

export const Suggestion: Model<ISuggestion> = mongoose.model<ISuggestion>('Suggestion', suggestionSchema);