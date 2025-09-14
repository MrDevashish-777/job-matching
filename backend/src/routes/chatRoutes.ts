import { Router } from 'express';
import { askChat } from '../services/chatbotService';

const router = Router();

router.post('/ask', async (req, res) => {
  const { query } = req.body as { query?: string };
  if (!query) return res.status(400).json({ message: 'query required' });
  const result = await askChat(query);
  res.json(result);
});

export default router;