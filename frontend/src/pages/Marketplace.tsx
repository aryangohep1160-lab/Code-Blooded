import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart } from 'lucide-react';
import Skeleton from '../components/Skeleton';

export default function Marketplace() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (typeFilter !== 'ALL') queryParams.append('type', typeFilter);

        const res = await fetch(`http://localhost:5001/api/listings?${queryParams.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Add a small debounce for typing
    const delay = setTimeout(() => {
      fetchListings();
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, typeFilter]);

  if (loading) {
    return (
      <main className="container animate-slide-up" style={{ padding: '3rem 24px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card" style={{ padding: '0' }}><Skeleton height="350px" borderRadius="12px" /></div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <>
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
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search items..." 
                style={{ paddingLeft: '2.5rem', width: '250px', marginBottom: 0 }} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {['ALL', 'SELL', 'DONATE', 'SWAP', 'REPAIR', 'WANTED'].map(type => (
              <button 
                key={type}
                className={`btn ${typeFilter === type ? 'btn-primary' : 'btn-outline'}`} 
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                onClick={() => setTypeFilter(type)}
              >
                {type === 'ALL' ? 'All Items' : type}
              </button>
            ))}
          </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {listings.length === 0 ? (
            <div className="glass-card text-center" style={{ gridColumn: '1 / -1' }}>
              <p style={{ color: 'var(--text-muted)' }}>No items listed yet. Be the first!</p>
            </div>
          ) : (
            listings.map(item => (
              <div 
                key={item.id} 
                className="glass-card listing-card" 
                style={{ padding: '0', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onClick={() => navigate(`/listing/${item.id}`)}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
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
                    <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                      {item.price ? `₹${item.price.toFixed(2)}` : 'Free'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.condition}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
