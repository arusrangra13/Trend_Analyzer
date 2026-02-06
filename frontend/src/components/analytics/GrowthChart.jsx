import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function GrowthChart({ data, title = "Growth Timeline" }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        No data available
      </div>
    );
  }

  // Find min and max for scaling
  const values = data.map(d => d.followers);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue;

  // Calculate growth percentage
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const growthPercent = ((lastValue - firstValue) / firstValue * 100).toFixed(1);
  const isPositive = growthPercent >= 0;

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatNumber(lastValue)}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem', 
              fontSize: '0.875rem',
              color: isPositive ? '#10b981' : '#ef4444',
              fontWeight: 600
            }}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? '+' : ''}{growthPercent}% ({data.length} days)
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ position: 'relative', height: '200px', marginBottom: '1rem' }}>
        {/* Y-axis labels */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>{formatNumber(maxValue)}</span>
          <span>{formatNumber(minValue + range / 2)}</span>
          <span>{formatNumber(minValue)}</span>
        </div>

        {/* Chart area */}
        <div style={{ marginLeft: '60px', height: '100%', position: 'relative' }}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${i * 25}%`,
              height: '1px',
              background: 'var(--border-color)',
              opacity: 0.3
            }} />
          ))}

          {/* Line chart */}
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Gradient fill */}
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--primary-color)', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: 'var(--primary-color)', stopOpacity: 0 }} />
              </linearGradient>
            </defs>

            {/* Area under line */}
            <path
              d={generateAreaPath(data, maxValue, minValue)}
              fill="url(#chartGradient)"
            />

            {/* Line */}
            <path
              d={generateLinePath(data, maxValue, minValue)}
              fill="none"
              stroke="var(--primary-color)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((point.followers - minValue) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill="var(--primary-color)"
                  stroke="var(--background-card)"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* X-axis labels */}
      <div style={{ marginLeft: '60px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>{formatDate(data[0].date)}</span>
        <span>{formatDate(data[Math.floor(data.length / 2)].date)}</span>
        <span>{formatDate(data[data.length - 1].date)}</span>
      </div>

      {/* Stats row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: '1rem', 
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-color)'
      }}>
        <StatItem 
          label="Avg. Engagement" 
          value={`${(data.reduce((sum, d) => sum + d.engagement, 0) / data.length).toFixed(0)}`}
          trend="up"
        />
        <StatItem 
          label="Total Views" 
          value={formatNumber(data.reduce((sum, d) => sum + d.views, 0))}
          trend="up"
        />
        <StatItem 
          label="Posts" 
          value={data.reduce((sum, d) => sum + d.posts, 0)}
          trend="stable"
        />
      </div>
    </div>
  );
}

function StatItem({ label, value, trend }) {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const color = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : 'var(--text-muted)';

  return (
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {value}
        </span>
        <Icon size={14} color={color} />
      </div>
    </div>
  );
}

function generateLinePath(data, maxValue, minValue) {
  const range = maxValue - minValue || 1;
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.followers - minValue) / range) * 100;
    return `${x},${y}`;
  });
  return `M ${points.join(' L ')}`;
}

function generateAreaPath(data, maxValue, minValue) {
  const range = maxValue - minValue || 1;
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.followers - minValue) / range) * 100;
    return `${x},${y}`;
  });
  
  const firstX = 0;
  const lastX = 100;
  
  return `M ${firstX},100 L ${points.join(' L ')} L ${lastX},100 Z`;
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
