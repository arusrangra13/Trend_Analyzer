import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import Loader from '../common/Loader';
import '../../assets/styles/dashboard.css';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // If direct access attempt without login, redirect to login
      // loginWithRedirect(); // Or redirect to landing
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

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
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="dashboard-page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
