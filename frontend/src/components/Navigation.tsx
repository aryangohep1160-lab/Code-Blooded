import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, User, LayoutDashboard, ShoppingBag } from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header style={{ 
      background: 'rgba(15, 23, 42, 0.7)', 
      backdropFilter: 'blur(16px)',
      borderBottom: 'var(--glass-border)', 
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Leaf size={28} color="var(--primary-light)" />
          <h2 style={{ margin: 0, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>ReCircle</h2>
        </Link>
        
        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link 
            to="/dashboard" 
            style={{ 
              color: isActive('/dashboard') ? 'white' : 'var(--text-muted)', 
              textDecoration: 'none', 
              fontSize: '0.95rem',
              fontWeight: isActive('/dashboard') ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link 
            to="/marketplace" 
            style={{ 
              color: isActive('/marketplace') ? 'white' : 'var(--text-muted)', 
              textDecoration: 'none', 
              fontSize: '0.95rem',
              fontWeight: isActive('/marketplace') ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShoppingBag size={18} /> Marketplace
          </Link>
          <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }} />
          <button 
            className="btn btn-outline" 
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderColor: isActive('/profile') ? 'var(--primary-light)' : 'var(--border)' }}
            onClick={() => navigate('/profile')}
          >
            <User size={16} /> Profile
          </button>
        </nav>
      </div>
    </header>
  );
}
