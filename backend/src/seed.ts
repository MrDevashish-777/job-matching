import mongoose from 'mongoose';
import { config } from './config/env';
import { Worker } from './models/Worker';
import { Employer } from './models/Employer';
import { Job } from './models/Job';
import { embedText } from './services/embeddingService';

async function main() {
  await mongoose.connect(config.MONGO_URI);

  await Worker.deleteMany({});
  await Employer.deleteMany({});
  await Job.deleteMany({});

  const employer = await Employer.create({ companyName: 'Acme Homes', contactName: 'Neha', email: 'neha@acme.com', password: 'hashed' });

  const workers = await Worker.create([
    { name: 'Ravi', skills: ['carpentry','painting'], languages: ['hindi','english'], experienceYears: 4, availability: 'full-time', location: { type: 'Point', coordinates: [77.2090, 28.6139] } },
    { name: 'Sita', skills: ['maid','cleaning','cooking'], languages: ['hindi'], experienceYears: 3, availability: 'part-time', location: { type: 'Point', coordinates: [72.8777, 19.0760] } },
    { name: 'Akash', skills: ['plumbing'], languages: ['hindi','english'], experienceYears: 5, availability: 'full-time', location: { type: 'Point', coordinates: [77.1025, 28.7041] } }
  ]);

  // embeddings for workers
  for (const w of workers) {
    w.embedding = await embedText(`${w.name}\n${w.skills.join(', ')}\n${w.experienceYears}`);
    await w.save();
  }

  const jobs = await Job.create([
    { title: 'Carpenter needed', description: 'Fix doors and shelves', requiredSkills: ['carpentry'], wageOffered: 800, location: { type: 'Point', coordinates: [77.2090, 28.6139] }, createdBy: employer._id },
    { title: 'House help', description: 'Daily cleaning and cooking', requiredSkills: ['cleaning','cooking'], wageOffered: 6000, location: { type: 'Point', coordinates: [72.8777, 19.0760] }, createdBy: employer._id }
  ]);

  for (const j of jobs) {
    j.embedding = await embedText(`${j.title}\n${j.description}\n${j.requiredSkills.join(', ')}`);
    await j.save();
  }

  console.log('Seeded example dataset');
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });