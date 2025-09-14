import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Job } from '../models/Job';
import { Worker } from '../models/Worker';
import { AuthRequest } from '../middleware/auth';
import { rankByEmbedding } from '../services/matchingService';
import { embedText } from '../services/embeddingService';
import { suggestFairWage } from '../services/wageService';

export async function createJob(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
  const { title, description, requiredSkills, wageOffered, location, jobType, city } = req.body as any;
  if (!title || !description) return res.status(400).json({ message: 'title and description required' });

  const embedding = await embedText(`${title}\n${description}\n${(requiredSkills||[]).join(', ')}`);
  const wageInfo = suggestFairWage(jobType || title, city || '');

  const job = await Job.create({
    title,
    description,
    requiredSkills: requiredSkills || [],
    wageOffered,
    fairWageSuggested: wageInfo.fair,
    location,
    embedding,
    createdBy: new Types.ObjectId(req.user.id)
  });
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
  const { title, description, requiredSkills, wageOffered, location, status } = req.body as any;
  job.title = title ?? job.title;
  job.description = description ?? job.description;
  job.requiredSkills = requiredSkills ?? job.requiredSkills;
  job.wageOffered = wageOffered ?? job.wageOffered;
  job.location = location ?? job.location;
  job.status = status ?? job.status;
  // Re-embed if core fields changed
  if (title || description || requiredSkills) {
    job.embedding = await embedText(`${job.title}\n${job.description}\n${(job.requiredSkills||[]).join(', ')}`);
  }
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

  // Optional: geospatial prefilter if job has location
  const geoFilter: any = job.location ? { location: { $near: { $geometry: job.location, $maxDistance: 25_000 } } } : {};
  const workers = await Worker.find(geoFilter).select('embedding name skills location').lean();
  if (!job.embedding || job.embedding.length === 0) {
    job.embedding = await embedText(`${job.title}\n${job.description}\n${(job.requiredSkills||[]).join(', ')}`);
    await job.save();
  }
  const ranked = rankByEmbedding(job.embedding, workers as any, 50);
  const byId = new Map(workers.map(w => [w._id.toString(), w]));
  const result = ranked.slice(0, 20).map(r => ({ score: r.score, worker: byId.get(r.id) }));
  return res.json(result);
}