import React, { useState } from 'react';

type Message = { role: 'user' | 'assistant'; text: string };

type Props = {
  onSend: (text: string) => Promise<string>;
}

export default function ChatWindow({ onSend }: Props) {
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  async function send() {
    if (!input.trim()) return;
    const q = input.trim();
    setHistory(h => [...h, { role: 'user', text: q }]);
    setInput('');
    const reply = await onSend(q);
    setHistory(h => [...h, { role: 'assistant', text: reply }]);
  }

  return (
    <div className="card">
      <div className="h-96 overflow-y-auto space-y-3 mb-4 p-2 bg-white/60 rounded">
        {history.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={`inline-block px-3 py-2 rounded-lg ${m.role==='user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="input-field flex-1" placeholder="Ask something..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send(); }} />
        <button className="btn-primary" onClick={send}>Send</button>
      </div>
    </div>
  );
}