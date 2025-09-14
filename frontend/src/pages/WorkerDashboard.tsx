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
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-200 mb-2">Worker Dashboard</h1>
          <p className="text-green-100">Manage your profile and find perfect job matches</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">👤</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-300">My Profile</h2>
            </div>
            
            {me ? (
              <div className="space-y-4">
                <input className="input-field" placeholder="Full Name" value={me.name} onChange={e=>setMe({...me, name:e.target.value})} />
                <input className="input-field" placeholder="Skills (comma separated)" value={(me.skills||[]).join(', ')} onChange={e=>setMe({...me, skills:e.target.value.split(',').map(s=>s.trim())})} />
                <input className="input-field" placeholder="Years of Experience" type="number" value={me.experienceYears||0} onChange={e=>setMe({...me, experienceYears:Number(e.target.value)})} />
                <input className="input-field" placeholder="Location" value={me.location||''} onChange={e=>setMe({...me, location:e.target.value})} />
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input type="checkbox" className="w-5 h-5 text-blue-500 rounded" checked={me.availability ?? true} onChange={e=>setMe({...me, availability:e.target.checked})} /> 
                  <span className="text-gray-700 font-medium">Available for work</span>
                </label>
                <button className="btn-secondary w-full" onClick={saveProfile}>Save Profile</button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-green-500">Please login as a worker to view your profile</p>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">💼</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-300">Job Recommendations</h2>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {jobs.map(j => (
                <div key={j._id} className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-800 mb-2">{j.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{j.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {j.skillsRequired.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{skill}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">📍 {j.location || 'Remote'}</span>
                    <button className="btn-secondary text-sm py-2 px-4" onClick={()=>apply(j._id)}>Apply Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {message && <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-blue-700 text-center font-medium">{message}</p>
        </div>}
      </div>
    </div>
  );
}