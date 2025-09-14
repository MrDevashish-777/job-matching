import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [role, setRole] = useState<'worker'|'employer'>('worker');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    try {
      const payload: any = { role, email: email || undefined, phone: phone || undefined, password, location };
      if (role === 'worker') payload.name = name;
      else { payload.companyName = companyName; payload.contactName = contactName; }
      const { data } = await axios.post('/api/auth/register', payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      setMessage('Registered! Use nav to go to dashboard.');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="page-container flex items-center justify-center">
      <div className="max-w-md w-full glass-card p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🎆</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-300 mb-2">Join Us Today</h1>
          <p className="text-gray-300">Create your account to get started</p>
        </div>
        
        <form className="space-y-6" onSubmit={submit}>
          <div className="flex gap-3 mb-6">
            <button type="button" className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
              role==='worker' ? 'bg-blue-500 border-blue-500 text-white shadow-lg' : 'border-gray-300 text-gray-600 hover:border-blue-300'
            }`} onClick={()=>setRole('worker')}>Worker</button>
            <button type="button" className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
              role==='employer' ? 'bg-blue-500 border-blue-500 text-white shadow-lg' : 'border-gray-300 text-gray-600 hover:border-blue-300'
            }`} onClick={()=>setRole('employer')}>Employer</button>
          </div>

          {role==='worker' ? (
            <input className="input-field" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
          ) : (
            <>
              <input className="input-field" placeholder="Company Name" value={companyName} onChange={e=>setCompanyName(e.target.value)} />
              <input className="input-field" placeholder="Contact Name" value={contactName} onChange={e=>setContactName(e.target.value)} />
            </>
          )}

          <input className="input-field" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input-field" placeholder="Phone (optional)" value={phone} onChange={e=>setPhone(e.target.value)} />
          <input className="input-field" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <input className="input-field" placeholder="Location (optional)" value={location} onChange={e=>setLocation(e.target.value)} />
          
          <button className="btn-primary">Create Account</button>
          
          <div className="text-center">
            <span className="text-gray-600 text-sm">Already have an account? </span>
            <a href="/login" className="text-blue-500 hover:text-blue-600 text-sm font-medium">Sign in here</a>
          </div>
        </form>
        
        {message && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600 text-center">{message}</p>
        </div>}
      </div>
    </div>
  );
}