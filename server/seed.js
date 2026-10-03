const db = require('./db');

function seedData() {
  db.exec('DELETE FROM member_redes');
  db.exec('DELETE FROM membro_publico');
  db.exec('DELETE FROM members');
  db.exec('DELETE FROM verticais');
  db.exec('DELETE FROM equipes');
  db.exec('DELETE FROM publicos');
  db.exec('DELETE FROM graph_edges');
  db.exec('DELETE FROM grupo_valores');
  db.exec('DELETE FROM grupo_passos');
  db.exec('DELETE FROM grupo_estrutura');
  db.exec('DELETE FROM meta');

  // 1. Meta
  const insertMeta = db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)');
  insertMeta.run('grupo', 'BNI JUNTOS');
  insertMeta.run('fase', 'Em formação — 12ª reunião');
  insertMeta.run('local', 'Recife / PE');
  insertMeta.run('integrantes_atuais', '14');
  insertMeta.run('candidatos_em_avaliacao', '2');
  insertMeta.run('meta_cadeiras', '20');
  insertMeta.run('regra_escala', 'Até 12 integrantes não há reunião semanal regular; a partir daí, os encontros passam a ser toda semana.');

  // 2. Verticais
  const insertVertical = db.prepare('INSERT INTO verticais (id, nome, cor, descricao, cadeiras) VALUES (?, ?, ?, ?, ?)');
  insertVertical.run('juridico', 'Jurídico & Compliance', 'blue', 'Direito previdenciário, bancário, saúde, trabalhista e compliance contratual.', 4);
  insertVertical.run('contabil', 'Contábil, BPO & Finanças', 'emerald', 'BPO financeiro, contabilidade consultiva e perícia contábil.', 3);
  insertVertical.run('marketing', 'Marketing, Vendas & Digital', 'violet', 'Treinamento comercial, tráfego pago, posicionamento digital e diagnósticos comportamentais.', 4);
  insertVertical.run('saude_sst', 'Saúde, SST & Bem-Estar', 'amber', 'Planejamento financeiro, seguro de vida, ergonomia e SST.', 2);
  insertVertical.run('engenharia', 'Engenharia, Arquitetura & Imóveis', 'cyan', 'Arquitetura corporativa, projetos executivos e energia solar.', 3);

  // 3. Equipes
  const insertEquipe = db.prepare('INSERT INTO equipes (id, nome, pontos, cor) VALUES (?, ?, ?, ?)');
  insertEquipe.run('lobo', 'Equipe Lobo', 640, '#2563eb');
  insertEquipe.run('aguia', 'Equipe Águia', 445, '#059669');

  // 4. Públicos Alvo
  const insertPublico = db.prepare('INSERT INTO publicos (id, nome, desc) VALUES (?, ?, ?)');
  insertPublico.run('P1', 'PMEs e empresas locais', 'Público comum de contábil, BPO e consultoria de gestão.');
  insertPublico.run('P2', 'Famílias e pessoas físicas', 'Seguro de vida, plano de saúde e previdenciário.');
  insertPublico.run('P3', 'Empresas com risco ocupacional', 'SST, NR-1, ergonomia e riscos psicossociais.');
  insertPublico.run('P4', 'Construtoras e reformas', 'Arquitetura, obra e energia solar em conjunto.');
  insertPublico.run('P5', 'Empresas com demanda digital', 'Tráfego pago, posicionamento e conversão comercial.');
  insertPublico.run('P6', 'Consumidores com relação de consumo', 'Saúde, bancário e revisão contratual.');

  // 5. Members
  const insertMember = db.prepare(`
    INSERT INTO members (
      id, nome, empresa, especialidade, vertical, papel, pitch, origem, fonte, fit, fit_score, gargalo, oferta, nat, equipe
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertRede = db.prepare('INSERT INTO member_redes (member_id, tipo, handle) VALUES (?, ?, ?)');
  const insertMembroPublico = db.prepare('INSERT INTO membro_publico (member_id, publico_id) VALUES (?, ?)');

  const membersData = [
    {
      id: "marina",
      nome: "Marina",
      empresa: "Advocacia Previdenciária",
      especialidade: "Direito Previdenciário",
      vertical: "juridico",
      papel: "Membro",
      pitch: "Soluções em planejamento previdenciário, concessão e revisão de aposentadorias e benefícios do INSS.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Médio",
      fit_score: 75,
      gargalo: "Triagem manual de documentos previdenciários e prazos de exigência do INSS.",
      oferta: "Automação de triagem documental com IA e extração de CNIS em segundos.",
      nat: "membro",
      equipe: "Lobo",
      publicos: ["P2"],
      redes: [{ tipo: "LinkedIn", handle: "advocacia-previdenciaria-marina" }]
    },
    {
      id: "lucas",
      nome: "Lucas",
      empresa: "Advocacia Bancária",
      especialidade: "Direito Bancário",
      vertical: "juridico",
      papel: "Membro",
      pitch: "Defesa de empresas e pessoas físicas contra cobranças abusivas, juros extorsivos e contratos bancários irregulares.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Médio",
      fit_score: 80,
      gargalo: "Cálculo pericial de juros compostos em contratos bancários extenso.",
      oferta: "Engine de cálculo pericial e geração de pareceres revisionais via IA.",
      nat: "membro",
      equipe: "Águia",
      publicos: ["P2", "P6"],
      redes: [{ tipo: "Site", handle: "lucasadvocaciabancaria.com.br" }]
    },
    {
      id: "adelaide",
      nome: "Adelaide",
      empresa: "Advocacia Saúde e Consumidor",
      especialidade: "Direito à Saúde e Consumidor",
      vertical: "juridico",
      papel: "Membro",
      pitch: "Garantia de direitos de pacientes perante planos de saúde (negativa de cirurgias, medicamentos de alto custo e home care).",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Alto",
      fit_score: 88,
      gargalo: "Acompanhamento de liminares urgentes e negativas de operadoras de saúde.",
      oferta: "Painel de monitoramento de liminares de saúde e alertas de cumprimento.",
      nat: "membro",
      equipe: "Lobo",
      publicos: ["P6"],
      redes: [{ tipo: "Instagram", handle: "@adelaide.advsaude" }]
    },
    {
      id: "tatiana",
      nome: "Tatiana",
      empresa: "Advocacia Trabalhista",
      especialidade: "Direito do Trabalho e Compliance Trabalhista",
      vertical: "juridico",
      papel: "Membro",
      pitch: "Consultoria preventiva e contencioso trabalhista para empresas evitarem passivos jurídicos recorrentes.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Alto",
      fit_score: 90,
      gargalo: "Gestão manual de evidências de horas extras e rotinas de PMEs.",
      oferta: "Auditoria preventiva de passivo trabalhista com agentes autônomos KeyCore.",
      nat: "membro",
      equipe: "Águia",
      publicos: ["P1", "P3"],
      redes: [{ tipo: "LinkedIn", handle: "tatiana-trabalhista" }]
    },
    {
      id: "rodrigo",
      nome: "Rodrigo",
      empresa: "BPO Financeiro",
      especialidade: "Gestão Financeira Terceirizada",
      vertical: "contabil",
      papel: "Membro",
      pitch: "Terceirização completa de contas a pagar, contas a receber, conciliação bancária e emissão de notas para PMEs.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Alto",
      fit_score: 95,
      gargalo: "Conferência manual de centenas de comprovantes de PIX/boletos diários.",
      oferta: "Pipeline OCR de comprovantes com conciliação bancária 100% automatizada.",
      nat: "membro",
      equipe: "Lobo",
      publicos: ["P1"],
      redes: [{ tipo: "Site", handle: "bpofinanceirorodrigo.com.br" }]
    },
    {
      id: "pedro",
      nome: "Pedro",
      empresa: "Contabilidade Consultiva",
      especialidade: "Contabilidade Estratégica & Planejamento Tributário",
      vertical: "contabil",
      papel: "Membro",
      pitch: "Contabilidade estratégica para PMEs reduzirem impostos legalmente e organizarem seu fluxo de caixa.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Alto",
      fit_score: 92,
      gargalo: "Coleta descentralizada de extratos e notas fiscais dos clientes todo mês.",
      oferta: "Bot WhatsApp de coleta automatizada de documentos mensais dos clientes.",
      nat: "membro",
      equipe: "Lobo",
      publicos: ["P1"],
      redes: [{ tipo: "LinkedIn", handle: "pedro-contabilidade" }]
    },
    {
      id: "diego",
      nome: "Diego",
      empresa: "Perícia Contábil",
      especialidade: "Perícia Financeira & Avaliação de Empresas",
      vertical: "contabil",
      papel: "Membro",
      pitch: "Laudos periciais contábeis para disputas judiciais, apuração de haveres e avaliação patrimonial.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Médio",
      fit_score: 82,
      gargalo: "Análise manual de livros diários e balancetes antigos em PDF escaneado.",
      oferta: "Extrator estruturado de demonstrativos contábeis legados com IA.",
      nat: "membro",
      equipe: "Águia",
      publicos: ["P1"],
      redes: []
    },
    {
      id: "debora",
      nome: "Débora",
      empresa: "Ponto de Vista Arquitetura",
      especialidade: "Arquitetura Corporativa e Comercial",
      vertical: "engenharia",
      papel: "Membro",
      pitch: "Arquitetura, interiores e reformas para espaços corporativos, comerciais e residenciais com projetos viáveis.",
      origem: "Transcrição — pitch semanal",
      fonte: "pontodevistaarquitetura.com",
      fit: "Médio",
      fit_score: 84,
      gargalo: "Diário de obra e acompanhamento de fornecedores de forma fragmentada no WhatsApp.",
      oferta: "Portal mobile de diário de obra com checkpoints e evidências fotográficas.",
      nat: "membro",
      equipe: "Lobo",
      publicos: ["P4"],
      redes: [
        { tipo: "Site", handle: "pontodevistaarquitetura.com" },
        { tipo: "LinkedIn", handle: "company/pontodevista-arquitetura" }
      ]
    },
    {
      id: "henrique",
      nome: "Henrique Dantas",
      empresa: "Funil de Vendas",
      especialidade: "Treinamento e Apoio Comercial",
      vertical: "marketing",
      papel: "Membro",
      pitch: "Treinamento comercial e estruturação de processos de vendas para equipes comerciais de alta performance.",
      origem: "Transcrição — pitch semanal",
      fonte: "funildevendas.com.br",
      fit: "Alto",
      fit_score: 96,
      gargalo: "Tempo de resposta a leads de entrada — demora no primeiro atendimento reduz conversão.",
      oferta: "Agente de IA de pré-venda e qualificação 24/7 integrado no WhatsApp e CRM.",
      nat: "membro",
      equipe: "Lobo",
      publicos: ["P1", "P5"],
      redes: [
        { tipo: "Site", handle: "funildevendas.com.br" },
        { tipo: "LinkedIn", handle: "company/funil-de-vendas" }
      ]
    },
    {
      id: "luiz",
      nome: "Luiz",
      empresa: "Colisio",
      especialidade: "Posicionamento Digital & Growth",
      vertical: "marketing",
      papel: "Membro",
      pitch: "Estratégia de marca, posicionamento digital e geração de demanda para empresas que querem crescer na internet.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Alto",
      fit_score: 94,
      gargalo: "Handover manual entre agência de mídia e equipe de vendas do cliente.",
      oferta: "Integração KeyCore para disparos instantâneos de leads para corretores/vendedores.",
      nat: "membro",
      equipe: "Águia",
      publicos: ["P1", "P5"],
      redes: [{ tipo: "Instagram", handle: "@colisio.digital" }]
    },
    {
      id: "danilo",
      nome: "Danilo",
      empresa: "Tráfego Pago & Performance",
      especialidade: "Gestão de Tráfego Pago (Google Ads & Meta Ads)",
      vertical: "marketing",
      papel: "Membro",
      pitch: "Aquisição de clientes via campanhas de tráfego pago otimizadas para ROI e custo por aquisição.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Alto",
      fit_score: 91,
      gargalo: "Consolidação manual de relatórios de métricas de anúncios para clientes toda semana.",
      oferta: "Dashboard automatizado de ROI de mídia paga com alertas em tempo real.",
      nat: "membro",
      equipe: "Águia",
      publicos: ["P5"],
      redes: []
    },
    {
      id: "raoni",
      nome: "Raoni Camilo",
      empresa: "Estratégia Comportamental",
      especialidade: "Desenvolvimento Humano & Equipes",
      vertical: "marketing",
      papel: "Membro",
      pitch: "Desenvolvimento de lideranças e resolução de conflitos comportamentais em equipes corporativas.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Médio",
      fit_score: 78,
      gargalo: "Aplicação e tabulação manual de testes de perfil psicológico/comportamental.",
      oferta: "Plataforma web de avaliação comportamental com emissão automática de laudos.",
      nat: "membro",
      equipe: "Lobo",
      publicos: ["P1"],
      redes: [{ tipo: "LinkedIn", handle: "raoni-camilo" }]
    },
    {
      id: "felipe",
      nome: "Felipe Gomes",
      empresa: "Prudential",
      especialidade: "Planejamento Financeiro & Proteção Familiar",
      vertical: "saude_sst",
      papel: "Membro",
      pitch: "Proteção patrimonial, planejamento sucessório e seguro de vida personalizado para empresários e famílias.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Médio",
      fit_score: 80,
      gargalo: "Acompanhamento de renovações de apólices e aniversários de clientes no Excel.",
      oferta: "Automação de régua de relacionamento e lembretes de apólice via n8n + WhatsApp.",
      nat: "membro",
      equipe: "Lobo",
      publicos: ["P2"],
      redes: [{ tipo: "LinkedIn", handle: "felipe-gomes-prudential" }]
    },
    {
      id: "andressa",
      nome: "Andressa",
      empresa: "Ergonomia Multidisciplinar",
      especialidade: "Ergonomia Ocupacional & Laudos NR-17",
      vertical: "saude_sst",
      papel: "Membro",
      pitch: "Análise ergonômica do trabalho (AET), adequação à NR-17 e prevenção de lesões ocupacionais.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Alto",
      fit_score: 89,
      gargalo: "Preenchimento manual de checklists de vistoria ergonômica em campo.",
      oferta: "App mobile offline de vistoria ergonômica com geração de relatório em PDF.",
      nat: "membro",
      equipe: "Águia",
      publicos: ["P3"],
      redes: []
    },
    {
      id: "bruno",
      nome: "Bruno",
      empresa: "Energia Solar & Sustentabilidade",
      especialidade: "Projetos de Energia Fotovoltaica",
      vertical: "engenharia",
      papel: "Membro",
      pitch: "Redução de até 95% na conta de luz para empresas e residências com sistemas de energia solar de alta eficiência.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      fit: "Alto",
      fit_score: 87,
      gargalo: "Elaboração manual de propostas comerciais de dimensionamento solar.",
      oferta: "Gerador automático de propostas comerciais de energia solar com simulação de payback.",
      nat: "membro",
      equipe: "Lobo",
      publicos: ["P1", "P4"],
      redes: [{ tipo: "Site", handle: "energiasolarbruno.com.br" }]
    },
    {
      id: "keycore",
      nome: "KeyCore Tech Hub",
      empresa: "KeyCore Tech Hub",
      especialidade: "Automação, Agentes de IA & Transformação Operacional",
      vertical: "marketing",
      papel: "Parceiro Estratégico",
      pitch: "Tecnologia que devolve tempo. Transformamos gargalos operacionais em tempo, clareza e eficiência com IA e automação.",
      origem: "KeyCore Institutional",
      fonte: "CNPJ 42.231.277/0001-75 — keycore.com.br",
      fit: "Excepcional",
      fit_score: 100,
      gargalo: "Empresários perdendo tempo com tarefas operacionais manuais e repetitivas.",
      oferta: "Agentes de IA autônomos Hermes, automações n8n, dashboards operacionais e plataformas customizadas.",
      nat: "membro",
      equipe: "Lobo",
      publicos: ["P1", "P3", "P4", "P5"],
      redes: [
        { tipo: "Site", handle: "keycore.com.br" },
        { tipo: "LinkedIn", handle: "company/keycore-tech-hub" }
      ]
    }
  ];

  for (const m of membersData) {
    insertMember.run(
      m.id, m.nome, m.empresa, m.especialidade, m.vertical, m.papel,
      m.pitch, m.origem, m.fonte, m.fit, m.fit_score, m.gargalo, m.oferta, m.nat, m.equipe
    );

    if (m.redes) {
      for (const r of m.redes) {
        insertRede.run(m.id, r.tipo, r.handle);
      }
    }

    if (m.publicos) {
      for (const p of m.publicos) {
        insertMembroPublico.run(m.id, p);
      }
    }
  }

  // 6. Graph Edges
  const insertEdge = db.prepare('INSERT INTO graph_edges (source, target, tipo, label) VALUES (?, ?, ?, ?)');
  const edges = [
    { source: "keycore", target: "rodrigo", tipo: "oferta", label: "OCR Comprovantes BPO" },
    { source: "keycore", target: "henrique", tipo: "oferta", label: "Agente IA Pré-venda" },
    { source: "keycore", target: "luiz", tipo: "oferta", label: "Integração Lead Handover" },
    { source: "keycore", target: "danilo", tipo: "oferta", label: "Dashboard ROI Tráfego" },
    { source: "keycore", target: "tatiana", tipo: "oferta", label: "Auditoria Passivo IA" },
    { source: "keycore", target: "andressa", tipo: "oferta", label: "App Vistoria NR-17" },
    { source: "keycore", target: "debora", tipo: "oferta", label: "Portal Diário de Obra" },
    { source: "keycore", target: "bruno", tipo: "oferta", label: "Gerador Propostas Solar" },

    { source: "rodrigo", target: "pedro", tipo: "sinergia", label: "BPO + Contabilidade" },
    { source: "pedro", target: "diego", tipo: "sinergia", label: "Contábil + Perícia" },
    { source: "luiz", target: "danilo", tipo: "sinergia", label: "Branding + Tráfego" },
    { source: "henrique", target: "luiz", tipo: "sinergia", label: "Vendas + Leads" },
    { source: "debora", target: "bruno", tipo: "sinergia", label: "Obra + Energia Solar" },
    { source: "marina", target: "felipe", tipo: "sinergia", label: "Previdência + Seguro" },
    { source: "tatiana", target: "andressa", tipo: "sinergia", label: "Trabalhista + SST" }
  ];

  for (const e of edges) {
    insertEdge.run(e.source, e.target, e.tipo, e.label);
  }

  // 7. Grupo Valores
  const insertValor = db.prepare('INSERT INTO grupo_valores (num, titulo, descricao) VALUES (?, ?, ?)');
  const valores = [
    { num: 1, titulo: "Construção de Relacionamentos", descricao: "Encontros semanais, conversas 1-2-1 e convivência constante constroem laços sólidos de confiança comercial." },
    { num: 2, titulo: "Aprendizado Contínuo", descricao: "Treinamentos, capacitações no BNI Business Builder e trocas de experiência entre os membros." },
    { num: 3, titulo: "Tradição e Inovação", descricao: "Honrar os 41 anos de método consagrado enquanto inovamos em ferramentas e tecnologias." },
    { num: 4, titulo: "Atitude Positiva", descricao: "Postura construtiva e proativa esperada de todos os empresários do grupo." },
    { num: 5, titulo: "Prestação de Contas & Responsabilidade", descricao: "Métricas transparentes de presença, referências passadas e negócios fechados." },
    { num: 6, titulo: "Reconhecimento", descricao: "Celebração pública das conquistas e contribuições dos membros ao ecossistema." },
    { num: 7, titulo: "Givers Gain® (Ganhar Ajudando)", descricao: "Filosofia central: quanto mais você ajuda outros empresários a fecharem negócios, mais negócios você recebe de volta." }
  ];
  for (const v of valores) {
    insertValor.run(v.num, v.titulo, v.descricao);
  }

  // 8. Grupo Passos da Reunião
  const insertPasso = db.prepare('INSERT INTO grupo_passos (num, titulo, descricao) VALUES (?, ?, ?)');
  const passos = [
    { num: 1, titulo: "Networking Aberto (Open Networking)", descricao: "Recepção, café e conversas informais entre membros e convidados para quebrar o gelo." },
    { num: 2, titulo: "Apresentações Semanais dos Membros (60s)", descricao: "Pitch de 60 segundos onde cada membro declara sua cadeira, cliente ideal e referência da semana." },
    { num: 3, titulo: "Apresentação de Convidados", descricao: "Boas-vindas aos empresários visitantes e explicação sobre o método BNI." },
    { num: 4, titulo: "Relatório da Diretoria & Educação", descricao: "Balanço das estatísticas da equipe, ponto educacional da semana e lembretes operacionais." },
    { num: 5, titulo: "Passagem de Referências & Obrigado Por Negócio Fechado (OPNF)", descricao: "O momento principal: troca formal de fichas de indicação e declaração de faturamento gerado." },
    { num: 6, titulo: "Encerramento e Sorteio", descricao: "Agradecimentos finais, premiação da equipe destaque (Lobo vs Águia) e foto oficial." }
  ];
  for (const p of passos) {
    insertPasso.run(p.num, p.titulo, p.descricao);
  }

  // 9. Grupo Estrutura Organizacional
  const insertEstrutura = db.prepare('INSERT INTO grupo_estrutura (id, cargo, descricao, responsavel) VALUES (?, ?, ?, ?)');
  const estruturas = [
    { id: "presidencia", cargo: "Presidente do Grupo", descricao: "Lidera as reuniões semanais, zela pelo cumprimento da pauta e pela alta performance do grupo.", responsavel: "Diretoria BNI PE JUNTOS" },
    { id: "vice_presidencia", cargo: "Vice-Presidente & Comitê de Membros", descricao: "Gerencia a renovação de membros, controle de presenças, relatórios estatísticos e aplicação de normas.", responsavel: "Comitê de Desempenho" },
    { id: "secretario", cargo: "Secretário-Tesoureiro", descricao: "Responsável pelo controle financeiro da equipe, pagamentos de mensalidades e ficha cadastral dos membros.", responsavel: "Tesouraria Operacional" },
    { id: "anfitrioes", cargo: "Anfitriões de Visitantes", descricao: "Recepcionam os empresários convidados, orientam sobre o formato e conduzem a sala de orientação.", responsavel: "Equipe de Recepção" },
    { id: "educacao", cargo: "Coordenador de Educação", descricao: "Apresenta pílulas de conhecimento de 3 a 5 minutos toda semana sobre o método BNI.", responsavel: "Comitê Educacional" },
    { id: "eventos", cargo: "Coordenador de Eventos", descricao: "Organiza encontros de integração, rodadas de negócios fora do horário regular e ações sociais.", responsavel: "Comitê Social" }
  ];
  for (const e of estruturas) {
    insertEstrutura.run(e.id, e.cargo, e.descricao, e.responsavel);
  }

  console.log("Database seeded successfully!");
}

seedData();
