import { useEffect, useState } from 'react';
import { Map, MapPin, Star, X, Phone, Clock, Globe } from 'lucide-react';
import Skeleton from '../components/Skeleton';

interface Partner {
  id: string;
  name: string;
  type: string;
  category: string;
  address: string;
  distance: string;
  rating: number;
  image: string;
  description: string;
  phone?: string;
  hours?: string;
  website?: string;
}

export default function Network() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5001/api/network/partners?type=${filter}`);
        if (res.ok) setPartners(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, [filter]);

  return (
    <main className="container animate-slide-up" style={{ padding: '3rem 24px', flex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Map size={40} color="var(--primary-light)" /> Local Repair Network
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem' }}>Find nearby repair shops, recycling centers, and donation hubs.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {['ALL', 'REPAIR', 'RECYCLE', 'DONATION'].map(type => (
          <button 
            key={type}
            className={`btn ${filter === type ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(type)}
            style={{ padding: '8px 24px' }}
          >
            {type === 'ALL' ? 'All Partners' : type}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          {[1,2,3,4].map(i => <div key={i} className="glass-card" style={{ padding: 0 }}><Skeleton height="400px" borderRadius="16px" /></div>)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          {partners.map(partner => (
            <div key={partner.id} className="glass-card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', position: 'relative' }}>
                <img src={partner.image} alt={partner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: 'var(--radius-pill)', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {partner.category}
                </div>
                <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {partner.distance}
                </div>
              </div>
              
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'white' }}>{partner.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FBBF24', fontWeight: 'bold' }}>
                    <Star size={16} fill="#FBBF24" /> {partner.rating}
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {partner.address}
                </p>
                <p style={{ color: 'var(--text-muted)', flex: 1, marginBottom: '1.5rem', fontSize: '0.95rem' }}>{partner.description}</p>
                
                <button className="btn btn-outline btn-full" onClick={() => setSelectedPartner(partner)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedPartner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '24px'
        }} onClick={() => setSelectedPartner(null)}>
          <div className="glass-card animate-slide-up" style={{ 
            maxWidth: '500px', width: '100%', padding: '2rem', position: 'relative' 
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedPartner(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div style={{ height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <img src={selectedPartner.image} alt={selectedPartner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <h2 style={{ marginBottom: '0.5rem', color: 'white' }}>{selectedPartner.name}</h2>
            <p style={{ color: 'var(--primary-light)', fontWeight: 600, marginBottom: '1.5rem' }}>{selectedPartner.category}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={18} color="var(--text-muted)" />
                <span>{selectedPartner.address} ({selectedPartner.distance})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} color="var(--text-muted)" />
                <span>{selectedPartner.phone || 'Contact not available'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={18} color="var(--text-muted)" />
                <span>{selectedPartner.hours || 'Hours not available'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Globe size={18} color="var(--text-muted)" />
                <a href="#" style={{ color: 'var(--primary-light)' }}>{selectedPartner.website || 'Website not available'}</a>
              </div>
            </div>

            <button className="btn btn-primary btn-full" style={{ marginTop: '2rem' }} onClick={() => setSelectedPartner(null)}>
              Close Details
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
