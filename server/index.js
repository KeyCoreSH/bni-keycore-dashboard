const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// Serve meeting evidence before the SPA fallback so /docs returns the image.
app.use('/docs', express.static(path.join(__dirname, '../docs')));
// Serve static assets built by Vite in dist/.
app.use(express.static(path.join(__dirname, '../dist')));

// Add columns introduced after the initial SQLite schema without destroying data.
for (const statement of [
  'ALTER TABLE reunioes ADD COLUMN anexo_path TEXT',
  'ALTER TABLE reunioes ADD COLUMN anexo_tipo TEXT',
  'ALTER TABLE reunioes ADD COLUMN anexo_descricao TEXT',
  'ALTER TABLE reunioes ADD COLUMN plataforma TEXT',
  'ALTER TABLE reunioes ADD COLUMN codigo_reuniao TEXT',
  'ALTER TABLE reunioes ADD COLUMN horario_exibido TEXT',
  'ALTER TABLE reunioes ADD COLUMN participantes_visiveis TEXT',
  'ALTER TABLE reunioes ADD COLUMN estados_participantes TEXT'
]) {
  try { db.exec(statement); } catch (err) {
    if (!String(err.message).includes('duplicate column name')) throw err;
  }
}

const reuniaoAnexo = {
  path: '/docs/reunioes/2026-10-07-rogerio-felipe-imagem.jpg',
  tipo: 'image/jpeg',
  descricao: 'Captura do Google Meet: 3 participantes visíveis, código zqy-gpef-exa e horário exibido 14:41.'
};

// Keep the verified meeting screenshot linked to the existing meeting record.
try {
  db.prepare(`UPDATE reunioes SET anexo_path = ?, anexo_tipo = ?, anexo_descricao = ?, plataforma = ?, codigo_reuniao = ?, horario_exibido = ?, participantes_visiveis = ?, estados_participantes = ? WHERE id = 1`)
    .run(
      reuniaoAnexo.path,
      reuniaoAnexo.tipo,
      reuniaoAnexo.descricao,
      'Google Meet',
      'zqy-gpef-exa',
      '14:41',
      'Felipe Gomes; Rogerio Alencar Filho; Sintessy Bot',
      'Felipe e Rogerio com vídeo visível; Sintessy Bot sem vídeo e microfone silenciado. Não inferir estado absoluto dos microfones de Felipe e Rogerio a partir da imagem.'
    );
} catch (err) {
  console.warn('Anexo da reunião ainda não foi vinculado:', err.message);
}

app.get('/api/reunioes/:id/anexo', (req, res) => {
  const row = db.prepare('SELECT anexo_path, anexo_tipo, anexo_descricao FROM reunioes WHERE id = ?').get(req.params.id);
  if (!row || !row.anexo_path) return res.status(404).json({ error: 'Anexo não encontrado' });
  res.json({ ...row, url: row.anexo_path });
});

// Authentication Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Informe o e-mail e a senha.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (normalizedEmail === 'geriofilho@gmail.com' && password === 'R0ger!n20100') {
    return res.json({
      success: true,
      token: 'keycore_bni_token_master_rogerio_2026',
      user: {
        name: 'Rogério Alencar Filho',
        email: 'Geriofilho@gmail.com',
        role: 'Founder & CEO KeyCore Tech Hub'
      }
    });
  }

  return res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
});

// POST /api/verticais — Add new vertical dynamically
app.post('/api/verticais', (req, res) => {
  try {
    const { id, nome, cor, descricao } = req.body || {};
    if (!nome) {
      return res.status(400).json({ error: 'O nome da vertical é obrigatório.' });
    }
    const verticalId = id || nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_');
    const color = cor || 'blue';
    const desc = descricao || '';

    const stmt = db.prepare('INSERT OR REPLACE INTO verticais (id, nome, cor, descricao, cadeiras) VALUES (?, ?, ?, ?, ?)');
    stmt.run(verticalId, nome, color, desc, 0);

    res.json({ success: true, vertical: { id: verticalId, nome, cor: color, descricao: desc, cadeiras: 0 } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Endpoints

// GET /api/meta
app.get('/api/meta', (req, res) => {
  try {
    const metaRows = db.prepare('SELECT key, value FROM meta').all();
    const metaObj = metaRows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    const equipes = db.prepare('SELECT * FROM equipes').all();
    const verticais = db.prepare('SELECT * FROM verticais').all();
    const totalMembers = db.prepare('SELECT COUNT(*) as count FROM members').get().count;
    const totalReunioes = db.prepare('SELECT COUNT(*) as count FROM reunioes').get().count;

    res.json({
      meta: metaObj,
      equipes,
      verticais,
      totalMembers,
      totalReunioes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/verticais
app.get('/api/verticais', (req, res) => {
  try {
    const verticais = db.prepare('SELECT * FROM verticais').all();
    const result = verticais.map(v => {
      const members = db.prepare('SELECT id, nome, empresa, especialidade FROM members WHERE vertical = ?').all(v.id);
      return { ...v, members };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/members
app.get('/api/members', (req, res) => {
  try {
    const { vertical, equipe, fit, search } = req.query;
    let query = 'SELECT * FROM members WHERE 1=1';
    const params = [];

    if (vertical) {
      query += ' AND vertical = ?';
      params.push(vertical);
    }
    if (equipe) {
      query += ' AND equipe = ?';
      params.push(equipe);
    }
    if (fit) {
      query += ' AND fit = ?';
      params.push(fit);
    }
    if (search) {
      query += ' AND (nome LIKE ? OR empresa LIKE ? OR especialidade LIKE ? OR pitch LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    const members = db.prepare(query).all(...params);

    const fullMembers = members.map(m => {
      const redes = db.prepare('SELECT tipo, handle FROM member_redes WHERE member_id = ?').all(m.id);
      const publicos = db.prepare(`
        SELECT p.id, p.nome 
        FROM publicos p
        JOIN membro_publico mp ON p.id = mp.publico_id
        WHERE mp.member_id = ?
      `).all(m.id);
      return { ...m, redes, publicos };
    });

    res.json(fullMembers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/members/:id
app.get('/api/members/:id', (req, res) => {
  try {
    const { id } = req.params;
    const member = db.prepare('SELECT * FROM members WHERE id = ?').get(id);
    if (!member) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }

    const redes = db.prepare('SELECT tipo, handle FROM member_redes WHERE member_id = ?').all(id);
    const publicos = db.prepare(`
      SELECT p.id, p.nome 
      FROM publicos p
      JOIN membro_publico mp ON p.id = mp.publico_id
      WHERE mp.member_id = ?
    `).all(id);

    const edges = db.prepare('SELECT * FROM graph_edges WHERE source = ? OR target = ?').all(id, id);

    res.json({ ...member, redes, publicos, edges });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/members
app.post('/api/members', (req, res) => {
  try {
    const { id, nome, empresa, especialidade, vertical, equipe, pitch, gargalo, oferta, fit_score } = req.body;
    const memberId = id || nome.toLowerCase().replace(/[^a-z0-9]/g, '');

    db.prepare(`
      INSERT INTO members (id, nome, empresa, especialidade, vertical, equipe, pitch, gargalo, oferta, fit_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(memberId, nome, empresa, especialidade, vertical, equipe || 'lobo', pitch, gargalo, oferta, fit_score || 75);

    res.json({ message: 'Membro criado com sucesso', id: memberId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/members/:id
app.put('/api/members/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nome, empresa, especialidade, vertical, equipe, pitch, gargalo, oferta, fit_score } = req.body;

    db.prepare(`
      UPDATE members 
      SET nome = ?, empresa = ?, especialidade = ?, vertical = ?, equipe = ?, pitch = ?, gargalo = ?, oferta = ?, fit_score = ?
      WHERE id = ?
    `).run(nome, empresa, especialidade, vertical, equipe, pitch, gargalo, oferta, fit_score, id);

    res.json({ message: 'Membro atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/members/:id
app.delete('/api/members/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM members WHERE id = ?').run(id);
    res.json({ message: 'Membro removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reunioes
app.get('/api/reunioes', (req, res) => {
  try {
    const reunioes = db.prepare(`
      SELECT 
        r.*,
        m1.nome as indicador_nome,
        m1.empresa as indicador_empresa,
        m1.especialidade as indicador_especialidade,
        m2.nome as contato_nome,
        m2.empresa as contato_empresa,
        m2.especialidade as contato_especialidade,
        r.anexo_path,
        r.anexo_tipo,
        r.anexo_descricao,
        r.plataforma,
        r.codigo_reuniao,
        r.horario_exibido,
        r.participantes_visiveis,
        r.estados_participantes
      FROM reunioes r
      JOIN members m1 ON r.indicador_id = m1.id
      JOIN members m2 ON r.contato_id = m2.id
      ORDER BY r.data_hora DESC
    `).all();

    res.json(reunioes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reunioes
app.post('/api/reunioes', (req, res) => {
  try {
    const { indicador_id, contato_id, data_hora, local, status, observacao } = req.body;

    if (!indicador_id || !contato_id || !data_hora || !local) {
      return res.status(400).json({ error: 'Campos indicador_id, contato_id, data_hora e local são obrigatórios.' });
    }

    const info = db.prepare(`
      INSERT INTO reunioes (indicador_id, contato_id, data_hora, local, status, observacao)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(indicador_id, contato_id, data_hora, local, status || 'Agendada', observacao || '');

    const m1 = db.prepare('SELECT nome FROM members WHERE id = ?').get(indicador_id);
    const m2 = db.prepare('SELECT nome FROM members WHERE id = ?').get(contato_id);

    const edgeLabel = `Reunião/Indicação: ${m1 ? m1.nome : indicador_id} ➔ ${m2 ? m2.nome : contato_id} (${local})`;

    db.prepare('INSERT INTO graph_edges (source, target, tipo, label) VALUES (?, ?, ?, ?)').run(
      indicador_id,
      contato_id,
      'reuniao',
      edgeLabel
    );

    res.json({ message: 'Reunião/Indicação registrada com sucesso!', id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reunioes/:id
app.delete('/api/reunioes/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM reunioes WHERE id = ?').run(id);
    res.json({ message: 'Registro de reunião removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/graph
app.get('/api/graph', (req, res) => {
  try {
    const verticais = db.prepare('SELECT * FROM verticais').all();
    const members = db.prepare('SELECT id, nome, empresa, vertical, fit FROM members').all();
    const publicos = db.prepare('SELECT * FROM publicos').all();
    const edges = db.prepare('SELECT * FROM graph_edges').all();

    const nodes = [
      { data: { id: 'keycore', label: 'KeyCore Tech Hub', level: 0, type: 'root' } },
      ...verticais.map(v => ({ data: { id: v.id, label: v.nome, level: 1, type: 'vertical', color: v.cor } })),
      ...members.map(m => ({ data: { id: m.id, label: m.nome, parent: m.vertical, level: 2, type: 'member', fit: m.fit } })),
      ...publicos.map(p => ({ data: { id: p.id, label: p.nome, level: 3, type: 'publico' } }))
    ];

    const formattedEdges = edges.map(e => ({
      data: { id: `e_${e.id}`, source: e.source, target: e.target, label: e.label, tipo: e.tipo }
    }));

    res.json({ nodes, edges: formattedEdges });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/fit
app.get('/api/fit', (req, res) => {
  try {
    const members = db.prepare('SELECT id, nome, empresa, especialidade, vertical, fit, fit_score, gargalo, oferta FROM members ORDER BY fit_score DESC').all();

    const altoCount = members.filter(m => m.fit === 'Alto' || m.fit === 'Excepcional').length;
    const medioCount = members.filter(m => m.fit === 'Médio').length;

    const totalScore = members.reduce((sum, m) => sum + (m.fit_score || 0), 0);
    const avgScore = members.length > 0 ? Math.round(totalScore / members.length) : 0;

    const fitSummary = {
      totalMembers: members.length,
      altoCount,
      medioCount,
      avgScore,
      pipeline: members.map(m => ({
        id: m.id,
        nome: m.nome,
        empresa: m.empresa,
        especialidade: m.especialidade,
        vertical: m.vertical,
        gargalo: m.gargalo,
        oferta: m.oferta,
        fit: m.fit,
        fit_score: m.fit_score
      }))
    };

    res.json(fitSummary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/fit/calculate
app.post('/api/fit/calculate', (req, res) => {
  try {
    const { member1Id, member2Id, customGoal } = req.body;

    const m1 = member1Id ? db.prepare('SELECT * FROM members WHERE id = ?').get(member1Id) : null;
    const m2 = member2Id ? db.prepare('SELECT * FROM members WHERE id = ?').get(member2Id) : null;

    let score = 85;
    let synergies = [];
    let jointOffer = "";

    if (m1 && m2) {
      if (m1.vertical === m2.vertical) {
        score = 92;
        synergies.push(`Mesma vertical (${m1.vertical}): alta complementaridade de carteira e serviços cruzados.`);
      } else {
        score = 88;
        synergies.push(`Verticais distintas (${m1.vertical} + ${m2.vertical}): oportunidade de indicação bilateral de clientes.`);
      }
      jointOffer = `Pacote Integrado: ${m1.empresa} (${m1.especialidade}) + ${m2.empresa} (${m2.especialidade}). Solução completa com automação KeyCore.`;
    } else if (m1) {
      jointOffer = `Diagnóstico de automação para ${m1.empresa}: ${m1.oferta}`;
      synergies.push(`Resolução do gargalo: "${m1.gargalo}"`);
    } else {
      score = 75;
      jointOffer = "Análise genérica de fit comercial e potencial de automação operacional com a KeyCore.";
      synergies.push("Geração de valor através do método Givers Gain® e agentes autônomos.");
    }

    if (customGoal) {
      synergies.push(`Meta específica analisada: "${customGoal}"`);
    }

    res.json({
      score,
      member1: m1 ? { id: m1.id, nome: m1.nome, empresa: m1.empresa } : null,
      member2: m2 ? { id: m2.id, nome: m2.nome, empresa: m2.empresa } : null,
      jointOffer,
      synergies
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/grupo
app.get('/api/grupo', (req, res) => {
  try {
    const valores = [
      { id: 1, num: 1, titulo: 'Givers Gain® (Dar para Ganhar)', descricao: 'Contribuir e ajudar outros empresários sem esperar recompensa imediata.' },
      { id: 2, num: 2, titulo: 'Construção de Relacionamentos', descricao: 'Encontros semanais e conversas 1-2-1 favorecem laços sólidos de confiança.' },
      { id: 3, num: 3, titulo: 'Aprendizado Contínuo', descricao: 'Capacitação constante sobre técnicas de networking e áreas dos colegas.' },
      { id: 4, num: 4, titulo: 'Tradição e Inovação', descricao: '41 anos de metodologia comprovada com constante evolução tecnológica.' },
      { id: 5, num: 5, titulo: 'Atitude Positiva', descricao: 'Entusiasmo e postura construtiva em todas as reuniões e contatos.' },
      { id: 6, num: 6, titulo: 'Responsabilidade & Prestação de Contas', descricao: 'Acompanhamento rigoroso de presença, indicações e negócios fechados.' },
      { id: 7, num: 7, titulo: 'Reconhecimento', descricao: 'Celebração pública das conquistas e contribuições de cada integrante.' }
    ];

    const vcr = [
      { fase: 'Visibilidade', desc: 'Ser visto e conhecido pelos demais membros nas reuniões e pitches.' },
      { fase: 'Credibilidade', desc: 'Demonstrar competência técnica e cumprir compromissos assiduamente.' },
      { fase: 'Rentabilidade', desc: 'Passo natural onde as indicações qualificadas se convertem em faturamento real.' }
    ];

    const passos = [
      { id: 1, num: 1, titulo: 'Networking Livre & Conexão Inicial', descricao: 'Recepção dos membros e visitantes com café e troca informal de contatos.' },
      { id: 2, num: 2, titulo: 'Abertura Oficial & Apresentação do BNI', descricao: 'Propósito da reunião, filosofia Givers Gain® e boas-vindas da presidência.' },
      { id: 3, num: 3, titulo: 'Pitches Semanal dos Membros (30-60s)', descricao: 'Cada integrante apresenta seu negócio e solicita o perfil exato de cliente desejado.' },
      { id: 4, num: 4, titulo: 'Apresentação Principal da Semana (10 min)', descricao: 'Destaque aprofundado do portfólio de um membro da equipe.' },
      { id: 5, num: 5, titulo: 'Passagem de Referências & Obrigado por Negócio Fechado (OBNF)', descricao: 'Momento auge onde os membros entregam indicações e reportam faturamento gerado.' },
      { id: 6, num: 6, titulo: 'Anúncios, Orientação de Visitantes e Encerramento', descricao: 'Fechamento com orientações aos convidados e próximos passos.' }
    ];

    const estrutura = [
      { id: 'pres', cargo: 'Presidente', descricao: 'Lidera as reuniões semanais, coordena o comitê executivo e garante o padrão metodológico.', responsavel: 'Presidência' },
      { id: 'vice', cargo: 'Vice-Presidente', descricao: 'Gerencia o comitê de membros, acompanha frequência e contabiliza referências e OBNF.', responsavel: 'Vice-Presidência' },
      { id: 'secr', cargo: 'Secretário-Tesoureiro', descricao: 'Administra as finanças da equipe, mensalidades do local e relatórios administrativos.', responsavel: 'Secretaria' },
      { id: 'anfitria', cargo: 'Anfitriões de Visitantes', descricao: 'Recepcionam convidados no café da manhã e orientam empresários visitantes.', responsavel: 'Recepção & Hospedagem' },
      { id: 'educ', cargo: 'Coordenador de Educação', descricao: 'Ministra pílulas educativas de networking profissional no início das reuniões.', responsavel: 'Capacitação' },
      { id: 'eventos', cargo: 'Coordenador de Eventos', descricao: 'Organiza rodadas externas de negócios, jantares festivos e 1-2-1s coletivos.', responsavel: 'Integração' }
    ];

    res.json({ valores, vcr, passos, estrutura });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback to SPA for any non-API routes
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
