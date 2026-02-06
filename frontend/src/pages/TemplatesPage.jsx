import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionService } from '../services/subscriptionService';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { 
  FileText,
  Search,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Film,
  Zap,
  TrendingUp,
  Users,
  Briefcase,
  Gamepad2,
  Heart,
  Code,
  Music,
  Utensils,
  Dumbbell,
  Star,
  Crown,
  Lock
} from 'lucide-react';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    checkAccessAndLoad();
  }, [user]);

  const checkAccessAndLoad = async () => {
    setLoading(true);
    
    // Check subscription access
    const subscription = SubscriptionService.getCurrentSubscription(user?.sub);
    const hasProFeature = subscription?.plan === 'pro' || subscription?.plan === 'advance';
    
    setHasAccess(hasProFeature);
    setLoading(false);
  };

  const templates = [
    {
      id: 1,
      title: 'Product Launch Announcement',
      description: 'Professional template for announcing new products or features',
      platform: 'linkedin',
      category: 'business',
      style: 'professional',
      duration: 'medium',
      popular: true,
      preview: 'Exciting news! We\'re thrilled to announce...'
    },
    {
      id: 2,
      title: 'Tutorial/How-To Video',
      description: 'Step-by-step educational content structure',
      platform: 'youtube',
      category: 'education',
      style: 'educational',
      duration: 'long',
      popular: true,
      preview: 'In this tutorial, I\'ll show you exactly how to...'
    },
    {
      id: 3,
      title: 'Daily Vlog',
      description: 'Casual, personal storytelling format',
      platform: 'youtube',
      category: 'lifestyle',
      style: 'casual',
      duration: 'medium',
      popular: false,
      preview: 'Hey everyone! Welcome back to another day in my life...'
    },
    {
      id: 4,
      title: 'Instagram Reel Hook',
      description: 'Attention-grabbing short-form content',
      platform: 'instagram',
      category: 'entertainment',
      style: 'humorous',
      duration: 'short',
      popular: true,
      preview: 'Wait for it... You won\'t believe what happens next!'
    },
    {
      id: 5,
      title: 'Tech Review',
      description: 'Comprehensive product review structure',
      platform: 'youtube',
      category: 'tech',
      style: 'professional',
      duration: 'long',
      popular: true,
      preview: 'Today we\'re reviewing the latest...'
    },
    {
      id: 6,
      title: 'Motivational Post',
      description: 'Inspiring and uplifting content',
      platform: 'instagram',
      category: 'lifestyle',
      style: 'professional',
      duration: 'short',
      popular: false,
      preview: 'Your only limit is you. Remember...'
    },
    {
      id: 7,
      title: 'Industry News Update',
      description: 'Breaking news and trend analysis',
      platform: 'twitter',
      category: 'business',
      style: 'professional',
      duration: 'short',
      popular: false,
      preview: 'Breaking: Major development in...'
    },
    {
      id: 8,
      title: 'Gaming Highlights',
      description: 'Epic moments and gameplay commentary',
      platform: 'youtube',
      category: 'gaming',
      style: 'casual',
      duration: 'medium',
      popular: true,
      preview: 'That was INSANE! Let me show you...'
    },
    {
      id: 9,
      title: 'Recipe Tutorial',
      description: 'Step-by-step cooking instructions',
      platform: 'instagram',
      category: 'food',
      style: 'casual',
      duration: 'short',
      popular: false,
      preview: 'Today I\'m making the easiest...'
    },
    {
      id: 10,
      title: 'Workout Routine',
      description: 'Fitness exercise guide',
      platform: 'youtube',
      category: 'fitness',
      style: 'educational',
      duration: 'medium',
      popular: false,
      preview: 'Let\'s crush this workout together...'
    },
    {
      id: 11,
      title: 'Behind the Scenes',
      description: 'Exclusive look at your creative process',
      platform: 'instagram',
      category: 'entertainment',
      style: 'casual',
      duration: 'short',
      popular: true,
      preview: 'Want to see how I actually make...'
    },
    {
      id: 12,
      title: 'Coding Tutorial',
      description: 'Programming concepts explained',
      platform: 'youtube',
      category: 'tech',
      style: 'educational',
      duration: 'extended',
      popular: false,
      preview: 'In this video, we\'ll build...'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories', icon: <FileText size={16} /> },
    { id: 'business', label: 'Business', icon: <Briefcase size={16} /> },
    { id: 'tech', label: 'Technology', icon: <Code size={16} /> },
    { id: 'education', label: 'Education', icon: <Users size={16} /> },
    { id: 'entertainment', label: 'Entertainment', icon: <Star size={16} /> },
    { id: 'lifestyle', label: 'Lifestyle', icon: <Heart size={16} /> },
    { id: 'gaming', label: 'Gaming', icon: <Gamepad2 size={16} /> },
    { id: 'fitness', label: 'Fitness', icon: <Dumbbell size={16} /> },
    { id: 'food', label: 'Food', icon: <Utensils size={16} /> }
  ];

  const platforms = [
    { id: 'all', label: 'All Platforms', icon: <FileText size={16} /> },
    { id: 'youtube', label: 'YouTube', icon: <Youtube size={16} /> },
    { id: 'instagram', label: 'Instagram', icon: <Instagram size={16} /> },
    { id: 'twitter', label: 'Twitter', icon: <Twitter size={16} /> },
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} /> },
    { id: 'tiktok', label: 'TikTok', icon: <Film size={16} /> }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || template.platform === filterPlatform;
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesPlatform && matchesCategory;
  });

  const handleUseTemplate = (template) => {
    // Navigate to script generator with template pre-filled
    navigate('/script-generator', { 
      state: { 
        template: {
          topic: template.title,
          platform: template.platform,
          style: template.style,
          duration: template.duration
        }
      }
    });
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'youtube': return <Youtube size={16} />;
      case 'instagram': return <Instagram size={16} />;
      case 'twitter': return <Twitter size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'tiktok': return <Film size={16} />;
      default: return <FileText size={16} />;
    }
  };

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
            Proven Viral Content Templates are available exclusively for Pro plan members. Upgrade to skip the blank page and start creating instantly.
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <FileText size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
              Script Templates
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Pre-made templates to jumpstart your content creation
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'var(--background-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                background: 'var(--background-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Platform Filter */}
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--background-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            {platforms.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--background-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUse={() => handleUseTemplate(template)}
              getPlatformIcon={getPlatformIcon}
            />
          ))}
        </div>
      ) : (
        <div style={{
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          textAlign: 'center',
          border: '2px dashed var(--border-color)'
        }}>
          <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            No templates found
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Try adjusting your filters or search query
          </p>
        </div>
      )}
      </>
      )}
    </DashboardLayout>
  );
}

function TemplateCard({ template, onUse, getPlatformIcon }) {
  return (
    <div style={{
      background: 'var(--background-card)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.2s',
      position: 'relative'
    }}>
      {/* Popular Badge */}
      {template.popular && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.35rem 0.75rem',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          textTransform: 'uppercase'
        }}>
          <TrendingUp size={12} />
          Popular
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3, paddingRight: template.popular ? '80px' : '0' }}>
          {template.title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
          {template.description}
        </p>
      </div>

      {/* Preview */}
      <div style={{
        padding: '1rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1rem',
        fontStyle: 'italic',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6
      }}>
        "{template.preview}"
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.25rem 0.65rem',
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--primary-color)',
          textTransform: 'capitalize'
        }}>
          {getPlatformIcon(template.platform)}
          {template.platform}
        </span>
        <span style={{
          padding: '0.25rem 0.65rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textTransform: 'capitalize'
        }}>
          {template.style}
        </span>
        <span style={{
          padding: '0.25rem 0.65rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textTransform: 'capitalize'
        }}>
          {template.duration}
        </span>
      </div>

      {/* Use Button */}
      <button
        onClick={onUse}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        <Zap size={16} />
        Use Template
      </button>
    </div>
  );
}
