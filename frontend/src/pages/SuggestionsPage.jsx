import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { TrendService } from '../services/trendService';
import { SocialMediaService } from '../services/socialMediaService';
import { GeminiService } from '../services/geminiService';
import { 
  TrendingUp, 
  Twitter, 
  Hash, 
  Target, 
  Clock,
  Eye,
  Flame,
  Lightbulb,
  BarChart3,
  Zap,
  Users,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Youtube,
  Instagram,
  Linkedin,
  Film,
  Search,
  Filter,
  Star,
  AlertCircle,
  CheckCircle,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function SuggestionsPage() {
  const navigate = useNavigate();
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSuggestions, setSavedSuggestions] = useState([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    loadTrendData();
    loadSavedSuggestions();
  }, []);

  const loadSavedSuggestions = () => {
    const saved = localStorage.getItem('saved_suggestions');
    if (saved) {
      setSavedSuggestions(JSON.parse(saved));
    }
  };

  const loadTrendData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const socialData = SocialMediaService.loadSocialData();
      const analysis = await TrendService.getTrendAnalysis(socialData);
      setTrendData(analysis);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error loading trend data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadTrendData(true);
  };

  const toggleSaveSuggestion = (suggestion) => {
    const isSaved = savedSuggestions.some(s => s.name === suggestion.name);
    let updated;
    
    if (isSaved) {
      updated = savedSuggestions.filter(s => s.name !== suggestion.name);
    } else {
      updated = [...savedSuggestions, { ...suggestion, savedAt: new Date().toISOString() }];
    }
    
    setSavedSuggestions(updated);
    localStorage.setItem('saved_suggestions', JSON.stringify(updated));
  };

  const isSuggestionSaved = (suggestion) => {
    return savedSuggestions.some(s => s.name === suggestion.name);
  };

  const handleUseInGenerator = (topic) => {
    navigate('/script-generator', { 
      state: { 
        template: {
          topic: topic,
          platform: selectedPlatform !== 'all' ? selectedPlatform : 'youtube'
        }
      }
    });
  };

  const handleSchedule = (topic) => {
    navigate('/calendar', { 
      state: { 
        scheduleTopic: topic
      }
    });
  };

  const calculateViralScore = (trend) => {
    // Simple viral score calculation based on volume and engagement
    const volumeScore = Math.min((trend.volume || 0) / 10000, 50);
    const engagementScore = Math.min((trend.engagement || 0) / 1000, 30);
    const timeScore = 20; // Recency bonus
    return Math.round(volumeScore + engagementScore + timeScore);
  };

  const calculateCompetition = (trend) => {
    // Estimate competition level
    const volume = trend.volume || 0;
    if (volume > 50000) return { level: 'High', color: '#ef4444', percentage: 85 };
    if (volume > 10000) return { level: 'Medium', color: '#f59e0b', percentage: 60 };
    return { level: 'Low', color: '#10b981', percentage: 30 };
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'youtube': return <Youtube size={16} />;
      case 'instagram': return <Instagram size={16} />;
      case 'twitter': return <Twitter size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'tiktok': return <Film size={16} />;
      default: return <TrendingUp size={16} />;
    }
  };

  const getAllTrends = () => {
    if (!trendData) return [];
    
    const trends = [
      ...(trendData.twitterTrends || []).map(t => ({ ...t, source: 'twitter', platform: 'twitter' })),
      ...(trendData.redditTrends || []).map(t => ({ ...t, source: 'reddit', platform: 'youtube' })),
      ...(trendData.keywords || []).map(k => ({ 
        name: k.keyword, 
        volume: k.count * 1000, 
        source: 'keywords',
        platform: 'instagram'
      }))
    ];

    return trends;
  };

  const filteredTrends = getAllTrends()
    .filter(trend => {
      const matchesPlatform = selectedPlatform === 'all' || trend.platform === selectedPlatform;
      const matchesSearch = !searchQuery || trend.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSaved = !showSavedOnly || isSuggestionSaved(trend);
      return matchesPlatform && matchesSearch && matchesSaved;
    })
    .sort((a, b) => calculateViralScore(b) - calculateViralScore(a));

  const platforms = [
    { id: 'all', label: 'All Platforms', icon: <TrendingUp size={16} /> },
    { id: 'youtube', label: 'YouTube', icon: <Youtube size={16} /> },
    { id: 'instagram', label: 'Instagram', icon: <Instagram size={16} /> },
    { id: 'twitter', label: 'Twitter', icon: <Twitter size={16} /> },
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} /> },
    { id: 'tiktok', label: 'TikTok', icon: <Film size={16} /> }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading trending topics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
              <Lightbulb size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                Content Suggestions
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                AI-powered trending topics and content ideas
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Updated {Math.floor((new Date() - lastRefreshed) / 60000)}m ago
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          <StatCard 
            label="Trending Topics" 
            value={filteredTrends.length} 
            icon={<TrendingUp size={20} />} 
            color="var(--primary-color)" 
          />
          <StatCard 
            label="Saved Ideas" 
            value={savedSuggestions.length} 
            icon={<BookmarkCheck size={20} />} 
            color="#10b981" 
          />
          <StatCard 
            label="High Viral Potential" 
            value={filteredTrends.filter(t => calculateViralScore(t) > 70).length} 
            icon={<Flame size={20} />} 
            color="#ef4444" 
          />
          <StatCard 
            label="Low Competition" 
            value={filteredTrends.filter(t => calculateCompetition(t).level === 'Low').length} 
            icon={<Target size={20} />} 
            color="#f59e0b" 
          />
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
              placeholder="Search trending topics..."
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
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
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

          {/* Saved Filter */}
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            style={{
              padding: '0.75rem 1.25rem',
              background: showSavedOnly ? 'var(--primary-color)' : 'var(--background-dark)',
              border: `1px solid ${showSavedOnly ? 'var(--primary-color)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              color: showSavedOnly ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <BookmarkCheck size={16} />
            Saved Only
          </button>
        </div>
      </div>

      {/* Suggestions Grid */}
      {filteredTrends.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
          {filteredTrends.map((trend, index) => (
            <SuggestionCard
              key={index}
              trend={trend}
              viralScore={calculateViralScore(trend)}
              competition={calculateCompetition(trend)}
              isSaved={isSuggestionSaved(trend)}
              onToggleSave={() => toggleSaveSuggestion(trend)}
              onUseInGenerator={() => handleUseInGenerator(trend.name)}
              onSchedule={() => handleSchedule(trend.name)}
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
            No suggestions found
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Try adjusting your filters or refresh to get new trending topics
          </p>
        </div>
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

function SuggestionCard({ trend, viralScore, competition, isSaved, onToggleSave, onUseInGenerator, onSchedule, getPlatformIcon }) {
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
      {/* Save Button */}
      <button
        onClick={onToggleSave}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem',
          background: isSaved ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.05)',
          border: 'none',
          borderRadius: '8px',
          color: isSaved ? 'var(--primary-color)' : 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s'
        }}
        title={isSaved ? 'Remove from saved' : 'Save for later'}
      >
        {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>

      {/* Header */}
      <div style={{ marginBottom: '1rem', paddingRight: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ color: 'var(--primary-color)' }}>
            {getPlatformIcon(trend.platform)}
          </div>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            {trend.source}
          </span>
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {trend.name}
        </h3>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Viral Score */}
        <div style={{
          padding: '0.875rem',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Flame size={14} color="#ef4444" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Viral Score
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: viralScore > 70 ? '#ef4444' : viralScore > 50 ? '#f59e0b' : '#10b981' }}>
              {viralScore}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
        </div>

        {/* Competition */}
        <div style={{
          padding: '0.875rem',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Target size={14} color={competition.color} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Competition
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: competition.color }}>
              {competition.level}
            </span>
            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${competition.percentage}%`, height: '100%', background: competition.color, transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Volume */}
      {trend.volume && (
        <div style={{
          padding: '0.75rem',
          background: 'rgba(99, 102, 241, 0.05)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem'
        }}>
          <Eye size={14} color="var(--primary-color)" />
          <span style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--primary-color)' }}>{trend.volume.toLocaleString()}</strong> mentions
          </span>
        </div>
      )}

      {/* Hashtags */}
      {trend.hashtags && trend.hashtags.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            Recommended Hashtags
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {trend.hashtags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: '0.25rem 0.65rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  color: '#10b981',
                  fontWeight: 600
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onUseInGenerator}
          className="btn btn-primary"
          style={{
            padding: '0.65rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <Sparkles size={14} />
          Generate
        </button>
        <button
          onClick={onSchedule}
          className="btn btn-secondary"
          style={{
            padding: '0.65rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <Calendar size={14} />
          Schedule
        </button>
      </div>
    </div>
  );
}
