import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RotateCw, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'HOUSEHOLD' | 'BUSINESS'>('HOUSEHOLD');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
    gstNumber: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOfflineFallback, setShowOfflineFallback] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDemoLogin = (demoRole: 'HOUSEHOLD' | 'BUSINESS' = 'HOUSEHOLD') => {
    const demoToken = 'demo_jwt_token_' + Date.now();
    const demoUser = demoRole === 'HOUSEHOLD' ? {
      id: 'demo-household',
      firstName: formData.firstName || 'Aarav',
      lastName: formData.lastName || 'Patel',
      email: formData.email || 'aarav@recircle.eco',
      role: 'HOUSEHOLD',
      ecoPoints: 340
    } : {
      id: 'demo-business',
      firstName: 'Rohan',
      lastName: 'Mehta',
      email: formData.email || 'rohan@recircle.eco',
      role: 'BUSINESS',
      ecoPoints: 850,
      businessProfile: {
        businessName: formData.businessName || 'Gujarat Circular Solutions',
        address: formData.address || 'Ellisbridge, Ahmedabad'
      }
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
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.warn('Signup API error:', err.message);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Backend server is connecting or offline.');
        setShowOfflineFallback(true);
      } else {
        setError(err.message || 'Signup failed. Please try again.');
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
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Give your unused things a second life.</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          
          {/* Role Selector Pill */}
          <div className="role-selector">
            <div 
              className={`role-option ${role === 'HOUSEHOLD' ? 'active' : ''}`}
              onClick={() => setRole('HOUSEHOLD')}
            >
              Household
            </div>
            <div 
              className={`role-option ${role === 'BUSINESS' ? 'active' : ''}`}
              onClick={() => setRole('BUSINESS')}
            >
              Business
            </div>
          </div>

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
                    onClick={() => handleDemoLogin(role)}
                  >
                    <CheckCircle2 size={14} /> Enter in Standalone Demo Mode
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {role === 'HOUSEHOLD' ? (
              /* Grid ensures First Name and Last Name stay 100% inside container without horizontal overflow */
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', marginBottom: '1.2rem' }}>
                <div className="input-group" style={{ margin: 0, minWidth: 0 }}>
                  <label className="input-label">First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    className="input-field" 
                    placeholder="e.g. Aarav" 
                    required 
                    onChange={handleChange} 
                  />
                </div>
                <div className="input-group" style={{ margin: 0, minWidth: 0 }}>
                  <label className="input-label">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    className="input-field" 
                    placeholder="e.g. Patel" 
                    required 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label className="input-label">Business Name</label>
                <input 
                  type="text" 
                  name="businessName" 
                  className="input-field" 
                  placeholder="e.g. Gujarat Circular Solutions" 
                  required 
                  onChange={handleChange} 
                />
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Email</label>
              <input 
                type="email" 
                name="email" 
                className="input-field" 
                placeholder="name@recircle.eco" 
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
                  style={{ width: '100%', paddingRight: '42px' }} 
                  placeholder="••••••••" 
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

            {role === 'BUSINESS' && (
              <>
                <div className="input-group">
                  <label className="input-label">GST Number (Optional)</label>
                  <input 
                    type="text" 
                    name="gstNumber" 
                    className="input-field" 
                    placeholder="24AABCU9603R1ZM" 
                    onChange={handleChange} 
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Business Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    className="input-field" 
                    placeholder="Industrial Zone, Ellisbridge, Ahmedabad" 
                    required 
                    onChange={handleChange} 
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="rc-btn rc-btn-primary btn-full" 
              disabled={loading} 
              style={{ marginTop: '0.75rem', padding: '12px' }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Quick Demo Bypass */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--line)', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Fast Evaluation Access
            </span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                className="rc-chip"
                style={{ fontSize: '12px', padding: '5px 12px' }}
                onClick={() => handleDemoLogin('HOUSEHOLD')}
              >
                <Sparkles size={13} color="var(--fern)" /> Quick Household
              </button>
              <button
                type="button"
                className="rc-chip"
                style={{ fontSize: '12px', padding: '5px 12px' }}
                onClick={() => handleDemoLogin('BUSINESS')}
              >
                <Sparkles size={13} color="var(--clay)" /> Quick Business
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--muted)', margin: '1.25rem 0 0' }}>
            Already have an account? <Link to="/login" style={{ fontWeight: 600, color: 'var(--fern)' }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
