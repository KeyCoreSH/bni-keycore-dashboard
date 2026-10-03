import React, { useEffect, useState } from 'react';

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
        <span className="pill">
          <i className="fa-solid fa-bullseye"></i> Mapeamento de Ecossistema &middot; 12ª reunião
        </span>
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
              16 <small style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>de 20</small>
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
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>Integrantes Mapeados</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              14 <small style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>+2 avaliações</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>Presença verificada em ata da 12ª reunião.</div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>Placar das Equipes</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-600)' }}>
              640 <small style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>vs 445 pts</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>Lobo lidera sobre Águia na formação.</div>
          </div>
        </div>
      </section>

      {/* Main Grid: 5 Verticals & KeyCore Thesis */}
      <div className="grid g-2" style={{ marginTop: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '4px', height: '24px', background: 'var(--brand-600)', borderRadius: '2px' }}></div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>As 5 Verticais do Grupo</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '16px' }}>
            O BNI garante exclusividade de cadeira. Cada membro representa um segmento distinto dentro do ecossistema.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--slate-50)', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>1. Jurídico &amp; Compliance</strong>
                <span className="badge badge-blue">4 cadeiras</span>
              </div>
              <div style={{ marginTop: '8px' }}>
                <span className="tag tag-blue">Previdenciário</span>
                <span className="tag tag-blue">Bancário</span>
                <span className="tag tag-blue">Saúde &amp; Consumidor</span>
                <span className="tag tag-blue">Trabalhista</span>
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--slate-50)', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>2. Contábil, BPO &amp; Finanças</strong>
                <span className="badge badge-emerald">3 cadeiras</span>
              </div>
              <div style={{ marginTop: '8px' }}>
                <span className="tag tag-blue">BPO Financeiro</span>
                <span className="tag tag-blue">Contabilidade Consultiva</span>
                <span className="tag tag-blue">Perícia Contábil</span>
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--slate-50)', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>3. Marketing, Vendas &amp; Digital</strong>
                <span className="badge badge-violet">4 cadeiras</span>
              </div>
              <div style={{ marginTop: '8px' }}>
                <span className="tag tag-blue">Treinamento Comercial</span>
                <span className="tag tag-blue">Posicionamento Digital</span>
                <span className="tag tag-blue">Tráfego Pago</span>
                <span className="tag tag-blue">Estratégia Comportamental</span>
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--slate-50)', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>4. Saúde, SST &amp; Bem-Estar</strong>
                <span className="badge badge-amber">2 cadeiras</span>
              </div>
              <div style={{ marginTop: '8px' }}>
                <span className="tag tag-blue">Seguro de Vida / Finanças</span>
                <span className="tag tag-blue">Ergonomia &amp; NR-17</span>
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--slate-50)', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>5. Engenharia, Arquitetura &amp; Imóveis</strong>
                <span className="badge badge-cyan">3 cadeiras</span>
              </div>
              <div style={{ marginTop: '8px' }}>
                <span className="tag tag-blue">Arquitetura Corporativa</span>
                <span className="tag tag-blue">Energia Solar</span>
              </div>
            </div>
          </div>
        </div>

        {/* KeyCore Thesis Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '4px', height: '24px', background: 'var(--violet-600)', borderRadius: '2px' }}></div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>Tese de Parceria KeyCore</h2>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '16px', lineHeight: 1.6 }}>
              A KeyCore Tech Hub atua como parceira de transformação operacional do ecossistema BNI. Enquanto os membros realizam conexões comerciais e trocam referências, a KeyCore identifica e resolve os gargalos de tempo e processos manuais que travam a entrega de valor desses negócios.
            </p>

            <div style={{ background: 'var(--brand-50)', borderLeft: '4px solid var(--brand-600)', padding: '14px', borderRadius: '8px', marginBottom: '20px' }}>
              <strong style={{ color: 'var(--brand-900)', fontSize: '0.85rem' }}>Slogan Institucional KeyCore:</strong>
              <div style={{ fontStyle: 'italic', fontWeight: 700, color: 'var(--brand-700)', fontSize: '1rem', marginTop: '4px' }}>
                "Tecnologia que devolve tempo."
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--brand-900)', marginTop: '4px' }}>
                Transformamos gargalos operacionais em tempo, clareza e eficiência.
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button className="btn btn-primary" onClick={() => onNavigate('/membros')}>
                <i className="fa-solid fa-users"></i> Explorar Membros
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('/grafo')}>
                <i className="fa-solid fa-diagram-project"></i> Ver Grafo
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('/fit')}>
                <i className="fa-solid fa-bullseye"></i> Simular Fit
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('/grupo')}>
                <i className="fa-solid fa-book-open"></i> Guia do Grupo
              </button>
            </div>
          </div>

          {/* Global Reach Section */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--slate-100)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Alcance Global do BNI
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
              <div><strong>77 países</strong> com equipes ativas</div>
              <div><strong>20 mil+</strong> membros no Brasil</div>
              <div><strong>300+</strong> empresários em Recife</div>
              <div><strong>7 grupos</strong> na operação PE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
