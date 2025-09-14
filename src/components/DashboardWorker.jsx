import React, { useState, useEffect } from 'react';

export default function DashboardWorker() {
  const [loading, setLoading] = useState(true);
  const [notifyOpen, setNotifyOpen] = useState(false);
  useEffect(()=> {
    const t = setTimeout(()=>setLoading(false), 900);
    return ()=>clearTimeout(t);
  },[]);

  return (
    <div className="dashboard">
      <aside>
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontWeight:800}}>My Profile</div>
            <div className="notifications">
              <button className="notify-btn" onClick={()=>setNotifyOpen(s=>!s)}>🔔</button>
              {notifyOpen && (
                <div className="notify-pop">
                  <div><strong>New match:</strong> Frontend Developer — 2h ago</div>
                  <div><strong>Message:</strong> Employer invited you — 1d ago</div>
                </div>
              )}
            </div>
          </div>

          <div style={{marginTop:12}} className="profile-header">
            <div className="avatar">JD</div>
            <div>
              <div style={{fontWeight:700}}>Jordan Doe</div>
              <div className="small">Frontend Developer • 3 years</div>
            </div>
          </div>

          <div className="progress-line">
            <div style={{width: '70%',height:'100%',background:'linear-gradient(90deg,var(--accent-from),var(--accent-to))'}} />
          </div>
          <div className="small" style={{marginTop:8}}>Profile 70% complete</div>

          <div style={{marginTop:12}} className="row">
            <button className="social-btn" onClick={()=>alert('Edit profile (demo)')}>Edit</button>
            <button className="social-btn" onClick={()=>alert('Share profile (demo)')}>Share</button>
          </div>
        </div>

        <div style={{height:14}} />

        <div className="card">
          <div style={{fontWeight:800}}>Quick Stats</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:10}}>
            <div style={{background:'rgba(2,6,23,0.03)',padding:12,borderRadius:10}}>
              <div className="small-muted">Matches</div>
              <div style={{fontWeight:800}}>12</div>
            </div>
            <div style={{background:'rgba(2,6,23,0.03)',padding:12,borderRadius:10}}>
              <div className="small-muted">Applications</div>
              <div style={{fontWeight:800}}>4</div>
            </div>
          </div>
        </div>
      </aside>

      <section>
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontWeight:800}}>Job Recommendations</div>
            <div className="small-muted">Based on your skills</div>
          </div>

          <div style={{marginTop:14,display:'grid',gap:12}}>
            {loading ? (
              <>
                <div className="skeleton skel" style={{height:76}} />
                <div className="skeleton skel" style={{height:76}} />
                <div className="skeleton skel" style={{height:76}} />
              </>
            ) : (
              <>
                <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>Frontend Developer</div>
                    <div className="small-muted">Remote • $45k–60k</div>
                  </div>
                  <div className="row">
                    <button className="social-btn" onClick={()=>alert('Save (demo)')}>Save</button>
                    <button className="cta" onClick={()=>alert('Apply (demo)')}>Apply</button>
                  </div>
                </div>

                <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>UI/UX Designer</div>
                    <div className="small-muted">On-site • $50k–70k</div>
                  </div>
                  <div className="row">
                    <button className="social-btn" onClick={()=>alert('Save (demo)')}>Save</button>
                    <button className="cta" onClick={()=>alert('Apply (demo)')}>Apply</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
