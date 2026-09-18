import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Search, Filter, Plus, Heart } from 'lucide-react';

export default function Marketplace() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/listings');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) {
    return <div className="auth-wrapper"><div className="animate-slide-up"><Leaf size={40} className="spin" color="var(--primary-light)" /></div></div>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header / Navbar */}
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
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Leaf size={28} color="var(--primary-light)" />
            <h2 style={{ margin: 0, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>ReCircle</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '0.9rem' }} onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
            <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }} onClick={() => navigate('/create-listing')}>
              <Plus size={16} /> New Listing
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container animate-slide-up" style={{ padding: '3rem 24px', flex: 1 }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Marketplace</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Find or offer items in your local area.</p>
          </div>
          <div className="flex gap-4">
            <div style={{ position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" className="input-field" placeholder="Search items..." style={{ paddingLeft: '2.5rem', width: '250px', marginBottom: 0 }} />
            </div>
            <button className="btn btn-outline" style={{ padding: '12px 16px' }}><Filter size={18} /></button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {listings.length === 0 ? (
            <div className="glass-card text-center" style={{ gridColumn: '1 / -1' }}>
              <p style={{ color: 'var(--text-muted)' }}>No items listed yet. Be the first!</p>
            </div>
          ) : (
            listings.map(item => (
              <div key={item.id} className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                  height: '200px', 
                  background: item.imageUrl ? `url(${item.imageUrl}) center/cover` : 'rgba(52, 211, 153, 0.1)',
                  borderBottom: 'var(--glass-border)',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(15,23,42,0.6)', padding: 6, borderRadius: '50%', backdropFilter: 'blur(4px)' }}>
                    <Heart size={18} color="white" />
                  </div>
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem', fontWeight: 600 }}>
                    {item.type}
                  </div>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>{item.description.substring(0, 80)}...</p>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                      {item.price ? `$${item.price.toFixed(2)}` : 'Free'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.condition}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
