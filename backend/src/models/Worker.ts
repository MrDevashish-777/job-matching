import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWorker extends Document<Types.ObjectId> {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  skills: string[];
  experienceYears?: number;
  location?: string;
  availability?: boolean;
  createdAt: Date;
}

const WorkerSchema = new Schema<IWorker>({
  name: { type: String, required: true },
  email: { type: String, index: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, index: true, sparse: true },
  password: { type: String, required: true },
  skills: { type: [String], default: [] },
  experienceYears: { type: Number, default: 0 },
  location: { type: String },
  availability: { type: Boolean, default: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Worker = mongoose.model<IWorker>('Worker', WorkerSchema);