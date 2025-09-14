import { Router } from 'express';
import { getMe, updateMe, listWorkers, upload, uploadVoiceProfile } from '../controllers/workerController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', listWorkers);
router.get('/me', requireAuth(['worker']), getMe);
router.put('/me', requireAuth(['worker']), updateMe);
router.post('/:id/voice-profile', requireAuth(['worker']), upload.single('audio'), uploadVoiceProfile);

export default router;