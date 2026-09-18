import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Signup() {
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
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container animate-slide-up">
        <div className="auth-title">
          <div className="flex justify-center items-center gap-2 cursor-pointer" style={{ marginBottom: '1rem' }} onClick={() => navigate('/')}>
            <Leaf size={40} color="var(--primary-light)" />
            <h1>ReCircle</h1>
          </div>
          <p>Give your unused things a second life.</p>
        </div>

        <div className="glass-card">
          <div className="role-selector">
            <div 
              className={`role-option household ${role === 'HOUSEHOLD' ? 'active' : ''}`}
              onClick={() => setRole('HOUSEHOLD')}
            >
              Household
            </div>
            <div 
              className={`role-option business ${role === 'BUSINESS' ? 'active' : ''}`}
              onClick={() => setRole('BUSINESS')}
            >
              Business
            </div>
          </div>

          {error && <div className="error-text" style={{marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {role === 'HOUSEHOLD' ? (
              <div className="flex gap-4">
                <div className="input-group" style={{flex: 1}}>
                  <label className="input-label">First Name</label>
                  <input type="text" name="firstName" className="input-field" required onChange={handleChange} />
                </div>
                <div className="input-group" style={{flex: 1}}>
                  <label className="input-label">Last Name</label>
                  <input type="text" name="lastName" className="input-field" required onChange={handleChange} />
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label className="input-label">Business Name</label>
                <input type="text" name="businessName" className="input-field" required onChange={handleChange} />
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" name="email" className="input-field" required onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input type="password" name="password" className="input-field" required onChange={handleChange} />
            </div>

            {role === 'BUSINESS' && (
              <>
                <div className="input-group">
                  <label className="input-label">GST Number (Optional)</label>
                  <input type="text" name="gstNumber" className="input-field" onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label className="input-label">Business Address</label>
                  <input type="text" name="address" className="input-field" required onChange={handleChange} />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{marginTop: '1rem'}}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem'}}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
