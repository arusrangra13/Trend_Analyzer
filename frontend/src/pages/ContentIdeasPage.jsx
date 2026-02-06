import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useToast } from '../contexts/ToastContext';
import { 
  Lightbulb,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  TrendingUp,
  FileText,
  Calendar,
  Star,
  Archive,
  MoreVertical,
  Search,
  Filter,
  Grid,
  List,
  ChevronRight
} from 'lucide-react';

export default function ContentIdeasPage() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [ideas, setIdeas] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, archived
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    tags: [],
    status: 'active'
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = () => {
    const saved = localStorage.getItem('content_ideas');
    if (saved) {
      setIdeas(JSON.parse(saved));
    } else {
      // Sample ideas
      const sampleIdeas = [
        {
          id: '1',
          title: 'AI in Content Creation',
          description: 'Explore how AI is revolutionizing content creation for creators',
          category: 'technology',
          priority: 'high',
          tags: ['AI', 'Technology', 'Tutorial'],
          status: 'active',
          createdAt: new Date().toISOString(),
          starred: true
        },
        {
          id: '2',
          title: '10 Tips for Better Engagement',
          description: 'Share proven strategies to boost audience engagement',
          category: 'education',
          priority: 'medium',
          tags: ['Tips', 'Engagement', 'Growth'],
          status: 'active',
          createdAt: new Date().toISOString(),
          starred: false
        }
      ];
      setIdeas(sampleIdeas);
      localStorage.setItem('content_ideas', JSON.stringify(sampleIdeas));
    }
  };

  const saveIdeas = (updatedIdeas) => {
    localStorage.setItem('content_ideas', JSON.stringify(updatedIdeas));
    setIdeas(updatedIdeas);
  };

  const handleAddIdea = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const newIdea = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      starred: false
    };

    if (editingIdea) {
      const updated = ideas.map(idea => 
        idea.id === editingIdea.id ? { ...newIdea, id: editingIdea.id, starred: editingIdea.starred } : idea
      );
      saveIdeas(updated);
      toast.success('Idea updated successfully');
      setEditingIdea(null);
    } else {
      saveIdeas([newIdea, ...ideas]);
      toast.success('Idea added successfully');
    }

    setShowAddModal(false);
    setFormData({
      title: '',
      description: '',
      category: 'general',
      priority: 'medium',
      tags: [],
      status: 'active'
    });
  };

  const handleEditIdea = (idea) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title,
      description: idea.description,
      category: idea.category,
      priority: idea.priority,
      tags: idea.tags,
      status: idea.status
    });
    setShowAddModal(true);
  };

  const handleDeleteIdea = (id) => {
    if (confirm('Are you sure you want to delete this idea?')) {
      const updated = ideas.filter(idea => idea.id !== id);
      saveIdeas(updated);
      toast.success('Idea deleted');
    }
  };

  const handleToggleStar = (id) => {
    const updated = ideas.map(idea =>
      idea.id === id ? { ...idea, starred: !idea.starred } : idea
    );
    saveIdeas(updated);
  };

  const handleArchiveIdea = (id) => {
    const updated = ideas.map(idea =>
      idea.id === id ? { ...idea, status: idea.status === 'active' ? 'archived' : 'active' } : idea
    );
    saveIdeas(updated);
    toast.success(updated.find(i => i.id === id).status === 'archived' ? 'Idea archived' : 'Idea restored');
  };

  const handleGenerateScript = (idea) => {
    navigate('/script-generator', { state: { topic: idea.title } });
  };

  const handleSchedule = (idea) => {
    navigate('/calendar', { state: { scheduleTopic: idea.title } });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return colors[priority] || '#6b7280';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      technology: '💻',
      education: '📚',
      entertainment: '🎬',
      lifestyle: '🌟',
      business: '💼',
      general: '📝'
    };
    return icons[category] || '📝';
  };

  const filteredIdeas = ideas
    .filter(idea => {
      if (filterStatus !== 'all' && idea.status !== filterStatus) return false;
      if (searchQuery && !idea.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !idea.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      // Starred first
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      // Then by date
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const stats = {
    total: ideas.length,
    active: ideas.filter(i => i.status === 'active').length,
    archived: ideas.filter(i => i.status === 'archived').length,
    starred: ideas.filter(i => i.starred).length
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}>
              <Lightbulb size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                Content Ideas
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Brainstorm and organize your content ideas
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingIdea(null);
              setFormData({
                title: '',
                description: '',
                category: 'general',
                priority: 'medium',
                tags: [],
                status: 'active'
              });
              setShowAddModal(true);
            }}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            New Idea
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <StatCard label="Total Ideas" value={stats.total} color="#6366f1" />
          <StatCard label="Active" value={stats.active} color="#10b981" />
          <StatCard label="Starred" value={stats.starred} color="#f59e0b" />
          <StatCard label="Archived" value={stats.archived} color="#6b7280" />
        </div>

        {/* Filters & Search */}
        <div style={{
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search ideas..."
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

            {/* Status Filter */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['all', 'active', 'archived'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: filterStatus === status ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${filterStatus === status ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    color: filterStatus === status ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.5rem',
                background: viewMode === 'grid' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: viewMode === 'grid' ? 'white' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.5rem',
                background: viewMode === 'list' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: viewMode === 'list' ? 'white' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Ideas Grid/List */}
      {filteredIdeas.length > 0 ? (
        <div style={{
          display: viewMode === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : 'none',
          flexDirection: viewMode === 'list' ? 'column' : 'none',
          gap: '1.5rem'
        }}>
          {filteredIdeas.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              viewMode={viewMode}
              onEdit={() => handleEditIdea(idea)}
              onDelete={() => handleDeleteIdea(idea.id)}
              onToggleStar={() => handleToggleStar(idea.id)}
              onArchive={() => handleArchiveIdea(idea.id)}
              onGenerate={() => handleGenerateScript(idea)}
              onSchedule={() => handleSchedule(idea)}
              getPriorityColor={getPriorityColor}
              getCategoryIcon={getCategoryIcon}
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
          <Lightbulb size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {searchQuery || filterStatus !== 'all' ? 'No ideas found' : 'No ideas yet'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Start brainstorming your next viral content'}
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <Plus size={18} />
              Create Your First Idea
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}
        onClick={() => setShowAddModal(false)}
        >
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-xl)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              {editingIdea ? 'Edit Idea' : 'New Content Idea'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter idea title..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--background-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your idea..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--background-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'var(--background-dark)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="general">General</option>
                    <option value="technology">Technology</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="business">Business</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'var(--background-dark)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Tags
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add a tag..."
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--background-dark)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button
                    onClick={handleAddTag}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--primary-color)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '0.35rem 0.75rem',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        color: 'var(--primary-color)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary-color)',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem' }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddIdea}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  {editingIdea ? 'Update' : 'Create'} Idea
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: 'var(--background-card)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: color }}>
        {value}
      </div>
    </div>
  );
}

function IdeaCard({ idea, viewMode, onEdit, onDelete, onToggleStar, onArchive, onGenerate, onSchedule, getPriorityColor, getCategoryIcon }) {
  return (
    <div style={{
      background: 'var(--background-card)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.2s',
      opacity: idea.status === 'archived' ? 0.6 : 1
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{getCategoryIcon(idea.category)}</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {idea.title}
            </h3>
            <button
              onClick={onToggleStar}
              style={{
                background: 'none',
                border: 'none',
                color: idea.starred ? '#f59e0b' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Star size={18} fill={idea.starred ? '#f59e0b' : 'none'} />
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
            {idea.description}
          </p>
        </div>
      </div>

      {/* Tags & Priority */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{
          padding: '0.25rem 0.65rem',
          background: `${getPriorityColor(idea.priority)}15`,
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: getPriorityColor(idea.priority),
          textTransform: 'capitalize'
        }}>
          {idea.priority} Priority
        </span>
        {idea.tags.map((tag, i) => (
          <span key={i} style={{
            padding: '0.25rem 0.65rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onGenerate}
          className="btn btn-primary"
          style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
        >
          <Sparkles size={14} />
          Generate
        </button>
        <button
          onClick={onSchedule}
          className="btn btn-secondary"
          style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
        >
          <Calendar size={14} />
          Schedule
        </button>
        <button
          onClick={onEdit}
          style={{
            padding: '0.5rem 0.75rem',
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Edit size={14} />
        </button>
        <button
          onClick={onArchive}
          style={{
            padding: '0.5rem 0.75rem',
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Archive size={14} />
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: '0.5rem 0.75rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: '#ef4444',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
