
import React, { useEffect, useState } from 'react';
import Navigation from './components/layout/Navigation';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import DiseaseDetector from './components/disease/DiseaseDetector';
import KnowledgeBase from './components/knowledge/KnowledgeBase';
import AnalyticsView from './components/analytics/AnalyticsView';
import HistoryView from './components/history/HistoryView';
import ProfileView from './components/profile/ProfileView';
import AlertsCenter from './components/alerts/AlertsCenter';
import { AppModule } from './types';
import { AppProvider } from './context/AppContext';
import AuthScreen from './components/auth/AuthScreen';
import { getCurrentUser, logout, type AuthUser } from './services/authApi';
import { refreshSession } from './services/apiClient';

interface AppContentProps {
  onLogout: () => Promise<void>;
}

const AppContent: React.FC<AppContentProps> = ({ onLogout }) => {
  const [currentModule, setCurrentModule] = useState<AppModule>(AppModule.DASHBOARD);

  const renderModule = () => {
    switch (currentModule) {
      case AppModule.DASHBOARD: return <Dashboard />;
      case AppModule.DISEASE: return <DiseaseDetector />;
      case AppModule.KNOWLEDGE: return <KnowledgeBase />;
      case AppModule.ANALYTICS: return <AnalyticsView />;
      case AppModule.HISTORY: return <HistoryView />;
      case AppModule.PROFILE: return <ProfileView onLogout={onLogout} />;
      case AppModule.ALERTS: return <AlertsCenter />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      <Navigation currentModule={currentModule} setModule={setCurrentModule} />
      <main className="flex-1 lg:ml-64 overflow-y-auto flex flex-col">
        <Header currentModule={currentModule} setModule={setCurrentModule} />
        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          {renderModule()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  useEffect(() => { refreshSession().then(() => getCurrentUser()).then(setUser).catch(() => setUser(null)).finally(() => setCheckingAuth(false)); }, []);
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
    }
  };
  if (checkingAuth) return <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center">Loading NEEV...</div>;
  if (!user) return <AuthScreen onAuthenticated={setUser} />;
  return (
    <AppProvider>
      <AppContent onLogout={handleLogout} />
    </AppProvider>
  );
};

export default App;
