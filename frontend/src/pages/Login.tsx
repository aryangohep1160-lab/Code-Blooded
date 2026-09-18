import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
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
          <p>Sign in to continue your sustainable journey.</p>
        </div>

        <div className="glass-card">
          {error && <div className="error-text" style={{marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" name="email" className="input-field" required onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input type="password" name="password" className="input-field" required onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{marginTop: '1rem'}}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem'}}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
