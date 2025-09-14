import { Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import WorkerDashboard from './pages/WorkerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import Chatbot from './pages/Chatbot';

function Nav() {
  return (
    <nav className="px-16 py-6 flex justify-between items-center bg-gray-900/80 backdrop-blur-md shadow-sm relative z-20">
      <Link to="/" className="font-bold text-3xl text-white tracking-wide">Job Matchmaker</Link>
      <div className="flex gap-8">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
        <Link to="/worker" className="nav-link">Worker</Link>
        <Link to="/employer" className="nav-link">Employer</Link>
      </div>
    </nav>
  );
}

function AnimatedGrid() {
  const squares = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 6
  }));

  return (
    <div className="animated-grid">
      {squares.map(square => (
        <div
          key={square.id}
          className="grid-square"
          style={{
            left: `${square.left}%`,
            top: `${square.top}%`,
            animationDelay: `${square.delay}s`
          }}
        />
      ))}
    </div>
  );
}

function HomePage() {
  return (
    <div className="page-container flex items-center">
      <AnimatedGrid />
      <div className="content-wrapper container mx-auto px-16 flex items-center justify-between">
        <div className="w-1/2 pr-16">
          <h1 className="text-6xl font-bold text-white mb-8 leading-tight">
            Connect Workers with<br />
            <span style={{ color: '#00FF40' }}>Perfect Jobs</span>
          </h1>
          <p className="text-gray-300 text-xl mb-10 leading-relaxed max-w-2xl">
            Our AI-powered platform connects skilled workers with employers seamlessly.
            Whether you're looking for work or hiring talent, we make job matching simple and effective.
          </p>
          <Link to="/login" className="btn-primary inline-block font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
            Get Started
          </Link>
        </div>
        <div className="w-1/2 flex justify-center">
          <div className="glass-card p-8 text-center">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Smart Matching</h3>
            <p className="text-gray-300">AI-powered job matching for better connections</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="relative">
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/chat" element={<Chatbot />} />
      </Routes>
    </div>
  );
}