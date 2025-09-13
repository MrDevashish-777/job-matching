import { Response } from 'express';
import { Worker } from '../models/Worker';
import { AuthRequest } from '../middleware/auth';

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== 'worker') return res.status(403).json({ message: 'Forbidden' });
  const me = await Worker.findById(req.user.id);
  return res.json(me);
}

export async function updateMe(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== 'worker') return res.status(403).json({ message: 'Forbidden' });
  const { name, skills, experienceYears, location, availability } = req.body as any;
  const updated = await Worker.findByIdAndUpdate(
    req.user.id,
    { $set: { name, skills, experienceYears, location, availability } },
    { new: true }
  );
  return res.json(updated);
}

export async function listWorkers(_req: AuthRequest, res: Response) {
  const workers = await Worker.find().limit(100);
  return res.json(workers);
}