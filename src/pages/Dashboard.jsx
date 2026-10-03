import React, { useEffect, useState } from 'react';

const LOGO_URL = 'https://raw.githubusercontent.com/KeyCoreSH/stickers-keycore/main/KeyCore_146_stickers_PNG_HD_transparentes/PNG/09_build_better/KC09-01.png';

export const Dashboard = ({ onNavigate }) => {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/meta')
      .then((res) => res.json())
      .then((data) => {
        setMeta(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar meta:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <section className="hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <img src={LOGO_URL} alt="KeyCore Logo" style={{ height: '48px', width: 'auto' }} />
          <span className="pill">
            <i className="fa-solid fa-bullseye"></i> Mapeamento de Ecossistema &middot; 12ª reunião
          </span>
        </div>

        <h1>
          BNI JUNTOS <span className="gradient-text">&amp; KeyCore Tech Hub</span>
        </h1>
        <p className="lead">
          Mapeamento do grupo de networking empresarial BNI PE JUNTOS — em formação no Recife — com leitura de método, perfis de membros, rede de relacionamentos e identificação de gargalos operacionais que a KeyCore pode automatizar.
        </p>

        <div className="grid g-4 mt-4" style={{ marginTop: '24px' }}>
          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>Cadeiras Mapeadas</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              17 <small style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>de 20</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>Meta para lançamento oficial do grupo.</div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>Verticais de Negócio</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              5 <small style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>verticais</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>Jurídico, Contábil, Mkt, Saúde &amp; Eng.</div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>Integrantes &amp; Candidatos</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-600)' }}>
              14 + 2 <small style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>avaliação</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>Regra: quinzenal até 12, semanal após.</div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>Equipe Lobo vs Águia</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-600)' }}>
              640 <small style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>vs 445 pts</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>Fase de formação e engajamento.</div>
          </div>
        </div>
      </section>

      {/* Global & Local Reach Indicators */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '24px', background: 'var(--brand-600)', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>Alcance do BNI: Global &amp; Pernambuco</h2>
        </div>

        <div className="grid g-4">
          <div style={{ background: 'var(--slate-50)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-600)' }}>77 países</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '2px' }}>Presença internacional contínua há 41 anos.</div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald-600)' }}>20.000+ membros</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '2px' }}>Empresários integrados em 19 estados do Brasil.</div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--violet-600)' }}>300+ integrantes</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '2px' }}>Empresários ativos na região metropolitana do Recife.</div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--amber-600)' }}>7 grupos em PE</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '2px' }}>Grupos consolidados e equipes em formação.</div>
          </div>
        </div>
      </div>

      {/* The 5 Verticals Grid */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '24px', background: 'var(--emerald-600)', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>As 5 Verticais de Negócio Mapeadas</h2>
        </div>

        <div className="grid g-3">
          {meta?.verticais.map((v) => (
            <div key={v.id} style={{ padding: '16px', background: 'var(--slate-50)', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className={`badge badge-${v.cor}`}>{v.nome}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)' }}>{v.cadeiras} cadeiras</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>{v.descricao}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KeyCore Thesis & Quick Actions */}
      <div className="card" style={{ background: 'var(--brand-50)', border: '1px solid var(--brand-200)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <i className="fa-solid fa-microchip" style={{ color: 'var(--brand-600)', fontSize: '1.4rem' }}></i>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-900)' }}>
            Tese KeyCore: "Tecnologia que devolve tempo"
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--brand-900)', lineHeight: 1.6, marginBottom: '20px' }}>
          O BNI constrói conexões baseadas em confiança. A KeyCore Tech Hub entra como a camada de automação e Inteligência Artificial que elimina o trabalho operacional repetitivo das empresas dos membros, permitindo que cada empresário foque no que gera receita real.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => onNavigate('/membros')}>
            <i className="fa-solid fa-users"></i> Ver Membros &amp; Pitches
          </button>

          <button className="btn btn-secondary" onClick={() => onNavigate('/reunioes')}>
            <i className="fa-solid fa-calendar-check"></i> Reuniões &amp; Indicações
          </button>

          <button className="btn btn-secondary" onClick={() => onNavigate('/grafo')}>
            <i className="fa-solid fa-diagram-project"></i> Explorar Grafo
          </button>

          <button className="btn btn-secondary" onClick={() => onNavigate('/fit')}>
            <i className="fa-solid fa-bullseye"></i> Simular Fit
          </button>

          <button className="btn btn-secondary" onClick={() => onNavigate('/grupo')}>
            <i className="fa-solid fa-people-group"></i> Guia BNI (#estrutura)
          </button>
        </div>
      </div>
    </div>
  );
};
