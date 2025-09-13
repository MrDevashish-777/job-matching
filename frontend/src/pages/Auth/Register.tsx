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
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      <form className="space-y-3" onSubmit={submit}>
        <div className="flex gap-2">
          <button type="button" className={`px-3 py-1 border ${role==='worker'?'bg-gray-200':''}`} onClick={()=>setRole('worker')}>Worker</button>
          <button type="button" className={`px-3 py-1 border ${role==='employer'?'bg-gray-200':''}`} onClick={()=>setRole('employer')}>Employer</button>
        </div>

        {role==='worker' ? (
          <input className="w-full border p-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        ) : (
          <>
            <input className="w-full border p-2" placeholder="Company Name" value={companyName} onChange={e=>setCompanyName(e.target.value)} />
            <input className="w-full border p-2" placeholder="Contact Name" value={contactName} onChange={e=>setContactName(e.target.value)} />
          </>
        )}

        <input className="w-full border p-2" placeholder="Email (or leave blank and use phone)" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2" placeholder="Phone (optional)" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="w-full border p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input className="w-full border p-2" placeholder="Location (optional)" value={location} onChange={e=>setLocation(e.target.value)} />
        <button className="w-full bg-black text-white p-2">Register</button>
      </form>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}