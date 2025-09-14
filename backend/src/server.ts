import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import workerRoutes from './routes/workerRoutes';
import jobRoutes from './routes/jobRoutes';
import chatRoutes from './routes/chatRoutes';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', name: 'AI-Powered Informal Sector Job Matchmaker API' });
});

app.use('/auth', authRoutes);
app.use('/workers', workerRoutes);
app.use('/jobs', jobRoutes);
app.use('/chat', chatRoutes);

const start = async () => {
  await connectDB(config.MONGO_URI);
  const port = config.PORT;
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});