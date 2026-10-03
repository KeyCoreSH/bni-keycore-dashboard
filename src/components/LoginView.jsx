import React, { useState } from 'react';

export const LoginView = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          onLoginSuccess(data.user, data.token, rememberMe);
        } else {
          setError(data.message || 'Credenciais inválidas.');
        }
      })
      .catch((err) => {
        setLoading(false);
        setError('Erro ao conectar com o servidor. Tente novamente.');
      });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '20px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '440px',
        padding: '36px 30px',
        boxSizing: 'border-box'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="https://raw.githubusercontent.com/KeyCoreSH/stickers-keycore/main/KeyCore_146_stickers_PNG_HD_transparentes/PNG/09_build_better/KC09-01.png"
            alt="KeyCore Tech Hub"
            style={{ height: '60px', objectFit: 'contain', marginBottom: '14px' }}
          />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 6px 0' }}>
            BNI PE JUNTOS
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: 0 }}>
            Painel Executivo KeyCore Tech Hub
          </p>
          <div style={{ marginTop: '10px' }}>
            <span className="pill" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)', border: '1px solid var(--brand-200)', fontSize: '0.75rem', fontWeight: 700 }}>
              "Tecnologia que devolve tempo."
            </span>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
              <i className="fa-solid fa-envelope" style={{ marginRight: '6px', color: 'var(--brand-600)' }}></i>
              E-mail de Acesso
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="Ex: geriofilho@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
              <i className="fa-solid fa-lock" style={{ marginRight: '6px', color: 'var(--brand-600)' }}></i>
              Senha
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Sua senha master"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--slate-700)', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--brand-600)' }}
              />
              Permanecer conectado
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--slate-100)', fontSize: '0.75rem', color: 'var(--slate-400)' }}>
          Plataforma de Governança &amp; Gestão BNI PE JUNTOS © {new Date().getFullYear()} KeyCore Tech Hub
        </div>
      </div>
    </div>
  );
};
