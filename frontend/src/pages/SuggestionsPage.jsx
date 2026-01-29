import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { TrendService } from '../services/trendService';
import { SocialMediaService } from '../services/socialMediaService';
import { 
  TrendingUp, 
  Twitter, 
  MessageSquare, 
  Hash, 
  Target, 
  Clock,
  Eye,
  ArrowUpRight,
  Flame,
  Lightbulb,
  BarChart3,
  Zap,
  Globe,
  Users
} from 'lucide-react';

export default function SuggestionsPage() {
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadTrendData = async () => {
      try {
        // Load user's social media data
        const profileData = localStorage.getItem('userProfileData');
        let socialData = [];
        
        if (profileData) {
          const parsedProfile = JSON.parse(profileData);
          socialData = await SocialMediaService.syncProfileWithSocialData(parsedProfile);
        } else {
          socialData = SocialMediaService.loadSocialData();
        }

        // Get trend analysis
        const analysis = await TrendService.getTrendAnalysis(socialData);
        setTrendData(analysis);
      } catch (error) {
        console.error('Error loading trend data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendData();
  }, []);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const filteredSuggestions = trendData?.suggestions?.filter(suggestion => 
    selectedCategory === 'all' || suggestion.type === selectedCategory
  ) || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Loading real-time trends...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Real-Time Trend Suggestions
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
          Viral topics, trending keywords, and content suggestions based on your <strong>{trendData?.domain}</strong> niche
        </p>
      </div>

      {/* Trending Topics Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Flame size={24} color="#ef4444" />
          🔥 Trending Topics Now
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {trendData?.twitterTrends?.map((trend, index) => (
            <div key={index} style={{
              background: 'var(--background-light)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <Twitter size={16} color="#1DA1F2" />
              </div>
              
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                {trend.name}
              </h3>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  <MessageSquare size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  {trend.volume}
                </span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                  <ArrowUpRight size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  {trend.growth}
                </span>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ 
                  background: 'var(--primary-color)', 
                  color: 'white', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px', 
                  fontSize: '0.75rem' 
                }}>
                  {trend.category}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {trend.keywords.map((keyword, i) => (
                  <span key={i} style={{
                    background: 'var(--background-color)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}>
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Viral Keywords Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Hash size={24} color="#8b5cf6" />
          Viral Keywords
        </h2>
        <div style={{
          background: 'var(--background-light)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {trendData?.keywords?.slice(0, 12).map((keyword, index) => (
              <div key={index} style={{
                background: keyword.viral ? 'rgba(239, 68, 68, 0.1)' : 'var(--background-color)',
                border: keyword.viral ? '1px solid #ef4444' : '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {keyword.viral && <Zap size={14} color="#ef4444" />}
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {keyword.keyword}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {TrendService.formatNumber(keyword.volume)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Suggestions Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lightbulb size={24} color="#eab308" />
          Content Suggestions
        </h2>
        
        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {['all', 'trending', 'viral', 'domain'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
          {filteredSuggestions.map((suggestion, index) => (
            <div key={index} style={{
              background: 'var(--background-light)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: `1px solid ${getUrgencyColor(suggestion.urgency)}33`,
              borderLeft: `4px solid ${getUrgencyColor(suggestion.urgency)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{
                  background: getUrgencyColor(suggestion.urgency),
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}>
                  {suggestion.urgency} priority
                </span>
                <span style={{
                  background: 'var(--primary-color)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  {suggestion.type}
                </span>
              </div>
              
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                {suggestion.title}
              </h3>
              
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {suggestion.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {suggestion.keywords?.slice(0, 3).map((keyword, i) => (
                    <span key={i} style={{
                      background: 'var(--background-color)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}>
                      #{keyword}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <Eye size={14} />
                  {TrendService.formatNumber(suggestion.estimatedReach)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reddit Viral Content */}
      {trendData?.redditTrends?.length > 0 && (
        <div>
          <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={24} color="#ff5700" />
            Viral Content from Reddit
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
            {trendData.redditTrends.map((post, index) => (
              <div key={index} style={{
                background: 'var(--background-light)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ 
                    background: '#ff5700', 
                    color: 'white', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem' 
                  }}>
                    r/{post.subreddit}
                  </span>
                  <span style={{
                    background: post.engagement === 'high' ? '#10b981' : '#f59e0b',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem'
                  }}>
                    {post.engagement} engagement
                  </span>
                </div>
                
                <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {post.title}
                </h3>
                
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span>👍 {TrendService.formatNumber(post.upvotes)}</span>
                  <span>💬 {TrendService.formatNumber(post.comments)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
