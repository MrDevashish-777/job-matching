import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AuthCard from './components/AuthCard';
import DashboardWorker from './components/DashboardWorker';

function App() {
  const [route, setRoute] = useState('home'); // home | login | register | dashboard
  return (
    <div className="app-root">
      <Navbar onNavigate={setRoute} active={route} />
      <main className="app-main">
        {route === 'home' && <Hero onPrimary={() => setRoute('register')} />}
        {route === 'login' && <AuthCard mode="login" onBack={() => setRoute('home')} />}
        {route === 'register' && <AuthCard mode="register" onBack={() => setRoute('home')} />}
        {route === 'dashboard' && <DashboardWorker onBack={() => setRoute('home')} />}
      </main>
      <footer className="app-footer">
        <div>© {new Date().getFullYear()} Job Matchmaker</div>
      </footer>
    </div>
  );
}

export default App;
