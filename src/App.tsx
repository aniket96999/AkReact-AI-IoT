
import React, { useState } from 'react';
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

const AppContent: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<AppModule>(AppModule.DASHBOARD);

  const renderModule = () => {
    switch (currentModule) {
      case AppModule.DASHBOARD: return <Dashboard />;
      case AppModule.DISEASE: return <DiseaseDetector />;
      case AppModule.KNOWLEDGE: return <KnowledgeBase />;
      case AppModule.ANALYTICS: return <AnalyticsView />;
      case AppModule.HISTORY: return <HistoryView />;
      case AppModule.PROFILE: return <ProfileView />;
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
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
