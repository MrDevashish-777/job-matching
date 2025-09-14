import React, { useState } from 'react';

export default function AuthCard({ mode='login', onBack }) {
  const [tab, setTab] = useState('worker'); // worker | employer
  const [vals, setVals] = useState({email:'',password:'',name:''});
  const [show, setShow] = useState(false);
  const validEmail = /\S+@\S+\.\S+/.test(vals.email);
  const progress = mode==='register' ? (vals.email?30:0) + (vals.name?30:0) + (vals.password?40:0) : 100;

  return (
    <div className="auth-card card" style={{maxWidth:480}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div style={{fontWeight:800,fontSize:18}}>{mode==='login' ? 'Welcome back' : 'Create your account'}</div>
        <div style={{fontSize:12,color:'var(--muted)',cursor:'pointer'}} onClick={onBack}>Back</div>
      </div>

      <div className="tab-row">
        <div className={`tab ${tab==='worker'?'active':''}`} onClick={()=>setTab('worker')}>Worker</div>
        <div className={`tab ${tab==='employer'?'active':''}`} onClick={()=>setTab('employer')}>Employer</div>
      </div>

      {mode==='register' && (
        <>
          <div className="small-muted">Signup progress</div>
          <div className="progress"><i style={{width:`${Math.min(progress,100)}%`}}/></div>
        </>
      )}

      <div style={{marginTop:12}}>
        {mode==='register' && (
          <div className="input">
            <span>👤</span>
            <input placeholder="Full name" value={vals.name} onChange={e=>setVals(v=>({...v,name:e.target.value}))} />
          </div>
        )}

        <div className="input">
          <span>📧</span>
          <input placeholder="Email" value={vals.email} onChange={e=>setVals(v=>({...v,email:e.target.value}))} />
        </div>
        <div className="input">
          <span>🔒</span>
          <input type={show?'text':'password'} placeholder="Password" value={vals.password} onChange={e=>setVals(v=>({...v,password:e.target.value}))} />
          <button onClick={()=>setShow(s=>!s)} style={{background:'transparent',border:0,cursor:'pointer'}}>{show?'Hide':'Show'}</button>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
          <label className="small-muted"><input type="checkbox" /> Remember me</label>
          <a className="small-muted" href="#forgot">Forgot?</a>
        </div>

        <div style={{marginTop:12}}>
          <button className="cta" style={{width:'100%'}} onClick={()=>alert(`${mode} ${tab} (demo)`)}>{mode==='login'?'Sign In':'Create Account'}</button>
        </div>

        <div style={{marginTop:12}} className="center small-muted">Or continue with</div>
        <div className="social-row">
          <button className="social-btn" onClick={()=>alert('Google login (demo)')}>🔎 Google</button>
          <button className="social-btn" onClick={()=>alert('LinkedIn login (demo)')}>💼 LinkedIn</button>
        </div>

        <div style={{marginTop:12}} className="small center">By continuing you agree to our Terms.</div>
      </div>
    </div>
  );
}
