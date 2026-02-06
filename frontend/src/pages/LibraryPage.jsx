import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { ScriptTrackingService } from '../services/scriptTrackingService';
import { useToast } from '../contexts/ToastContext';
import { 
  FolderOpen,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Copy,
  Eye,
  Calendar,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Film,
  FileText,
  Clock,
  Hash,
  TrendingUp,
  Star,
  MoreVertical
} from 'lucide-react';

export default function LibraryPage() {
  const toast = useToast();
  const [scripts, setScripts] = useState([]);
  const [filteredScripts, setFilteredScripts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStyle, setFilterStyle] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedScript, setSelectedScript] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadScripts();
  }, []);

  useEffect(() => {
    filterAndSortScripts();
  }, [scripts, searchQuery, filterPlatform, filterStyle, sortBy]);

  const loadScripts = () => {
    const allScripts = ScriptTrackingService.getAllScripts();
    setScripts(allScripts);
  };

  const filterAndSortScripts = () => {
    let filtered = [...scripts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(script => 
        script.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.script?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Platform filter
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(script => script.platform === filterPlatform);
    }

    // Style filter
    if (filterStyle !== 'all') {
      filtered = filtered.filter(script => script.style === filterStyle);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'topic':
          return (a.topic || '').localeCompare(b.topic || '');
        case 'wordCount':
          return (b.wordCount || 0) - (a.wordCount || 0);
        default:
          return 0;
      }
    });

    setFilteredScripts(filtered);
  };

  const handleDeleteScript = (scriptId) => {
    if (confirm('Are you sure you want to delete this script?')) {
      const success = ScriptTrackingService.deleteScript(scriptId);
      if (success) {
        toast.success('Script deleted successfully');
        loadScripts();
      } else {
        toast.error('Failed to delete script');
      }
    }
  };

  const handleCopyScript = (script) => {
    const content = [
      script.hook ? `HOOK:\n${script.hook}\n\n` : '',
      `SCRIPT:\n${script.script}`,
      script.hashtags?.length > 0 ? `\n\nHASHTAGS:\n${script.hashtags.join(' ')}` : ''
    ].join('');

    navigator.clipboard.writeText(content);
    toast.success('Script copied to clipboard!');
  };

  const handleDownloadScript = (script) => {
    const content = [
      `Topic: ${script.topic}`,
      `Platform: ${script.platform}`,
      `Style: ${script.style}`,
      `Generated: ${new Date(script.timestamp).toLocaleString()}`,
      '\n---\n',
      script.hook ? `HOOK:\n${script.hook}\n\n` : '',
      `SCRIPT:\n${script.script}`,
      script.hashtags?.length > 0 ? `\n\nHASHTAGS:\n${script.hashtags.join(' ')}` : ''
    ].join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreview = (script) => {
    setSelectedScript(script);
    setShowPreview(true);
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'youtube': return <Youtube size={16} />;
      case 'instagram': return <Instagram size={16} />;
      case 'twitter': return <Twitter size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'tiktok': return <Film size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getStats = () => {
    return {
      total: scripts.length,
      thisWeek: scripts.filter(s => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(s.timestamp) > weekAgo;
      }).length,
      totalWords: scripts.reduce((sum, s) => sum + (s.wordCount || 0), 0),
      platforms: [...new Set(scripts.map(s => s.platform))].length
    };
  };

  const stats = getStats();

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
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
            <FolderOpen size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
              Content Library
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Manage and organize all your generated scripts
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          <StatCard label="Total Scripts" value={stats.total} icon={<FileText size={20} />} color="var(--primary-color)" />
          <StatCard label="This Week" value={stats.thisWeek} icon={<TrendingUp size={20} />} color="#10b981" />
          <StatCard label="Total Words" value={stats.totalWords.toLocaleString()} icon={<Hash size={20} />} color="var(--secondary-color)" />
          <StatCard label="Platforms" value={stats.platforms} icon={<Youtube size={20} />} color="#f59e0b" />
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{
        background: 'var(--background-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '1rem', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search scripts..."
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
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--background-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Platforms</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          {/* Style Filter */}
          <select
            value={filterStyle}
            onChange={(e) => setFilterStyle(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--background-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Styles</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
            <option value="educational">Educational</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--background-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="topic">By Topic</option>
            <option value="wordCount">By Word Count</option>
          </select>
        </div>
      </div>

      {/* Scripts Grid */}
      {filteredScripts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredScripts.map((script, index) => (
            <ScriptCard
              key={script.id || index}
              script={script}
              onPreview={() => handlePreview(script)}
              onCopy={() => handleCopyScript(script)}
              onDownload={() => handleDownloadScript(script)}
              onDelete={() => handleDeleteScript(script.id)}
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
          <FolderOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {searchQuery || filterPlatform !== 'all' || filterStyle !== 'all' ? 'No scripts found' : 'No scripts yet'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {searchQuery || filterPlatform !== 'all' || filterStyle !== 'all' 
              ? 'Try adjusting your filters or search query'
              : 'Generate your first script to get started'}
          </p>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedScript && (
        <PreviewModal
          script={selectedScript}
          onClose={() => setShowPreview(false)}
          onCopy={() => handleCopyScript(selectedScript)}
          onDownload={() => handleDownloadScript(selectedScript)}
          getPlatformIcon={getPlatformIcon}
        />
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

function ScriptCard({ script, onPreview, onCopy, onDownload, onDelete, getPlatformIcon }) {
  return (
    <div style={{
      background: 'var(--background-card)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.2s',
      cursor: 'pointer'
    }}
    onClick={onPreview}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
            {script.topic}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              background: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--primary-color)',
              textTransform: 'capitalize'
            }}>
              {getPlatformIcon(script.platform)}
              {script.platform}
            </span>
            <span style={{
              padding: '0.25rem 0.65rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'capitalize'
            }}>
              {script.style}
            </span>
          </div>
        </div>
      </div>

      {/* Preview */}
      <p style={{
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        marginBottom: '1rem',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {script.script}
      </p>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Hash size={12} />
            {script.wordCount} words
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={12} />
            {new Date(script.timestamp).toLocaleDateString()}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onCopy}
            style={{
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Copy"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={onDownload}
            style={{
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Download"
          >
            <Download size={14} />
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: '0.5rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: 'none',
              borderRadius: '6px',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ script, onClose, onCopy, onDownload, getPlatformIcon }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}
    onClick={onClose}
    >
      <div style={{
        background: 'var(--background-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '1px solid var(--border-color)'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              {script.topic}
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary-color)',
                textTransform: 'capitalize'
              }}>
                {getPlatformIcon(script.platform)}
                {script.platform}
              </span>
              <span style={{
                padding: '0.35rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                textTransform: 'capitalize'
              }}>
                {script.style}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onCopy} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              <Copy size={16} /> Copy
            </button>
            <button onClick={onDownload} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              <Download size={16} /> Download
            </button>
          </div>
        </div>

        {/* Hook */}
        {script.hook && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Viral Hook
            </h4>
            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {script.hook}
            </p>
          </div>
        )}

        {/* Script */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <pre style={{
            margin: 0,
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            color: 'var(--text-primary)',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            {script.script}
          </pre>
        </div>

        {/* Hashtags */}
        {script.hashtags?.length > 0 && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10b981', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Hashtags
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {script.hashtags.map((tag, i) => (
                <span key={i} style={{
                  padding: '0.35rem 0.75rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  color: '#10b981',
                  fontWeight: 600
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Meta */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <span>{script.wordCount} words</span>
          <span>Generated: {new Date(script.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
