import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AnalysisPage from './pages/AnalysisPage';
import SuggestionsPage from './pages/SuggestionsPage';
import ScriptGeneratorPage from './pages/ScriptGeneratorPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SettingsPage from './pages/SettingsPage';
import LibraryPage from './pages/LibraryPage';
import TemplatesPage from './pages/TemplatesPage';
import CalendarPage from './pages/CalendarPage';
import HelpPage from './pages/HelpPage';
import BrandKitPage from './pages/BrandKitPage';
import NotificationsPage from './pages/NotificationsPage';
import ContentIdeasPage from './pages/ContentIdeasPage';
import YouTubeTrendingPage from './pages/YouTubeTrendingPage';
import LocalDisplayPage from './pages/LocalBrainstormPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/analysis" element={
          <ProtectedRoute>
            <AnalysisPage />
          </ProtectedRoute>
        } />
        <Route path="/suggestions" element={
          <ProtectedRoute>
            <SuggestionsPage />
          </ProtectedRoute>
        } />
        <Route path="/script-generator" element={
          <ProtectedRoute>
            <ScriptGeneratorPage />
          </ProtectedRoute>
        } />
        <Route path="/library" element={
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        } />
        <Route path="/templates" element={
          <ProtectedRoute>
            <TemplatesPage />
          </ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        } />
        <Route path="/subscription" element={
          <ProtectedRoute>
            <SubscriptionPage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/help" element={
          <ProtectedRoute>
            <HelpPage />
          </ProtectedRoute>
        } />
        <Route path="/brand-kit" element={
          <ProtectedRoute>
            <BrandKitPage />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />
        <Route path="/content-ideas" element={
          <ProtectedRoute>
            <ContentIdeasPage />
          </ProtectedRoute>
        } />
        <Route path="/youtube-trending" element={
          <ProtectedRoute>
            <YouTubeTrendingPage />
          </ProtectedRoute>
        } />
        <Route path="/brainstorm" element={
          <ProtectedRoute>
            <LocalDisplayPage />
          </ProtectedRoute>
        } />
        
      </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;