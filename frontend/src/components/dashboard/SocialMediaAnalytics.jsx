import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SocialMediaParser } from '../../services/socialMediaParser';
import { SocialMediaService } from '../../services/socialMediaService';
import UserStorageService from '../../services/userStorageService'; // Import added
import { Youtube, Instagram, Twitter, TrendingUp, Users, Eye, Heart, MessageCircle, Share2, ArrowUpRight, ArrowDownRight, Minus, Zap } from 'lucide-react';

export default function SocialMediaAnalytics() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth();
  const [socialData, setSocialData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Load data from localStorage on mount and sync with profile
  useEffect(() => {
    const loadData = async () => {
      // Load profile data
      const profileData = UserStorageService.getItem('userProfileData'); // Use UserStorageService
      if (profileData) {
        try {
          const parsedProfile = JSON.parse(profileData);
          // Sync profile URLs with social media data
          const syncedData = await SocialMediaService.syncProfileWithSocialData(parsedProfile);
          setSocialData(syncedData);
        } catch (error) {
          console.error('Error syncing profile data:', error);
        }
      }
      
      // Fallback to existing social media data
      const savedData = SocialMediaService.loadSocialData();
      if (savedData.length > 0) {
        setSocialData(savedData);
      }
    };
    
    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      if (socialData.length > 0) {
        let token = null;
        if (isAuthenticated) {
          try {
            token = await getAccessTokenSilently();
          } catch (e) {
            console.error("Error getting token for saving social data", e);
          }
        }
        SocialMediaService.saveSocialData(socialData, token);
      }
    };
    saveData();
  }, [socialData, isAuthenticated, getAccessTokenSilently]);

  const handleAddSocialMedia = async () => {
    if (!newUrl.trim()) {
      setError('Please enter a social media URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await SocialMediaParser.fetchSocialMediaData(newUrl);
      if (data) {
        const newData = [...socialData.filter(item => item.url !== newUrl), data];
        setSocialData(newData);
        
        // Save immediately with token if possible
        let token = null;
        if (isAuthenticated) {
           try {
             token = await getAccessTokenSilently();
           } catch (e) { console.error(e); }
        }
        SocialMediaService.saveSocialData(newData, token);
        
        setNewUrl('');
      } else {
        setError('Could not fetch data from this URL. Please check if it\'s a public profile.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSocialMedia = async (url) => {
    const newData = socialData.filter(item => item.url !== url);
    setSocialData(newData);
    
    let token = null;
    if (isAuthenticated) {
        try {
            token = await getAccessTokenSilently();
        } catch (e) { console.error(e); }
    }
    SocialMediaService.saveSocialData(newData, token);
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'youtube': return <Youtube size={20} color="#FF0000" />;
      case 'instagram': return <Instagram size={20} color="#E4405F" />;
      case 'twitter': return <Twitter size={20} color="#1DA1F2" />;
      default: return <TrendingUp size={20} />;
    }
  };

  const getGrowthIcon = (growth) => {
    if (growth > 5) return <ArrowUpRight size={16} color="#10b981" />;
    if (growth < -5) return <ArrowDownRight size={16} color="#ef4444" />;
    return <Minus size={16} color="#6b7280" />;
  };

  const renderPlatformStats = (data) => {
    const trends = SocialMediaParser.analyzeTrends(data);

    switch (data.platform) {
      case 'youtube':
        return (
          <div className="platform-stats">
            <div className="stat-item">
              <Users size={16} />
              <span>{SocialMediaParser.formatNumber(data.subscribers)} Subscribers</span>
            </div>
            <div className="stat-item">
              <Eye size={16} />
              <span>{SocialMediaParser.formatNumber(data.totalViews)} Total Views</span>
            </div>
            <div className="stat-item">
              <Share2 size={16} />
              <span>{data.videos} Videos</span>
            </div>
            <div className="stat-item">
              <Heart size={16} />
              <span>{data.engagement}% Engagement</span>
            </div>
            <div className="stat-item growth">
              {getGrowthIcon(data.recentGrowth)}
              <span>{data.recentGrowth > 0 ? '+' : ''}{data.recentGrowth}% Growth</span>
            </div>
          </div>
        );

      case 'instagram':
        return (
          <div className="platform-stats">
            <div className="stat-item">
              <Users size={16} />
              <span>{SocialMediaParser.formatNumber(data.followers)} Followers</span>
            </div>
            <div className="stat-item">
              <Eye size={16} />
              <span>{SocialMediaParser.formatNumber(data.following)} Following</span>
            </div>
            <div className="stat-item">
              <Share2 size={16} />
              <span>{data.posts} Posts</span>
            </div>
            <div className="stat-item">
              <Heart size={16} />
              <span>{data.engagement}% Engagement</span>
            </div>
            <div className="stat-item">
              <TrendingUp size={16} />
              <span>{SocialMediaParser.formatNumber(data.reach)} Reach</span>
            </div>
          </div>
        );

      case 'twitter':
        return (
          <div className="platform-stats">
            <div className="stat-item">
              <Users size={16} />
              <span>{SocialMediaParser.formatNumber(data.followers)} Followers</span>
            </div>
            <div className="stat-item">
              <MessageCircle size={16} />
              <span>{data.tweets} Tweets</span>
            </div>
            <div className="stat-item">
              <Eye size={16} />
              <span>{SocialMediaParser.formatNumber(data.following)} Following</span>
            </div>
            <div className="stat-item">
              <Share2 size={16} />
              <span>{SocialMediaParser.formatNumber(data.retweets)} Retweets</span>
            </div>
            <div className="stat-item">
              <Heart size={16} />
              <span>{data.engagement}% Engagement</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="social-media-analytics" style={{
      background: 'var(--background-card)',
      borderRadius: 'var(--radius-xl)',
      padding: '2rem',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Connected Platforms
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {socialData.length} Account{socialData.length !== 1 ? 's' : ''} Connected
        </span>
      </div>

      {/* Add New Social Media */}
      <div className="add-social-section" style={{
        marginBottom: '2rem',
        padding: '1.25rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Paste social media profile URL..."
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--background-dark)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSocialMedia()}
            />
          </div>
          <button
            onClick={handleAddSocialMedia}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0 1.5rem', fontWeight: 600 }}
          >
            {loading ? 'Analyzing...' : 'Add Platform'}
          </button>
        </div>
        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
             <span style={{ fontWeight: 700 }}>!</span> {error}
          </div>
        )}
      </div>

      {/* Social Media Cards */}
      <div className="social-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {socialData.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '3rem 1.5rem',
            color: 'var(--text-muted)',
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255,255,255,0.01)'
          }}>
            <TrendingUp size={48} style={{ margin: '0 auto 1.25rem', opacity: 0.2 }} />
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No profiles linked yet</p>
            <p style={{ fontSize: '0.85rem' }}>Link your YouTube or Instagram to see real-time performance analytics</p>
          </div>
        ) : (
          socialData.map((data, index) => (
            <div key={index} className="social-platform-card" style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s hover'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '12px', 
                    background: 'var(--background-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)'
                  }}>
                    {getPlatformIcon(data.platform)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>
                      @{data.username}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      {data.platform}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSocialMedia(data.url)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.25rem'
                  }}
                >
                  Unlink
                </button>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                   <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Audience</p>
                   <p style={{ margin: '0.1rem 0 0 0', fontWeight: 700, fontSize: '1.1rem' }}>
                     {SocialMediaParser.formatNumber(data.subscribers || data.followers)}
                   </p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                   <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Engagement</p>
                   <p style={{ margin: '0.1rem 0 0 0', fontWeight: 700, fontSize: '1.1rem', color: '#10b981' }}>
                     {data.engagement}%
                   </p>
                </div>
              </div>

              {/* Trends and Recommendations */}
              <div style={{ 
                background: 'rgba(99, 102, 241, 0.05)', 
                padding: '1rem', 
                borderRadius: '12px',
                border: '1px solid rgba(99, 102, 241, 0.1)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <Zap size={14} color="var(--primary-color)" />
                  <h5 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                    AI Insight
                  </h5>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {SocialMediaParser.analyzeTrends(data).recommendations.slice(0, 1).map((rec, i) => (
                    <div key={i}>
                      {rec.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
