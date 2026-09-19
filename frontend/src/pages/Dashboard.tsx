import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Target, MapPin, Sparkles, Send, Paperclip, X, RefreshCw, ExternalLink, Compass } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import { API_BASE_URL } from '../config/api';

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Dynamic Geolocation & Live Google Map State
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
    accuracy?: string;
    isDetecting: boolean;
  }>({
    lat: 23.0338,
    lng: 72.5850,
    name: 'Navrangpura Green Hub, Ahmedabad',
    accuracy: 'Hyperlocal Hub (Simulated GPS)',
    isDetecting: false
  });

  const detectUserLocation = () => {
    if (!('geolocation' in navigator)) {
      setUserLocation(prev => ({
        ...prev,
        name: 'Navrangpura Green Hub (Ahmedabad)',
        accuracy: 'GPS Unavailable',
        isDetecting: false
      }));
      return;
    }

    setUserLocation(prev => ({ ...prev, isDetecting: true }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = `Accurate to ±${Math.round(pos.coords.accuracy)}m`;

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'Accept': 'application/json' }
          });
          if (res.ok) {
            const data = await res.json();
            const neighborhood = data.address?.suburb || data.address?.neighbourhood || data.address?.residential || data.address?.road;
            const city = data.address?.city || data.address?.town || data.address?.state_district || 'Ahmedabad';
            const state = data.address?.state || 'Gujarat';
            const placeName = neighborhood ? `${neighborhood}, ${city}` : `${city}, ${state}`;

            setUserLocation({
              lat,
              lng,
              name: placeName,
              accuracy,
              isDetecting: false
            });
            return;
          }
        } catch (e) {
          // Fallback to coordinates
        }

        setUserLocation({
          lat,
          lng,
          name: `Latitude ${lat.toFixed(4)}°, Longitude ${lng.toFixed(4)}°`,
          accuracy,
          isDetecting: false
        });
      },
      (err) => {
        console.warn('Geolocation prompt dismissed or unavailable:', err.message);
        setUserLocation(prev => ({
          ...prev,
          name: profile?.businessProfile?.address || 'Navrangpura Green Hub (Ahmedabad)',
          accuracy: 'Estimated Hub Location',
          isDetecting: false
        }));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    detectUserLocation();
  }, []);
  
  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedMimeType, setAttachedMimeType] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string, image?: string}[]>([
    { role: 'ai', text: "Hi there! I'm Eco-AI. Ask me to estimate the value of an item, verify a recycling code, or give repair advice." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          return;
        }
      } catch (err) {
        console.warn('Backend profile fetch failed, using local profile state:', err);
      } finally {
        setLoading(false);
      }

      // Graceful fallback to stored user or default profile
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          setProfile(JSON.parse(cachedUser));
          return;
        } catch (e) {}
      }
      setProfile({
        id: 'u1',
        firstName: 'Aarav',
        lastName: 'Patel',
        email: 'aarav@recircle.eco',
        role: 'HOUSEHOLD',
        ecoPoints: 340
      });
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleImageAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setAttachedImage(base64String);
        setAttachedMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setAttachedImage(null);
    setAttachedMimeType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl + U to open file upload
      if (e.ctrlKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = (reader.result as string).split(',')[1];
              setAttachedImage(base64String);
              setAttachedMimeType(file.type);
            };
            reader.readAsDataURL(file);
            e.preventDefault();
          }
        }
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() && !attachedImage) return;

    const userText = chatInput.trim();
    
    // Store message locally for display
    const userMessage = { 
      role: 'user' as const, 
      text: userText,
      image: attachedImage ? `data:${attachedMimeType};base64,${attachedImage}` : undefined 
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Clear inputs immediately
    setChatInput('');
    setAttachedImage(null);
    setAttachedMimeType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          message: userText || "What is in this image and how can I recycle it?", 
          image: userMessage.image?.split(',')[1],
          mimeType: attachedMimeType 
        })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response || data.error }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <main className="container animate-slide-up" style={{ padding: '3rem 24px', flex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <Skeleton height="40px" width="300px" style={{ marginBottom: '0.5rem' }} />
          <Skeleton height="20px" width="400px" />
        </div>
        <div className="flex gap-6">
          <div style={{ flex: 7 }}><Skeleton height="400px" /></div>
          <div style={{ flex: 4 }}><Skeleton height="200px" /></div>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Main Content */}
      <main className="container animate-slide-up" style={{ padding: '3rem 24px', flex: 1 }}>
        <div className="flex justify-between items-end" style={{ marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              Welcome back, <span style={{ color: 'var(--primary-light)' }}>
                {profile?.role === 'BUSINESS' ? profile.businessProfile?.businessName : profile.firstName}
              </span>!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Here is your sustainability snapshot for today.</p>
          </div>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            padding: '8px 16px', 
            background: profile?.role === 'BUSINESS' 
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))'
              : 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(5, 150, 105, 0.1))',
            border: profile?.role === 'BUSINESS'
              ? '1px solid rgba(251, 191, 36, 0.3)'
              : '1px solid rgba(52, 211, 153, 0.3)',
            color: profile?.role === 'BUSINESS' ? 'var(--accent-light)' : 'var(--primary-light)', 
            borderRadius: 'var(--radius-pill)', 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            boxShadow: profile?.role === 'BUSINESS' 
              ? '0 0 15px rgba(245, 158, 11, 0.15)' 
              : '0 0 15px rgba(5, 150, 105, 0.15)',
            marginBottom: '8px'
          }}>
            {profile?.role} ACCOUNT
          </div>
        </div>

        <div className="flex gap-6" style={{ alignItems: 'flex-start' }}>
          
          {/* Left Column */}
          <div className="flex-col gap-6" style={{ flex: 7, display: 'flex' }}>
            
            {/* Impact Tracking Widget */}
            <div className="glass-card">
              <h3 className="flex items-center gap-2" style={{ marginBottom: '1.5rem', color: 'var(--moss)', fontSize: '1.25rem' }}>
                <Target size={22} color="var(--primary)" /> Impact Tracking
              </h3>
              <div className="flex gap-4" style={{ marginBottom: '2rem' }}>
                <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(26, 104, 67, 0.08)', border: '1px solid rgba(26, 104, 67, 0.15)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ color: 'var(--fern)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>CO2 Saved</p>
                  <h2 style={{ fontSize: '3rem', color: 'var(--moss)', margin: 0, fontFamily: 'var(--font-display)' }}>0.0 <span style={{fontSize:'1.2rem', color: 'var(--text-muted)'}}>kg</span></h2>
                </div>
                <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(212, 155, 90, 0.12)', border: '1px solid rgba(212, 155, 90, 0.2)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ color: 'var(--clay)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Waste Diverted</p>
                  <h2 style={{ fontSize: '3rem', color: 'var(--moss)', margin: 0, fontFamily: 'var(--font-display)' }}>0 <span style={{fontSize:'1.2rem', color: 'var(--text-muted)'}}>items</span></h2>
                </div>
              </div>
              <button className="rc-btn rc-btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }} onClick={() => navigate('/create-listing')}>Start a New Listing</button>
            </div>

            {/* AI Sustainability Assistant Widget */}
            <div className="glass-card" style={{ padding: 0 }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--mist)' }}>
                <div style={{ background: 'var(--moss)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <Sparkles size={20} color="var(--sprout)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--moss)' }}>Eco-AI Assistant</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Powered by Gemini 2.5 Flash</p>
                </div>
              </div>
              
              <div className="ai-chat-container" style={{ border: 'none', borderRadius: 0, background: 'transparent' }}>
                <div className="ai-chat-messages">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-msg ${msg.role}`} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {msg.image && (
                        <img src={msg.image} alt="User attachment" style={{ maxWidth: '200px', borderRadius: '4px' }} />
                      )}
                      <span>{msg.text}</span>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="chat-msg ai" style={{ display: 'flex', gap: '4px', alignItems: 'center', width: 'fit-content' }}>
                      <span className="dot" style={{ width: 6, height: 6, background: 'var(--primary-light)', borderRadius: '50%', animation: 'slideUpFade 0.6s infinite alternate' }}></span>
                      <span className="dot" style={{ width: 6, height: 6, background: 'var(--primary-light)', borderRadius: '50%', animation: 'slideUpFade 0.6s infinite alternate 0.2s' }}></span>
                      <span className="dot" style={{ width: 6, height: 6, background: 'var(--primary-light)', borderRadius: '50%', animation: 'slideUpFade 0.6s infinite alternate 0.4s' }}></span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                
                {/* Image Attachment Preview */}
                {attachedImage && (
                  <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={`data:${attachedMimeType};base64,${attachedImage}`} alt="Preview" style={{ height: '60px', borderRadius: '4px', border: '1px solid var(--border)' }} />
                      <button type="button" onClick={removeAttachment} style={{ position: 'absolute', top: -5, right: -5, background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%', padding: '2px', cursor: 'pointer' }}>
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                )}

                <form className="ai-chat-input-area" onSubmit={handleSendMessage}>
                  <button type="button" className="btn btn-outline" style={{ padding: '0 12px', borderRadius: 'var(--radius-md)' }} onClick={() => fileInputRef.current?.click()} title="Attach image">
                    <Paperclip size={18} />
                  </button>
                  <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageAttachment} />
                  
                  <input 
                    type="text" 
                    className="input-field" 
                    style={{ flex: 1, marginBottom: 0 }}
                    placeholder={attachedImage ? "Add a message with your image..." : "Ask about recycling..."}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onPaste={handlePaste}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', borderRadius: 'var(--radius-md)' }} disabled={!chatInput.trim() && !attachedImage}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>

          </div>

          {/* Right Column / Sidebar */}
          <div className="flex-col gap-6" style={{ flex: 4, display: 'flex' }}>
            
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'rgba(26, 104, 67, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--fern)'
                  }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--moss)', fontWeight: 700 }}>
                      Live Hyperlocal GPS
                    </h3>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={detectUserLocation}
                  disabled={userLocation.isDetecting}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--line)',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--moss)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Refresh exact GPS location"
                >
                  <RefreshCw size={12} className={userLocation.isDetecting ? 'animate-spin' : ''} />
                  {userLocation.isDetecting ? 'Locating...' : 'Refresh'}
                </button>
              </div>

              {/* Exact Location Name & Status */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--moss)', lineHeight: 1.3 }}>
                  {profile?.role === 'BUSINESS' && profile?.businessProfile?.address 
                    ? profile.businessProfile.address 
                    : userLocation.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 8px #10B981'
                  }} />
                  <span style={{ fontSize: '11px', color: 'var(--fern)', fontWeight: 600 }}>
                    {userLocation.accuracy}
                  </span>
                </div>
              </div>

              {/* Embedded Small Google Maps Area */}
              <div style={{
                position: 'relative',
                height: '160px',
                width: '100%',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid var(--line)',
                boxShadow: '0 6px 18px -6px rgba(13, 51, 36, 0.15)',
                marginBottom: '0.85rem'
              }}>
                <iframe
                  title="User Live Google Map Area"
                  src={`https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}&hl=en&z=15&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Floating GPS Coordinates Pill */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  background: 'rgba(8, 28, 19, 0.9)',
                  backdropFilter: 'blur(8px)',
                  color: 'var(--sprout)',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '999px',
                  border: '1px solid rgba(181, 241, 90, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  pointerEvents: 'none'
                }}>
                  <Compass size={11} />
                  {userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E
                </div>
              </div>

              {/* Open in Google Maps Link */}
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${userLocation.lat},${userLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rc-btn rc-btn-ghost btn-full"
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--moss)',
                  borderColor: 'var(--line)',
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ExternalLink size={13} /> Open in Google Maps Fullscreen
              </a>
            </div>

            <div className="glass-card" style={{ 
              background: 'linear-gradient(145deg, var(--moss), var(--fern))', 
              border: '1px solid rgba(181, 241, 90, 0.3)',
              boxShadow: '0 10px 30px rgba(13, 51, 36, 0.2)',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.3rem' }}>Ready to earn?</h3>
                <Award size={24} color="var(--sprout)" />
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Use your EcoPoints to redeem exciting vouchers and local perks!</p>
              <button className="rc-btn rc-btn-primary btn-full" style={{ padding: '12px' }} onClick={() => navigate('/rewards')}>View Rewards Catalog</button>
            </div>
            
          </div>
        </div>
      </main>
    </>
  );
}
