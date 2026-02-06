import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import SocialMediaAnalytics from '../components/dashboard/SocialMediaAnalytics';
import OnboardingModal from '../components/onboarding/OnboardingModal';
import YouTubeService from '../services/youtubeService';
import { SocialMediaService } from '../services/socialMediaService';
import UserStorageService from '../services/userStorageService';
import { ScriptTrackingService } from '../services/scriptTrackingService';
import { TrendingUp, Users, FileText, ArrowUpRight, Eye, Clock, BarChart3, Youtube } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [channelStats, setChannelStats] = useState(null);
  const [scriptStats, setScriptStats] = useState(null);
  const [recentScripts, setRecentScripts] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalViews: '0',
    totalFollowers: '0',
    totalPosts: '0',
    growthRate: '+0%'
  });

  // Load YouTube data and calculate metrics
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        // Initialize script tracking
        ScriptTrackingService.initializeTracking();
        
        // Load script statistics
        const scriptData = ScriptTrackingService.getFormattedStats();
        setScriptStats(scriptData);
        setRecentScripts(scriptData.recentScripts);
        
        // Load Social Media Data (Synced with Profile)
        let socialData = [];
        const profileDataJson = localStorage.getItem('userProfileData'); // Use raw localStorage or wrapper if needed, dependent on how ProfileCard saves it globally vs user-specific. 
        // Note: ProfileCard uses UserStorageService. We should too, but for simplicity in this context let's try SocialMediaService's loader which handles storage.
        
        // 1. Sync Profile Links first
        if (user || profileDataJson) {
           try {
             const userProfile = UserStorageService.getItem('userProfileData') || profileDataJson;
             if (userProfile) {
                const parsed = JSON.parse(userProfile);
                socialData = await SocialMediaService.syncProfileWithSocialData(parsed);
             }
           } catch (e) {
             console.error("Error syncing profile:", e);
             socialData = SocialMediaService.loadSocialData();
           }
        } else {
           socialData = SocialMediaService.loadSocialData();
        }

        // 2. Calculate Aggregated Metrics
        if (socialData && socialData.length > 0) {
           const totals = SocialMediaService.getFormattedMetrics(socialData);
           setMetrics({
             totalViews: totals.totalViews,
             totalFollowers: totals.totalFollowers,
             totalPosts: totals.totalPosts,
             growthRate: totals.growthRate
           });
           
           // If we have data, we can derive a "primary" channel stat for the widget if we want, 
           // but for now, the aggregated metrics are better.
           if (socialData.find(d => d.platform === 'youtube')) {
              setChannelStats(socialData.find(d => d.platform === 'youtube')); 
           }
        } else {
           // Fallback to manual channel ID if no social data yet
           const savedChannelId = localStorage.getItem('youtube_channel_id');
           if (savedChannelId) {
             const stats = await YouTubeService.getChannelStats(savedChannelId);
             if (stats) {
               setChannelStats(stats);
               setMetrics({
                 totalViews: YouTubeService.formatNumber(stats.viewCount),
                 totalFollowers: YouTubeService.formatNumber(stats.subscriberCount),
                 totalPosts: stats.videoCount.toString(),
                 growthRate: '+12%'
               });
             }
           }
        }
        
        // Load trending videos for quick insights
        const trending = await YouTubeService.getTrendingVideos('US', 10);
        setTrendingVideos(trending);
        
      } catch (error) {
        console.error('Error loading dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [user]); // Re-run if user changes to ensure profile sync

  return (
    <DashboardLayout>
      <div className="welcome-card">
        <div className="welcome-content">
          <h1>Welcome back, {user?.name || 'Creator'}!</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You have <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>3 new trend opportunities</span> in your niche today. 
            Your engagement rate is up by <span style={{ color: '#10b981', fontWeight: 600 }}>12%</span> this week.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => window.location.href = '/suggestions'}>
              View Trends
            </button>
            <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => window.location.href = '/analysis'}>
              Detailed Insights
            </button>
          </div>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}>
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Views</p>
            <h3>{metrics.totalViews}</h3>
            <span style={{ color: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              <TrendingUp size={12} /> {metrics.growthRate} growth
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)' }}>
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Scripts Generated</p>
            <h3>{scriptStats?.totalGenerated || 0}</h3>
            <span style={{ color: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              <TrendingUp size={12} /> {scriptStats?.thisWeek || 0} this week
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-color)' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Followers</p>
            <h3>{metrics.totalFollowers}</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>
              {channelStats ? 'YouTube Subscribers' : 'Connect YouTube'}
            </span>
          </div>
        </div>
      </div>

      {/* Social Media Analytics Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <SocialMediaAnalytics />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Recent Scripts Generated</h2>
        <button 
          onClick={() => window.location.href = '/script-generator'}
          className="btn-text" 
          style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 600 }}
        >
          Generate New +
        </button>
      </div>

      <div className="recent-activity">
        {recentScripts.length > 0 ? (
          recentScripts.map((script) => (
            <div key={script.id} className="activity-item">
              <div className="activity-icon">
                <FileText size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 600 }}>{script.topic}</h4>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span style={{ textTransform: 'capitalize' }}>{script.platform}</span>
                  <span>•</span>
                  <span>{script.style}</span>
                  <span>•</span>
                  <span>{script.timeAgo}</span>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = `/script-generator?script=${script.id}`}
                className="btn btn-secondary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'rgba(255,255,255,0.03)' }}
              >
                Open
              </button>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.02)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <FileText size={32} style={{ opacity: 0.3 }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No scripts yet</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Your generated scripts will appear here for quick access.
            </p>
            <button 
              onClick={() => window.location.href = '/script-generator'}
              className="btn btn-primary"
            >
              Create Your First Script
            </button>
          </div>
        )}
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal onComplete={() => setShowOnboarding(false)} />
    </DashboardLayout>
  );
}
