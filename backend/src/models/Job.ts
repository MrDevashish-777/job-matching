import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IJob extends Document<Types.ObjectId> {
  title: string;
  description: string;
  requiredSkills: string[];
  aiSuggestedSkills?: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  city?: string;
  region?: string;
  wageOffered?: number;
  fairWageSuggested?: number;
  fairWageConfidence?: number; // 0-1
  embedding?: number[];
  jobVectorId?: string; // for vector DB mapping
  createdBy: Types.ObjectId; // Employer
  applicants: Types.ObjectId[]; // Workers
  acceptedWorker?: Types.ObjectId | null;
  status: 'open' | 'in_progress' | 'filled' | 'closed';
  statusHistory?: { status: string; timestamp: Date; note?: string }[];
  views?: number;
  saves?: number;
  recommendationScore?: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// GeoJSON schema for location
const GeoPointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (val: number[]) {
          return val.length === 2;
        },
        message: 'Coordinates must be [lng, lat]',
      },
    },
  },
  { _id: false } // no separate _id for subdocument
);

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requiredSkills: { type: [String], default: [] },
    aiSuggestedSkills: { type: [String], default: [] },
    location: { type: GeoPointSchema },
    city: { type: String, trim: true },
    region: { type: String, trim: true },
    wageOffered: { type: Number },
    fairWageSuggested: { type: Number },
    fairWageConfidence: { type: Number, min: 0, max: 1 },
    embedding: { type: [Number], default: [] },
    jobVectorId: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
    applicants: [{ type: Schema.Types.ObjectId, ref: 'Worker' }],
    acceptedWorker: { type: Schema.Types.ObjectId, ref: 'Worker', default: null },
    status: { type: String, enum: ['open', 'in_progress', 'filled', 'closed'], default: 'open' },
    statusHistory: [
      {
        status: { type: String, enum: ['open', 'in_progress', 'filled', 'closed'] },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    recommendationScore: { type: Number, default: 0 },
    expiresAt: { type: Date },
  },
  { timestamps: true } // auto adds createdAt + updatedAt
);

// ✅ Proper Indexes
JobSchema.index({ location: '2dsphere' });
JobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });

export const Job = mongoose.model<IJob>('Job', JobSchema);
