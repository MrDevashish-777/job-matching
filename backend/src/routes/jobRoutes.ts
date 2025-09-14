import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { applyToJob, createJob, deleteJob, getJob, listJobs, matchWorkers, updateJob, acceptWorker } from '../controllers/jobController';
import { matchJobsForWorker } from '../controllers/matchController';

const router = Router();

router.get('/', listJobs);
router.post('/', requireAuth(['employer']), createJob);
router.get('/:id', getJob);
router.put('/:id', requireAuth(['employer']), updateJob);
router.delete('/:id', requireAuth(['employer']), deleteJob);

router.post('/:id/apply', requireAuth(['worker']), applyToJob);
router.post('/:id/accept', requireAuth(['employer']), acceptWorker);
router.get('/:id/match', matchWorkers);

// Worker-to-jobs
router.get('/workers/:id/match', matchJobsForWorker);

export default router;