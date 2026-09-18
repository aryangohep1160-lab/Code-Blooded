import { useEffect, useState } from 'react';
import { Trophy, Users, Star, Medal } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';

export default function Community() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [squads, setSquads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lbRes, sqRes] = await Promise.all([
          fetch('http://localhost:5001/api/community/leaderboard'),
          fetch('http://localhost:5001/api/community/squads')
        ]);
        
        if (lbRes.ok) setLeaderboard(await lbRes.json());
        if (sqRes.ok) setSquads(await sqRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJoinSquad = async (squadId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        addToast("Please log in to join a squad.", "error");
        return;
      }
      const res = await fetch('http://localhost:5001/api/community/squads/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ squadId })
      });
      if (!res.ok) throw new Error("Failed to join");
      addToast("Successfully joined the squad!", "success");
      // Re-fetch squads to update count (optional optimization)
    } catch (err) {
      addToast("Failed to join squad.", "error");
    }
  };

  if (loading) {
    return (
      <main className="container animate-slide-up" style={{ padding: '3rem 24px', flex: 1 }}>
        <Skeleton height="40px" width="300px" style={{ marginBottom: '2rem' }} />
        <div className="flex gap-6">
          <div style={{ flex: 1 }}><Skeleton height="500px" /></div>
          <div style={{ flex: 1 }}><Skeleton height="500px" /></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container animate-slide-up" style={{ padding: '3rem 24px', flex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Users size={40} color="var(--primary-light)" /> Community Hub
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem' }}>Join forces and see who leads the sustainability charge.</p>
      </div>

      <div className="flex gap-6 flex-col md:flex-row" style={{ flexWrap: 'wrap' }}>
        
        {/* Leaderboard Section */}
        <div className="glass-card" style={{ flex: 1, minWidth: '350px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem', color: 'white' }}>
            <Trophy size={24} color="var(--accent-light)" /> Global Leaderboard
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {leaderboard.map((user, index) => (
              <div key={user.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '1rem', 
                background: index < 3 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                border: index < 3 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: index === 0 ? '#FBBF24' : index === 1 ? '#94A3B8' : index === 2 ? '#B45309' : 'transparent',
                    color: index < 3 ? '#0F172A' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'white' }}>{user.role === 'BUSINESS' ? user.businessProfile?.businessName : `${user.firstName} ${user.lastName}`}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>{user.role}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={16} color="var(--accent-light)" />
                  <span style={{ fontWeight: 'bold', color: 'white' }}>{user.ecoPoints}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Green Squads Section */}
        <div className="glass-card" style={{ flex: 1, minWidth: '350px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem', color: 'white' }}>
            <Medal size={24} color="var(--primary-light)" /> Green Squads
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Pool your EcoPoints together to achieve community sustainability goals.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {squads.map(squad => (
              <div key={squad.id} style={{ 
                padding: '1.5rem', 
                background: 'rgba(52, 211, 153, 0.05)',
                border: '1px solid rgba(52, 211, 153, 0.2)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>{squad.name}</h4>
                  <span style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '0.85rem' }}>
                    {squad._count.members} members
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{squad.description}</p>
                <button className="btn btn-primary btn-full" onClick={() => handleJoinSquad(squad.id)}>Join Squad</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
