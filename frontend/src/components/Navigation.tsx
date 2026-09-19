import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LayoutDashboard, ShoppingBag, Users, Gift, Map } from 'lucide-react';
import ReCircleLogo from './ReCircleLogo';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header style={{ 
      background: 'rgba(255, 255, 255, 0.94)', 
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--line)', 
      padding: '0.85rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 20px -5px rgba(13, 51, 36, 0.05)'
    }}>
      <div className="container flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <ReCircleLogo size={34} textColor="var(--moss)" subtextColor="var(--fern)" />
        </Link>
        
        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          <Link 
            to="/dashboard" 
            className={`rc-chip ${isActive('/dashboard') ? 'on' : ''}`}
            style={{ textDecoration: 'none', gap: '6px' }}
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link 
            to="/marketplace" 
            className={`rc-chip ${isActive('/marketplace') ? 'on' : ''}`}
            style={{ textDecoration: 'none', gap: '6px' }}
          >
            <ShoppingBag size={16} /> Marketplace
          </Link>
          <Link 
            to="/community" 
            className={`rc-chip ${isActive('/community') ? 'on' : ''}`}
            style={{ textDecoration: 'none', gap: '6px' }}
          >
            <Users size={16} /> Community
          </Link>
          <Link 
            to="/rewards" 
            className={`rc-chip ${isActive('/rewards') ? 'on' : ''}`}
            style={{ textDecoration: 'none', gap: '6px' }}
          >
            <Gift size={16} /> Rewards
          </Link>
          <Link 
            to="/network" 
            className={`rc-chip ${isActive('/network') ? 'on' : ''}`}
            style={{ textDecoration: 'none', gap: '6px' }}
          >
            <Map size={16} /> Network
          </Link>
          
          <div style={{ width: '1px', height: '24px', background: 'var(--line)', margin: '0 6px' }} />

          <button 
            className="rc-btn rc-btn-ghost" 
            style={{ 
              padding: '6px 14px', 
              fontSize: '13px', 
              fontWeight: 600,
              borderColor: isActive('/profile') ? 'var(--fern)' : 'var(--line)',
              background: isActive('/profile') ? 'var(--mist)' : 'transparent'
            }}
            onClick={() => navigate('/profile')}
          >
            <User size={15} /> Profile
          </button>
        </nav>
      </div>
    </header>
  );
}
