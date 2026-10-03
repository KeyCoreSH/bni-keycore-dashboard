import React, { useState } from 'react';

const LOGO_URL = 'https://raw.githubusercontent.com/KeyCoreSH/stickers-keycore/main/KeyCore_146_stickers_PNG_HD_transparentes/PNG/09_build_better/KC09-01.png';

export const Navigation = ({ currentPath, setPath }) => {
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
        <div className="brand-header">
          <img src={LOGO_URL} alt="KeyCore Tech Hub Logo" style={{ height: '40px', width: 'auto' }} />
          <div>
            <div className="brand-title">BNI PE JUNTOS</div>
            <div className="brand-subtitle">KeyCore Tech Hub</div>
          </div>
        </div>

        <nav style={{ padding: '16px 0', flex: 1, overflowY: 'auto' }}>
          {/* Section 1: Ecossistema & Operação */}
          <div style={{ padding: '0 20px 8px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--slate-400)', letterSpacing: '0.05em' }}>
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
          <div style={{ padding: '20px 20px 8px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--slate-400)', letterSpacing: '0.05em' }}>
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
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--slate-100)', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
          <div>BNI PE JUNTOS &copy; 2026</div>
          <div style={{ color: 'var(--brand-600)', fontWeight: 600 }}>Tecnologia que devolve tempo.</div>
        </div>
      </aside>
    </>
  );
};
