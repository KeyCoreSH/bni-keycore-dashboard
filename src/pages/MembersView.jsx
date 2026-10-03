import React, { useEffect, useState } from 'react';

export const MembersView = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [vertical, setVertical] = useState('');
  const [equipe, setEquipe] = useState('');
  const [fit, setFit] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    especialidade: '',
    vertical: 'marketing',
    equipe: 'Lobo',
    fit: 'Alto',
    fit_score: 85,
    pitch: '',
    gargalo: '',
    oferta: ''
  });

  const loadMembers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (vertical) params.append('vertical', vertical);
    if (equipe) params.append('equipe', equipe);
    if (fit) params.append('fit', fit);

    fetch(`/api/members?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar membros:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMembers();
  }, [search, vertical, equipe, fit]);

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        nome: member.nome || '',
        empresa: member.empresa || '',
        especialidade: member.especialidade || '',
        vertical: member.vertical || 'marketing',
        equipe: member.equipe || 'Lobo',
        fit: member.fit || 'Alto',
        fit_score: member.fit_score || 85,
        pitch: member.pitch || '',
        gargalo: member.gargalo || '',
        oferta: member.oferta || ''
      });
    } else {
      setEditingMember(null);
      setFormData({
        nome: '',
        empresa: '',
        especialidade: '',
        vertical: 'marketing',
        equipe: 'Lobo',
        fit: 'Alto',
        fit_score: 85,
        pitch: '',
        gargalo: '',
        oferta: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const method = editingMember ? 'PUT' : 'POST';
    const url = editingMember ? `/api/members/${editingMember.id}` : '/api/members';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        setIsModalOpen(false);
        loadMembers();
      })
      .catch((err) => console.error('Erro ao salvar membro:', err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Deseja realmente remover este membro?')) return;
    fetch(`/api/members/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => loadMembers());
  };

  const getVerticalBadge = (v) => {
    switch (v) {
      case 'juridico': return <span className="badge badge-blue">Jurídico &amp; Compliance</span>;
      case 'contabil': return <span className="badge badge-emerald">Contábil &amp; BPO</span>;
      case 'marketing': return <span className="badge badge-violet">Marketing &amp; Vendas</span>;
      case 'saude_sst': return <span className="badge badge-amber">Saúde &amp; SST</span>;
      case 'engenharia': return <span className="badge badge-cyan">Engenharia &amp; Arquitetura</span>;
      default: return <span className="badge badge-blue">{v}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)' }}>Membros do BNI PE JUNTOS</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
            16 cadeiras mapeadas na 12ª reunião, com leitura de pitches, gargalos operacionais e soluções KeyCore.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="fa-solid fa-user-plus"></i> Adicionar Membro
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px' }}>
        <div className="grid g-4" style={{ alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)' }}>BUSCAR</label>
            <input
              type="text"
              className="input-field"
              placeholder="Buscar por nome, empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)' }}>VERTICAL</label>
            <select className="input-field" value={vertical} onChange={(e) => setVertical(e.target.value)}>
              <option value="">Todas as verticais</option>
              <option value="juridico">Jurídico &amp; Compliance</option>
              <option value="contabil">Contábil, BPO &amp; Finanças</option>
              <option value="marketing">Marketing, Vendas &amp; Digital</option>
              <option value="saude_sst">Saúde, SST &amp; Bem-Estar</option>
              <option value="engenharia">Engenharia &amp; Arquitetura</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)' }}>EQUIPE</label>
            <select className="input-field" value={equipe} onChange={(e) => setEquipe(e.target.value)}>
              <option value="">Todas as equipes</option>
              <option value="Lobo">Equipe Lobo</option>
              <option value="Águia">Equipe Águia</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)' }}>FIT KEYCORE</label>
            <select className="input-field" value={fit} onChange={(e) => setFit(e.target.value)}>
              <option value="">Todos os níveis</option>
              <option value="Alto">Fit Alto / Excepcional</option>
              <option value="Médio">Fit Médio</option>
              <option value="Baixo">Fit Baixo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-500)' }}>Carregando membros...</div>
      ) : (
        <div className="grid g-3">
          {members.map((m) => (
            <div key={m.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: m.equipe === 'Lobo' ? 'var(--brand-100)' : 'var(--emerald-50)',
                      color: m.equipe === 'Lobo' ? 'var(--brand-700)' : 'var(--emerald-700)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1.1rem'
                    }}>
                      {m.nome.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)' }}>{m.nome}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>{m.empresa}</div>
                    </div>
                  </div>
                  {getVerticalBadge(m.vertical)}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--slate-700)', marginBottom: '12px', fontWeight: 600 }}>
                  <i className="fa-solid fa-briefcase" style={{ marginRight: '6px', color: 'var(--slate-400)' }}></i>
                  {m.especialidade}
                </div>

                {/* Pitch */}
                {m.pitch && (
                  <div style={{ background: 'var(--slate-50)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--slate-700)', fontStyle: 'italic', marginBottom: '12px', borderLeft: '3px solid var(--slate-300)' }}>
                    "{m.pitch}"
                  </div>
                )}

                {/* Gargalo & Oferta */}
                <div style={{ marginBottom: '12px', fontSize: '0.8rem' }}>
                  <div style={{ color: 'var(--amber-700)', fontWeight: 700, marginBottom: '2px' }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '4px' }}></i> Gargalo Operacional:
                  </div>
                  <div style={{ color: 'var(--slate-600)', marginBottom: '8px' }}>{m.gargalo || 'Não mapeado.'}</div>

                  <div style={{ color: 'var(--emerald-700)', fontWeight: 700, marginBottom: '2px' }}>
                    <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: '4px' }}></i> Oferta KeyCore:
                  </div>
                  <div style={{ color: 'var(--slate-600)' }}>{m.oferta || 'Em análise.'}</div>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ paddingTop: '12px', borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="pill" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                    Fit {m.fit} ({m.fit_score}%)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600 }}>
                    Eq. {m.equipe}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleOpenModal(m)}>
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#ef4444' }} onClick={() => handleDelete(m.id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{editingMember ? 'Editar Membro' : 'Novo Membro'}</h2>
              <button className="menu-toggle" onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <form onSubmit={handleSave} className="grid g-1" style={{ gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Nome Completo *</label>
                <input type="text" className="input-field" required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
              </div>

              <div className="grid g-2">
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Empresa</label>
                  <input type="text" className="input-field" value={formData.empresa} onChange={(e) => setFormData({ ...formData, empresa: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Especialidade / Cadeira</label>
                  <input type="text" className="input-field" value={formData.especialidade} onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })} />
                </div>
              </div>

              <div className="grid g-2">
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Vertical</label>
                  <select className="input-field" value={formData.vertical} onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}>
                    <option value="juridico">Jurídico &amp; Compliance</option>
                    <option value="contabil">Contábil, BPO &amp; Finanças</option>
                    <option value="marketing">Marketing, Vendas &amp; Digital</option>
                    <option value="saude_sst">Saúde, SST &amp; Bem-Estar</option>
                    <option value="engenharia">Engenharia &amp; Arquitetura</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Equipe</label>
                  <select className="input-field" value={formData.equipe} onChange={(e) => setFormData({ ...formData, equipe: e.target.value })}>
                    <option value="Lobo">Equipe Lobo</option>
                    <option value="Águia">Equipe Águia</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Pitch Semanal (60 segundos)</label>
                <textarea className="input-field" rows="2" value={formData.pitch} onChange={(e) => setFormData({ ...formData, pitch: e.target.value })} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Gargalo Operacional (Análise KeyCore)</label>
                <input type="text" className="input-field" value={formData.gargalo} onChange={(e) => setFormData({ ...formData, gargalo: e.target.value })} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Oferta de Automação / Solução KeyCore</label>
                <input type="text" className="input-field" value={formData.oferta} onChange={(e) => setFormData({ ...formData, oferta: e.target.value })} />
              </div>

              <div className="grid g-2">
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Classificação de Fit</label>
                  <select className="input-field" value={formData.fit} onChange={(e) => setFormData({ ...formData, fit: e.target.value })}>
                    <option value="Alto">Alto</option>
                    <option value="Médio">Médio</option>
                    <option value="Baixo">Baixo</option>
                    <option value="Excepcional">Excepcional</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Pontuação de Fit (%)</label>
                  <input type="number" className="input-field" min="0" max="100" value={formData.fit_score} onChange={(e) => setFormData({ ...formData, fit_score: parseInt(e.target.value) || 0 })} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Membro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
