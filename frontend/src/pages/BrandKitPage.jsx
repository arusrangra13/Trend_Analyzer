import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionService } from '../services/subscriptionService';
import { 
  Palette,
  Type,
  Image as ImageIcon,
  Save,
  Upload,
  Copy,
  Check,
  Plus,
  Trash2,
  Eye,
  Download,
  Sparkles,
  Lock,
  Crown
} from 'lucide-react';

export default function BrandKitPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [brandKit, setBrandKit] = useState({
    brandName: '',
    tagline: '',
    colors: {
      primary: '#6366f1',
      secondary: '#ec4899',
      accent: '#f59e0b',
      background: '#0b0f1a',
      text: '#f8fafc'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    logo: null,
    voiceTone: 'professional',
    keywords: [],
    templates: []
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [copiedColor, setCopiedColor] = useState(null);

  useEffect(() => {
    checkAccessAndLoad();
  }, [user]);

  const checkAccessAndLoad = async () => {
    setLoading(true);
    
    // Check subscription access
    const subscription = SubscriptionService.getCurrentSubscription(user?.sub);
    const hasProFeature = subscription?.plan === 'pro' || subscription?.plan === 'advance';
    
    setHasAccess(hasProFeature);
    
    if (!hasProFeature) {
      setLoading(false);
      return; 
    }

    loadBrandKit();
    setLoading(false);
  };

  const loadBrandKit = () => {
    const saved = localStorage.getItem('brand_kit');
    if (saved) {
      setBrandKit(JSON.parse(saved));
    }
  };

  const saveBrandKit = () => {
    localStorage.setItem('brand_kit', JSON.stringify(brandKit));
    toast.success('Brand kit saved successfully!');
  };

  const handleColorChange = (colorKey, value) => {
    setBrandKit({
      ...brandKit,
      colors: {
        ...brandKit.colors,
        [colorKey]: value
      }
    });
  };

  const handleCopyColor = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast.success('Color copied to clipboard!');
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandKit({ ...brandKit, logo: reader.result });
        toast.success('Logo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setBrandKit({
        ...brandKit,
        keywords: [...brandKit.keywords, newKeyword.trim()]
      });
      setNewKeyword('');
      toast.success('Keyword added!');
    }
  };

  const handleRemoveKeyword = (index) => {
    setBrandKit({
      ...brandKit,
      keywords: brandKit.keywords.filter((_, i) => i !== index)
    });
  };

  const voiceToneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal and authoritative' },
    { value: 'casual', label: 'Casual', description: 'Friendly and conversational' },
    { value: 'humorous', label: 'Humorous', description: 'Fun and entertaining' },
    { value: 'educational', label: 'Educational', description: 'Informative and clear' },
    { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' }
  ];

  const fontOptions = [
    'Inter', 'Roboto', 'Poppins', 'Montserrat', 'Open Sans', 
    'Lato', 'Raleway', 'Playfair Display', 'Merriweather'
  ];

  return (
    <DashboardLayout>
      {!loading && !hasAccess ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            border: '2px solid var(--primary-color)'
          }}>
            <Lock size={40} color="var(--primary-color)" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Premium Feature
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2rem' }}>
            Custom Brand Kits are available exclusively for Pro plan members. Upgrade to maintain consistent branding across all your content.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => navigate('/subscription')}
              className="btn btn-primary"
              style={{ 
                padding: '0.75rem 2rem', 
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: 'none',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              <Crown size={20} />
              Upgrade to Pro
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
            >
              Go Back
            </button>
          </div>
        </div>
      ) : (
      <>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              <Palette size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                Brand Kit
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Define your brand identity and maintain consistency
              </p>
            </div>
          </div>

          <button
            onClick={saveBrandKit}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={18} />
            Save Brand Kit
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Brand Info */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} />
              Brand Information
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandKit.brandName}
                  onChange={(e) => setBrandKit({ ...brandKit, brandName: e.target.value })}
                  placeholder="Enter your brand name..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--background-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Tagline
                </label>
                <input
                  type="text"
                  value={brandKit.tagline}
                  onChange={(e) => setBrandKit({ ...brandKit, tagline: e.target.value })}
                  placeholder="Your brand tagline..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--background-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={20} />
              Brand Logo
            </h2>

            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => document.getElementById('logo-upload').click()}
            >
              {brandKit.logo ? (
                <div>
                  <img src={brandKit.logo} alt="Brand Logo" style={{ maxWidth: '200px', maxHeight: '100px', marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Click to change logo</p>
                </div>
              ) : (
                <div>
                  <Upload size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Upload Your Logo
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    PNG, JPG or SVG (Max 2MB)
                  </p>
                </div>
              )}
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Brand Colors */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette size={20} />
              Brand Colors
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(brandKit.colors).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-md)',
                    background: value,
                    border: '2px solid var(--border-color)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => document.getElementById(`color-${key}`).click()}
                  >
                    <input
                      id={`color-${key}`}
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize', marginBottom: '0.25rem' }}>
                      {key}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {value}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyColor(value)}
                    style={{
                      padding: '0.5rem',
                      background: copiedColor === value ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      color: copiedColor === value ? '#10b981' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {copiedColor === value ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Typography */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Type size={20} />
              Typography
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Heading Font
                </label>
                <select
                  value={brandKit.fonts.heading}
                  onChange={(e) => setBrandKit({ ...brandKit, fonts: { ...brandKit.fonts, heading: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--background-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
                <div style={{ marginTop: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontFamily: brandKit.fonts.heading, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    The Quick Brown Fox
                  </p>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Body Font
                </label>
                <select
                  value={brandKit.fonts.body}
                  onChange={(e) => setBrandKit({ ...brandKit, fonts: { ...brandKit.fonts, body: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--background-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
                <div style={{ marginTop: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontFamily: brandKit.fonts.body, fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    The quick brown fox jumps over the lazy dog. This is a sample of your body text.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Voice & Tone */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              Voice & Tone
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {voiceToneOptions.map(option => (
                <div
                  key={option.value}
                  onClick={() => setBrandKit({ ...brandKit, voiceTone: option.value })}
                  style={{
                    padding: '1rem',
                    background: brandKit.voiceTone === option.value ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${brandKit.voiceTone === option.value ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {option.label}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {option.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Keywords */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              Brand Keywords
            </h2>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                  placeholder="Add a keyword..."
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'var(--background-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  onClick={handleAddKeyword}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--primary-color)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 600
                  }}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {brandKit.keywords.map((keyword, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    color: 'var(--primary-color)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {keyword}
                  <button
                    onClick={() => handleRemoveKeyword(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-color)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {brandKit.keywords.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', padding: '2rem 0' }}>
                Add keywords that represent your brand
              </p>
            )}
          </div>
        </div>
      </div>
      </>
      )}
    </DashboardLayout>
  );
}
