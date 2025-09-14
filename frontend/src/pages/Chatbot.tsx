import { useState } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [history, setHistory] = useState<{role:'user'|'assistant'; text:string}[]>([]);
  const [input, setInput] = useState('');
  const token = localStorage.getItem('token') || '';

  async function send() {
    if (!input.trim()) return;
    const q = input.trim();
    setHistory(h => [...h, { role: 'user', text: q }]);
    setInput('');
    try {
      const { data } = await axios.post('/api/chat/ask', { query: q }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
      setHistory(h => [...h, { role: 'assistant', text: data.reply || JSON.stringify(data) }]);
    } catch (e: any) {
      setHistory(h => [...h, { role: 'assistant', text: e?.response?.data?.message || 'Error' }]);
    }
  }

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-200 mb-6">Chatbot Assistant</h1>
        <div className="card">
          <div className="h-96 overflow-y-auto space-y-3 mb-4 p-2 bg-white/60 rounded">
            {history.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={`inline-block px-3 py-2 rounded-lg ${m.role==='user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>{m.text}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input-field flex-1" placeholder="Ask about jobs, workers..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send(); }} />
            <button className="btn-primary" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}