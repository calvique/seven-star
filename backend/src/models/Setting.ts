import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: string | number | boolean | object | Array<any>;
  group: string;
  label: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'image' | 'file' | 'color' | 'date' | 'select';
  options?: { value: string; label: string }[];
  validation?: string;
  isPublic: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    group: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'json', 'image', 'file', 'color', 'date', 'select'],
      default: 'string',
    },
    options: [{
      value: String,
      label: String,
    }],
    validation: String,
    isPublic: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

settingSchema.index({ key: 1 });
settingSchema.index({ group: 1, order: 1 });
settingSchema.index({ isPublic: 1 });

export const Setting: Model<ISetting> = mongoose.model<ISetting>('Setting', settingSchema);