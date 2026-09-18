import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Target, MapPin, Sparkles, Send, Paperclip, X } from 'lucide-react';
import Skeleton from '../components/Skeleton';

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
        const res = await fetch('http://localhost:5001/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
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
      const res = await fetch('http://localhost:5001/api/ai/chat', {
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
              <h3 className="flex items-center gap-2" style={{ marginBottom: '1.5rem', color: 'white', fontSize: '1.25rem' }}>
                <Target size={22} color="var(--primary-light)" /> Impact Tracking
              </h3>
              <div className="flex gap-4" style={{ marginBottom: '2rem' }}>
                <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>CO2 Saved</p>
                  <h2 style={{ fontSize: '3rem', color: 'white', margin: 0, fontFamily: 'var(--font-display)' }}>0.0 <span style={{fontSize:'1.2rem', color: 'var(--text-muted)'}}>kg</span></h2>
                </div>
                <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ color: 'var(--accent-light)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Waste Diverted</p>
                  <h2 style={{ fontSize: '3rem', color: 'white', margin: 0, fontFamily: 'var(--font-display)' }}>0 <span style={{fontSize:'1.2rem', color: 'var(--text-muted)'}}>items</span></h2>
                </div>
              </div>
              <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }} onClick={() => navigate('/create-listing')}>Start a New Listing</button>
            </div>

            {/* AI Sustainability Assistant Widget */}
            <div className="glass-card" style={{ padding: 0 }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: 'var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(15, 23, 42, 0.4)' }}>
                <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <Sparkles size={20} color="white" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Eco-AI Assistant</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Powered by Gemini 2.5 Flash</p>
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
                  <button type="button" className="btn btn-outline" style={{ padding: '0 12px', borderRadius: 'var(--radius-md)' }} onClick={() => fileInputRef.current?.click()} title="Attach file (Ctrl+U)">
                    <Paperclip size={18} />
                  </button>
                  <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageAttachment} />
                  
                  <input 
                    type="text" 
                    className="input-field" 
                    style={{ flex: 1, marginBottom: 0 }}
                    placeholder={attachedImage ? "Add a message with your image..." : "Ask about recycling... (Ctrl+U to attach, or Paste image)"}
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
            
            <div className="glass-card">
              <h3 className="flex items-center gap-2" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                <MapPin size={20} color="var(--primary-light)" /> Location
              </h3>
              {profile?.role === 'BUSINESS' ? (
                <p style={{ color: 'var(--text-muted)' }}>{profile?.businessProfile?.address || 'No address set'}</p>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Hyperlocal matching is active in your area.</p>
              )}
            </div>

            <div className="glass-card" style={{ 
              background: 'linear-gradient(145deg, rgba(5, 150, 105, 0.4), rgba(6, 95, 70, 0.8))', 
              border: '1px solid rgba(52, 211, 153, 0.4)',
              boxShadow: '0 10px 30px rgba(5, 150, 105, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ color: 'white', margin: 0, fontSize: '1.3rem' }}>Ready to earn?</h3>
                <Award size={24} color="var(--accent-light)" />
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Use your EcoPoints to redeem exciting vouchers and local perks!</p>
              <button className="btn btn-accent btn-full" style={{ padding: '14px' }} onClick={() => navigate('/rewards')}>View Rewards Catalog</button>
            </div>
            
          </div>
        </div>
      </main>
    </>
  );
}
