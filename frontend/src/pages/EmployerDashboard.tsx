import { useEffect, useState } from 'react';
import axios from 'axios';

type Job = { _id: string; title: string; description: string; skillsRequired: string[]; budget?: number; location?: string };

type Candidate = { score: number; worker: { _id: string; name: string; skills: string[]; location?: string; email?: string; phone?: string } };

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [budget, setBudget] = useState<number | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token') || '';

  async function loadJobs() {
    const res = await axios.get('/api/jobs');
    setJobs(res.data);
  }

  useEffect(() => { loadJobs(); }, []);

  async function createJob() {
    try {
      const { data } = await axios.post('/api/jobs', {
        title, description, skillsRequired: skills.split(',').map(s=>s.trim()).filter(Boolean), budget, location
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Job created');
      setTitle(''); setDescription(''); setSkills(''); setBudget(undefined); setLocation('');
      setJobs([data, ...jobs]);
    } catch (e: any) {
      setMessage(e?.response?.data?.message || 'Create failed');
    }
  }

  async function viewMatches(jobId: string) {
    try {
      setSelectedJobId(jobId);
      const { data } = await axios.get(`/api/jobs/${jobId}/match`);
      setCandidates(data);
    } catch (e: any) {
      setMessage(e?.response?.data?.message || 'Match failed');
    }
  }

  async function accept(workerId: string) {
    if (!selectedJobId) return;
    try {
      await axios.post(`/api/jobs/${selectedJobId}/accept`, { workerId }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Worker accepted');
      setCandidates([]);
      await loadJobs();
    } catch (e: any) {
      setMessage(e?.response?.data?.message || 'Accept failed');
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="font-semibold text-lg">Post a Job</h2>
        <input className="w-full border p-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="w-full border p-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input className="w-full border p-2" placeholder="Required skills (comma separated)" value={skills} onChange={e=>setSkills(e.target.value)} />
        <input className="w-full border p-2" placeholder="Budget (optional)" type="number" value={budget ?? ''} onChange={e=>setBudget(Number(e.target.value))} />
        <input className="w-full border p-2" placeholder="Location (optional)" value={location} onChange={e=>setLocation(e.target.value)} />
        <button className="bg-black text-white px-3 py-2" onClick={createJob}>Create</button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">My Jobs</h2>
        <ul className="space-y-3">
          {jobs.map(j => (
            <li key={j._id} className="border p-3 rounded">
              <h3 className="font-semibold">{j.title}</h3>
              <p className="text-sm text-gray-700">{j.description}</p>
              <p className="text-xs text-gray-500">Skills: {j.skillsRequired.join(', ')}</p>
              <div className="mt-2 flex gap-2">
                <button className="border px-3 py-1" onClick={()=>viewMatches(j._id)}>View Candidates</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">Recommended Candidates</h2>
        <ul className="grid md:grid-cols-2 gap-3">
          {candidates.map((c, i) => (
            <li key={i} className="border p-3 rounded">
              <div className="flex justify-between"><span className="font-semibold">{c.worker?.name}</span><span className="text-xs">Score: {c.score.toFixed(2)}</span></div>
              <p className="text-sm text-gray-700">Skills: {(c.worker?.skills||[]).join(', ')}</p>
              <p className="text-xs text-gray-500">Location: {c.worker?.location||'-'}</p>
              {(c.worker?.email || c.worker?.phone) && (
                <p className="text-xs text-gray-500">Contact: {c.worker?.email||''} {c.worker?.phone||''}</p>
              )}
              <button className="mt-2 border px-3 py-1" onClick={()=>accept(c.worker._id)}>Accept</button>
            </li>
          ))}
        </ul>
      </div>

      {message && <p className="md:col-span-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}