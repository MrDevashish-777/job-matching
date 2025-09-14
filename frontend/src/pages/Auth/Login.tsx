import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [role, setRole] = useState<'worker'|'employer'>('worker');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    try {
      const { data } = await axios.post('/api/auth/login', { role, email: email || undefined, phone: phone || undefined, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      setMessage('Logged in! Use nav to go to dashboard.');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="page-container flex items-center justify-center">
      <div className="max-w-md w-full glass-card p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">💼</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-300 mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to your account</p>
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
          
          <input className="input-field" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input-field" placeholder="Phone (optional)" value={phone} onChange={e=>setPhone(e.target.value)} />
          <input className="input-field" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          
          <button className="btn-primary">Sign In</button>
          
          <div className="text-center">
            <span className="text-gray-600 text-sm">Don't have an account? </span>
            <a href="/register" className="text-blue-500 hover:text-blue-600 text-sm font-medium">Sign up here</a>
          </div>
        </form>
        
        {message && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 text-center">{message}</p>
        </div>}
      </div>
    </div>
  );
}