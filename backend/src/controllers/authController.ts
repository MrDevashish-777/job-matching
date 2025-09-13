import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Worker } from '../models/Worker';
import { Employer } from '../models/Employer';
import { signToken } from '../middleware/auth';

export async function register(req: Request, res: Response) {
  try {
    const { role, name, companyName, contactName, email, phone, password, location } = req.body as any;
    if (!role || !['worker', 'employer'].includes(role)) {
      return res.status(400).json({ message: 'role must be worker or employer' });
    }
    if (!password) return res.status(400).json({ message: 'password required' });

    const hashed = await bcrypt.hash(password, 10);

    if (role === 'worker') {
      if (!name) return res.status(400).json({ message: 'name required' });
      const ors: any[] = [];
      if (email) ors.push({ email });
      if (phone) ors.push({ phone });
      const existing = ors.length ? await Worker.findOne({ $or: ors }) : null;
      if (existing) return res.status(409).json({ message: 'Worker already exists' });
      const worker = await Worker.create({ name, email, phone, password: hashed, location, skills: [] });
      const token = signToken({ id: worker._id.toString(), role: 'worker' });
      return res.status(201).json({ token, role: 'worker', worker });
    } else {
      if (!companyName) return res.status(400).json({ message: 'companyName required' });
      const ors: any[] = [];
      if (email) ors.push({ email });
      if (phone) ors.push({ phone });
      const existing = ors.length ? await Employer.findOne({ $or: ors }) : null;
      if (existing) return res.status(409).json({ message: 'Employer already exists' });
      const employer = await Employer.create({ companyName, contactName, email, phone, password: hashed, location });
      const token = signToken({ id: employer._id.toString(), role: 'employer' });
      return res.status(201).json({ token, role: 'employer', employer });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { role, email, phone, password } = req.body as any;
    if (!role || !['worker', 'employer'].includes(role)) {
      return res.status(400).json({ message: 'role must be worker or employer' });
    }
    if (!password) return res.status(400).json({ message: 'password required' });

    const query: any = email ? { email } : phone ? { phone } : null;
    if (!query) return res.status(400).json({ message: 'email or phone required' });

    if (role === 'worker') {
      const user = await Worker.findOne(query).lean();
      if (!user) return res.status(404).json({ message: 'Worker not found' });
      const ok = await bcrypt.compare(password, (user as any).password);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
      const token = signToken({ id: (user as any)._id.toString(), role: 'worker' });
      return res.json({ token, role: 'worker', worker: user });
    } else {
      const user = await Employer.findOne(query).lean();
      if (!user) return res.status(404).json({ message: 'Employer not found' });
      const ok = await bcrypt.compare(password, (user as any).password);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
      const token = signToken({ id: (user as any)._id.toString(), role: 'employer' });
      return res.json({ token, role: 'employer', employer: user });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Login failed' });
  }
}