import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Trash2, Award } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/Skeleton';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5001/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    addToast("Logged out successfully.", "info");
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account and all listings? This cannot be undone.")) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete account');
      
      localStorage.removeItem('token');
      addToast("Account permanently deleted.", "success");
      navigate('/');
    } catch (err) {
      addToast("Error deleting account.", "error");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="container" style={{ padding: '3rem 24px', maxWidth: '800px', margin: '0 auto' }}>
        <Skeleton height="40px" width="200px" style={{ marginBottom: '2rem' }} />
        <div className="glass-card"><Skeleton height="300px" /></div>
      </main>
    );
  }

  return (
    <main className="container animate-slide-up" style={{ padding: '3rem 24px', maxWidth: '800px', margin: '0 auto', flex: 1 }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <User size={36} color="var(--primary-light)" /> Profile Settings
        </h1>
        <button className="btn btn-outline" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'white' }}>Account Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Name / Business Name</p>
            <p style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>{profile.role === 'BUSINESS' ? profile.businessProfile?.businessName : `${profile.firstName} ${profile.lastName}`}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Email</p>
            <p style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>{profile.email}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Account Type</p>
            <p style={{ color: 'var(--primary-light)', fontSize: '1.1rem', margin: 0, fontWeight: 'bold' }}>{profile.role}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Total EcoPoints</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={18} color="var(--accent-light)" />
              <p style={{ color: 'var(--accent-light)', fontSize: '1.1rem', margin: 0, fontWeight: 'bold' }}>{profile.ecoPoints || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '50%' }}>
            <Trash2 size={24} color="#EF4444" />
          </div>
          <h3 style={{ color: '#EF4444', margin: 0, fontSize: '1.2rem' }}>Danger Zone</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Once you delete your account, there is no going back. Please be certain. All your data and active marketplace listings will be permanently erased.
        </p>
        <button 
          className="btn btn-outline" 
          style={{ borderColor: '#EF4444', color: '#EF4444', padding: '12px 24px', fontWeight: 'bold' }}
          onClick={handleDeleteAccount}
        >
          Permanently Delete Account
        </button>
      </div>
    </main>
  );
}
