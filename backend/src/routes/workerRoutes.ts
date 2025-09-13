import { Router } from 'express';
import { getMe, updateMe, listWorkers } from '../controllers/workerController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', listWorkers);
router.get('/me', requireAuth(['worker']), getMe);
router.put('/me', requireAuth(['worker']), updateMe);

export default router;