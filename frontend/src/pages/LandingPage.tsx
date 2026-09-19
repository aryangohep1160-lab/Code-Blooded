import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  Users, 
  MapPin, 
  Recycle, 
  CloudRain, 
  ShoppingBag,
  RotateCw,
  Wrench,
  User,
  ShieldCheck
} from 'lucide-react';
import ReCircleLogo from '../components/ReCircleLogo';

interface OrbitNodeData {
  title: string;
  category: string;
  description: string;
  impact: string;
  icon: string;
}

const ORBIT_NODES: OrbitNodeData[] = [
  {
    title: 'Smartphones & E-Waste',
    category: 'ELECTRONICS',
    description: 'Diagnose repairs, reclaim precious metals, and coordinate peer-to-peer local swaps.',
    impact: '1.8 kg e-waste saved',
    icon: '📱'
  },
  {
    title: 'Ergonomic Furniture',
    category: 'FURNITURE',
    description: 'Re-cushion, woodwork overhaul, and neighborhood study chair recirculation.',
    impact: '18.5 kg landfill diverted',
    icon: '🪑'
  },
  {
    title: 'Textbooks & Study Bundles',
    category: 'TEXTBOOKS',
    description: 'Peer-to-peer semester book swap and zero-waste academic learning circles.',
    impact: '8.0 kg paper saved',
    icon: '📚'
  },
  {
    title: 'Home Appliances',
    category: 'APPLIANCES',
    description: 'Descaling, minor component swaps, and energy rating restoration.',
    impact: '4.2 kg waste saved',
    icon: '⚡'
  },
  {
    title: 'Textiles & Discard Bags',
    category: 'CLOTHING',
    description: 'Fiber recovery, upcycling, community donation drives, and circular fashion.',
    impact: '14.5 kg fabric saved',
    icon: '🧥'
  },
  {
    title: 'Repair Hero Services',
    category: 'REPAIR',
    description: 'Local diagnostics, soldering, modular part swaps, and certified repair hubs.',
    impact: '25.0 kg saved',
    icon: '🔧'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeOrbit, setActiveOrbit] = useState<OrbitNodeData>(ORBIT_NODES[1]); // Default Ergonomic Furniture

  // Check auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token) {
      setIsLoggedIn(true);
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch {
          setCurrentUser(null);
        }
      }
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'linear-gradient(180deg, #071F15 0%, #0D3324 20%, #0A281C 50%, #082117 75%, #05160E 100%)',
      color: '#ffffff',
      position: 'relative'
    }}>
      
      {/* Top Floating Glass Header */}
      <header style={{
        position: 'fixed',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 22px',
          borderRadius: '999px',
          background: 'rgba(8, 28, 19, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 14px 42px -16px rgba(0, 0, 0, 0.55)',
          pointerEvents: 'auto'
        }}>
          {/* Brand Logo with custom ReCircle logo */}
          <div 
            onClick={() => navigate('/')} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ReCircleLogo size={36} textColor="#ffffff" subtextColor="var(--sprout)" />
          </div>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="rc-chip" 
              style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#ffffff', fontWeight: 600 }}
              onClick={() => navigate('/marketplace')}
            >
              Marketplace
            </button>
            <button 
              className="rc-chip" 
              style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#ffffff', fontWeight: 600 }}
              onClick={() => navigate('/community')}
            >
              Community
            </button>
            <button 
              className="rc-chip" 
              style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#ffffff', fontWeight: 600 }}
              onClick={() => navigate('/rewards')}
            >
              Rewards
            </button>
            <button 
              className="rc-chip" 
              style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#ffffff', fontWeight: 600 }}
              onClick={() => navigate('/network')}
            >
              Network
            </button>
          </nav>

          {/* Right Action Items: Responsive to auth state */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isLoggedIn ? (
              <>
                <button 
                  className="rc-chip"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    border: '1px solid rgba(181, 241, 90, 0.3)', 
                    color: '#ffffff',
                    padding: '6px 14px',
                    gap: '8px'
                  }}
                  onClick={() => navigate('/profile')}
                  title="View Profile"
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--sprout)',
                    color: 'var(--moss)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User size={13} />}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>
                    {currentUser?.name ? currentUser.name.split(' ')[0] : 'My Account'}
                  </span>
                </button>

                <button 
                  className="rc-btn rc-btn-primary" 
                  style={{ padding: '8px 20px', fontSize: '13px' }}
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </button>
              </>
            ) : (
              <>
                <button 
                  className="rc-btn rc-btn-ghost" 
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button 
                  className="rc-btn rc-btn-primary" 
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section: Deep Forest Dawn Aesthetic */}
      <section className="rc-dawn" style={{ paddingTop: '7.5rem', paddingBottom: '7rem', position: 'relative' }}>
        <div className="rc-sun" aria-hidden="true" />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '3.5rem', 
            alignItems: 'center' 
          }}>
            
            {/* Hero Left Column */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                marginBottom: '1.5rem'
              }}>
                <Leaf size={14} color="var(--sprout)" /> ReCircle OS: Hyperlocal Circular Economy Platform
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                lineHeight: 1.05,
                color: '#ffffff',
                marginBottom: '1.5rem',
                letterSpacing: '-0.03em'
              }}>
                Give what you own <br />
                <span style={{ color: 'var(--sprout)' }}>a second life.</span>
              </h1>

              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.88)',
                maxWidth: '540px',
                marginBottom: '2rem'
              }}>
                Buy, sell, swap, donate or diagnose broken electronics with Gemini AI. Join neighborhood Green Squads, discover certified local repair partners, and earn tangible EcoPoints rewards.
              </p>

              {/* Call to Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '2.5rem' }}>
                <button 
                  className="rc-btn rc-btn-primary" 
                  style={{ padding: '14px 28px', fontSize: '1rem' }}
                  onClick={() => navigate('/marketplace')}
                >
                  Explore Marketplace <ArrowRight size={18} />
                </button>
                <button 
                  className="rc-btn rc-btn-ghost" 
                  style={{ padding: '14px 24px', fontSize: '0.95rem' }}
                  onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
                >
                  <Sparkles size={16} color="var(--sprout)" /> Open Eco-AI Assistant
                </button>
                <button 
                  className="rc-btn rc-btn-ghost" 
                  style={{ padding: '14px 24px', fontSize: '0.95rem' }}
                  onClick={() => navigate('/community')}
                >
                  <Users size={16} color="var(--sprout)" /> Join Green Squads
                </button>
              </div>

              {/* Hyperlocal Hub Tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)' }}>
                <MapPin size={16} color="var(--sprout)" />
                <span>Active Community Hub: <strong style={{ color: '#ffffff' }}>Navrangpura Green Hub (Ahmedabad)</strong></span>
              </div>
            </div>

            {/* Hero Right Column: Living Interactive Orbit System */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '380px',
                aspectRatio: '1/1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Outer Dotted Orbit Ring */}
                <div 
                  className="rc-orbit-ring"
                  style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '50%',
                    border: '2px dashed rgba(255, 255, 255, 0.3)'
                  }} 
                />

                {/* Inner Ring */}
                <div style={{
                  position: 'absolute',
                  inset: '64px',
                  borderRadius: '50%',
                  border: '1px solid rgba(181, 241, 90, 0.35)'
                }} />

                {/* Center Core Node: ReCircle Engine */}
                <div style={{
                  position: 'relative',
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #071F15, #12402E)',
                  border: '2px solid rgba(181, 241, 90, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  zIndex: 5
                }}>
                  <div className="rc-ping" style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '1px solid rgba(181, 241, 90, 0.6)'
                  }} />
                  <RotateCw size={26} color="var(--sprout)" style={{ marginBottom: '4px' }} />
                  <div style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontWeight: 700, 
                    fontSize: '12px', 
                    color: '#ffffff' 
                  }}>
                    ReCircle
                  </div>
                  <div style={{ 
                    fontSize: '9px', 
                    color: 'var(--sprout)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px', 
                    fontWeight: 700 
                  }}>
                    Engine
                  </div>
                </div>

                {/* Orbiting Interactive Nodes */}
                {/* Node 0: Top - Electronics */}
                <button
                  type="button"
                  className={`rc-node ${activeOrbit.category === ORBIT_NODES[0].category ? 'active' : ''}`}
                  style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)' }}
                  onClick={() => setActiveOrbit(ORBIT_NODES[0])}
                  title={ORBIT_NODES[0].title}
                >
                  {ORBIT_NODES[0].icon}
                </button>

                {/* Node 1: Top-Right - Furniture */}
                <button
                  type="button"
                  className={`rc-node ${activeOrbit.category === ORBIT_NODES[1].category ? 'active' : ''}`}
                  style={{ position: 'absolute', top: '22%', right: '-6px' }}
                  onClick={() => setActiveOrbit(ORBIT_NODES[1])}
                  title={ORBIT_NODES[1].title}
                >
                  {ORBIT_NODES[1].icon}
                </button>

                {/* Node 2: Bottom-Right - Textbooks */}
                <button
                  type="button"
                  className={`rc-node ${activeOrbit.category === ORBIT_NODES[2].category ? 'active' : ''}`}
                  style={{ position: 'absolute', bottom: '22%', right: '-6px' }}
                  onClick={() => setActiveOrbit(ORBIT_NODES[2])}
                  title={ORBIT_NODES[2].title}
                >
                  {ORBIT_NODES[2].icon}
                </button>

                {/* Node 3: Bottom - Appliances */}
                <button
                  type="button"
                  className={`rc-node ${activeOrbit.category === ORBIT_NODES[3].category ? 'active' : ''}`}
                  style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }}
                  onClick={() => setActiveOrbit(ORBIT_NODES[3])}
                  title={ORBIT_NODES[3].title}
                >
                  {ORBIT_NODES[3].icon}
                </button>

                {/* Node 4: Bottom-Left - Clothing */}
                <button
                  type="button"
                  className={`rc-node ${activeOrbit.category === ORBIT_NODES[4].category ? 'active' : ''}`}
                  style={{ position: 'absolute', bottom: '22%', left: '-6px' }}
                  onClick={() => setActiveOrbit(ORBIT_NODES[4])}
                  title={ORBIT_NODES[4].title}
                >
                  {ORBIT_NODES[4].icon}
                </button>

                {/* Node 5: Top-Left - Repair Service */}
                <button
                  type="button"
                  className={`rc-node ${activeOrbit.category === ORBIT_NODES[5].category ? 'active' : ''}`}
                  style={{ position: 'absolute', top: '22%', left: '-6px' }}
                  onClick={() => setActiveOrbit(ORBIT_NODES[5])}
                  title={ORBIT_NODES[5].title}
                >
                  {ORBIT_NODES[5].icon}
                </button>
              </div>

              {/* Orbit Info Card */}
              <div style={{
                marginTop: '1.5rem',
                width: '100%',
                maxWidth: '380px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                padding: '16px 20px',
                borderRadius: '20px',
                color: '#ffffff',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ 
                    fontWeight: 700, 
                    color: 'var(--sprout)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px', 
                    fontSize: '11px' 
                  }}>
                    {activeOrbit.category}
                  </span>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    background: 'rgba(181, 241, 90, 0.2)', 
                    color: 'var(--sprout)', 
                    padding: '2px 8px', 
                    borderRadius: '999px' 
                  }}>
                    {activeOrbit.impact}
                  </span>
                </div>
                <h4 style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 700, 
                  fontSize: '1.1rem', 
                  color: '#ffffff', 
                  margin: '0 0 4px 0' 
                }}>
                  {activeOrbit.title}
                </h4>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', margin: 0, lineHeight: 1.5 }}>
                  {activeOrbit.description}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Unified 2-Column Section: Left = Circular Capabilities, Right = Our Contributions */}
      <section className="container" style={{ paddingBottom: '6rem', paddingTop: '1rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          
          {/* LEFT COLUMN: Explore Circular Capabilities */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'rgba(181, 241, 90, 0.15)',
                color: 'var(--sprout)',
                marginBottom: '0.75rem',
                border: '1px solid rgba(181, 241, 90, 0.3)'
              }}>
                <Sparkles size={13} /> Circular Ecosystem
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.3rem)',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 0.5rem 0',
                letterSpacing: '-0.02em'
              }}>
                Explore Circular Capabilities
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.75)',
                margin: 0,
                lineHeight: 1.6
              }}>
                Comprehensive neighborhood tools engineered to divert household waste, diagnose repairs, and build localized circular loops.
              </p>
            </div>

            {/* 2x2 Capabilities Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem'
            }}>
              {/* Card 1: Marketplace */}
              <div 
                className="rc-card"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(181, 241, 90, 0.4)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onClick={() => navigate('/marketplace')}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'rgba(181, 241, 90, 0.15)',
                  border: '1px solid rgba(181, 241, 90, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sprout)',
                  marginBottom: '1rem'
                }}>
                  <ShoppingBag size={22} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: '#ffffff', margin: '0 0 0.35rem' }}>
                  Marketplace
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 1rem', lineHeight: 1.5 }}>
                  Browse, sell, swap, or donate items directly to verified local neighbors.
                </p>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sprout)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Open Marketplace <ArrowRight size={13} />
                </div>
              </div>

              {/* Card 2: Eco-AI Advisor */}
              <div 
                className="rc-card"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(181, 241, 90, 0.4)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'rgba(181, 241, 90, 0.15)',
                  border: '1px solid rgba(181, 241, 90, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sprout)',
                  marginBottom: '1rem'
                }}>
                  <Sparkles size={22} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: '#ffffff', margin: '0 0 0.35rem' }}>
                  Eco-AI Advisor
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 1rem', lineHeight: 1.5 }}>
                  Instant valuation estimation, recycling codes, and repair diagnostics via Gemini.
                </p>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sprout)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Ask AI Guide <ArrowRight size={13} />
                </div>
              </div>

              {/* Card 3: Green Squads */}
              <div 
                className="rc-card"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(181, 241, 90, 0.4)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onClick={() => navigate('/community')}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'rgba(181, 241, 90, 0.15)',
                  border: '1px solid rgba(181, 241, 90, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sprout)',
                  marginBottom: '1rem'
                }}>
                  <Users size={22} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: '#ffffff', margin: '0 0 0.35rem' }}>
                  Green Squads
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 1rem', lineHeight: 1.5 }}>
                  Collaborate with campus and neighborhood sustainability groups for collective impact.
                </p>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sprout)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Join Green Squads <ArrowRight size={13} />
                </div>
              </div>

              {/* Card 4: Repair Network */}
              <div 
                className="rc-card"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(181, 241, 90, 0.4)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onClick={() => navigate('/network')}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'rgba(181, 241, 90, 0.15)',
                  border: '1px solid rgba(181, 241, 90, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sprout)',
                  marginBottom: '1rem'
                }}>
                  <Wrench size={22} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: '#ffffff', margin: '0 0 0.35rem' }}>
                  Repair Network
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 1rem', lineHeight: 1.5 }}>
                  Discover 8+ certified local mechanics, electronics doctors, cobblers, and drop-off hubs.
                </p>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sprout)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Find Repair Heroes <ArrowRight size={13} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Our Contributions (with text above it) */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'rgba(181, 241, 90, 0.15)',
                color: 'var(--sprout)',
                marginBottom: '0.75rem',
                border: '1px solid rgba(181, 241, 90, 0.3)'
              }}>
                <Recycle size={13} /> Live Ledger & Environmental Impact
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.3rem)',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 0.5rem 0',
                letterSpacing: '-0.02em'
              }}>
                Our Contributions
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.75)',
                margin: 0,
                lineHeight: 1.6
              }}>
                Real-time audited impact generated across our hyperlocal network. Every repair, donation, and swap directly diverts waste from regional landfills and cuts community emissions.
              </p>
            </div>

            {/* 4 Impact Stat Cards in a 2x2 Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              {/* Stat 1 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(181, 241, 90, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sprout)'
                  }}>
                    <Recycle size={22} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--sprout)', background: 'rgba(181, 241, 90, 0.15)', padding: '2px 8px', borderRadius: '999px' }}>
                    +12% wk
                  </span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.9rem', color: '#ffffff', lineHeight: 1 }}>
                    34.8 kg
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', fontWeight: 500 }}>
                    Landfill waste diverted
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(124, 208, 222, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7CD0DE'
                  }}>
                    <CloudRain size={22} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#7CD0DE', background: 'rgba(124, 208, 222, 0.15)', padding: '2px 8px', borderRadius: '999px' }}>
                    Verified
                  </span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.9rem', color: '#ffffff', lineHeight: 1 }}>
                    52.5 kg
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', fontWeight: 500 }}>
                    CO₂ emissions avoided
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(181, 241, 90, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sprout)'
                  }}>
                    <RotateCw size={22} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--sprout)', background: 'rgba(181, 241, 90, 0.15)', padding: '2px 8px', borderRadius: '999px' }}>
                    Circular
                  </span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.9rem', color: '#ffffff', lineHeight: 1 }}>
                    5 Items
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', fontWeight: 500 }}>
                    Items recirculated
                  </div>
                </div>
              </div>

              {/* Stat 4 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(212, 155, 90, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D49B5A'
                  }}>
                    <Users size={22} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#D49B5A', background: 'rgba(212, 155, 90, 0.15)', padding: '2px 8px', borderRadius: '999px' }}>
                    Active Hub
                  </span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.9rem', color: '#ffffff', lineHeight: 1 }}>
                    4 Squads
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', fontWeight: 500 }}>
                    Active green squads
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Trust Pill */}
            <div style={{
              background: 'rgba(181, 241, 90, 0.08)',
              border: '1px solid rgba(181, 241, 90, 0.25)',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <ShieldCheck size={24} color="var(--sprout)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--sprout)' }}>100% Hyperlocal Verified Impact:</strong> Real-world carbon and waste offsets calculated with municipal environmental audit standards.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Footer in Seamless Dark Green Theme */}
      <footer style={{
        marginTop: 'auto',
        background: 'rgba(5, 18, 12, 0.96)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2.5rem 0',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container" style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {/* Brand Logo in Footer */}
          <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <ReCircleLogo size={32} textColor="#ffffff" subtextColor="var(--sprout)" />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '13px', fontWeight: 600 }}>
            <span style={{ cursor: 'pointer', color: 'rgba(255, 255, 255, 0.8)' }} onClick={() => navigate('/')}>Home</span>
            <span style={{ cursor: 'pointer', color: 'rgba(255, 255, 255, 0.8)' }} onClick={() => navigate('/marketplace')}>Marketplace</span>
            <span style={{ cursor: 'pointer', color: 'rgba(255, 255, 255, 0.8)' }} onClick={() => navigate('/community')}>Community</span>
            <span style={{ cursor: 'pointer', color: 'rgba(255, 255, 255, 0.8)' }} onClick={() => navigate('/rewards')}>Rewards</span>
            <span style={{ cursor: 'pointer', color: 'rgba(255, 255, 255, 0.8)' }} onClick={() => navigate('/network')}>Network</span>
          </div>

          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            © 2026 ReCircle Earth Initiative. Powered by Circular OS.
          </div>
        </div>
      </footer>

    </div>
  );
}
