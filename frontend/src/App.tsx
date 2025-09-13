import { Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import WorkerDashboard from './pages/WorkerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';

function Nav() {
  return (
    <nav className="p-4 bg-white shadow flex gap-4">
      <Link to="/" className="font-bold">Job Matchmaker</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/worker">Worker</Link>
      <Link to="/employer">Employer</Link>
    </nav>
  );
}

export default function App() {
  return (
    <div>
      <Nav />
      <div className="p-4 max-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/worker" element={<WorkerDashboard />} />
          <Route path="/employer" element={<EmployerDashboard />} />
        </Routes>
      </div>
    </div>
  );
}