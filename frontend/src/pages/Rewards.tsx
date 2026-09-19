import { useEffect, useState } from 'react';
import { Gift, Award } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL } from '../config/api';

export default function Rewards() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch Rewards
        const rewRes = await fetch(`${API_BASE_URL}/api/community/rewards`);
        if (rewRes.ok) setRewards(await rewRes.json());
        
        // Fetch User Points if logged in
        if (token) {
          const profRes = await fetch(`${API_BASE_URL}/api/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (profRes.ok) {
            const data = await profRes.json();
            setUserPoints(data.ecoPoints);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRedeem = async (rewardId: string, cost: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      addToast("Please log in to redeem rewards.", "error");
      return;
    }

    if (userPoints < cost) {
      addToast(`You need ${cost - userPoints} more EcoPoints for this.`, "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/community/rewards/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rewardId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      addToast(data.message, "success");
      setUserPoints(prev => prev - cost);
    } catch (err: any) {
      addToast(err.message || "Failed to redeem reward.", "error");
    }
  };

  if (loading) {
    return (
      <main className="container animate-slide-up" style={{ padding: '3rem 24px', flex: 1 }}>
        <Skeleton height="40px" width="300px" style={{ marginBottom: '2rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {[1,2,3].map(i => <div key={i} className="glass-card" style={{ padding: 0 }}><Skeleton height="350px" borderRadius="16px" /></div>)}
        </div>
      </main>
    );
  }

  return (
    <main className="container animate-slide-up" style={{ padding: '3rem 24px', flex: 1 }}>
      <div className="flex justify-between items-end" style={{ marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Gift size={40} color="var(--accent-light)" /> Rewards Catalog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem' }}>Spend your EcoPoints on exclusive vouchers and perks.</p>
        </div>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 24px -6px rgba(13, 51, 36, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          padding: '4px 14px', 
          height: '34px',
          borderRadius: '999px', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px',
          fontSize: '12px'
        }}>
          <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Your Balance:</span>
          <Award size={14} color="var(--clay)" />
          <span style={{ color: 'var(--moss)', fontSize: '13px', fontWeight: 800 }}>{userPoints}</span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--fern)' }}>PTS</span>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '3rem', background: 'var(--mist)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(26, 104, 67, 0.15)', padding: '12px', borderRadius: '50%' }}>
          <Award size={32} color="var(--fern)" />
        </div>
        <div>
          <h3 style={{ margin: 0, color: 'var(--moss)', fontSize: '1.2rem' }}>How to earn EcoPoints?</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>Earn points by listing items for donation, participating in community recycling drives, joining Green Squads, or repairing items through our local network.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {rewards.map(reward => (
          <div key={reward.id} className="glass-card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', background: 'var(--sand)', overflow: 'hidden' }}>
              {reward.imageUrl ? (
                <img src={reward.imageUrl} alt={reward.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gift size={48} color="var(--text-muted)" />
                </div>
              )}
            </div>
            
            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--moss)', fontSize: '1.4rem' }}>{reward.title}</h3>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(212, 155, 90, 0.15)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', color: 'var(--clay)', fontWeight: 'bold' }}>
                  <Award size={16} /> {reward.cost}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flex: 1 }}>{reward.description}</p>
              
              <button 
                className={`rc-btn rc-btn-primary btn-full`} 
                onClick={() => handleRedeem(reward.id, reward.cost)}
                disabled={userPoints < reward.cost}
                style={{ opacity: userPoints < reward.cost ? 0.5 : 1, cursor: userPoints < reward.cost ? 'not-allowed' : 'pointer' }}
              >
                {userPoints >= reward.cost ? 'Redeem Reward' : 'Not Enough Points'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
