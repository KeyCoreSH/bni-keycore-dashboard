import React, { useState } from 'react';

export const Navigation = ({ currentPath, setPath }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Visão Geral', path: '/', icon: 'fa-chart-pie' },
    { label: 'Membros', path: '/membros', icon: 'fa-users' },
    { label: 'Grafo de Conexões', path: '/grafo', icon: 'fa-diagram-project' },
    { label: 'Análise de Fit', path: '/fit', icon: 'fa-bullseye' },
    { label: 'O Grupo BNI', path: '/grupo', icon: 'fa-people-group' }
  ];

  const handleNavClick = (path) => {
    setPath(path);
    window.history.pushState({}, '', path);
    setIsOpen(false);
  };

  const isItemActive = (itemPath) => {
    const p = currentPath.toLowerCase();
    if (itemPath === '/' && (p === '/' || p === '/index.html' || p === '')) return true;
    if (itemPath === '/membros' && (p.includes('/membros') || p.includes('/membros.html'))) return true;
    if (itemPath === '/grafo' && (p.includes('/grafo') || p.includes('/grafo.html'))) return true;
    if (itemPath === '/fit' && (p.includes('/fit') || p.includes('/fit.html'))) return true;
    if (itemPath === '/grupo' && (p.includes('/grupo') || p.includes('/grupo.html'))) return true;
    return false;
  };

  return (
    <>
      {/* Top Bar for Mobile Screens */}
      <header className="top-navbar">
        <div className="brand-title">
          <i className="fa-solid fa-layer-group" style={{ color: 'var(--brand-600)' }}></i>
          <span>BNI PE JUNTOS</span>
        </div>
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir Menu"
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </header>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15,23,42,0.5)',
            zIndex: 95
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-title">
            <i className="fa-solid fa-layer-group" style={{ color: 'var(--brand-600)', fontSize: '1.4rem' }}></i>
            <span>BNI PE JUNTOS</span>
          </div>
          <div className="brand-subtitle">Ecossistema &amp; KeyCore Tech Hub</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const active = isItemActive(item.path);
            return (
              <a
                key={item.path}
                href={item.path}
                className={`nav-item ${active ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.path);
                }}
              >
                <i className={`fa-solid ${item.icon}`} style={{ width: '20px' }}></i>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div>Plataforma de Ecossistema</div>
          <div style={{ fontWeight: 700, color: 'var(--slate-600)', marginTop: '2px' }}>
            KeyCore Tech Hub v2.0
          </div>
        </div>
      </aside>
    </>
  );
};
