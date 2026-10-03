import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { MembersView } from './pages/MembersView';
import { MeetingsView } from './pages/MeetingsView';
import { GraphView } from './pages/GraphView';
import { FitAnalysis } from './pages/FitAnalysis';
import { GroupGuide } from './pages/GroupGuide';
import { LoginView } from './components/LoginView';

export const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check saved session or local storage
    const savedToken = localStorage.getItem('bni_auth_token') || sessionStorage.getItem('bni_auth_token');
    const savedUser = localStorage.getItem('bni_user') || sessionStorage.getItem('bni_user');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('bni_auth_token');
        sessionStorage.removeItem('bni_auth_token');
      }
    }
    setCheckingAuth(false);

    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleLoginSuccess = (userData, token, rememberMe) => {
    const userStr = JSON.stringify(userData);
    if (rememberMe) {
      localStorage.setItem('bni_auth_token', token);
      localStorage.setItem('bni_user', userStr);
    } else {
      sessionStorage.setItem('bni_auth_token', token);
      sessionStorage.setItem('bni_user', userStr);
    }
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('bni_auth_token');
    localStorage.removeItem('bni_user');
    sessionStorage.removeItem('bni_auth_token');
    sessionStorage.removeItem('bni_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff' }}>
        <div>Carregando portal BNI PE JUNTOS...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

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
      <Navigation
        currentPath={currentPath}
        setPath={setCurrentPath}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
