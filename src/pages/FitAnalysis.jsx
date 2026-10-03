import React, { useEffect, useState } from 'react';

export const FitAnalysis = () => {
  const [fitData, setFitData] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Match Simulator state
  const [m1, setM1] = useState('');
  const [m2, setM2] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/fit').then((res) => res.json()),
      fetch('/api/members').then((res) => res.json())
    ])
      .then(([fitRes, memRes]) => {
        setFitData(fitRes);
        setMembers(memRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar dados de fit:', err);
        setLoading(false);
      });
  }, []);

  const handleSimulate = (e) => {
    e.preventDefault();
    setSimulating(true);

    fetch('/api/fit/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member1Id: m1, member2Id: m2, customGoal })
    })
      .then((res) => res.json())
      .then((data) => {
        setSimulationResult(data);
        setSimulating(false);
      })
      .catch((err) => {
        console.error('Erro na simulação:', err);
        setSimulating(false);
      });
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)' }}>Análise de Fit &amp; Matriz de Automação</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
          Mapeamento quantitativo e qualitativo do potencial de automação KeyCore e sinergia comercial entre os membros do BNI.
        </p>
      </div>

      {/* Summary Stats */}
      {fitData && (
        <div className="grid g-4" style={{ marginBottom: '24px' }}>
          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>Fit Alto / Excepcional</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-600)' }}>
              {fitData.altoCount} <small style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>membros</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>Empresas com gargalos imediatos.</div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>Fit Médio</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-600)' }}>
              {fitData.medioCount} <small style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>membros</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>Processos em consolidação.</div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>Score Médio do Grupo</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--violet-600)' }}>
              {fitData.avgScore}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>Compatibilidade média com IA.</div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>Soluções Ofertadas</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--amber-600)' }}>
              16 <small style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>projetos</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>1 para cada cadeira mapeada.</div>
          </div>
        </div>
      )}

      {/* Simulator Section */}
      <div className="card" style={{ marginBottom: '28px', background: 'var(--slate-50)', border: '1px solid var(--brand-200)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <i className="fa-solid fa-calculator" style={{ color: 'var(--brand-600)', fontSize: '1.2rem' }}></i>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>Simulador de Match &amp; Sinergia Comercial</h2>
        </div>

        <form onSubmit={handleSimulate} className="grid g-3" style={{ marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Membro 1</label>
            <select className="input-field" value={m1} onChange={(e) => setM1(e.target.value)}>
              <option value="">Selecione o Membro A</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.nome} ({m.empresa})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Membro 2 (ou KeyCore)</label>
            <select className="input-field" value={m2} onChange={(e) => setM2(e.target.value)}>
              <option value="">Selecione o Membro B ou KeyCore</option>
              <option value="keycore">KeyCore Tech Hub</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.nome} ({m.empresa})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Objetivo ou Projeto Específico</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ex: Parceria para captação de clientes corporativos"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
            />
          </div>
        </form>

        <button className="btn btn-primary" onClick={handleSimulate} disabled={simulating}>
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          {simulating ? 'Calculando Match...' : 'Calcular Compatibilidade de Fit'}
        </button>

        {/* Result Container */}
        {simulationResult && (
          <div style={{ marginTop: '20px', padding: '16px', background: '#ffffff', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>Resultado da Análise</div>
              <span className="pill" style={{ fontSize: '0.85rem' }}>Score de Match: {simulationResult.score}%</span>
            </div>

            <div style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--brand-900)', fontWeight: 700 }}>
              {simulationResult.jointOffer}
            </div>

            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Pontos de Sinergia Identificados:</strong>
              <ul style={{ marginTop: '4px', paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                {simulationResult.synergies.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Bottlenecks Pipeline Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '24px', background: 'var(--brand-600)', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>Matriz de Gargalos Operacionais vs Soluções KeyCore</h2>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Membro / Empresa</th>
                <th>Especialidade</th>
                <th>Gargalo Operacional</th>
                <th>Solução de Automação KeyCore</th>
                <th>Score</th>
                <th>Fit</th>
              </tr>
            </thead>
            <tbody>
              {fitData?.pipeline.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.nome}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{p.empresa}</div>
                  </td>
                  <td>{p.especialidade}</td>
                  <td style={{ color: 'var(--amber-700)', fontSize: '0.85rem' }}>{p.gargalo || '-'}</td>
                  <td style={{ color: 'var(--emerald-700)', fontSize: '0.85rem', fontWeight: 600 }}>{p.oferta || '-'}</td>
                  <td><strong>{p.fit_score}%</strong></td>
                  <td>
                    <span className={`badge ${p.fit === 'Alto' || p.fit === 'Excepcional' ? 'badge-emerald' : 'badge-amber'}`}>
                      {p.fit}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
