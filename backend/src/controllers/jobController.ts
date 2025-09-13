import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Job } from '../models/Job';
import { Worker } from '../models/Worker';
import { AuthRequest } from '../middleware/auth';
import { rankWorkers } from '../services/matchingService';

export async function createJob(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
  const { title, description, skillsRequired, budget, location } = req.body;
  if (!title || !description) return res.status(400).json({ message: 'title and description required' });
  const job = await Job.create({ title, description, skillsRequired: skillsRequired || [], budget, location, createdBy: new Types.ObjectId(req.user.id) });
  return res.status(201).json(job);
}

export async function listJobs(_req: Request, res: Response) {
  const jobs = await Job.find().sort({ createdAt: -1 }).limit(100);
  return res.json(jobs);
}

export async function getJob(req: Request, res: Response) {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  return res.json(job);
}

export async function updateJob(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not your job' });
  const { title, description, skillsRequired, budget, location, status } = req.body;
  job.title = title ?? job.title;
  job.description = description ?? job.description;
  job.skillsRequired = skillsRequired ?? job.skillsRequired;
  job.budget = budget ?? job.budget;
  job.location = location ?? job.location;
  job.status = status ?? job.status;
  await job.save();
  return res.json(job);
}

export async function deleteJob(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not your job' });
  await job.deleteOne();
  return res.json({ ok: true });
}

export async function applyToJob(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== 'worker') return res.status(403).json({ message: 'Forbidden' });
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const workerId = new Types.ObjectId(req.user.id);
  if (!job.applicants.find((a) => a.toString() === workerId.toString())) {
    job.applicants.push(workerId);
    await job.save();
  }
  return res.json(job);
}

export async function acceptWorker(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
  const { workerId } = req.body as { workerId: string };
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not your job' });
  job.acceptedWorker = new Types.ObjectId(workerId);
  job.status = 'in_progress';
  await job.save();
  return res.json(job);
}

export async function matchWorkers(req: AuthRequest, res: Response) {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const workers = await Worker.find({ availability: true }, { skills: 1 }).lean();
  const ranked = rankWorkers(job.skillsRequired, job.description, workers as any);
  // Return top 20 with worker summaries
  const topIds = ranked.slice(0, 20).map(r => r.workerId);
  const topWorkers = await Worker.find({ _id: { $in: topIds } });
  const byId = new Map(topWorkers.map(w => [w._id.toString(), w]));
  const result = ranked
    .filter(r => byId.has(r.workerId))
    .map(r => ({ score: r.score, worker: byId.get(r.workerId) }))
    .slice(0, 20);
  return res.json(result);
}