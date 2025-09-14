import React, { useState, useEffect } from 'react';

const LINKS = ['home','login','register','worker','employer'];

export default function Navbar({ onNavigate, active }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(()=> {
    document.documentElement.classList.toggle('dark', dark);
  },[dark]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="brand" style={{cursor:'pointer'}} onClick={()=>onNavigate('home')}>Job Matchmaker</div>
        </div>

        <nav>
          <div className="nav-links" role="navigation">
            {LINKS.map(l => (
              <button key={l}
                className={`nav-link ${active===l ? 'active':''}`}
                onClick={()=>onNavigate(l)}>
                {l.charAt(0).toUpperCase()+l.slice(1)}
              </button>
            ))}
            <button className="toggle-btn" title="Toggle theme" onClick={()=>setDark(d=>!d)}>{dark? '🌙':'☀️'}</button>
          </div>

          <button className="hamburger" onClick={()=>setOpen(o=>!o)} aria-label="menu">
            ☰
          </button>

          {open && (
            <div style={{position:'absolute',right:20,top:64,background:'var(--panel)',boxShadow:'var(--shadow)',borderRadius:12,padding:12}}>
              {LINKS.map(l => (
                <div key={l} style={{padding:8}}>
                  <button className="nav-link" onClick={()=>{ onNavigate(l); setOpen(false); }}>{l}</button>
                </div>
              ))}
              <div style={{paddingTop:8}}><button className="toggle-btn" onClick={()=>setDark(d=>!d)}>{dark? 'Dark':'Light'}</button></div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
