import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWorker extends Document<Types.ObjectId> {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  age?: number;
  skills: string[];
  aiSuggestedSkills?: string[];
  experienceYears?: number;
  languages: string[];
  availability?: string; // e.g., full-time, part-time
  availabilitySlots?: { day: string; start: string; end: string }[];
  preferredJobTypes?: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  embedding?: number[];
  workerVectorId?: string; // for vector DB
  verified?: boolean;
  trustScore?: number; // AI-calculated
  appliedJobs?: Types.ObjectId[];
  completedJobs?: Types.ObjectId[];
  ratings?: { jobId: Types.ObjectId; rating: number; feedback?: string }[];
  averageRating?: number;
  recommendationScore?: number;
  savedByEmployers?: number;
  views?: number;
  lastActiveAt?: Date;
  statusHistory?: { status: string; timestamp: Date; note?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

// ✅ GeoJSON Point schema
const GeoPoint = {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], default: undefined }, // no index here!
};

const WorkerSchema = new Schema<IWorker>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, index: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, index: true, sparse: true },
    password: { type: String, required: true },
    age: { type: Number },
    skills: { type: [String], default: [] },
    aiSuggestedSkills: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    languages: { type: [String], default: [] },
    availability: { type: String, default: 'full-time' },
    availabilitySlots: [{ day: String, start: String, end: String }],
    preferredJobTypes: { type: [String], default: [] },
    location: { type: GeoPoint }, // ❌ removed inline index
    embedding: { type: [Number], default: [] },
    workerVectorId: { type: String },
    verified: { type: Boolean, default: false },
    trustScore: { type: Number, default: 0 },
    appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    completedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    ratings: [
      {
        jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
        rating: { type: Number, min: 1, max: 5 },
        feedback: { type: String, trim: true },
      },
    ],
    averageRating: { type: Number, default: 0 },
    recommendationScore: { type: Number, default: 0 },
    savedByEmployers: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    lastActiveAt: { type: Date, default: Date.now },
    statusHistory: [
      {
        status: { type: String, enum: ['registered', 'verified', 'suspended', 'active'] },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
); 


// ✅ Indexes for performance
WorkerSchema.index({ location: '2dsphere' });
WorkerSchema.index({ skills: 1 }); // Single-field index
WorkerSchema.index({ languages: 1 }); // Single-field index
// Text index (allowed, as it is not a compound index on two arrays)
WorkerSchema.index({ name: 'text', skills: 'text', aiSuggestedSkills: 'text' });

export const Worker = mongoose.model<IWorker>('Worker', WorkerSchema);
