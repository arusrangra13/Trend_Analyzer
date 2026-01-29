import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  const sizeClasses = {
    small: '16px',
    medium: '24px',
    large: '32px'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem'
    }}>
      <Loader2 
        size={sizeClasses[size]} 
        style={{ 
          animation: 'spin 1s linear infinite',
          color: 'var(--primary-color)'
        }} 
      />
      {text && (
        <span style={{ 
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          {text}
        </span>
      )}
    </div>
  );
}
