import React, { useEffect, useState } from 'react';

export const MembersView = () => {
  const [members, setMembers] = useState([]);
  const [verticaisList, setVerticaisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [vertical, setVertical] = useState('');
  const [equipe, setEquipe] = useState('');
  const [fit, setFit] = useState('');

  // Member Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    especialidade: '',
    vertical: 'tecnologia',
    equipe: 'Lobo',
    fit: 'Alto',
    fit_score: 85,
    pitch: '',
    gargalo: '',
    oferta: ''
  });

  // New Vertical Modal State
  const [isNewVerticalModalOpen, setIsNewVerticalModalOpen] = useState(false);
  const [newVerticalData, setNewVerticalData] = useState({
    nome: '',
    cor: 'blue',
    descricao: ''
  });

  const loadVerticais = () => {
    fetch('/api/verticais')
      .then((res) => res.json())
      .then((data) => setVerticaisList(data))
      .catch((err) => console.error('Erro ao carregar verticais:', err));
  };

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
    loadVerticais();
  }, []);

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
        vertical: member.vertical || 'tecnologia',
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
        vertical: verticaisList.length > 0 ? verticaisList[0].id : 'tecnologia',
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
      .then(() => {
        setIsModalOpen(false);
        loadMembers();
      })
      .catch((err) => console.error('Erro ao salvar membro:', err));
  };

  const handleCreateVertical = (e) => {
    e.preventDefault();
    if (!newVerticalData.nome) return;

    fetch('/api/verticais', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVerticalData)
    })
      .then((res) => res.json())
      .then(() => {
        setIsNewVerticalModalOpen(false);
        setNewVerticalData({ nome: '', cor: 'blue', descricao: '' });
        loadVerticais();
      })
      .catch((err) => console.error('Erro ao criar nova vertical:', err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Deseja realmente remover este membro?')) return;
    fetch(`/api/members/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => loadMembers());
  };

  const getVerticalBadge = (vId) => {
    const found = verticaisList.find((item) => item.id === vId);
    const name = found ? found.nome : (vId === 'tecnologia' ? 'Tecnologia & Inovação' : vId);
    const color = found ? found.cor : 'blue';

    return <span className={`badge badge-${color}`}>{name}</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)' }}>Membros do BNI PE JUNTOS</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
            Catálogo completo de membros, cadeiras e verticais estratégicas mapeadas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setIsNewVerticalModalOpen(true)}>
            <i className="fa-solid fa-folder-plus"></i> Nova Vertical
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenModal(null)}>
            <i className="fa-solid fa-user-plus"></i> Adicionar Membro
          </button>
        </div>
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

              {/* Dynamic Verticals list */}
              {verticaisList.map((v) => (
                <option key={v.id} value={v.id}>{v.nome}</option>
              ))}

              {/* Fallback if list not yet loaded */}
              {verticaisList.length === 0 && (
                <>
                  <option value="tecnologia">Tecnologia &amp; Inovação Digital</option>
                  <option value="juridico">Jurídico &amp; Compliance</option>
                  <option value="contabil">Contábil, BPO &amp; Finanças</option>
                  <option value="marketing">Marketing, Vendas &amp; Digital</option>
                  <option value="saude_sst">Saúde, SST &amp; Bem-Estar</option>
                  <option value="engenharia">Engenharia &amp; Arquitetura</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)' }}>EQUIPE</label>
            <select className="input-field" value={equipe} onChange={(e) => setEquipe(e.target.value)}>
              <option value="">Todas as equipes</option>
              <option value="Lobo">Equipe Lobo</option>
              <option value="Águia">Equipe Águia</option>
              <option value="Tubarão">Equipe Tubarão</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)' }}>FIT ESTRATÉGICO</label>
            <select className="input-field" value={fit} onChange={(e) => setFit(e.target.value)}>
              <option value="">Todos os fits</option>
              <option value="Excepcional">Excepcional</option>
              <option value="Alto">Alto Fit</option>
              <option value="Médio">Médio Fit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-500)' }}>Carregando catálogo de membros...</div>
      ) : (
        <div className="grid g-3">
          {members.map((m) => (
            <div className="card" key={m.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--brand-100)',
                      color: 'var(--brand-700)',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
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
                  <div style={{ color: 'var(--slate-600)' }}>{m.oferta || 'Não mapeada.'}</div>
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--slate-100)', marginTop: '12px' }}>
                <span className="pill" style={{ fontSize: '0.75rem' }}>
                  Fit {m.fit} ({m.fit_score}%)
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }} onClick={() => handleOpenModal(m)}>
                    <i className="fa-solid fa-pen"></i> Editar
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--rose-700)' }} onClick={() => handleDelete(m.id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Adicionar / Editar Membro */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <i className="fa-solid fa-user-gear" style={{ color: 'var(--brand-600)' }}></i>
                {editingMember ? 'Editar Membro' : 'Adicionar Membro'}
              </h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="modal-grid-2">
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Empresa</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-grid-2">
                <div className="form-group">
                  <label className="form-label">Especialidade / Cadeira</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.especialidade}
                    onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Vertical Estratégica</label>
                  <select
                    className="input-field"
                    value={formData.vertical}
                    onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                  >
                    {verticaisList.map((v) => (
                      <option key={v.id} value={v.id}>{v.nome}</option>
                    ))}
                    {verticaisList.length === 0 && (
                      <option value="tecnologia">Tecnologia &amp; Inovação Digital</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="modal-grid-2">
                <div className="form-group">
                  <label className="form-label">Equipe BNI</label>
                  <select
                    className="input-field"
                    value={formData.equipe}
                    onChange={(e) => setFormData({ ...formData, equipe: e.target.value })}
                  >
                    <option value="Lobo">Equipe Lobo</option>
                    <option value="Águia">Equipe Águia</option>
                    <option value="Tubarão">Equipe Tubarão</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Fit Score (0-100%)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.fit_score}
                    onChange={(e) => setFormData({ ...formData, fit_score: parseInt(e.target.value) || 75 })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pitch / Apresentação de 30s</label>
                <textarea
                  className="input-field"
                  rows="2"
                  value={formData.pitch}
                  onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gargalo Operacional Identificado</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.gargalo}
                  onChange={(e) => setFormData({ ...formData, gargalo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Oferta de Automação KeyCore</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.oferta}
                  onChange={(e) => setFormData({ ...formData, oferta: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Membro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Criar Nova Vertical */}
      {isNewVerticalModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewVerticalModalOpen(false)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <i className="fa-solid fa-folder-plus" style={{ color: 'var(--brand-600)' }}></i>
                Criar Nova Vertical Estratégica
              </h2>
              <button className="modal-close-btn" onClick={() => setIsNewVerticalModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCreateVertical} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Nome da Vertical</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: Recursos Humanos &amp; Carreira"
                  value={newVerticalData.nome}
                  onChange={(e) => setNewVerticalData({ ...newVerticalData, nome: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cor Visual do Badge</label>
                <select
                  className="input-field"
                  value={newVerticalData.cor}
                  onChange={(e) => setNewVerticalData({ ...newVerticalData, cor: e.target.value })}
                >
                  <option value="blue">Azul (Tecnologia / Jurídico)</option>
                  <option value="emerald">Verde Esmeralda (Contábil / Finanças)</option>
                  <option value="violet">Roxo Violeta (Marketing / Vendas)</option>
                  <option value="amber">Âmbar (Saúde / SST)</option>
                  <option value="cyan">Ciano (Engenharia / Arquitetura)</option>
                  <option value="rose">Rosa / Coral</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Descrição / Escopo de Cadeiras</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Descreva as especialidades e perfis que compõem esta nova vertical..."
                  value={newVerticalData.descricao}
                  onChange={(e) => setNewVerticalData({ ...newVerticalData, descricao: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--slate-100)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewVerticalModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fa-solid fa-plus"></i> Salvar Vertical
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
