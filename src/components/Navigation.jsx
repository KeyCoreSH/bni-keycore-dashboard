import React, { useState } from 'react';

const LOGO_URL = 'https://raw.githubusercontent.com/KeyCoreSH/stickers-keycore/main/KeyCore_146_stickers_PNG_HD_transparentes/PNG/09_build_better/KC09-01.png';

export const Navigation = ({ currentPath, setPath, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const mainNavItems = [
    { label: 'Visão Geral', path: '/', icon: 'fa-chart-pie' },
    { label: 'Membros & Pitches', path: '/membros', icon: 'fa-users' },
    { label: 'Reuniões & Indicações', path: '/reunioes', icon: 'fa-calendar-check' },
    { label: 'Grafo de Conexões', path: '/grafo', icon: 'fa-diagram-project' },
    { label: 'Matriz de Fit', path: '/fit', icon: 'fa-bullseye' }
  ];

  const groupNavItems = [
    { label: 'O Grupo BNI PE JUNTOS', path: '/grupo', icon: 'fa-people-group' }
  ];

  const handleNavClick = (path) => {
    setPath(path);
    window.history.pushState({}, '', path);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isItemActive = (itemPath) => {
    const p = currentPath.toLowerCase();
    if (itemPath === '/' && (p === '/' || p === '/index.html' || p === '')) return true;
    if (itemPath === '/membros' && p.includes('/membros')) return true;
    if (itemPath === '/reunioes' && p.includes('/reunioes')) return true;
    if (itemPath === '/grafo' && p.includes('/grafo')) return true;
    if (itemPath === '/fit' && p.includes('/fit')) return true;
    if (itemPath === '/grupo' && p.includes('/grupo')) return true;
    return false;
  };

  return (
    <>
      {/* Top Bar for Mobile Screens */}
      <header className="top-navbar">
        <div className="brand-title">
          <img src={LOGO_URL} alt="KeyCore Logo" style={{ height: '32px', width: 'auto' }} />
          <span>BNI PE JUNTOS</span>
        </div>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Abrir menu">
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </header>

      {/* Backdrop Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 190
          }}
        />
      )}

      {/* Off-Canvas Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={LOGO_URL} alt="KeyCore Tech Hub Logo" style={{ height: '40px', width: 'auto' }} />
            <div>
              <div className="brand-title">BNI PE JUNTOS</div>
              <div className="brand-subtitle">KeyCore Tech Hub</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* Section 1: Ecossistema & Operação */}
          <div className="nav-section-title">
            Navegação &amp; Operação
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {mainNavItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <li key={item.path}>
                  <a
                    href={item.path}
                    className={`nav-link ${active ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.path);
                    }}
                  >
                    <i className={`fa-solid ${item.icon}`}></i>
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Section 2: Guia Institucional */}
          <div className="nav-section-title" style={{ marginTop: '16px' }}>
            Método &amp; Institucional
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {groupNavItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <li key={item.path}>
                  <a
                    href={item.path}
                    className={`nav-link ${active ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.path);
                    }}
                  >
                    <i className={`fa-solid ${item.icon}`}></i>
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer" style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '14px', marginTop: 'auto' }}>
          {user && (
            <div style={{ marginBottom: '12px', background: 'var(--slate-50)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-user-gear" style={{ color: 'var(--brand-600)' }}></i>
                {user.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '2px', wordBreak: 'break-all' }}>
                {user.email}
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="btn btn-secondary"
            style={{
              width: '100%',
              fontSize: '0.8rem',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: 'var(--rose-700)',
              borderColor: 'var(--rose-200)',
              background: 'var(--rose-50)',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Sair do Painel
          </button>

          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>BNI PE JUNTOS &copy; 2026</div>
          <div style={{ color: 'var(--brand-600)', fontWeight: 600, fontSize: '0.75rem', marginTop: '2px' }}>Tecnologia que devolve tempo.</div>
        </div>
      </aside>
    </>
  );
};
