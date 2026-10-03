import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { MembersView } from './pages/MembersView';
import { MeetingsView } from './pages/MeetingsView';
import { GraphView } from './pages/GraphView';
import { FitAnalysis } from './pages/FitAnalysis';
import { GroupGuide } from './pages/GroupGuide';

export const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const renderPage = () => {
    const path = currentPath.toLowerCase();

    if (path.includes('/membros') || path.includes('/membros.html')) {
      return <MembersView />;
    }
    if (path.includes('/reunioes') || path.includes('/reunioes.html')) {
      return <MeetingsView />;
    }
    if (path.includes('/grafo') || path.includes('/grafo.html')) {
      return <GraphView />;
    }
    if (path.includes('/fit') || path.includes('/fit.html')) {
      return <FitAnalysis />;
    }
    if (path.includes('/grupo') || path.includes('/grupo.html')) {
      return <GroupGuide />;
    }
    return <Dashboard onNavigate={(newPath) => {
      setCurrentPath(newPath);
      window.history.pushState({}, '', newPath);
    }} />;
  };

  return (
    <div className="app-shell">
      <Navigation currentPath={currentPath} setPath={setCurrentPath} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
