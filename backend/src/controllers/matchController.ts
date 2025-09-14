import { Request, Response } from 'express';
import { Worker } from '../models/Worker';
import { Job } from '../models/Job';
import { embedText } from '../services/embeddingService';
import { rankByEmbedding } from '../services/matchingService';

export async function matchJobsForWorker(req: Request, res: Response) {
  const worker = await Worker.findById(req.params.id).lean();
  if (!worker) return res.status(404).json({ message: 'Worker not found' });

  // Optional geo prefilter by worker location
  const geoFilter: any = worker.location ? { location: { $near: { $geometry: worker.location, $maxDistance: 25_000 } } } : {};
  const jobs = await Job.find(geoFilter).select('title description requiredSkills embedding location').lean();

  let sourceEmbedding = worker.embedding || [];
  if (!sourceEmbedding.length) {
    const basis = `${worker.name || ''}\n${(worker.skills || []).join(', ')}\n${worker.experienceYears || ''}`;
    sourceEmbedding = await embedText(basis);
  }

  const ranked = rankByEmbedding(sourceEmbedding, jobs as any, 50);
  const byId = new Map(jobs.map(j => [j._id.toString(), j]));
  const result = ranked.slice(0, 20).map(r => ({ score: r.score, job: byId.get(r.id) }));
  return res.json(result);
}