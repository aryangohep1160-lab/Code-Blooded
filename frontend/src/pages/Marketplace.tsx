import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import { API_BASE_URL } from '../config/api';

const DEFAULT_LISTINGS = [
  {
    id: 'l1',
    title: 'Ergonomic Mesh Study Chair',
    description: 'High back breathable mesh office chair with adjustable lumbar support and hydraulic lift.',
    type: 'SELL',
    price: 1499.0,
    condition: 'Used',
    imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'l2',
    title: 'Computer Science & AI Textbooks Bundle',
    description: 'Semester 3 to 6 reference books for Algorithms, Python, and Machine Learning.',
    type: 'SWAP',
    price: 0.0,
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80'
  },
  {
    id: 'l3',
    title: 'Philips Electric Kettle 1.5L',
    description: 'Stainless steel fast-boiling kettle. Fully tested and descaled.',
    type: 'SELL',
    price: 450.0,
    condition: 'Used',
    imageUrl: 'https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=600&q=80'
  },
  {
    id: 'l4',
    title: 'Mechanical Keyboard (Cherry MX Blue)',
    description: 'Tactile mechanical keyboard with braided USB cable. Free donation to engineering students.',
    type: 'DONATE',
    price: 0.0,
    condition: 'Used',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80'
  }
];

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

        const res = await fetch(`${API_BASE_URL}/api/listings?${queryParams.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setListings(Array.isArray(data) && data.length > 0 ? data : DEFAULT_LISTINGS);
      } catch (err) {
        console.warn('Marketplace fetch fallback:', err);
        setListings(DEFAULT_LISTINGS.filter(item => {
          const matchType = typeFilter === 'ALL' || item.type === typeFilter;
          const matchSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
          return matchType && matchSearch;
        }));
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
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.85)', padding: 6, borderRadius: '50%', backdropFilter: 'blur(4px)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                    <Heart size={18} color="var(--moss)" />
                  </div>
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--moss)', color: 'var(--sprout)', padding: '4px 12px', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem', fontWeight: 700 }}>
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
