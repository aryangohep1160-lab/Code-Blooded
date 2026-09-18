import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.tsx';
import Navigation from './components/Navigation.tsx';
import LandingPage from './pages/LandingPage.tsx';
import Signup from './pages/Signup.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Marketplace from './pages/Marketplace.tsx';
import CreateListing from './pages/CreateListing.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Profile from './pages/Profile.tsx';
import Community from './pages/Community.tsx';
import Rewards from './pages/Rewards.tsx';
import Network from './pages/Network.tsx';

function AuthenticatedLayout() {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/listing/:id" element={<ProductDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/community" element={<Community />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/network" element={<Network />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
