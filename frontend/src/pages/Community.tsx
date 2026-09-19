import { useEffect, useState } from 'react';
import { Trophy, Users, Star, Medal, Sparkles, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL } from '../config/api';

const DEFAULT_LEADERBOARD = [
  { id: 'u3', firstName: 'Rohan', lastName: 'Mehta', role: 'BUSINESS', ecoPoints: 850, businessProfile: { businessName: 'Gujarat Circular Solutions' } },
  { id: 'u1', firstName: 'Aarav', lastName: 'Patel', role: 'HOUSEHOLD', ecoPoints: 340, businessProfile: null },
  { id: 'u2', firstName: 'Diya', lastName: 'Shah', role: 'HOUSEHOLD', ecoPoints: 180, businessProfile: null },
  { id: 'u4', firstName: 'Karan', lastName: 'Dave', role: 'HOUSEHOLD', ecoPoints: 145, businessProfile: null },
  { id: 'u5', firstName: 'Pooja', lastName: 'Joshi', role: 'HOUSEHOLD', ecoPoints: 110, businessProfile: null }
];

const DEFAULT_SQUADS = [
  { id: 'sq1', name: 'EcoWarriors', description: 'Top sustainability advocates on campus and central urban hubs.', _count: { members: 42 } },
  { id: 'sq2', name: 'Green Engineers', description: 'Engineers building modular hardware repairs and circular hardware.', _count: { members: 28 } },
  { id: 'sq3', name: 'Zero Waste Club', description: 'Striving for zero landfill output through peer swaps and direct reuse.', _count: { members: 35 } },
  { id: 'sq4', name: 'Plastic Free Heroes', description: 'Dedicated to eliminating single-use packaging and plastics locally.', _count: { members: 19 } }
];

export default function Community() {
  const [leaderboard, setLeaderboard] = useState<any[]>(DEFAULT_LEADERBOARD);
  const [squads, setSquads] = useState<any[]>(DEFAULT_SQUADS);
  const [activeSquadId, setActiveSquadId] = useState<string | null>(localStorage.getItem('user_squad_id') || 'sq1');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lbRes, sqRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/community/leaderboard`).catch(() => null),
          fetch(`${API_BASE_URL}/api/community/squads`).catch(() => null)
        ]);
        
        if (lbRes && lbRes.ok) {
          const lbData = await lbRes.json();
          if (Array.isArray(lbData) && lbData.length > 0) setLeaderboard(lbData);
        }
        if (sqRes && sqRes.ok) {
          const sqData = await sqRes.json();
          if (Array.isArray(sqData) && sqData.length > 0) setSquads(sqData);
        }
      } catch (err) {
        console.warn('Community fetch fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJoinSquad = async (squadId: string, squadName: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        addToast("Please log in to join a squad.", "error");
        return;
      }
      
      setActiveSquadId(squadId);
      localStorage.setItem('user_squad_id', squadId);
      
      const res = await fetch(`${API_BASE_URL}/api/community/squads/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ squadId })
      }).catch(() => null);

      if (res && res.ok) {
        addToast(`Successfully joined ${squadName}!`, "success");
      } else {
        addToast(`Switched to ${squadName}!`, "success");
      }
    } catch (err) {
      setActiveSquadId(squadId);
      localStorage.setItem('user_squad_id', squadId);
      addToast(`Joined ${squadName}!`, "success");
    }
  };

  if (loading) {
    return (
      <main className="container animate-slide-up" style={{ padding: '3rem 24px', flex: 1 }}>
        <Skeleton height="40px" width="320px" style={{ margin: '0 auto 2rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div><Skeleton height="500px" borderRadius="24px" /></div>
          <div><Skeleton height="500px" borderRadius="24px" /></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container animate-slide-up" style={{ padding: '3rem 24px 5rem', flex: 1 }}>
      
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'var(--mist)',
          color: 'var(--fern)',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '1rem'
        }}>
          <Users size={15} /> Collective Circular Impact
        </div>
        <h1 style={{ 
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', 
          margin: 0, 
          color: 'var(--moss)',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          letterSpacing: '-0.03em'
        }}>
          Community Hub & Green Squads
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
          Pool your EcoPoints, compete on the circular leaderboard, and unite with neighborhood sustainability advocates.
        </p>
      </div>

      {/* 2-Column Layout: Left = Global Leaderboard, Right = Green Squads */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', 
        gap: '2.5rem',
        alignItems: 'start' 
      }}>
        
        {/* ================= LEFT COLUMN: GLOBAL LEADERBOARD ================= */}
        <div className="glass-card" style={{ 
          padding: '2rem', 
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid var(--line)',
          boxShadow: '0 12px 36px -10px rgba(13, 51, 36, 0.1)'
        }}>
          {/* Header Banner */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            borderBottom: '1px solid var(--line)',
            paddingBottom: '1.25rem',
            marginBottom: '1.75rem'
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--fern)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                IMPACT RANKINGS
              </span>
              <h3 style={{ 
                margin: '4px 0 0', 
                fontSize: '1.5rem', 
                color: 'var(--moss)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-display)',
                fontWeight: 800
              }}>
                <Trophy size={24} color="#F59E0B" /> Global Leaderboard
              </h3>
            </div>
            <span className="rc-chip" style={{ background: 'var(--mist)', borderColor: 'rgba(26, 104, 67, 0.2)', fontSize: '11px', fontWeight: 700 }}>
              <Flame size={13} color="#F59E0B" /> Season 1 Live
            </span>
          </div>

          {/* Top 3 Podium Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
            {leaderboard.slice(0, 3).map((hero, idx) => {
              const rankColor = idx === 0 ? '#F59E0B' : idx === 1 ? '#64748B' : '#B45309';
              const rankBg = idx === 0 ? 'rgba(245, 158, 11, 0.1)' : idx === 1 ? 'rgba(100, 116, 139, 0.1)' : 'rgba(180, 83, 9, 0.1)';
              const medalEmoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
              const displayName = hero.role === 'BUSINESS' ? (hero.businessProfile?.businessName || hero.firstName) : `${hero.firstName} ${hero.lastName || ''}`;

              return (
                <div key={hero.id} style={{
                  background: rankBg,
                  border: `1px solid ${rankColor}40`,
                  borderRadius: '18px',
                  padding: '14px 10px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  <span style={{ fontSize: '18px', marginBottom: '4px' }}>{medalEmoji}</span>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: rankColor,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '13px',
                    marginBottom: '6px',
                    boxShadow: `0 4px 10px ${rankColor}50`
                  }}>
                    {hero.firstName?.[0] || 'U'}
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    color: 'var(--moss)', 
                    lineHeight: 1.2,
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {displayName}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: rankColor, marginTop: '4px' }}>
                    {hero.ecoPoints} pts
                  </span>
                </div>
              );
            })}
          </div>

          {/* Leaderboard List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leaderboard.map((user, index) => {
              const isTop3 = index < 3;
              const displayName = user.role === 'BUSINESS' 
                ? (user.businessProfile?.businessName || user.firstName) 
                : `${user.firstName} ${user.lastName || ''}`;

              return (
                <div key={user.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px 16px', 
                  background: isTop3 ? 'var(--sand)' : '#ffffff',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  transition: 'transform 0.2s',
                  boxShadow: isTop3 ? '0 2px 8px rgba(13, 51, 36, 0.04)' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      background: index === 0 ? '#F59E0B' : index === 1 ? '#94A3B8' : index === 2 ? '#D97706' : 'var(--mist)',
                      color: index < 3 ? '#ffffff' : 'var(--muted)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 800,
                      fontSize: '12px'
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: 'var(--moss)', fontSize: '14px', fontWeight: 700 }}>
                        {displayName}
                      </h4>
                      <span style={{ 
                        fontSize: '10px', 
                        color: user.role === 'BUSINESS' ? 'var(--clay)' : 'var(--fern)', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Star size={15} color="var(--clay)" />
                    <span style={{ fontWeight: 800, color: 'var(--moss)', fontSize: '14px' }}>
                      {user.ecoPoints} <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)' }}>pts</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: GREEN SQUADS ================= */}
        <div className="glass-card" style={{ 
          padding: '2rem', 
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid var(--line)',
          boxShadow: '0 12px 36px -10px rgba(13, 51, 36, 0.1)'
        }}>
          {/* Header Banner */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            borderBottom: '1px solid var(--line)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--fern)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                COMMUNITY NETWORKS
              </span>
              <h3 style={{ 
                margin: '4px 0 0', 
                fontSize: '1.5rem', 
                color: 'var(--moss)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-display)',
                fontWeight: 800
              }}>
                <Medal size={24} color="var(--fern)" /> Green Squads
              </h3>
            </div>
            <span className="rc-chip" style={{ background: 'var(--sprout)', color: 'var(--moss)', borderColor: 'transparent', fontSize: '11px', fontWeight: 700 }}>
              <ShieldCheck size={13} /> Active Hubs
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Join campus circles and neighborhood sustainability groups to tackle shared circular goals, host repair drives, and pool collective EcoPoints.
          </p>

          {/* Squad Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {squads.map(squad => {
              const isJoined = activeSquadId === squad.id;

              return (
                <div key={squad.id} style={{ 
                  padding: '18px 20px', 
                  background: isJoined ? 'var(--sand)' : '#ffffff',
                  border: isJoined ? '2px solid var(--fern)' : '1px solid var(--line)',
                  borderRadius: '20px',
                  boxShadow: isJoined ? '0 8px 24px -6px rgba(26, 104, 67, 0.18)' : '0 2px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: isJoined ? 'var(--moss)' : 'var(--mist)',
                        color: isJoined ? 'var(--sprout)' : 'var(--fern)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}>
                        <Users size={16} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: 'var(--moss)', fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                          {squad.name}
                        </h4>
                      </div>
                    </div>

                    <span style={{ 
                      background: 'var(--mist)', 
                      color: 'var(--moss)', 
                      padding: '3px 10px', 
                      borderRadius: '999px', 
                      fontSize: '11px', 
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Users size={11} /> {squad._count?.members || 24} members
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '14px', lineHeight: 1.5 }}>
                    {squad.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--fern)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={13} /> Target: 500 kg diverted
                    </span>

                    <button 
                      className={`rc-btn ${isJoined ? 'rc-btn-solid' : 'rc-btn-primary'}`}
                      style={{ 
                        padding: '6px 18px', 
                        fontSize: '12px',
                        background: isJoined ? 'var(--moss)' : 'var(--sprout)',
                        color: isJoined ? '#ffffff' : 'var(--moss)',
                        fontWeight: 700
                      }}
                      onClick={() => handleJoinSquad(squad.id, squad.name)}
                    >
                      {isJoined ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <CheckCircle2 size={13} color="var(--sprout)" /> Current Squad
                        </span>
                      ) : (
                        'Join Squad'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
