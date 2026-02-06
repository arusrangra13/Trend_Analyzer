import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import Loader from '../common/Loader';
import '../../assets/styles/dashboard.css';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading: isLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [children]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background-dark)' }}>
        <Loader />
      </div>
    );
  }

  // Allow rendering even if not authenticated for preview purposes (or handle strict protection)
  // In a real app, you might want to return null or a redirect here if !isAuthenticated
  
  return (
    <div className="dashboard-container">
      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="main-content">
        <Header onMenuClick={toggleSidebar} />
        <main className="dashboard-page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
