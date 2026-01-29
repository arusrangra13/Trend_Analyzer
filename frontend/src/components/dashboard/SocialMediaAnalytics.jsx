import React, { useState, useEffect } from 'react';
import { SocialMediaParser } from '../../services/socialMediaParser';
import { SocialMediaService } from '../../services/socialMediaService';
import { Youtube, Instagram, Twitter, TrendingUp, Users, Eye, Heart, MessageCircle, Share2, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function SocialMediaAnalytics() {
  const [socialData, setSocialData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Load data from localStorage on mount and sync with profile
  useEffect(() => {
    const loadData = async () => {
      // Load profile data
      const profileData = localStorage.getItem('userProfileData');
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
    if (socialData.length > 0) {
      SocialMediaService.saveSocialData(socialData);
    }
  }, [socialData]);

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
        setSocialData(prev => [...prev.filter(item => item.url !== newUrl), data]);
        SocialMediaService.saveSocialData([...socialData.filter(item => item.url !== newUrl), data]);
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

  const handleRemoveSocialMedia = (url) => {
    const newData = socialData.filter(item => item.url !== url);
    setSocialData(newData);
    SocialMediaService.saveSocialData(newData);
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
      background: 'var(--background-light)',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid var(--border-color)'
    }}>
      <h2 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)' }}>
        Social Media Analytics
      </h2>

      {/* Add New Social Media */}
      <div className="add-social-section" style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'var(--background-color)',
        borderRadius: '8px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Enter social media URL (YouTube, Instagram, Twitter)"
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              background: 'var(--background-light)',
              color: 'var(--text-primary)'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSocialMedia()}
          />
          <button
            onClick={handleAddSocialMedia}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            {loading ? 'Loading...' : 'Add'}
          </button>
        </div>
        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {error}
          </div>
        )}
      </div>

      {/* Social Media Cards */}
      <div className="social-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {socialData.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--text-secondary)',
            border: '2px dashed var(--border-color)',
            borderRadius: '8px'
          }}>
            <TrendingUp size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No social media accounts added yet</p>
            <p style={{ fontSize: '0.875rem' }}>Add your YouTube, Instagram, or Twitter URLs to see analytics</p>
          </div>
        ) : (
          socialData.map((data, index) => (
            <div key={index} className="social-card" style={{
              background: 'var(--background-color)',
              borderRadius: '8px',
              padding: '1rem',
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {getPlatformIcon(data.platform)}
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>
                      @{data.username}
                    </h4>
                    <a 
                      href={data.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--primary-color)', 
                        textDecoration: 'none' 
                      }}
                    >
                      View Profile
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSocialMedia(data.url)}
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                >
                  Remove
                </button>
              </div>

              {/* Stats */}
              {renderPlatformStats(data)}

              {/* Trends and Recommendations */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  Insights & Recommendations
                </h5>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {SocialMediaParser.analyzeTrends(data).recommendations.map((rec, i) => (
                    <div key={i} style={{ marginBottom: '0.25rem' }}>
                      • {rec}
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
