import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Marketplace from './pages/Marketplace.tsx';
import CreateListing from './pages/CreateListing.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/create-listing" element={<CreateListing />} />
      </Routes>
    </Router>
  );
}

export default App;
