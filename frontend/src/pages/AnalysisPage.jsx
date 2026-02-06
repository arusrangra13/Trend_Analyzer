import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionService } from '../services/subscriptionService';
import YouTubeService from '../services/youtubeService';
import { 
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  ThumbsUp,
  MessageCircle,
  Youtube,
  RefreshCw,
  Calendar,
  Clock,
  Target,
  Zap,
  Award,
  Activity,
  Lock,
  Crown
} from 'lucide-react';

export default function AnalysisPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [channelStats, setChannelStats] = useState(null);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [channelId, setChannelId] = useState('');
  const [showChannelInput, setShowChannelInput] = useState(false);

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

    await loadAnalytics();
  };

  const loadAnalytics = async () => {
    try {
      // Load saved channel ID
      const savedChannelId = localStorage.getItem('youtube_channel_id');
      
      if (savedChannelId) {
        setChannelId(savedChannelId);
        await loadChannelData(savedChannelId);
      } else {
        setShowChannelInput(true);
      }
      
      // Load trending videos for analysis
      const trending = await YouTubeService.getTrendingVideos('US', 20);
      setTrendingVideos(trending);
      
      // Get top performers
      const topPerf = trending
        .sort((a, b) => b.viralScore - a.viralScore)
        .slice(0, 5);
      setTopPerformers(topPerf);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadChannelData = async (channelId) => {
    try {
      const stats = await YouTubeService.getChannelStats(channelId);
      setChannelStats(stats);
      toast.success('Channel data loaded successfully');
    } catch (error) {
      console.error('Error loading channel data:', error);
      toast.error('Failed to load channel data');
    }
  };

  const handleSaveChannelId = async () => {
    if (!channelId.trim()) {
      toast.error('Please enter a channel ID');
      return;
    }
    
    localStorage.setItem('youtube_channel_id', channelId);
    await loadChannelData(channelId);
    setShowChannelInput(false);
  };

  const calculateAverageEngagement = () => {
    if (trendingVideos.length === 0) return 0;
    const total = trendingVideos.reduce((sum, video) => sum + video.engagement, 0);
    return (total / trendingVideos.length).toFixed(2);
  };

  const calculateAverageViralScore = () => {
    if (trendingVideos.length === 0) return 0;
    const total = trendingVideos.reduce((sum, video) => sum + video.viralScore, 0);
    return Math.round(total / trendingVideos.length);
  };

  const getTotalViews = () => {
    return trendingVideos.reduce((sum, video) => sum + video.viewCount, 0);
  };

  const getTotalEngagement = () => {
    return trendingVideos.reduce((sum, video) => sum + video.likeCount + video.commentCount, 0);
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
            background: 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            border: '2px solid #f59e0b'
          }}>
            <Lock size={40} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Premium Feature
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2rem' }}>
            Advanced Analytics and Viral Score features are available exclusively for Pro plan members. Upgrade now to unlock deep insights.
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
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
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
              background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              <BarChart3 size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                Analytics & Insights
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Real-time YouTube analytics and performance metrics
              </p>
            </div>
          </div>

          <button
            onClick={checkAccessAndLoad}
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            Refresh Data
          </button>
        </div>

        {/* Channel Input */}
        {showChannelInput && (
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Connect Your YouTube Channel
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Enter your YouTube Channel ID to see your channel analytics. Find it in your YouTube Studio URL.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="UCxxxxxxxxxxxxxxxxxx"
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background: 'var(--background-dark)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
              <button
                onClick={handleSaveChannelId}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2rem' }}
              >
                Connect Channel
              </button>
            </div>
          </div>
        )}

        {/* Channel Stats */}
        {channelStats && (
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff0000, #cc0000)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Youtube size={30} color="white" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {channelStats.title}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    {channelStats.customUrl || channelStats.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChannelInput(true)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                Change Channel
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <ChannelStatCard
                icon={<Users size={24} />}
                label="Subscribers"
                value={YouTubeService.formatNumber(channelStats.subscriberCount)}
                color="#ff0000"
              />
              <ChannelStatCard
                icon={<Eye size={24} />}
                label="Total Views"
                value={YouTubeService.formatNumber(channelStats.viewCount)}
                color="#10b981"
              />
              <ChannelStatCard
                icon={<Youtube size={24} />}
                label="Total Videos"
                value={channelStats.videoCount.toLocaleString()}
                color="#6366f1"
              />
            </div>
          </div>
        )}

        {/* Overall Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <StatCard
            icon={<Eye size={20} />}
            label="Total Views"
            value={YouTubeService.formatNumber(getTotalViews())}
            color="#6366f1"
          />
          <StatCard
            icon={<ThumbsUp size={20} />}
            label="Total Engagement"
            value={YouTubeService.formatNumber(getTotalEngagement())}
            color="#10b981"
          />
          <StatCard
            icon={<Activity size={20} />}
            label="Avg Engagement"
            value={`${calculateAverageEngagement()}%`}
            color="#f59e0b"
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label="Avg Viral Score"
            value={calculateAverageViralScore()}
            color="#ef4444"
          />
        </div>
      </div>

      {/* Top Performers */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={24} color="var(--primary-color)" />
          Top Performing Videos
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <RefreshCw size={40} color="var(--primary-color)" className="spinning" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
          </div>
        ) : topPerformers.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topPerformers.map((video, index) => (
              <VideoPerformanceCard key={video.id} video={video} rank={index + 1} />
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            textAlign: 'center',
            border: '2px dashed var(--border-color)'
          }}>
            <BarChart3 size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              No Data Available
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Connect your YouTube channel to see analytics
            </p>
          </div>
        )}
      </div>

      {/* Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Engagement Insights */}
        <div style={{
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="#f59e0b" />
            Engagement Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InsightItem
              label="Average Likes per Video"
              value={YouTubeService.formatNumber(
                trendingVideos.reduce((sum, v) => sum + v.likeCount, 0) / Math.max(trendingVideos.length, 1)
              )}
              trend="+12%"
              positive={true}
            />
            <InsightItem
              label="Average Comments per Video"
              value={YouTubeService.formatNumber(
                trendingVideos.reduce((sum, v) => sum + v.commentCount, 0) / Math.max(trendingVideos.length, 1)
              )}
              trend="+8%"
              positive={true}
            />
            <InsightItem
              label="Engagement Rate"
              value={`${calculateAverageEngagement()}%`}
              trend="+5%"
              positive={true}
            />
          </div>
        </div>

        {/* Content Insights */}
        <div style={{
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} color="#10b981" />
            Content Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InsightItem
              label="Total Videos Analyzed"
              value={trendingVideos.length.toString()}
              trend="Live Data"
              positive={true}
            />
            <InsightItem
              label="High Viral Potential"
              value={trendingVideos.filter(v => v.viralScore >= 70).length.toString()}
              trend={`${Math.round((trendingVideos.filter(v => v.viralScore >= 70).length / Math.max(trendingVideos.length, 1)) * 100)}%`}
              positive={true}
            />
            <InsightItem
              label="Average Views per Video"
              value={YouTubeService.formatNumber(
                trendingVideos.reduce((sum, v) => sum + v.viewCount, 0) / Math.max(trendingVideos.length, 1)
              )}
              trend="+15%"
              positive={true}
            />
          </div>
        </div>
      </div>
      </>
      )}
    </DashboardLayout>
  );
}

function StatCard({ icon, label, value, color }) {
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

function ChannelStatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      border: '1px solid var(--border-color)',
      textAlign: 'center'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        margin: '0 auto 1rem'
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}

function VideoPerformanceCard({ video, rank }) {
  const getRankColor = (rank) => {
    if (rank === 1) return '#ffd700';
    if (rank === 2) return '#c0c0c0';
    if (rank === 3) return '#cd7f32';
    return 'var(--text-muted)';
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) return '🏆';
    return '⭐';
  };

  return (
    <div style={{
      background: 'var(--background-card)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      border: '1px solid var(--border-color)',
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'center'
    }}>
      {/* Rank */}
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        background: `${getRankColor(rank)}15`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <div style={{ fontSize: '1.5rem' }}>{getRankIcon(rank)}</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: getRankColor(rank) }}>#{rank}</div>
      </div>

      {/* Thumbnail */}
      <img
        src={video.thumbnail}
        alt={video.title}
        style={{
          width: '120px',
          height: '68px',
          borderRadius: 'var(--radius-md)',
          objectFit: 'cover',
          flexShrink: 0
        }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {video.title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          {video.channelTitle}
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Eye size={14} />
            {YouTubeService.formatNumber(video.viewCount)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <ThumbsUp size={14} />
            {YouTubeService.formatNumber(video.likeCount)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <MessageCircle size={14} />
            {YouTubeService.formatNumber(video.commentCount)}
          </div>
        </div>
      </div>

      {/* Viral Score */}
      <div style={{
        padding: '0.75rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        background: video.viralScore >= 70 ? 'rgba(239, 68, 68, 0.1)' : video.viralScore >= 50 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        border: `1px solid ${video.viralScore >= 70 ? '#ef4444' : video.viralScore >= 50 ? '#f59e0b' : '#10b981'}`,
        textAlign: 'center',
        flexShrink: 0
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>
          Viral Score
        </div>
        <div style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: video.viralScore >= 70 ? '#ef4444' : video.viralScore >= 50 ? '#f59e0b' : '#10b981'
        }}>
          {video.viralScore}
        </div>
      </div>
    </div>
  );
}

function InsightItem({ label, value, trend, positive }) {
  return (
    <div style={{
      padding: '1rem',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: positive ? '#10b981' : '#ef4444',
          padding: '0.25rem 0.5rem',
          background: positive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderRadius: '12px'
        }}>
          {trend}
        </span>
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}
