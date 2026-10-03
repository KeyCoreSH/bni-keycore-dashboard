import React, { useEffect, useState } from 'react';

export const GroupGuide = () => {
  const [grupoData, setGrupoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/grupo')
      .then((res) => res.json())
      .then((data) => {
        setGrupoData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar dados do grupo:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <span className="pill">
          <i className="fa-solid fa-people-group"></i> Guia Oficial do Grupo BNI
        </span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '8px' }}>
          O Grupo BNI PE JUNTOS — Método, Filosofia &amp; Estrutura
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
          Entenda a metodologia de networking profissional do BNI: origem, filosofia Givers Gain®, 7 valores, estrutura de comitês e as 6 partes da reunião semanal.
        </p>
      </div>

      {/* Anchor Nav Bar */}
      <div className="card" style={{ padding: '12px 20px', marginBottom: '24px', position: 'sticky', top: '10px', zindex: 50 }}>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', fontSize: '0.85rem', fontWeight: 700 }}>
          <a href="#origem" style={{ color: 'var(--brand-600)', textDecoration: 'none' }}>1. Origem</a>
          <a href="#valores" style={{ color: 'var(--violet-600)', textDecoration: 'none' }}>2. 7 Valores</a>
          <a href="#metodo" style={{ color: 'var(--emerald-600)', textDecoration: 'none' }}>3. Método V-C-R</a>
          <a href="#passos" style={{ color: 'var(--amber-600)', textDecoration: 'none' }}>4. 6 Passos da Reunião</a>
          <a href="#estrutura" style={{ color: 'var(--brand-700)', textDecoration: 'none' }}>5. Estrutura Organizacional</a>
          <a href="#pontuacao" style={{ color: 'var(--slate-700)', textDecoration: 'none' }}>6. Placar das Equipes</a>
        </div>
      </div>

      {/* 1. Origem */}
      <section id="origem" className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '4px', height: '24px', background: 'var(--brand-600)', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>1. Origem: Um Cliente Perdido, Um Jantar</h2>
        </div>
        <p style={{ fontSize: '0.95rem', color: 'var(--slate-700)', lineHeight: 1.6, marginBottom: '16px' }}>
          Há 41 anos, após perder seu principal cliente de consultoria, o <strong>Dr. Ivan Misner</strong> reuniu um grupo de amigos empresários em um jantar com um objetivo simples: trocar indicações de negócios de forma estruturada e sem pagar comissão. O modelo funcionou tão bem que se multiplicou globalmente.
        </p>

        <div className="grid g-3">
          <div style={{ background: 'var(--slate-50)', padding: '14px', borderRadius: '10px' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>A Ideia Central</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '4px' }}>
              Relacionamentos profissionais contínuos que ajudam os participantes a fechar negócios maiores e melhores de forma previsível.
            </p>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '14px', borderRadius: '10px' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>Sem Comissão por Indicação</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '4px' }}>
              Cada membro indica outro e fecha negócios baseados em confiança mútua, sem cobrar qualquer taxa ou comissão sobre o valor.
            </p>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '14px', borderRadius: '10px' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>Exclusividade de Cadeira</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '4px' }}>
              Cada cadeira representa uma especialidade única. Nenhum concorrente direto pode entrar na mesma equipe.
            </p>
          </div>
        </div>
      </section>

      {/* 2. 7 Valores */}
      <section id="valores" className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '24px', background: 'var(--violet-600)', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>2. Os 7 Valores Fundamentais do BNI</h2>
        </div>

        <div className="grid g-2">
          {grupoData?.valores.map((v) => (
            <div key={v.id} style={{ display: 'flex', gap: '14px', padding: '14px', background: 'var(--slate-50)', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', background: 'var(--violet-50)',
                color: 'var(--violet-700)', fontWeight: 800, display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0
              }}>
                {v.num}
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)' }}>{v.titulo}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '4px' }}>{v.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Método V-C-R */}
      <section id="metodo" className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '24px', background: 'var(--emerald-600)', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>3. O Processo V-C-R (Visibilidade &rarr; Credibilidade &rarr; Rentabilidade)</h2>
        </div>

        <div className="grid g-3">
          {grupoData?.vcr.map((v, idx) => (
            <div key={idx} style={{ padding: '16px', background: 'var(--emerald-50)', borderRadius: '10px', borderLeft: '4px solid var(--emerald-600)' }}>
              <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>Fase {idx + 1}</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--emerald-700)', marginBottom: '6px' }}>{v.fase}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 6 Passos da Reunião */}
      <section id="passos" className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '24px', background: 'var(--amber-600)', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>4. As 6 Partes da Reunião Semanal</h2>
        </div>

        <div className="grid g-2">
          {grupoData?.passos.map((p) => (
            <div key={p.id} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--slate-50)', borderRadius: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--amber-50)', color: 'var(--amber-700)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {p.num}
              </div>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>{p.titulo}</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '2px' }}>{p.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Estrutura Organizacional (#estrutura) */}
      <section id="estrutura" className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '24px', background: 'var(--brand-700)', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>5. Estrutura Organizacional do Grupo (#estrutura)</h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '16px' }}>
          Um grupo BNI opera como uma verdadeira empresa, com lideranças voluntárias e comitês de governança renovados periodicamente.
        </p>

        <div className="grid g-3">
          {grupoData?.estrutura.map((e) => (
            <div key={e.id} style={{ padding: '16px', background: 'var(--slate-50)', borderRadius: '10px', border: '1px solid var(--slate-200)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '8px' }}>{e.responsavel}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '6px' }}>{e.cargo}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>{e.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Placar das Equipes */}
      <section id="pontuacao" className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '24px', background: 'var(--slate-800)', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>6. Matriz de Pontuação — Lobo vs Águia</h2>
        </div>

        <div className="grid g-2">
          <div style={{ padding: '16px', background: 'var(--brand-50)', borderRadius: '10px', border: '1px solid var(--brand-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-900)' }}>Equipe Lobo</h3>
              <span className="badge badge-blue" style={{ fontSize: '1rem', padding: '6px 12px' }}>640 pontos</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--brand-700)', marginTop: '8px' }}>
              Liderança na fase de formação com alta engajamento em 1-2-1s e convidados para reuniões de validação.
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--emerald-50)', borderRadius: '10px', border: '1px solid var(--emerald-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald-900)' }}>Equipe Águia</h3>
              <span className="badge badge-emerald" style={{ fontSize: '1rem', padding: '6px 12px' }}>445 pontos</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--emerald-700)', marginTop: '8px' }}>
              Vice-liderança focada na conversão de referências internas e estruturação de rotinas de atendimento.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
