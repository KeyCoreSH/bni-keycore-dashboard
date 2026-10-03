import React, { useState } from 'react';

export const Navigation = ({ currentPath, setPath }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Visão Geral', path: '/', altPath: '/index.html', icon: 'fa-chart-pie' },
    { label: 'Membros', path: '/membros', altPath: '/membros.html', icon: 'fa-users' },
    { label: 'Grafo de Conexões', path: '/grafo', altPath: '/grafo.html', icon: 'fa-diagram-project' },
    { label: 'Análise de Fit', path: '/fit', altPath: '/fit.html', icon: 'fa-bullseye' },
    { label: 'O Grupo BNI', path: '/grupo', altPath: '/grupo.html', icon: 'fa-people-group' },
  ];

  const handleNavigate = (path) => {
    setPath(path);
    window.history.pushState({}, '', path);
    setIsOpen(false);
  };

  const isCurrent = (item) => {
    return currentPath === item.path || currentPath === item.altPath || (item.path === '/' && (currentPath === '' || currentPath === '/index.html'));
  };

  return (
    <>
      <div className="top-navbar">
        <div className="brand-title">
          <i className="fa-solid fa-layer-group" style={{ color: 'var(--brand-600)' }}></i>
          <span>BNI PE JUNTOS</span>
        </div>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-title">
            <i className="fa-solid fa-layer-group" style={{ color: 'var(--brand-600)', fontSize: '1.25rem' }}></i>
            <span>BNI PE JUNTOS</span>
          </div>
          <div className="brand-subtitle">&amp; KeyCore Tech Hub</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`nav-item ${isCurrent(item) ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(item.path);
              }}
            >
              <i className={`fa-solid ${item.icon}`} style={{ width: '20px' }}></i>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div>KeyCore Tech Hub &copy; 2026</div>
          <div style={{ marginTop: '4px', color: 'var(--slate-500)' }}>"Tecnologia que devolve tempo."</div>
        </div>
      </aside>
    </>
  );
};
