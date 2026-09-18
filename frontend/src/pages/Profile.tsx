import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Trash2, Award } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/Skeleton';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [userListings, setUserListings] = useState<any[]>([]);
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
        const [profileRes, listingsRes] = await Promise.all([
          fetch('http://localhost:5001/api/auth/profile', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5001/api/listings/user/me', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!profileRes.ok) throw new Error('Unauthorized');
        const profileData = await profileRes.json();
        setProfile(profileData);

        if (listingsRes.ok) {
          setUserListings(await listingsRes.json());
        }
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

  const handleDeleteListing = async (listingId: string) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete listing');
      
      setUserListings(prev => prev.filter(l => l.id !== listingId));
      addToast("Listing deleted.", "success");
    } catch (err) {
      addToast("Error deleting listing.", "error");
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

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'white' }}>My Active Listings</h3>
        {userListings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>You haven't posted any items yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {userListings.map(listing => (
              <div key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.5)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {listing.imageUrl ? (
                    <img src={listing.imageUrl} alt={listing.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <div style={{ width: '50px', height: '50px', background: 'var(--glass-bg)', borderRadius: '8px' }} />
                  )}
                  <div>
                    <h4 style={{ margin: 0, color: 'white' }}>{listing.title}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)' }}>{listing.type}</span>
                  </div>
                </div>
                <button 
                  className="btn btn-outline" 
                  style={{ padding: '6px 12px', borderColor: '#EF4444', color: '#EF4444' }}
                  onClick={() => handleDeleteListing(listing.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
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
