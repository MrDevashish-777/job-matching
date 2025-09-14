import { Request, Response } from 'express';
import multer from 'multer';
import { Worker } from '../models/Worker';
import { AuthRequest } from '../middleware/auth';
import { transcribeWav, parseProfileFromText } from '../services/voiceService';
import { embedText } from '../services/embeddingService';

export const upload = multer({ storage: multer.memoryStorage() });

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== 'worker') return res.status(403).json({ message: 'Forbidden' });
  const me = await Worker.findById(req.user.id);
  return res.json(me);
}

export async function updateMe(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== 'worker') return res.status(403).json({ message: 'Forbidden' });
  const { name, skills, experienceYears, location, availability, languages, age } = req.body as any;
  const embedding = await embedText(`${name || ''}\n${(skills||[]).join(', ')}\n${experienceYears||''}`);
  const updated = await Worker.findByIdAndUpdate(
    req.user.id,
    { $set: { name, skills, experienceYears, location, availability, languages, age, embedding } },
    { new: true }
  );
  return res.json(updated);
}

export async function listWorkers(_req: Request, res: Response) {
  const workers = await Worker.find().limit(100);
  return res.json(workers);
}

export async function uploadVoiceProfile(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== 'worker') return res.status(403).json({ message: 'Forbidden' });
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ message: 'audio file required' });
  try {
    const transcript = await transcribeWav(file.buffer);
    const parsed = parseProfileFromText(transcript);
    const embedding = await embedText(`${(parsed.skills||[]).join(', ')} ${parsed.experienceYears||''}`);
    const updated = await Worker.findByIdAndUpdate(
      req.user.id,
      { $set: { ...parsed, embedding } },
      { new: true }
    );
    return res.json({ transcript, parsed, updated });
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Failed to process audio' });
  }
}