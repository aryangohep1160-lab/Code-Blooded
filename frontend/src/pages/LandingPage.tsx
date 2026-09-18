import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, Globe, Zap, Recycle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Orbs for Premium Glassmorphism */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.3, zIndex: 0, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '600px', height: '600px', background: 'var(--accent)', filter: 'blur(150px)', opacity: 0.2, zIndex: 0, borderRadius: '50%' }} />

      <header style={{ 
        padding: '1.5rem 2rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf size={32} color="var(--primary-light)" />
            <h2 style={{ margin: 0, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '1px', fontSize: '1.8rem' }}>ReCircle</h2>
          </div>
          <div className="flex gap-4">
            <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      </header>

      <main className="container animate-slide-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 10, padding: '4rem 20px' }}>
        
        <div style={{ display: 'inline-block', padding: '8px 24px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-pill)', color: 'var(--primary-light)', marginBottom: '2rem', fontWeight: 600, letterSpacing: '1px' }}>
          Welcome to the Circular Economy
        </div>

        <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '800px', color: 'white' }}>
          Give your items a <span style={{ color: 'var(--primary-light)', textShadow: '0 0 20px rgba(52,211,153,0.5)' }}>second life.</span>
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
          Join the community marketplace where nothing goes to waste. Sell, donate, swap, and repair items while earning EcoPoints for a greener planet.
        </p>

        <div className="flex gap-4" style={{ marginBottom: '5rem' }}>
          <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }} onClick={() => navigate('/marketplace')}>
            Browse Marketplace <ArrowRight size={20} />
          </button>
          <button className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem' }} onClick={() => navigate('/signup')}>
            Join the Network
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '900px', width: '100%' }}>
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'rgba(52,211,153,0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
              <Globe size={32} color="var(--primary-light)" />
            </div>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Local Impact</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Connect with your community to reduce local landfill waste.</p>
          </div>
          
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'rgba(139,92,246,0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
              <Zap size={32} color="var(--accent-light)" />
            </div>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Earn EcoPoints</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Get rewarded for every item you successfully re-home.</p>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'rgba(59,130,246,0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
              <Recycle size={32} color="#60A5FA" />
            </div>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>AI Assistant</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Not sure what to do? Let our AI analyze your items instantly.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
