import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useToast } from '../contexts/ToastContext';
import YouTubeService from '../services/youtubeService';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionService } from '../services/subscriptionService';
import { 
  TrendingUp,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Film,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Calendar,
  FileText,
  RefreshCw,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  MessageCircle,
  Clock,
  BarChart3,
  ExternalLink,
  Lock,
  Crown
} from 'lucide-react';

export default function YouTubeTrendingPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedVideos, setSavedVideos] = useState([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => {
    checkAccessAndLoad();
  }, [user, selectedRegion, selectedCategory]);

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

    await Promise.all([
      loadTrendingVideos(),
      loadCategories()
    ]);
    loadSavedVideos();
  };

  const loadTrendingVideos = async () => {
    setLoading(true);
    try {
      const categoryId = selectedCategory !== 'all' ? selectedCategory : null;
      const videos = await YouTubeService.getTrendingVideos(selectedRegion, 50, categoryId);
      setTrendingVideos(videos);
      toast.success(`Loaded ${videos.length} trending videos`);
    } catch (error) {
      console.error('Error loading trending videos:', error);
      toast.error('Failed to load trending videos');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await YouTubeService.getVideoCategories(selectedRegion);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadSavedVideos = () => {
    const saved = localStorage.getItem('saved_youtube_videos');
    if (saved) {
      setSavedVideos(JSON.parse(saved));
    }
  };

  const handleToggleSave = (video) => {
    const isSaved = savedVideos.some(v => v.id === video.id);
    let updated;
    
    if (isSaved) {
      updated = savedVideos.filter(v => v.id !== video.id);
      toast.info('Video removed from saved');
    } else {
      updated = [...savedVideos, video];
      toast.success('Video saved!');
    }
    
    setSavedVideos(updated);
    localStorage.setItem('saved_youtube_videos', JSON.stringify(updated));
  };

  const handleUseInGenerator = (video) => {
    navigate('/script-generator', { state: { topic: video.title } });
  };

  const handleSchedule = (video) => {
    navigate('/calendar', { state: { scheduleTopic: video.title } });
  };

  const isVideoSaved = (video) => {
    return savedVideos.some(v => v.id === video.id);
  };

  const getCompetitionLevel = (viewCount) => {
    if (viewCount > 1000000) return { level: 'High', percentage: 85, color: '#ef4444' };
    if (viewCount > 100000) return { level: 'Medium', percentage: 60, color: '#f59e0b' };
    return { level: 'Low', percentage: 30, color: '#10b981' };
  };

  const filteredVideos = trendingVideos
    .filter(video => {
      const matchesSearch = !searchQuery || 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channelTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSaved = !showSavedOnly || isVideoSaved(video);
      return matchesSearch && matchesSaved;
    })
    .sort((a, b) => b.viralScore - a.viralScore);

  const stats = {
    total: trendingVideos.length,
    highViral: trendingVideos.filter(v => v.viralScore >= 70).length,
    lowCompetition: trendingVideos.filter(v => v.viewCount < 100000).length,
    saved: savedVideos.length
  };

  const regions = [
    { code: 'US', name: 'United States' },
    { code: 'IN', name: 'India' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'BR', name: 'Brazil' }
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
            background: 'rgba(255, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            border: '2px solid #ff0000'
          }}>
            <Lock size={40} color="#ff0000" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Premium Feature
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2rem' }}>
            Real-time YouTube Trending analysis is available exclusively for Pro plan members. Upgrade now to spot viral trends instantly.
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
                background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(255, 0, 0, 0.3)'
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff0000, #cc0000)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 0, 0, 0.3)'
            }}>
              <Youtube size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                YouTube Trending
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Real-time trending videos from YouTube Data API
              </p>
            </div>
          </div>

          <button
            onClick={loadTrendingVideos}
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <StatCard label="Total Videos" value={stats.total} icon={<Youtube size={20} />} color="#ff0000" />
          <StatCard label="High Viral Potential" value={stats.highViral} icon={<TrendingUp size={20} />} color="#10b981" />
          <StatCard label="Low Competition" value={stats.lowCompetition} icon={<BarChart3 size={20} />} color="#f59e0b" />
          <StatCard label="Saved Ideas" value={stats.saved} icon={<Bookmark size={20} />} color="#6366f1" />
        </div>

        {/* Filters */}
        <div style={{
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search videos..."
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

            {/* Region */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                background: 'var(--background-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {regions.map(region => (
                <option key={region.code} value={region.code}>{region.name}</option>
              ))}
            </select>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                background: 'var(--background-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.snippet.title}</option>
              ))}
            </select>

            {/* Saved Filter */}
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              style={{
                padding: '0.75rem 1.25rem',
                background: showSavedOnly ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${showSavedOnly ? 'var(--primary-color)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                color: showSavedOnly ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              {showSavedOnly ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              Saved Only
            </button>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <RefreshCw size={48} color="var(--primary-color)" className="spinning" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Loading trending videos...</p>
        </div>
      ) : filteredVideos.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
          {filteredVideos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              isSaved={isVideoSaved(video)}
              onToggleSave={() => handleToggleSave(video)}
              onUseInGenerator={() => handleUseInGenerator(video)}
              onSchedule={() => handleSchedule(video)}
              getCompetitionLevel={getCompetitionLevel}
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
          <Youtube size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            No videos found
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

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: 'var(--background-card)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      border: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>
          {label}
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video, isSaved, onToggleSave, onUseInGenerator, onSchedule, getCompetitionLevel }) {
  const competition = getCompetitionLevel(video.viewCount);
  const viralColor = video.viralScore >= 70 ? '#ef4444' : video.viralScore >= 50 ? '#f59e0b' : '#10b981';

  return (
    <div style={{
      background: 'var(--background-card)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.2s'
    }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
        <img 
          src={video.thumbnail} 
          alt={video.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          padding: '0.35rem 0.75rem',
          background: viralColor,
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <TrendingUp size={12} />
          {video.viralScore}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        {/* Title */}
        <h3 style={{ 
          fontSize: '1rem', 
          fontWeight: 700, 
          color: 'var(--text-primary)', 
          marginBottom: '0.5rem',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {video.title}
        </h3>

        {/* Channel */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          {video.channelTitle}
        </p>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Views</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {YouTubeService.formatNumber(video.viewCount)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Likes</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {YouTubeService.formatNumber(video.likeCount)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Comments</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {YouTubeService.formatNumber(video.commentCount)}
            </div>
          </div>
        </div>

        {/* Competition */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Competition</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: competition.color }}>{competition.level}</span>
          </div>
          <div style={{ 
            height: '6px', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              height: '100%', 
              width: `${competition.percentage}%`, 
              background: competition.color,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={onToggleSave}
            style={{
              padding: '0.5rem',
              background: isSaved ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isSaved ? 'var(--primary-color)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              color: isSaved ? 'var(--primary-color)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title={isSaved ? 'Unsave' : 'Save'}
          >
            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
          <button
            onClick={onUseInGenerator}
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
          >
            <Sparkles size={14} />
            Generate
          </button>
          <button
            onClick={onSchedule}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
          >
            <Calendar size={14} />
            Schedule
          </button>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
            title="Watch on YouTube"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
