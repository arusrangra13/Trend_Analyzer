import React from 'react';
import { Clock, TrendingUp, Calendar, Zap } from 'lucide-react';

export default function BestPostingTimes({ data }) {
  if (!data) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading posting time analysis...
      </div>
    );
  }

  const { hourlyData, bestTimes, weekdayPattern } = data;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={20} color="white" />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Best Posting Times
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Optimized posting schedule based on your audience engagement patterns
        </p>
      </div>

      {/* Top 3 Best Times */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {bestTimes.map((time, index) => (
          <div key={index} style={{
            background: index === 0 
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05))'
              : 'rgba(255, 255, 255, 0.02)',
            border: index === 0 ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            position: 'relative'
          }}>
            {index === 0 && (
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '12px',
                background: 'var(--primary-color)',
                color: 'white',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Zap size={10} /> BEST
              </div>
            )}
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {time.time}
            </div>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: 700, 
              color: index === 0 ? 'var(--primary-color)' : '#10b981',
              marginBottom: '0.5rem'
            }}>
              {time.engagement}% engagement
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {time.recommendation}
            </div>
          </div>
        ))}
      </div>

      {/* Hourly Heatmap */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          24-Hour Engagement Pattern
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)', 
          gap: '0.5rem'
        }}>
          {hourlyData.map((hour, index) => {
            const intensity = hour.engagement / 100;
            const isTopHour = bestTimes.some(t => t.time === hour.label);
            
            return (
              <div
                key={index}
                title={`${hour.label}: ${hour.engagement}% engagement`}
                style={{
                  aspectRatio: '1',
                  background: isTopHour 
                    ? 'var(--primary-color)'
                    : `rgba(99, 102, 241, ${intensity * 0.7})`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: intensity > 0.5 ? 'white' : 'var(--text-muted)',
                  border: isTopHour ? '2px solid var(--primary-light)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {hour.hour}
                {isTopHour && (
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '8px',
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '50%',
                    border: '2px solid var(--background-card)'
                  }} />
                )}
              </div>
            );
          })}
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '0.5rem',
          fontSize: '0.7rem',
          color: 'var(--text-muted)'
        }}>
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
      </div>

      {/* Weekly Pattern */}
      <div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Weekly Engagement Pattern
        </h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {weekdayPattern.map((day, index) => {
            const isWeekend = index >= 5;
            const height = (day.engagement / 100) * 100;
            
            return (
              <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ 
                  height: '100px', 
                  display: 'flex', 
                  alignItems: 'flex-end',
                  marginBottom: '0.5rem'
                }}>
                  <div
                    title={`${day.day}: ${day.engagement.toFixed(0)}% engagement`}
                    style={{
                      width: '100%',
                      height: `${height}%`,
                      background: isWeekend 
                        ? 'linear-gradient(to top, var(--secondary-color), var(--primary-color))'
                        : 'var(--primary-color)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap'
                    }}>
                      {day.engagement.toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  color: isWeekend ? 'var(--primary-color)' : 'var(--text-secondary)'
                }}>
                  {day.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div style={{
        marginTop: '2rem',
        padding: '1.25rem',
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <TrendingUp size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Posting Strategy Recommendation
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Post at <strong style={{ color: '#10b981' }}>{bestTimes[0].time}</strong> for maximum engagement. 
              Weekend posts show {weekdayPattern[5].engagement > weekdayPattern[2].engagement ? 'higher' : 'similar'} engagement. 
              Maintain consistency with 1-2 posts daily during peak hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
