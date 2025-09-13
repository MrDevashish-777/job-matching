import { useEffect, useState } from 'react';
import axios from 'axios';

type Worker = { _id: string; name: string; skills: string[]; experienceYears?: number; location?: string; availability?: boolean };
type Job = { _id: string; title: string; description: string; skillsRequired: string[]; location?: string };

export default function WorkerDashboard() {
  const [me, setMe] = useState<Worker | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    async function load() {
      try {
        const meRes = await axios.get('/api/workers/me', { headers: { Authorization: `Bearer ${token}` } });
        setMe(meRes.data);
        const jobsRes = await axios.get('/api/jobs');
        setJobs(jobsRes.data);
      } catch (e: any) {
        setMessage(e?.response?.data?.message || 'Failed to load');
      }
    }
    if (token) load();
  }, [token]);

  async function saveProfile() {
    try {
      await axios.put('/api/workers/me', me, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Profile saved');
    } catch (e: any) {
      setMessage(e?.response?.data?.message || 'Save failed');
    }
  }

  async function apply(jobId: string) {
    try {
      await axios.post(`/api/jobs/${jobId}/apply`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Applied to job');
    } catch (e: any) {
      setMessage(e?.response?.data?.message || 'Apply failed');
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">My Profile</h2>
        {me ? (
          <div className="space-y-2">
            <input className="w-full border p-2" value={me.name} onChange={e=>setMe({...me, name:e.target.value})} />
            <input className="w-full border p-2" placeholder="comma separated skills" value={(me.skills||[]).join(', ')} onChange={e=>setMe({...me, skills:e.target.value.split(',').map(s=>s.trim())})} />
            <input className="w-full border p-2" placeholder="Experience years" type="number" value={me.experienceYears||0} onChange={e=>setMe({...me, experienceYears:Number(e.target.value)})} />
            <input className="w-full border p-2" placeholder="Location" value={me.location||''} onChange={e=>setMe({...me, location:e.target.value})} />
            <label className="flex items-center gap-2"><input type="checkbox" checked={me.availability ?? true} onChange={e=>setMe({...me, availability:e.target.checked})} /> Available</label>
            <button className="bg-black text-white px-3 py-2" onClick={saveProfile}>Save</button>
          </div>
        ) : (
          <p>Login as worker to view.</p>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">Job Recommendations</h2>
        <ul className="space-y-3">
          {jobs.map(j => (
            <li key={j._id} className="border p-3 rounded">
              <h3 className="font-semibold">{j.title}</h3>
              <p className="text-sm text-gray-700">{j.description}</p>
              <p className="text-xs text-gray-500">Skills: {j.skillsRequired.join(', ')}</p>
              <button className="mt-2 border px-3 py-1" onClick={()=>apply(j._id)}>Apply</button>
            </li>
          ))}
        </ul>
      </div>

      {message && <p className="md:col-span-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}