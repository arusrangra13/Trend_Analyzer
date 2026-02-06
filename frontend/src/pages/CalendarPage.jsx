import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useToast } from '../contexts/ToastContext';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Film,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

export default function CalendarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [scheduledPosts, setScheduledPosts] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    platform: 'youtube',
    time: '10:00',
    date: new Date()
  });

  useEffect(() => {
    loadScheduledPosts();
    
    // Check if navigated from suggestions with a topic
    if (location.state?.scheduleTopic) {
      setFormData(prev => ({ ...prev, title: location.state.scheduleTopic }));
      setShowAddModal(true);
    }
  }, [location]);

  const loadScheduledPosts = () => {
    const saved = localStorage.getItem('scheduled_posts');
    if (saved) {
      const posts = JSON.parse(saved);
      // Convert date strings back to Date objects
      const postsWithDates = posts.map(post => ({
        ...post,
        date: new Date(post.date)
      }));
      setScheduledPosts(postsWithDates);
    }
  };

  const saveScheduledPosts = (posts) => {
    localStorage.setItem('scheduled_posts', JSON.stringify(posts));
    setScheduledPosts(posts);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getPostsForDate = (date) => {
    if (!date) return [];
    return scheduledPosts.filter(post => 
      post.date.toDateString() === date.toDateString()
    );
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'youtube': return <Youtube size={14} />;
      case 'instagram': return <Instagram size={14} />;
      case 'twitter': return <Twitter size={14} />;
      case 'linkedin': return <Linkedin size={14} />;
      case 'tiktok': return <Film size={14} />;
      default: return null;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'youtube': return '#ff0000';
      case 'instagram': return '#e4405f';
      case 'twitter': return '#1da1f2';
      case 'linkedin': return '#0077b5';
      case 'tiktok': return '#000000';
      default: return 'var(--primary-color)';
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddPost = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      title: formData.title,
      platform: formData.platform,
      time: formData.time,
      date: selectedDate || new Date(),
      status: 'scheduled'
    };

    if (editingPost) {
      // Update existing post
      const updated = scheduledPosts.map(post => 
        post.id === editingPost.id ? { ...newPost, id: editingPost.id } : post
      );
      saveScheduledPosts(updated);
      toast.success('Post updated successfully');
      setEditingPost(null);
    } else {
      // Add new post
      saveScheduledPosts([...scheduledPosts, newPost]);
      toast.success('Post scheduled successfully');
    }

    setShowAddModal(false);
    setFormData({ title: '', platform: 'youtube', time: '10:00', date: new Date() });
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      platform: post.platform,
      time: post.time,
      date: post.date
    });
    setSelectedDate(post.date);
    setShowAddModal(true);
  };

  const handleDeletePost = (postId) => {
    if (confirm('Are you sure you want to delete this scheduled post?')) {
      const updated = scheduledPosts.filter(post => post.id !== postId);
      saveScheduledPosts(updated);
      toast.success('Post deleted successfully');
    }
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentDate);
  const selectedPosts = selectedDate ? getPostsForDate(selectedDate) : [];

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
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
              <CalendarIcon size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                Content Calendar
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Plan and schedule your content across platforms
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingPost(null);
              setFormData({ title: '', platform: 'youtube', time: '10:00', date: new Date() });
              setShowAddModal(true);
            }}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            Schedule Post
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Calendar */}
        <div style={{
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Calendar Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleToday}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                Today
              </button>
              <button
                onClick={handlePrevMonth}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextMonth}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {dayNames.map(day => (
              <div key={day} style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                padding: '0.5rem',
                textTransform: 'uppercase'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
            {days.map((date, index) => {
              const posts = date ? getPostsForDate(date) : [];
              return (
                <div
                  key={index}
                  onClick={() => date && setSelectedDate(date)}
                  style={{
                    minHeight: '80px',
                    padding: '0.5rem',
                    background: date ? (isSelected(date) ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.02)') : 'transparent',
                    border: `1px solid ${date ? (isToday(date) ? 'var(--primary-color)' : 'var(--border-color)') : 'transparent'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: date ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  {date && (
                    <>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: isToday(date) ? 700 : 600,
                        color: isToday(date) ? 'var(--primary-color)' : 'var(--text-primary)',
                        marginBottom: '0.25rem'
                      }}>
                        {date.getDate()}
                      </div>
                      {posts.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {posts.slice(0, 2).map(post => (
                            <div
                              key={post.id}
                              style={{
                                fontSize: '0.65rem',
                                padding: '2px 4px',
                                background: getPlatformColor(post.platform),
                                color: 'white',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {post.time}
                            </div>
                          ))}
                          {posts.length > 2 && (
                            <div style={{
                              fontSize: '0.65rem',
                              color: 'var(--text-muted)',
                              textAlign: 'center'
                            }}>
                              +{posts.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Selected Date Posts */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date'}
            </h3>

            {selectedPosts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedPosts.map(post => (
                  <div
                    key={post.id}
                    style={{
                      padding: '1rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: getPlatformColor(post.platform),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        {getPlatformIcon(post.platform)}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={12} />
                        {post.time}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                      {post.title}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditPost(post)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Edit size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: 'var(--radius-md)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <CalendarIcon size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                <p style={{ fontSize: '0.875rem' }}>
                  {selectedDate ? 'No posts scheduled' : 'Select a date to view scheduled posts'}
                </p>
              </div>
            )}
          </div>

          {/* Upcoming Posts */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Upcoming Posts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {scheduledPosts
                .filter(post => post.date >= new Date())
                .sort((a, b) => a.date - b.date)
                .slice(0, 5)
                .map(post => (
                  <div
                    key={post.id}
                    style={{
                      padding: '0.875rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <div style={{ color: getPlatformColor(post.platform) }}>
                        {getPlatformIcon(post.platform)}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {post.title.substring(0, 25)}...
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {post.date.toLocaleDateString()} at {post.time}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

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
            maxWidth: '500px',
            width: '100%',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-xl)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {editingPost ? 'Edit Post' : 'Schedule New Post'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter post title..."
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
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
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
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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

              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem' }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPost}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  {editingPost ? 'Update' : 'Schedule'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
