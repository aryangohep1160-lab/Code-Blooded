import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function CreateListing() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'New',
    type: 'SELL',
    imageUrl: ''
  });
  
  const [imageType, setImageType] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('condition', formData.condition);
      submitData.append('type', formData.type);
      
      if (formData.type === 'SELL' && formData.price) {
        submitData.append('price', formData.price);
      }
      
      if (imageType === 'url' && formData.imageUrl) {
        submitData.append('imageUrl', formData.imageUrl);
      } else if (imageType === 'file' && imageFile) {
        submitData.append('image', imageFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/listings`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create listing');
      }
      navigate('/marketplace');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="container animate-slide-up" style={{ padding: '3rem 24px', flex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-card">
          {error && <div className="error-text" style={{marginBottom: '1rem'}}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Title</label>
              <input type="text" name="title" className="input-field" placeholder="e.g. Vintage Denim Jacket" required onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea name="description" className="input-field" rows={4} placeholder="Describe the item, its history, and any flaws..." required onChange={handleChange}></textarea>
            </div>

            <div className="input-group">
              <label className="input-label">Listing Type</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['SELL', 'DONATE', 'SWAP', 'REPAIR', 'WANTED'].map(t => (
                  <button type="button" key={t} className={`btn ${formData.type === t ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, padding: '8px' }} onClick={() => setFormData({ ...formData, type: t })}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {formData.type === 'SELL' && (
              <div className="input-group">
                <label className="input-label">Price (₹)</label>
                <input type="number" name="price" className="input-field" placeholder="0.00" min="0" step="0.01" required onChange={handleChange} />
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Condition</label>
              <select name="condition" className="input-field" value={formData.condition} onChange={handleChange}>
                <option>New</option>
                <option>New with tags</option>
                <option>Like New</option>
                <option>Used - Good</option>
                <option>Used - Fair</option>
              </select>
            </div>

            <div className="input-group" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
              <label className="input-label" style={{ marginBottom: '8px' }}>Item Photo</label>
              
              <div className="flex gap-2" style={{ marginBottom: '12px' }}>
                <button type="button" className={`btn ${imageType === 'url' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, padding: '8px' }} onClick={() => setImageType('url')}>
                  <LinkIcon size={16} /> Image URL
                </button>
                <button type="button" className={`btn ${imageType === 'file' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, padding: '8px' }} onClick={() => setImageType('file')}>
                  <ImageIcon size={16} /> Upload File
                </button>
              </div>

              {imageType === 'url' ? (
                <input type="url" name="imageUrl" className="input-field" placeholder="https://..." onChange={handleChange} />
              ) : (
                <input type="file" accept="image/*" className="input-field" onChange={handleFileChange} style={{ padding: '10px' }} />
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              <UploadCloud size={18} /> {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
