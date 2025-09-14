import React, { useState } from 'react';

export default function Hero({ onPrimary }) {
  const [q, setQ] = useState('');
  return (
    <section className="hero">
      <div className="hero-left card">
        <h2 className="hero-title">Connect Workers with <span className="gradient-text">Perfect Jobs</span></h2>
        <p className="hero-desc">Our AI-powered platform connects skilled workers with employers seamlessly. Whether you're looking for work or hiring talent, we make job matching simple and effective.</p>

        <div className="hero-actions">
          <button className="cta" onClick={onPrimary}>Get Started</button>
          <div className="search-bar" style={{minWidth:320}}>
            <input className="search-input" placeholder="Search jobs, skills, locations..." value={q} onChange={e=>setQ(e.target.value)} />
            <button className="search-btn" onClick={()=>alert(`Searching for "${q}" (demo)`)}>Search</button>
          </div>
        </div>
      </div>

      <aside className="feature-card card">
        <div className="feature-emoji">🤝</div>
        <div className="feature-title">Smart Matching</div>
        <div className="feature-desc">AI-powered job matching for better connections</div>
      </aside>
    </section>
  );
}
