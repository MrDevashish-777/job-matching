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
      setMessage('Job created successfully');
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
      setMessage('Worker accepted successfully');
      setCandidates([]);
      await loadJobs();
    } catch (e: any) {
      setMessage(e?.response?.data?.message || 'Accept failed');
    }
  }

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-200 mb-2">Employer Dashboard</h1>
          <p className="text-green-100">Post jobs and find the perfect candidates</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">📝</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-300">Post New Job</h2>
            </div>
            
            <div className="space-y-4">
              <input className="input-field" placeholder="Job Title" value={title} onChange={e=>setTitle(e.target.value)} />
              <textarea className="input-field h-24 resize-none" placeholder="Job Description" value={description} onChange={e=>setDescription(e.target.value)} />
              <input className="input-field" placeholder="Required skills (comma separated)" value={skills} onChange={e=>setSkills(e.target.value)} />
              <input className="input-field" placeholder="Budget (optional)" type="number" value={budget ?? ''} onChange={e=>setBudget(Number(e.target.value))} />
              <input className="input-field" placeholder="Location (optional)" value={location} onChange={e=>setLocation(e.target.value)} />
              <button className="btn-primary" onClick={createJob}>Create Job Posting</button>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">📋</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-300">My Job Postings</h2>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {jobs.map(j => (
                <div key={j._id} className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-800 mb-2">{j.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{j.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {j.skillsRequired.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">{skill}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">📍 {j.location || 'Remote'}</span>
                    <button className="btn-secondary text-sm py-2 px-4" onClick={()=>viewMatches(j._id)}>View Candidates</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {candidates.length > 0 && (
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Recommended Candidates</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((c, i) => (
                <div key={i} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-800 text-lg">{c.worker?.name}</h3>
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {(c.score * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {(c.worker?.skills||[]).slice(0, 3).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{skill}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm text-gray-700">{c.worker?.location || 'Not specified'}</p>
                    </div>
                    
                    {(c.worker?.email || c.worker?.phone) && (
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="text-sm text-gray-700">{c.worker?.email || c.worker?.phone}</p>
                      </div>
                    )}
                  </div>
                  
                  <button className="btn-primary text-sm py-3" onClick={()=>accept(c.worker._id)}>
                    Accept Candidate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {message && <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-700 text-center font-medium">{message}</p>
        </div>}
      </div>
    </div>
  );
}