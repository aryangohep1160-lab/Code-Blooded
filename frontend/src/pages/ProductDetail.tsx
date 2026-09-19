import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/Skeleton';
import { API_BASE_URL } from '../config/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimedData, setClaimedData] = useState<{message: string, earned: number} | null>(null);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/listings/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/listings/${id}/claim`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to claim');
      const data = await res.json();
      setClaimedData(data);
      addToast(data.message, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to claim item. Are you logged in?', 'error');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <main className="container animate-slide-up" style={{ padding: '3rem 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <Skeleton height="40px" width="100px" style={{ marginBottom: '2rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <Skeleton height="400px" borderRadius="12px" />
          <div>
            <Skeleton height="40px" style={{ marginBottom: '1rem' }} />
            <Skeleton height="30px" width="150px" style={{ marginBottom: '2rem' }} />
            <Skeleton height="150px" style={{ marginBottom: '2rem' }} />
            <Skeleton height="100px" />
          </div>
        </div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="container" style={{ padding: '3rem 24px' }}>
        <div className="glass-card text-center" style={{ padding: '3rem' }}>
          <h2>Item not found</h2>
          <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/marketplace')}>Back to Marketplace</button>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="container animate-slide-up" style={{ padding: '3rem 24px', maxWidth: '1000px', margin: '0 auto', flex: 1 }}>
        <button className="btn btn-outline" style={{ marginBottom: '2rem', padding: '8px 16px', border: 'none', background: 'transparent' }} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          {/* Image Section */}
          <div style={{ 
            background: item.imageUrl ? `url(${item.imageUrl}) center/cover` : 'var(--glass-bg)',
            borderRadius: 'var(--radius-lg)',
            border: 'var(--glass-border)',
            minHeight: '400px',
            position: 'relative'
          }}>
            {!item.imageUrl && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)' }}>
                No Image Available
              </div>
            )}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: 'var(--radius-pill)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                {item.price ? `₹${item.price.toFixed(2)}` : 'Free'}
              </div>
          </div>

          {/* Details Section */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--moss)' }}>{item.title}</h1>
            
            <div className="flex items-center gap-4" style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--fern)' }}>
                {item.price ? `₹${item.price.toFixed(2)}` : 'Free'}
              </span>
              <span style={{ padding: '4px 12px', background: 'var(--mist)', color: 'var(--moss)', borderRadius: 'var(--radius-pill)', fontSize: '0.9rem', fontWeight: 600 }}>
                {item.condition}
              </span>
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--moss)' }}>Description</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{item.description}</p>
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--moss)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sprout)', fontWeight: 'bold' }}>
                  {item.user?.firstName?.[0] || item.user?.businessProfile?.businessName?.[0] || '?'}
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--moss)' }}>{item.user?.firstName || item.user?.businessProfile?.businessName}</h4>
                  <p className="flex items-center gap-1" style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <MapPin size={14} /> {item.user?.businessProfile?.address || 'Local Community Member'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Area */}
            {claimedData ? (
              <div className="glass-card text-center animate-slide-up" style={{ 
                background: 'var(--mist)',
                border: '1px solid var(--fern)'
              }}>
                <CheckCircle2 size={48} color="var(--fern)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ color: 'var(--moss)', marginBottom: '0.5rem' }}>Item Claimed Successfully!</h3>
                <p style={{ color: 'var(--text-muted)' }}>You've connected with the seller.</p>
                <div style={{ display: 'inline-block', marginTop: '1rem', padding: '8px 24px', background: 'rgba(212, 155, 90, 0.2)', color: 'var(--clay)', borderRadius: 'var(--radius-pill)', fontWeight: 'bold' }}>
                  <Sparkles size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
                  +{claimedData.earned} EcoPoints Earned
                </div>
              </div>
            ) : (
              <button 
                className="btn btn-primary btn-full" 
                style={{ padding: '18px', fontSize: '1.2rem', marginTop: 'auto' }}
                onClick={handleClaim}
                disabled={claiming || claimedData !== null}
              >
                {claiming ? 'Processing...' : claimedData ? 'Success!' : `Claim ${item.type === 'SELL' ? 'Item' : item.type === 'DONATE' ? 'Donation' : item.type === 'WANTED' ? 'Offer Item' : 'Listing'}`}
              </button>
            )}
            
          </div>
        </div>
      </main>
    </>
  );
}
