const db = require('./db');

function seedData() {
  db.exec('DROP TABLE IF EXISTS member_redes');
  db.exec('DROP TABLE IF EXISTS membro_publico');
  db.exec('DROP TABLE IF EXISTS graph_edges');
  db.exec('DROP TABLE IF EXISTS members');
  db.exec('DROP TABLE IF EXISTS verticais');
  db.exec('DROP TABLE IF EXISTS equipes');
  db.exec('DROP TABLE IF EXISTS meta');
  db.exec('DROP TABLE IF EXISTS publicos');

  db.exec(`
    CREATE TABLE meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE verticais (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      cor TEXT NOT NULL,
      descricao TEXT,
      cadeiras INTEGER DEFAULT 0
    );

    CREATE TABLE equipes (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      pontos INTEGER NOT NULL,
      cor TEXT
    );

    CREATE TABLE members (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      empresa TEXT,
      especialidade TEXT,
      vertical TEXT,
      papel TEXT DEFAULT 'Membro',
      pitch TEXT,
      origem TEXT,
      fonte TEXT,
      fit TEXT DEFAULT 'Médio',
      fit_score INTEGER DEFAULT 75,
      gargalo TEXT,
      oferta TEXT,
      nat TEXT DEFAULT 'membro',
      equipe TEXT DEFAULT 'lobo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE member_redes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id TEXT NOT NULL,
      tipo TEXT NOT NULL,
      handle TEXT NOT NULL,
      FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
    );

    CREATE TABLE publicos (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      desc TEXT
    );

    CREATE TABLE membro_publico (
      member_id TEXT NOT NULL,
      publico_id TEXT NOT NULL,
      PRIMARY KEY (member_id, publico_id),
      FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
    );

    CREATE TABLE graph_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      target TEXT NOT NULL,
      tipo TEXT NOT NULL,
      label TEXT
    );
  `);

  // Meta info
  const insertMeta = db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)');
  insertMeta.run('grupo', 'BNI JUNTOS');
  insertMeta.run('fase', 'Em formação — 12ª reunião');
  insertMeta.run('local', 'Recife / PE');
  insertMeta.run('integrantes_atuais', '14');
  insertMeta.run('candidatos_em_avaliacao', '2');
  insertMeta.run('meta_cadeiras', '20');
  insertMeta.run('regra_escala', 'Até 12 integrantes não há reunião semanal regular; a partir daí, os encontros passam a ser toda semana.');

  // Verticais
  const insertVertical = db.prepare('INSERT INTO verticais (id, nome, cor, descricao, cadeiras) VALUES (?, ?, ?, ?, ?)');
  insertVertical.run('juridico', 'Jurídico & Compliance', 'blue', 'Direito previdenciário, bancário, saúde, trabalhista e compliance contratual.', 4);
  insertVertical.run('contabil', 'Contábil & Financeiro', 'emerald', 'Contabilidade consultiva, perícia financeira e gestão BPO.', 3);
  insertVertical.run('marketing', 'Marketing, RH & Treinamento', 'violet', 'Posicionamento digital, tráfego pago, treinamento comercial e gestão comportamental.', 4);
  insertVertical.run('saude_sst', 'Saúde, Ergonomia & Seguros', 'amber', 'Saúde ocupacional, prevenção de passivos, seguros de vida e planejamento financeiro.', 2);
  insertVertical.run('engenharia', 'Engenharia, Arquitetura & Energia', 'cyan', 'Projetos de arquitetura, interiores, engenharia elétrica e energia solar.', 2);
  insertVertical.run('keycore', 'KeyCore Tech Hub', 'purple', 'Automação de processos, inteligência artificial, plataformas web e integração de sistemas.', 1);

  // Equipes
  const insertEquipe = db.prepare('INSERT INTO equipes (id, nome, pontos, cor) VALUES (?, ?, ?, ?)');
  insertEquipe.run('lobo', 'Equipe Lobo', 640, '#2563eb');
  insertEquipe.run('aguia', 'Equipe Águia', 445, '#059669');

  // Members
  const insertMember = db.prepare(`
    INSERT INTO members (id, nome, empresa, especialidade, vertical, papel, pitch, fit, fit_score, gargalo, oferta, equipe)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const membersList = [
    {
      id: 'marina',
      nome: 'Marina',
      empresa: 'Advocacia Previdenciária',
      especialidade: 'Direito Previdenciário',
      vertical: 'juridico',
      papel: 'Membro',
      pitch: 'Atendo aposentadorias, revisões de benefícios e planejamento previdenciário para servidores e celetistas.',
      fit: 'Excepcional',
      fit_score: 92,
      gargalo: 'Triagem manual de documentos de aposentadoria e cálculo de tempo de contribuição.',
      oferta: 'Automação de triagem documental via IA (OCR + análise de extrato CNIS).',
      equipe: 'lobo'
    },
    {
      id: 'lucas',
      nome: 'Lucas',
      empresa: 'Advocacia Bancária',
      especialidade: 'Direito Bancário & Defesa de Endividados',
      vertical: 'juridico',
      papel: 'Membro',
      pitch: 'Revisão de contratos bancários, juros abusivos e renegociação judicial de dívidas corporativas e pessoais.',
      fit: 'Alto',
      fit_score: 88,
      gargalo: 'Análise de cláusulas e cálculo de juros abusivos em contratos extensos.',
      oferta: 'Agente IA especialista em leitura de contratos bancários e extratos de cobrança.',
      equipe: 'aguia'
    },
    {
      id: 'adelaide',
      nome: 'Adelaide',
      empresa: 'Advocacia Saúde & Consumidor',
      especialidade: 'Direito à Saúde & Planos de Saúde',
      vertical: 'juridico',
      papel: 'Membro',
      pitch: 'Liminares contra negativas de planos de saúde, cobertura de medicamentos de alto custo e cirurgias.',
      fit: 'Alto',
      fit_score: 90,
      gargalo: 'Acompanhamento do status de liminares urgentes e atendimento emergencial a clientes.',
      oferta: 'Chatbot via WhatsApp para onboarding emergencial de pacientes e acompanhamento de relatórios médicos.',
      equipe: 'lobo'
    },
    {
      id: 'tatiana',
      nome: 'Tatiana',
      empresa: 'Advocacia Trabalhista',
      especialidade: 'Direito Trabalhista Empresarial',
      vertical: 'juridico',
      papel: 'Membro',
      pitch: 'Defesa de empresas em reclamações trabalhistas e auditoria preventiva de rotinas de RH.',
      fit: 'Alto',
      fit_score: 85,
      gargalo: 'Coleta de provas, cartões de ponto e documentos para audiências trabalhistas.',
      oferta: 'Painel de auditoria compliance de RH com alertas preditivos de passivo trabalhista.',
      equipe: 'aguia'
    },
    {
      id: 'rodrigo',
      nome: 'Rodrigo',
      empresa: 'BPO Financeiro',
      especialidade: 'Gestão Financeira Terceirizada',
      vertical: 'contabil',
      papel: 'Membro',
      pitch: 'Assumo a rotina financeira de PMEs: contas a pagar, receber, conciliação e relatórios de fluxo de caixa.',
      fit: 'Excepcional',
      fit_score: 95,
      gargalo: 'Input manual de comprovantes e conciliação bancária de dezenas de clientes.',
      oferta: 'Integração de conciliação bancária automática com extração inteligente de notas fiscais.',
      equipe: 'lobo'
    },
    {
      id: 'pedro',
      nome: 'Pedro',
      empresa: 'Contabilidade Consultiva',
      especialidade: 'Planejamento Tributário & DRE',
      vertical: 'contabil',
      papel: 'Membro',
      pitch: 'Redução legal de impostos para empresas do Simples, Lucro Presumido e Lucro Real.',
      fit: 'Alto',
      fit_score: 91,
      gargalo: 'Coleta de movimentação financeira dos clientes no fechamento mensal.',
      oferta: 'Portal do Cliente automatizado para envio e validação mensal de impostos.',
      equipe: 'aguia'
    },
    {
      id: 'diego',
      nome: 'Diego',
      empresa: 'Perícia Contábil',
      especialidade: 'Perícia Financeira & Avaliação de Empresas',
      vertical: 'contabil',
      papel: 'Membro',
      pitch: 'Laudos periciais para disputas judiciais, apuração de haveres e valuation de empresas.',
      fit: 'Alto',
      fit_score: 87,
      gargalo: 'Organização de grandes volumes de planilhas financeiras desconexas.',
      oferta: 'Pipeline de data analytics para unificação de balancetes e geração automatizada de relatórios periciais.',
      equipe: 'lobo'
    },
    {
      id: 'debora',
      nome: 'Débora / Ponto de Vista',
      empresa: 'Ponto de Vista Arquitetura',
      especialidade: 'Arquitetura Comercial & Interiores',
      vertical: 'engenharia',
      papel: 'Membro',
      pitch: 'Projetos arquitetônicos para escritórios, clínicas e residências de alto padrão focados em experiência.',
      fit: 'Alto',
      fit_score: 84,
      gargalo: 'Gestão de cronograma de fornecedores e especificação de materiais com clientes.',
      oferta: 'Dashboard interativo de acompanhamento de obras e aprovação de moodboards com clientes.',
      equipe: 'lobo'
    },
    {
      id: 'henrique',
      nome: 'Henrique Dantas',
      empresa: 'Funil de Vendas',
      especialidade: 'Treinamento Comercial & Processos de Vendas',
      vertical: 'marketing',
      papel: 'Membro',
      pitch: 'Estruturo equipes de vendas e rotinas comerciais para aumentar a conversão de leads.',
      fit: 'Excepcional',
      fit_score: 94,
      gargalo: 'Falta de CRM estruturado e acompanhamento de follow-ups dos vendedores.',
      oferta: 'Automação de funil de CRM via WhatsApp com relatórios de performance comercial por vendedor.',
      equipe: 'aguia'
    },
    {
      id: 'luiz',
      nome: 'Luiz',
      empresa: 'Colisio Posicionamento',
      especialidade: 'Branding & Posicionamento Digital',
      vertical: 'marketing',
      papel: 'Membro',
      pitch: 'Transformo marcas tradicionais em autoridades digitais desejadas no mercado.',
      fit: 'Alto',
      fit_score: 86,
      gargalo: 'Aprovação de conteúdos e métricas de engajamento dispersas em relatórios manuais.',
      oferta: 'Painel unificado de aprovação de peças e geração de métricas de marca.',
      equipe: 'lobo'
    },
    {
      id: 'danilo',
      nome: 'Danilo',
      empresa: 'Tráfego Pago & Performance',
      especialidade: 'Meta Ads & Google Ads',
      vertical: 'marketing',
      papel: 'Membro',
      pitch: 'Campanhas de tráfego pago focadas em geração de leads qualificados para B2B e serviços nobres.',
      fit: 'Excepcional',
      fit_score: 96,
      gargalo: 'Qualificação inicial de leads que chegam dos anúncios.',
      oferta: 'Agente de qualificação prévia via WhatsApp que direciona leads quentes para o vendedor.',
      equipe: 'aguia'
    },
    {
      id: 'raoni',
      nome: 'Raoni Camilo',
      empresa: 'Estratégia Comportamental',
      especialidade: 'Perfil Comportamental & Gestão de Pessoas',
      vertical: 'marketing',
      papel: 'Membro',
      pitch: 'Mapeamento de perfil DISC e desenvolvimento de liderança para reduzir rotatividade de equipes.',
      fit: 'Alto',
      fit_score: 89,
      gargalo: 'Aplicação e correção manual de questionários comportamentais.',
      oferta: 'Plataforma web automatizada para envio de questionários DISC com geração instantânea de relatórios.',
      equipe: 'lobo'
    },
    {
      id: 'felipe',
      nome: 'Felipe Gomes',
      empresa: 'Prudential Seguros',
      especialidade: 'Seguro de Vida & Proteção Financeira',
      vertical: 'saude_sst',
      papel: 'Membro',
      pitch: 'Planejamento de proteção patrimonial e sucessória para empresários e famílias.',
      fit: 'Médio',
      fit_score: 83,
      gargalo: 'Agendamento de reuniões de diagnóstico financeiro familiar.',
      oferta: 'Calculadora web de necessidade de proteção financeira com agendamento direto na agenda.',
      equipe: 'aguia'
    },
    {
      id: 'andressa',
      nome: 'Andressa',
      empresa: 'Ergonomia Multidisciplinar',
      especialidade: 'SST, Ergonomia & Laudos NR-17',
      vertical: 'saude_sst',
      papel: 'Membro',
      pitch: 'Adequação ergonômica de empresas para prevenção de lesões operacionais e multas fiscais.',
      fit: 'Alto',
      fit_score: 90,
      gargalo: 'Coleta presencial de dados e elaboração de laudos analíticos extensos.',
      oferta: 'App mobile de checklists para inspeção ergonômica com geração rápida de laudos em PDF.',
      equipe: 'lobo'
    },
    {
      id: 'bruno',
      nome: 'Bruno',
      empresa: 'Energia Solar & Sustentabilidade',
      especialidade: 'Energia Fotovoltaica & Eficiência',
      vertical: 'engenharia',
      papel: 'Membro',
      pitch: 'Projetos e instalação de energia solar para indústrias, comércios e residências.',
      fit: 'Alto',
      fit_score: 88,
      gargalo: 'Simulação rápida de payback e economia na conta de luz para propostas comerciais.',
      oferta: 'Calculadora de proposta de energia solar com estimativa de payback imediata via WhatsApp.',
      equipe: 'aguia'
    },
    {
      id: 'keycore',
      nome: 'KeyCore Tech Hub',
      empresa: 'KeyCore Tech Hub',
      especialidade: 'Automação de Processos & Inteligência Artificial',
      vertical: 'keycore',
      papel: 'Hub Parceiro',
      pitch: 'Desenvolvemos plataformas web, automações de processos e agentes de IA que devolvem tempo para as empresas.',
      fit: 'Excepcional',
      fit_score: 100,
      gargalo: 'Prospecção manual de clientes corporativos com gargalos operacionais.',
      oferta: 'Plataforma parceira BNI para mapeamento de gargalos e geração de sinergias em tempo real.',
      equipe: 'lobo'
    }
  ];

  for (const m of membersList) {
    insertMember.run(
      m.id, m.nome, m.empresa, m.especialidade, m.vertical,
      m.papel, m.pitch, m.fit, m.fit_score, m.gargalo, m.oferta, m.equipe
    );
  }

  // Redes
  const insertRede = db.prepare('INSERT INTO member_redes (member_id, tipo, handle) VALUES (?, ?, ?)');
  for (const m of membersList) {
    insertRede.run(m.id, 'LinkedIn', `linkedin.com/in/${m.id}`);
    insertRede.run(m.id, 'Site', `${m.id}.com.br`);
  }

  // Graph Edges
  const insertEdge = db.prepare('INSERT INTO graph_edges (source, target, tipo, label) VALUES (?, ?, ?, ?)');
  for (const m of membersList) {
    if (m.id !== 'keycore') {
      insertEdge.run('keycore', m.id, 'oferta', `Automação KeyCore para ${m.empresa}`);
      insertEdge.run(m.id, m.vertical, 'vertical', `Vertical ${m.vertical}`);
    }
  }

  insertEdge.run('marina', 'lucas', 'sinergia', 'Previdenciário + Bancário');
  insertEdge.run('debora', 'bruno', 'sinergia', 'Arquitetura + Energia Solar');
  insertEdge.run('henrique', 'danilo', 'sinergia', 'Treinamento de Vendas + Tráfego Pago');
  insertEdge.run('rodrigo', 'pedro', 'sinergia', 'BPO Financeiro + Contabilidade');
  insertEdge.run('andressa', 'tatiana', 'sinergia', 'Ergonomia/SST + Trabalhista');

  console.log('Database seeded and schema synchronized!');
}

seedData();
