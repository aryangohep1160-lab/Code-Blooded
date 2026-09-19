import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RotateCw, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: 'aarav@recircle.eco', password: 'password123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOfflineFallback, setShowOfflineFallback] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFastDemoLogin = (email: string, role: string, name: string) => {
    const demoToken = 'demo_token_' + Date.now();
    const demoUser = {
      id: 'demo-' + role.toLowerCase(),
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1] || '',
      email,
      role,
      ecoPoints: role === 'BUSINESS' ? 850 : 340,
      businessProfile: role === 'BUSINESS' ? {
        businessName: 'Gujarat Circular Solutions',
        address: 'Ellisbridge, Ahmedabad'
      } : null
    };

    localStorage.setItem('token', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    navigate('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowOfflineFallback(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid credentials');
      
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.warn('Login API error:', err.message);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Backend server is connecting or offline.');
        setShowOfflineFallback(true);
      } else {
        setError(err.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container animate-slide-up">
        <div className="auth-title">
          <div 
            className="flex justify-center items-center gap-2.5 cursor-pointer" 
            style={{ marginBottom: '0.75rem' }} 
            onClick={() => navigate('/')}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--moss)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sprout)',
              boxShadow: '0 4px 12px rgba(13, 51, 36, 0.2)'
            }}>
              <RotateCw size={20} />
            </div>
            <h1 style={{ margin: 0, fontSize: '2.2rem', color: 'var(--moss)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
              ReCircle
            </h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Sign in to continue your sustainable journey.</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          {error && (
            <div className="error-text" style={{ 
              marginBottom: '1rem', 
              textAlign: 'center', 
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              color: '#DC2626',
              fontSize: '13px'
            }}>
              {error}
              {showOfflineFallback && (
                <div style={{ marginTop: '8px' }}>
                  <button
                    type="button"
                    className="rc-btn rc-btn-primary"
                    style={{ padding: '6px 16px', fontSize: '12px', width: '100%' }}
                    onClick={() => handleFastDemoLogin(formData.email || 'aarav@recircle.eco', 'HOUSEHOLD', 'Aarav Patel')}
                  >
                    <CheckCircle2 size={14} /> Enter in Standalone Demo Mode
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input 
                type="email" 
                name="email" 
                className="input-field" 
                value={formData.email}
                required 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  className="input-field" 
                  value={formData.password}
                  style={{ width: '100%', paddingRight: '42px' }} 
                  required 
                  onChange={handleChange} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--muted)', 
                    cursor: 'pointer' 
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="rc-btn rc-btn-primary btn-full" 
              disabled={loading} 
              style={{ marginTop: '0.75rem', padding: '12px' }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--line)', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              One-Click Fast Demo Login
            </span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="rc-chip"
                style={{ fontSize: '12px', padding: '5px 12px' }}
                onClick={() => handleFastDemoLogin('aarav@recircle.eco', 'HOUSEHOLD', 'Aarav Patel')}
              >
                <Sparkles size={13} color="var(--fern)" /> Aarav (Household)
              </button>
              <button
                type="button"
                className="rc-chip"
                style={{ fontSize: '12px', padding: '5px 12px' }}
                onClick={() => handleFastDemoLogin('rohan@recircle.eco', 'BUSINESS', 'Rohan Mehta')}
              >
                <Sparkles size={13} color="var(--clay)" /> Rohan (Business)
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--muted)', margin: '1.25rem 0 0' }}>
            Don't have an account? <Link to="/signup" style={{ fontWeight: 600, color: 'var(--fern)' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
