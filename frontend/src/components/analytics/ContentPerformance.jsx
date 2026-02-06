import React from 'react';
import { Video, Image, LayoutGrid, Film, FileText, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function ContentPerformance({ data }) {
  if (!data) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading content performance data...
      </div>
    );
  }

  const { contentTypes, topPerformers, recommendations } = data;

  const getContentIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'video': return <Video size={20} />;
      case 'image': return <Image size={20} />;
      case 'carousel': return <LayoutGrid size={20} />;
      case 'reels/shorts': return <Film size={20} />;
      case 'text post': return <FileText size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={16} color="#10b981" />;
    if (trend === 'down') return <TrendingDown size={16} color="#ef4444" />;
    return <Minus size={16} color="var(--text-muted)" />;
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={18} color="#10b981" />;
      case 'warning': return <AlertCircle size={18} color="#f59e0b" />;
      case 'info': return <Info size={18} color="var(--primary-color)" />;
      default: return <Info size={18} color="var(--primary-color)" />;
    }
  };

  return (
    <div style={{
      background: 'var(--background-card)',
      borderRadius: 'var(--radius-xl)',
      padding: '2rem',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Content Performance by Type
        </h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Analyze which content formats drive the most engagement
        </p>
      </div>

      {/* Top Performers Highlight */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
        border: '1px solid var(--primary-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          🏆 Top Performing Formats
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          {topPerformers.map((content, index) => (
            <div key={index} style={{
              background: 'var(--background-card)',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                {getContentIcon(content.type)}
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{content.type}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {content.avgEngagement}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                engagement rate
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          gap: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>
          <div>Content Type</div>
          <div style={{ textAlign: 'center' }}>Posts</div>
          <div style={{ textAlign: 'center' }}>Avg Views</div>
          <div style={{ textAlign: 'center' }}>Engagement</div>
          <div style={{ textAlign: 'center' }}>Trend</div>
        </div>

        {contentTypes.map((content, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '10px',
              marginBottom: '0.5rem',
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-color)'
              }}>
                {getContentIcon(content.type)}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{content.type}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatNumber(content.avgLikes)} avg likes</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {content.count}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatNumber(content.avgViews)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                background: content.avgEngagement > 5 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                color: content.avgEngagement > 5 ? '#10b981' : 'var(--primary-color)',
                fontSize: '0.9rem',
                fontWeight: 700
              }}>
                {content.avgEngagement}%
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {getTrendIcon(content.trend)}
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: content.trend === 'up' ? '#10b981' : content.trend === 'down' ? '#ef4444' : 'var(--text-muted)'
              }}>
                {content.trendValue > 0 ? '+' : ''}{content.trendValue}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          AI Recommendations
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recommendations.map((rec, index) => (
            <div
              key={index}
              style={{
                padding: '1rem 1.25rem',
                background: rec.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.1)' 
                  : rec.type === 'warning' 
                  ? 'rgba(245, 158, 11, 0.1)' 
                  : 'rgba(99, 102, 241, 0.1)',
                border: `1px solid ${
                  rec.type === 'success' 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : rec.type === 'warning' 
                    ? 'rgba(245, 158, 11, 0.2)' 
                    : 'rgba(99, 102, 241, 0.2)'
                }`,
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}
            >
              {getRecommendationIcon(rec.type)}
              <div style={{ flex: 1 }}>
                <h5 style={{ margin: '0 0 0.35rem 0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {rec.title}
                </h5>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {rec.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
