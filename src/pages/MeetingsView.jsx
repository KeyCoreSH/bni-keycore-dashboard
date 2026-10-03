import React, { useEffect, useState } from 'react';

export const MeetingsView = () => {
  const [reunioes, setReunioes] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [indicadorId, setIndicadorId] = useState('luiz');
  const [contatoId, setContatoId] = useState('felipe');
  const [dataHora, setDataHora] = useState('2026-10-06T14:00');
  const [local, setLocal] = useState('Real Plural — Recife Antigo');
  const [status, setStatus] = useState('Agendada');
  const [observacao, setObservacao] = useState('');

  const loadData = () => {
    Promise.all([
      fetch('/api/reunioes').then((res) => res.json()),
      fetch('/api/members').then((res) => res.json())
    ])
      .then(([reunioesData, membersData]) => {
        setReunioes(reunioesData);
        setMembers(membersData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar reuniões:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!indicadorId || !contatoId || !dataHora || !local) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      indicador_id: indicadorId,
      contato_id: contatoId,
      data_hora: dataHora.replace('T', ' ') + ':00',
      local,
      status,
      observacao
    };

    fetch('/api/reunioes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then(() => {
        setShowModal(false);
        setObservacao('');
        loadData();
      })
      .catch((err) => console.error('Erro ao salvar reunião:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja remover este registro de reunião?')) {
      fetch(`/api/reunioes/${id}`, { method: 'DELETE' })
        .then(() => loadData())
        .catch((err) => console.error('Erro ao excluir reunião:', err));
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="pill">
            <i className="fa-solid fa-calendar-check"></i> Gestão de Relacionamentos 1-2-1
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '8px' }}>
            Reuniões Agendadas &amp; Histórico de Indicações
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
            Registre encontros de negócios, passe de referências e acompanhe o pipeline de relacionamentos do grupo BNI.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus"></i> Registrar Nova Reunião
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-500)' }}>
          <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
          <p style={{ marginTop: '12px' }}>Carregando reuniões e indicações...</p>
        </div>
      ) : (
        <div className="grid g-1" style={{ gap: '16px' }}>
          {reunioes.map((r) => (
            <div key={r.id} className="card" style={{ borderLeft: '4px solid var(--brand-600)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-blue">{r.status}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                      <i className="fa-regular fa-clock"></i> {formatDate(r.data_hora)}
                    </span>
                  </div>

                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', margin: '6px 0' }}>
                    📍 {r.local}
                  </div>

                  <div className="grid g-2" style={{ gap: '12px', marginTop: '12px' }}>
                    <div style={{ background: 'var(--slate-50)', padding: '12px', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
                      <span className="tag tag-blue" style={{ marginBottom: '4px' }}>Origem da Indicação</span>
                      <div style={{ fontWeight: 800, color: 'var(--slate-900)' }}>{r.indicador_nome}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>{r.indicador_empresa}</div>
                    </div>

                    <div style={{ background: 'var(--emerald-50)', padding: '12px', borderRadius: '10px', border: '1px solid var(--emerald-200)' }}>
                      <span className="badge badge-emerald" style={{ marginBottom: '4px' }}>Reunião Agendada Com</span>
                      <div style={{ fontWeight: 800, color: 'var(--emerald-900)' }}>{r.contato_nome}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--emerald-700)' }}>{r.contato_empresa}</div>
                    </div>
                  </div>

                  {r.observacao && (
                    <div style={{ marginTop: '12px', padding: '10px', background: 'var(--slate-50)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                      <strong>Observações / Contexto:</strong> {r.observacao}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-secondary"
                  style={{ color: 'var(--amber-700)', padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={() => handleDelete(r.id)}
                  title="Excluir reunião"
                >
                  <i className="fa-solid fa-trash"></i> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Registrar Reunião */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Registrar Reunião / Indicação
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid g-1" style={{ gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Quem indicou ou passou o contato? (Membro Origem)</label>
                <select className="input-field" value={indicadorId} onChange={(e) => setIndicadorId(e.target.value)}>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome} — {m.empresa}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Com quem é a reunião? (Membro Destino)</label>
                <select className="input-field" value={contatoId} onChange={(e) => setContatoId(e.target.value)}>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome} — {m.empresa}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Data e Hora da Reunião</label>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={dataHora}
                  onChange={(e) => setDataHora(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Local do Encontro</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: Real Plural — Recife Antigo"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Status</label>
                <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Agendada">Agendada</option>
                  <option value="Realizada">Realizada / Concluída</option>
                  <option value="Em Acompanhamento">Em Acompanhamento</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Observações ou Assunto</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Detalhes da indicação, objetivo da reunião..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Reunião</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
