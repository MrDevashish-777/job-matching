import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEmployer extends Document<Types.ObjectId> {
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  password: string;
  location?: string;
  createdAt: Date;
}

const EmployerSchema = new Schema<IEmployer>({
  companyName: { type: String, required: true },
  contactName: { type: String },
  email: { type: String, index: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, index: true, sparse: true },
  password: { type: String, required: true },
  location: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Employer = mongoose.model<IEmployer>('Employer', EmployerSchema);