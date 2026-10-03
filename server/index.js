const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

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

    res.json({
      meta: metaObj,
      equipes,
      verticais,
      totalMembers
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
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY fit_score DESC, nome ASC';

    const members = db.prepare(query).all(...params);

    const fullMembers = members.map(m => {
      const redes = db.prepare('SELECT tipo, handle FROM member_redes WHERE member_id = ?').all(m.id);
      const publicos = db.prepare(`
        SELECT p.id, p.nome, p.desc 
        FROM publicos p
        JOIN membro_publico mp ON mp.publico_id = p.id
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
      SELECT p.id, p.nome, p.desc 
      FROM publicos p
      JOIN membro_publico mp ON mp.publico_id = p.id
      WHERE mp.member_id = ?
    `).all(id);

    const connections = db.prepare('SELECT * FROM graph_edges WHERE source = ? OR target = ?').all(id, id);

    res.json({
      ...member,
      redes,
      publicos,
      connections
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/members
app.post('/api/members', (req, res) => {
  try {
    const {
      id, nome, empresa, especialidade, vertical, papel, pitch,
      origem, fonte, fit, fit_score, gargalo, oferta, nat, equipe, redes, publicos
    } = req.body;

    const memberId = id || nome.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const stmt = db.prepare(`
      INSERT INTO members (
        id, nome, empresa, especialidade, vertical, papel, pitch, origem, fonte, fit, fit_score, gargalo, oferta, nat, equipe
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      memberId, nome, empresa, especialidade, vertical || 'marketing',
      papel || 'Membro', pitch || '', origem || 'Interface Web', fonte || 'Manual',
      fit || 'Médio', fit_score || 80, gargalo || '', oferta || '', nat || 'membro', equipe || 'Lobo'
    );

    if (Array.isArray(redes)) {
      const stmtRede = db.prepare('INSERT INTO member_redes (member_id, tipo, handle) VALUES (?, ?, ?)');
      for (const r of redes) {
        if (r.tipo && r.handle) stmtRede.run(memberId, r.tipo, r.handle);
      }
    }

    if (Array.isArray(publicos)) {
      const stmtPub = db.prepare('INSERT INTO membro_publico (member_id, publico_id) VALUES (?, ?)');
      for (const pId of publicos) {
        stmtPub.run(memberId, pId);
      }
    }

    res.status(201).json({ id: memberId, message: 'Membro criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/members/:id
app.put('/api/members/:id', (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome, empresa, especialidade, vertical, papel, pitch,
      fit, fit_score, gargalo, oferta, equipe
    } = req.body;

    const stmt = db.prepare(`
      UPDATE members SET
        nome = COALESCE(?, nome),
        empresa = COALESCE(?, empresa),
        especialidade = COALESCE(?, especialidade),
        vertical = COALESCE(?, vertical),
        papel = COALESCE(?, papel),
        pitch = COALESCE(?, pitch),
        fit = COALESCE(?, fit),
        fit_score = COALESCE(?, fit_score),
        gargalo = COALESCE(?, gargalo),
        oferta = COALESCE(?, oferta),
        equipe = COALESCE(?, equipe)
      WHERE id = ?
    `);

    stmt.run(
      nome, empresa, especialidade, vertical, papel, pitch,
      fit, fit_score, gargalo, oferta, equipe, id
    );

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
    const verticais = db.prepare('SELECT * FROM verticais').all();

    const fitSummary = {
      altoCount: members.filter(m => m.fit === 'Alto' || m.fit === 'Excepcional').length,
      medioCount: members.filter(m => m.fit === 'Médio').length,
      baixoCount: members.filter(m => m.fit === 'Baixo').length,
      avgScore: Math.round(members.reduce((sum, m) => sum + m.fit_score, 0) / (members.length || 1)),
      pipeline: members.map(m => ({
        id: m.id,
        nome: m.nome,
        empresa: m.empresa,
        especialidade: m.especialidade,
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
      synergies,
      jointOffer
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/grupo
app.get('/api/grupo', (req, res) => {
  try {
    const valores = db.prepare('SELECT * FROM grupo_valores ORDER BY num ASC').all();
    const passos = db.prepare('SELECT * FROM grupo_passos ORDER BY num ASC').all();
    const estrutura = db.prepare('SELECT * FROM grupo_estrutura').all();
    const equipes = db.prepare('SELECT * FROM equipes').all();

    res.json({
      origem: {
        fundador: "Dr. Ivan Misner",
        ano: 1985,
        historia: "Há 41 anos, após perder seu principal cliente de consultoria, o Dr. Ivan Misner reuniu amigos empresários em um jantar para trocar indicações de negócios. Ali nasceu o BNI."
      },
      vcr: [
        { fase: "Visibilidade", desc: "Aparecer semanalmente nas reuniões e apresentar seu negócio com clareza." },
        { fase: "Credibilidade", desc: "Demonstrar pontualidade, ética e entregar resultados excelentes para os clientes indicados." },
        { fase: "Rentabilidade", desc: "Colher referências de alto valor e negócios fechados de forma contínua." }
      ],
      valores,
      passos,
      estrutura,
      equipes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve Static React Build
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback for HTML routes & SPA paths
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) {
        res.sendFile(path.join(__dirname, '../index.html'));
      }
    });
  } else {
    next();
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`BNI KeyCore Dashboard Server running on http://0.0.0.0:${PORT}`);
});
