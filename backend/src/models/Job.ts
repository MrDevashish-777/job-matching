import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IJob extends Document<Types.ObjectId> {
  title: string;
  description: string;
  skillsRequired: string[];
  budget?: number;
  location?: string;
  createdBy: Types.ObjectId; // Employer
  applicants: Types.ObjectId[]; // Workers
  acceptedWorker?: Types.ObjectId | null;
  status: 'open' | 'in_progress' | 'filled' | 'closed';
  createdAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: { type: [String], default: [] },
  budget: { type: Number },
  location: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
  applicants: [{ type: Schema.Types.ObjectId, ref: 'Worker' }],
  acceptedWorker: { type: Schema.Types.ObjectId, ref: 'Worker', default: null },
  status: { type: String, enum: ['open', 'in_progress', 'filled', 'closed'], default: 'open' },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Job = mongoose.model<IJob>('Job', JobSchema);