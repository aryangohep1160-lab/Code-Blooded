import { useEffect, useState } from 'react';
import { Map, MapPin, Star, X, Phone, Clock, Globe, Search, ExternalLink } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import { API_BASE_URL } from '../config/api';

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

const DEFAULT_PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'TechFix Electronics',
    type: 'REPAIR',
    category: 'Electronics',
    address: '124 Main Street, Downtown',
    distance: '1.2 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=400',
    description: 'Expert repairs for laptops, smartphones, tablets, and household electronics.',
    phone: '+91 (079) 2630-1122',
    hours: 'Mon-Sat: 9AM - 6PM',
    website: 'www.techfixelectronics.com'
  },
  {
    id: '2',
    name: 'GreenEarth E-Waste',
    type: 'RECYCLE',
    category: 'E-Waste',
    address: 'Industrial Park, Block C',
    distance: '3.5 km',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400',
    description: 'Certified e-waste drop-off, battery reclamation, and responsible recycling center.',
    phone: '+91 (079) 2583-4455',
    hours: 'Mon-Fri: 8AM - 4PM',
    website: 'www.greenearth-ewaste.org'
  },
  {
    id: '3',
    name: 'Goodwill Donation Center',
    type: 'DONATION',
    category: 'Clothing & Furniture',
    address: '89 Community Blvd',
    distance: '0.8 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=400',
    description: 'Accepting gently used clothes, books, and study desks for regional charity.',
    phone: '+91 (079) 2657-8899',
    hours: 'Daily: 10AM - 7PM',
    website: 'www.goodwillcenter.org'
  },
  {
    id: '4',
    name: 'The Woodshop Wizards',
    type: 'REPAIR',
    category: 'Furniture',
    address: '42 Artisan Alley, Ellisbridge',
    distance: '2.1 km',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&q=80&w=400',
    description: 'Specializing in wooden furniture restoration, chair repairs, and heirloom upcycling.',
    phone: '+91 (079) 2640-3344',
    hours: 'Tue-Sun: 10AM - 5PM',
    website: 'www.woodshopwizards.com'
  },
  {
    id: '5',
    name: 'Apex Auto & Motor Mechanics',
    type: 'REPAIR',
    category: 'Auto & Mechanics',
    address: '77 Motorway Hub, Navrangpura',
    distance: '1.5 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400',
    description: 'Certified mechanics for two-wheelers, scooter engine tuning, EV battery diagnostics, and brake overhaul.',
    phone: '+91 (079) 2791-4488',
    hours: 'Mon-Sat: 8:30AM - 7:30PM',
    website: 'www.apexmechanics.in'
  },
  {
    id: '6',
    name: 'CycleCraft Bike Hospital',
    type: 'REPAIR',
    category: 'Bicycles & Mobility',
    address: '15 Greenway Boulevard, Vastrapur',
    distance: '0.9 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400',
    description: 'Bicycle gear tuning, puncture repair, chain restorations, and zero-waste cycle upgrades.',
    phone: '+91 (079) 2676-9022',
    hours: 'Mon-Sun: 7AM - 8PM',
    website: 'www.cyclecraftrepair.in'
  },
  {
    id: '7',
    name: 'HomeVolt Appliance Doctor',
    type: 'REPAIR',
    category: 'Home Appliances',
    address: '210 Service Road, Paldi',
    distance: '2.4 km',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400',
    description: 'Fast diagnostics and motor rewinds for washing machines, induction cooktops, and electric kettles.',
    phone: '+91 (079) 2658-1100',
    hours: 'Mon-Sat: 9AM - 6PM',
    website: 'www.homevoltappliances.in'
  },
  {
    id: '8',
    name: 'SoleCraft Cobbler & Leather Works',
    type: 'REPAIR',
    category: 'Footwear & Bags',
    address: '63 Heritage Market, Old City',
    distance: '1.1 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400',
    description: 'Traditional handcrafted shoe resoling, luggage zipper replacements, and leather bag restoration.',
    phone: '+91 (079) 2535-6711',
    hours: 'Daily: 10AM - 8PM',
    website: 'www.solecraftleather.in'
  },
  {
    id: '9',
    name: 'SolarPulse Inverter & Solar Care',
    type: 'REPAIR',
    category: 'Solar & Renewable Energy',
    address: '104 Sun Park, Science City Road, Sola',
    distance: '3.1 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=400',
    description: 'Rooftop solar panel testing, microgrid inverter repair, battery pack reconditioning, and energy efficiency audits.',
    phone: '+91 (079) 2766-3399',
    hours: 'Mon-Sat: 9AM - 7PM',
    website: 'www.solarpulseenergy.in'
  },
  {
    id: '10',
    name: 'WatchCrafters & Chrono Clinic',
    type: 'REPAIR',
    category: 'Watches & Precision Gear',
    address: '28 Silver Plaza, C.G. Road',
    distance: '1.4 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
    description: 'Mechanical watch servicing, smartwatch display swap, ultrasonic strap cleaning, and waterproof gasket testing.',
    phone: '+91 (079) 2644-8822',
    hours: 'Mon-Sat: 10AM - 8PM',
    website: 'www.watchcraftersahmedabad.in'
  },
  {
    id: '11',
    name: 'TextileRevive Circular Atelier',
    type: 'REPAIR',
    category: 'Textiles & Circular Fashion',
    address: '56 Handloom House, Ashram Road',
    distance: '1.8 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=400',
    description: 'Invisible darning, denim distressing repair, zipper replacements, and bespoke upcycled patchwork garments.',
    phone: '+91 (079) 2656-7711',
    hours: 'Tue-Sun: 10:30AM - 7:30PM',
    website: 'www.textilerevive.org'
  },
  {
    id: '12',
    name: 'PureWater RO & Filter Services',
    type: 'REPAIR',
    category: 'Plumbing & Water Systems',
    address: '88 Aqua Enclave, Bodakdev',
    distance: '2.6 km',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    description: 'Water purifier membrane replacement, booster pump refurbishment, tap leak prevention, and zero-waste plumbing.',
    phone: '+91 (079) 2685-4422',
    hours: 'Mon-Sun: 8AM - 8PM',
    website: 'www.purewatercare.in'
  },
  {
    id: '13',
    name: 'Vibrant Gujarat Glass & Ceramic Rescue',
    type: 'RECYCLE',
    category: 'Glass & Ceramics',
    address: '14 Glassworks Lane, Naroda GIDC',
    distance: '4.8 km',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=400',
    description: 'Drop-off center for broken architectural glass, mirrors, cookware ceramics, and industrial cullet melting.',
    phone: '+91 (079) 2281-9900',
    hours: 'Mon-Fri: 8AM - 5PM',
    website: 'www.vibrantglassrescue.in'
  },
  {
    id: '14',
    name: 'City Book Bank & STEM Toy Library',
    type: 'DONATION',
    category: 'Books & Educational Toys',
    address: '19 Vidyanagar Road, Gujarat University Area',
    distance: '1.0 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400',
    description: 'Community lending repository for academic textbooks, competitive exam guides, and refurbished STEM learning toys.',
    phone: '+91 (079) 2630-5500',
    hours: 'Daily: 9AM - 8PM',
    website: 'www.citybookbankahmedabad.org'
  },
  {
    id: '15',
    name: 'AudioLab Speaker & Hi-Fi Restorations',
    type: 'REPAIR',
    category: 'Audio & Music Gear',
    address: '72 Harmony Arcade, Satellite',
    distance: '2.3 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=400',
    description: 'Amplifier circuit soldering, speaker cone repair, vinyl turntable belt replacements, and headphone rewiring.',
    phone: '+91 (079) 2673-1288',
    hours: 'Tue-Sat: 11AM - 8PM',
    website: 'www.audiolabrepairs.in'
  }
];

export default function Network() {
  const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/network/partners?type=${filter}`);
        if (res.ok) {
          const data = await res.json();
          setPartners(Array.isArray(data) && data.length > 0 ? data : DEFAULT_PARTNERS);
        } else {
          setPartners(filter === 'ALL' ? DEFAULT_PARTNERS : DEFAULT_PARTNERS.filter(p => p.type === filter));
        }
      } catch (err) {
        setPartners(filter === 'ALL' ? DEFAULT_PARTNERS : DEFAULT_PARTNERS.filter(p => p.type === filter));
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, [filter]);

  const filteredPartners = partners.filter(partner => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      partner.name.toLowerCase().includes(q) ||
      partner.category.toLowerCase().includes(q) ||
      partner.address.toLowerCase().includes(q) ||
      partner.description.toLowerCase().includes(q)
    );
  });

  return (
    <main className="container animate-slide-up" style={{ padding: '3rem 24px', flex: 1 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--moss)' }}>
          <Map size={40} color="var(--primary-light)" /> Local Repair & Circular Network
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem', maxWidth: '650px', margin: '0.5rem auto 0' }}>
          Discover certified repair heroes, automotive mechanics, solar engineers, electronic clinics, and verified e-waste drop-off points.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div style={{ maxWidth: '800px', margin: '0 auto 3rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={20} color="var(--muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            className="input-field"
            placeholder="Search mechanics, electronics, bicycles, shoes, solar, appliances..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '48px', marginBottom: 0, borderRadius: '999px', fontSize: '15px' }}
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Type Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { label: `All Partners (${DEFAULT_PARTNERS.length})`, val: 'ALL' },
            { label: 'Repair Heroes (11)', val: 'REPAIR' },
            { label: 'Recycling Centers (2)', val: 'RECYCLE' },
            { label: 'Donation Hubs (2)', val: 'DONATION' }
          ].map(item => (
            <button 
              key={item.val}
              className={`rc-chip ${filter === item.val ? 'on' : ''}`}
              onClick={() => setFilter(item.val)}
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Partners */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card" style={{ padding: 0 }}>
              <Skeleton height="380px" borderRadius="20px" />
            </div>
          ))}
        </div>
      ) : filteredPartners.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>No repair partners found matching "{searchQuery}".</p>
          <button className="rc-btn rc-btn-primary" onClick={() => setSearchQuery('')} style={{ marginTop: '1rem' }}>
            Clear Search
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
          {filteredPartners.map(partner => (
            <div 
              key={partner.id} 
              className="glass-card" 
              style={{ 
                padding: 0, 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 18px 36px -10px rgba(13, 51, 36, 0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div style={{ height: '210px', position: 'relative' }}>
                <img src={partner.image} alt={partner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* Category Badge */}
                <div style={{ 
                  position: 'absolute', 
                  top: 14, 
                  left: 14, 
                  background: 'rgba(255, 255, 255, 0.92)', 
                  backdropFilter: 'blur(8px)', 
                  padding: '5px 14px', 
                  borderRadius: 'var(--radius-pill)', 
                  color: 'var(--moss)', 
                  fontSize: '0.8rem', 
                  fontWeight: 700,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                  {partner.category}
                </div>

                {/* Distance Pill */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: 14, 
                  right: 14, 
                  background: 'rgba(8, 28, 19, 0.88)', 
                  backdropFilter: 'blur(8px)',
                  color: 'var(--sprout)', 
                  padding: '4px 12px', 
                  borderRadius: 'var(--radius-pill)', 
                  fontSize: '0.8rem', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  border: '1px solid rgba(181, 241, 90, 0.3)'
                }}>
                  <MapPin size={13} /> {partner.distance}
                </div>
              </div>
              
              <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--moss)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                    {partner.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>
                    <Star size={16} fill="#F59E0B" /> {partner.rating}
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={14} color="var(--fern)" style={{ flexShrink: 0 }} /> {partner.address}
                </p>

                <p style={{ color: 'var(--text-muted)', flex: 1, marginBottom: '1.5rem', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  {partner.description}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button 
                    className="rc-btn rc-btn-ghost" 
                    onClick={() => setSelectedPartner(partner)}
                    style={{ padding: '10px 14px', fontSize: '13px' }}
                  >
                    View Details
                  </button>

                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partner.name + ' ' + partner.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rc-btn rc-btn-primary"
                    style={{ padding: '10px 14px', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    Directions <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Partner Details Modal */}
      {selectedPartner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(8, 23, 17, 0.72)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '24px'
        }} onClick={() => setSelectedPartner(null)}>
          <div className="glass-card animate-slide-up" style={{ 
            maxWidth: '540px', width: '100%', padding: '2rem', position: 'relative', background: '#ffffff', borderRadius: '24px'
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedPartner(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              title="Close modal"
            >
              <X size={24} />
            </button>

            <div style={{ height: '220px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
              <img src={selectedPartner.image} alt={selectedPartner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', top: 12, left: 12,
                background: 'var(--moss)', color: 'var(--sprout)',
                fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px'
              }}>
                {selectedPartner.type}
              </div>
            </div>
            
            <h2 style={{ marginBottom: '0.35rem', color: 'var(--moss)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
              {selectedPartner.name}
            </h2>
            <p style={{ color: 'var(--fern)', fontWeight: 700, marginBottom: '1rem', fontSize: '14px' }}>
              {selectedPartner.category} • ★ {selectedPartner.rating}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {selectedPartner.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'var(--text-main)', fontSize: '13px', background: 'var(--sand)', padding: '16px', borderRadius: '14px', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={18} color="var(--fern)" style={{ flexShrink: 0 }} />
                <span><strong>Address:</strong> {selectedPartner.address} ({selectedPartner.distance})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} color="var(--fern)" style={{ flexShrink: 0 }} />
                <span><strong>Phone:</strong> {selectedPartner.phone || '+91 (079) 2630-0000'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={18} color="var(--fern)" style={{ flexShrink: 0 }} />
                <span><strong>Hours:</strong> {selectedPartner.hours || 'Mon-Sat: 9AM - 7PM'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Globe size={18} color="var(--fern)" style={{ flexShrink: 0 }} />
                <span><strong>Website:</strong> {selectedPartner.website || 'https://recircle.eco'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '1.5rem' }}>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPartner.name + ' ' + selectedPartner.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rc-btn rc-btn-primary"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px' }}
              >
                Get Directions <ExternalLink size={14} />
              </a>

              <button className="rc-btn rc-btn-solid" style={{ padding: '12px' }} onClick={() => setSelectedPartner(null)}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
