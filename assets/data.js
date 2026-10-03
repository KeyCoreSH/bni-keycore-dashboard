/* ============================================================
   BNI JUNTOS — Base de dados
   REGRA DE INTEGRIDADE:
   • Nomes, empresas, especialidades e pitches vêm da transcrição
     oficial da 12ª reunião (documento anexado pelo Rogério).
   • Contatos/redes só aparecem quando verificados em fonte
     pública. Campo ausente = null ("não informado").
   • Gargalos e ofertas KeyCore são ANÁLISE (inferência declarada),
     não declaração dos membros.
   ============================================================ */

const BNI_DATA = {

  meta: {
    grupo: "BNI JUNTOS",
    fase: "Em formação — 12ª reunião",
    local: "Recife / PE",
    integrantes_atuais: 14,
    candidatos_em_avaliacao: 2,
    meta_cadeiras: 20,
    regra_escala: "Até 12 integrantes não há reunião semanal regular; a partir daí, os encontros passam a ser toda semana.",
    equipes: [
      { equipe: "Lobo", pontos: 640 },
      { equipe: "Águia", pontos: 445 }
    ],
    estrutura_global: [
      { cargo: "Presidente global", pessoa: "Weimiller (grafia da transcrição)" },
      { cargo: "CEO", pessoa: "Mary Thompson" },
      { cargo: "Direção nacional (Brasil)", pessoa: "Marcos Martins" },
      { cargo: "Diretor distrital", pessoa: "Clayton" },
      { cargo: "Diretor regional — chegada do BNI a PE", pessoa: "Abelardo Boba" }
    ],
    alcance: [
      { label: "Países", valor: "77" },
      { label: "Membros no Brasil", valor: "20 mil+" },
      { label: "Estados brasileiros", valor: "19" },
      { label: "Integrantes em Recife", valor: "300+" },
      { label: "Grupos na operação local", valor: "7 (ativos ou em desenvolvimento)" },
      { label: "Caruaru", valor: "1º grupo formado há ~30 dias" }
    ],
    indicadores: [
      "Comparecer às reuniões ou enviar substituto",
      "Realizar conversas individuais (1-2-1)",
      "Fazer visitas a empresas",
      "Fornecer referências",
      "Participar de treinamentos",
      "Contribuir com depoimentos e atividades do grupo",
      "Convidar potenciais participantes"
    ],
    treinamentos: [
      { nome: "PSM (membro)", detalhe: "Obrigatório · 8 módulos de ~15-20 min · certificado" },
      { nome: "Treinamentos online", detalhe: "2 a 3 vezes por mês, à noite" },
      { nome: "BNI University", detalhe: "Milhares de horas de conteúdo, incluindo MBAs" }
    ],
    valores_bni: [
      { titulo: "Construção de relacionamentos", desc: "Encontros semanais, conversas e convivência favorecem relações de confiança." },
      { titulo: "Aprendizado contínuo", desc: "Os membros aprendem sobre as áreas uns dos outros, inclusive em conversas informais." },
      { titulo: "Tradição e inovação", desc: "Mais de quatro décadas de história, com incorporação de mudanças." },
      { titulo: "Atitude positiva", desc: "Postura esperada de quem participa do grupo." },
      { titulo: "Responsabilidade e prestação de contas", desc: "Atividades e resultados são medidos." },
      { titulo: "Reconhecimento", desc: "A organização destaca a contribuição e os resultados dos membros." },
      { titulo: "Givers Gain", desc: "Ajudar os demais como princípio de atuação — 'dar para ganhar'." }
    ]
  },

  keycore: {
    id: "KEYCORE",
    nome: "KeyCore Tech Hub",
    titulo: "Software house, automação e IA aplicada",
    slogan: "Tecnologia que devolve tempo.",
    cnpj: "42.231.277/0001-75",
    pitch_reuniao: "Empresário de uma software house que desenvolve soluções tecnológicas e utiliza inteligência artificial; trabalha com IA antes de sua popularização recente. Cliente ideal: empresas que precisam resolver problemas por meio de tecnologia.",
    observacao_cadeira: "O grupo ainda não definiu subdivisões para a categoria de IA — a especialidade deve ser apresentada de forma ampla por enquanto, com clareza sobre o problema que resolve."
  },

  /* ---------------------------------------------------------
     MEMBROS — apenas quem foi nominalmente citado na reunião
     --------------------------------------------------------- */
  membros: [
    {
      id: "rogério",
      nome: "Rogério Alencar Filho",
      empresa: "KeyCore Tech Hub",
      especialidade: "IA e desenvolvimento de soluções para problemas empresariais",
      vertical: "tecnologia",
      papel: "Membro",
      pitch: "Software house que desenvolve soluções tecnológicas e usa IA para resolver problemas empresariais. Citou o exemplo de aplicação para identificar pedras sob a cana-de-açúcar por meio de hardware instalado em uma usina.",
      origem: "Transcrição — apresentação + entrevista de candidatura",
      fonte: "Anexo da reunião",
      redes: [],
      fit: null,
      eh_keycore: true
    },
    {
      id: "heitor",
      nome: "Heitor",
      empresa: "Granata Advocacia (Vasconcelos Granata)",
      especialidade: "Direito do Consumidor e Direito da Saúde",
      vertical: "juridico",
      papel: "Membro",
      pitch: "Atuação contra negativas e abusos de planos de saúde. Cliente ideal da semana: pessoas com reajustes abusivos nos últimos três anos, em contratos empresariais que abrangem apenas membros da família — potencialmente caracterizados como 'falsos coletivos'.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo + site público vasconcelosgranata.com.br",
      redes: [
        { tipo: "Site", handle: "vasconcelosgranata.com.br" },
        { tipo: "WhatsApp (site oficial)", handle: "+55 81 99470-7741" }
      ],
      site_fornece: "Assistência 24 horas, negativas de cirurgias e internação, tratamento do autismo, medicamentos de alto valor.",
      fit: "Alto",
      gargalo: "Análise manual de prontuários extensos para sustentar negativa indevida e erro médico.",
      oferta: "RAG corporativo para resumo de prontuários e identificação de padrões de negativa.",
      nat: "membro"
    },
    {
      id: "gabriel",
      nome: "Gabriel",
      empresa: "Ponto de Vista Arquitetura",
      especialidade: "Arquitetura, interiores e reformas",
      vertical: "engenharia",
      papel: "Membro",
      pitch: "Arquitetura, interiores e reformas para espaços corporativos, comerciais e residenciais, com projetos compatíveis com a realidade e o orçamento dos clientes. Cliente ideal: PF e PJ que desejam melhorar seus espaços por meio de projetos executáveis.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo + site público pontodevistaarquitetura.com",
      redes: [
        { tipo: "Site", handle: "pontodevistaarquitetura.com" },
        { tipo: "LinkedIn", handle: "company/pontodevista-arquitetura" }
      ],
      fit: "Médio",
      gargalo: "Acompanhamento de diário de obra e prazos com cliente e fornecedores feito de forma fragmentada.",
      oferta: "Portal mobile de diário de obra com checkpoints e evidências fotográficas.",
      nat: "membro"
    },
    {
      id: "henrique",
      nome: "Henrique Dantas",
      empresa: "Funil de Vendas",
      especialidade: "Treinamento e apoio comercial",
      vertical: "marketing",
      papel: "Membro",
      pitch: "Treinamento e apoio comercial para transformar pessoas em empresas por meio de vendas. Mencionou a Renault Fachada e sua experiência anterior como aluno da Funil.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo + site público funildevendas.com.br",
      redes: [
        { tipo: "Site", handle: "funildevendas.com.br" },
        { tipo: "LinkedIn (rede de franquias)", handle: "página institucional da rede" }
      ],
      fit: "Alto",
      gargalo: "Tempo de resposta a leads de entrada — janela de conversão perdida quando o vendedor demora.",
      oferta: "Agente de IA de pré-venda e qualificação 24/7 no WhatsApp.",
      nat: "membro"
    },
    {
      id: "luiz",
      nome: "Luiz",
      empresa: "Colisio",
      especialidade: "Posicionamento digital e geração de demanda",
      vertical: "marketing",
      papel: "Membro",
      pitch: "Posicionamento de empresas e empresários no mercado digital, para gerar demanda qualificada e atrair leads. Relatou participação em um podcast feito para a Renault Fachada durante uma feira. Cliente ideal da semana: médicos ortopedistas.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo + página pública da empresa no LinkedIn (colisiobr) e perfil do fundador",
      redes: [
        { tipo: "LinkedIn (empresa)", handle: "colisiobr" },
        { tipo: "LinkedIn (fundador)", handle: "luiz-moreira-filho — Founder @Colisio | Tecnologia e Marketing" }
      ],
      fit: "Alto",
      gargalo: "Leads gerados por campanha esfriam antes do primeiro contato humano da equipe do cliente.",
      oferta: "Agente de IA de atendimento e qualificação de leads acoplado às campanhas Meta/Google.",
      nat: "membro"
    },
    {
      id: "otto",
      nome: "Otto",
      empresa: "ROV Energia",
      especialidade: "Energia compartilhada (solar sem investimento inicial)",
      vertical: "engenharia",
      papel: "Membro",
      pitch: "Energia compartilhada para reduzir contas sem investimento inicial, com ênfase em atendimento e resolução de problemas no pós-venda. Cliente ideal: interessados em economia de energia e suporte quando há problemas no fornecimento ou danos a equipamentos.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo + site público rovenergia.com e perfil público do gestor de vendas da ROV",
      redes: [
        { tipo: "Site", handle: "rovenergia.com" },
        { tipo: "Instagram", handle: "@rovenergia" }
      ],
      dados_empresa: "Empresa do Grupo 3R, nascida em Recife. Declara mais de 1.300 clientes e 30 anos de experiência do grupo; parques solares em Pernambuco; simulador de economia próprio no site.",
      fit: "Médio",
      gargalo: "Dimensionamento manual de proposta de payback a partir do PDF da conta de energia do cliente.",
      oferta: "Web app de simulação solar com leitura OCR da conta de luz.",
      nat: "membro"
    },
    {
      id: "bruno",
      nome: "Bruno",
      empresa: "BH Consultoria (BA Consultoria)",
      especialidade: "SST — assistência técnica trabalhista, PGR e LTCAT",
      vertical: "saude_sst",
      papel: "Membro",
      pitch: "Assistência técnica trabalhista, consultoria e elaboração de documentos como PGR e LTCAT. Avalia riscos no local de trabalho (calor, ruído) e orienta ações preventivas. Cliente ideal: empresas com funcionários que precisam identificar e controlar riscos ocupacionais. Deu a palestra principal da reunião sobre a NR-1.",
      origem: "Transcrição — pitch semanal + palestra",
      fonte: "Anexo",
      redes: [],
      destaque_palestra: "A partir de maio de 2026, os riscos psicossociais devem ser incluídos no PGR, com medidas e plano de ação correspondentes. A avaliação deve ser impessoal e confidencial — não é investigação da vida pessoal nem avaliação clínica individual.",
      fit: "Médio",
      gargalo: "Preenchimento manual de eventos de SST e validação no eSocial; risco de autuação por ausência de evidência de execução do plano de ação.",
      oferta: "Workflow n8n de validação e envio ao eSocial + repositório de evidências do PGR.",
      nat: "membro",
      citado_como: "Também grafado 'BA Consultoria' na transcrição"
    },
    {
      id: "andreia",
      nome: "Andreia Sasso",
      empresa: "Advocacia trabalhista",
      especialidade: "Direito trabalhista e NR-1",
      vertical: "juridico",
      papel: "Membro",
      pitch: "Advocacia trabalhista, com atenção a exigências empresariais, processos administrativos e cobranças de órgãos públicos. Menciona canal de denúncias, capacitação de funcionários e código de ética no contexto da NR-1. Cliente ideal: empresas que ainda não estruturaram as medidas relacionadas à NR-1 ou estão sendo fiscalizadas.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      redes: [],
      fit: "Alto",
      gargalo: "Estruturação e acompanhamento das exigências da NR-1 por cliente, com risco de prazo e autuação.",
      oferta: "Painel de conformidade NR-1 por cliente com alertas de prazo e evidências.",
      nat: "membro"
    },
    {
      id: "james",
      nome: "James",
      empresa: "Frei Corretora",
      especialidade: "Consórcios",
      vertical: "financeiro",
      papel: "Membro",
      pitch: "Consórcios como forma planejada de construir patrimônio, sem juros, com diferentes possibilidades de contemplação e potencial de alavancagem financeira. Cliente ideal: pessoas, empresários, empresas e condomínios interessados em investir ou planejar a aquisição de bens.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      redes: [],
      fit: "Médio",
      gargalo: "Simulação e comparação de grupos, lances e prazos de contemplação feita caso a caso.",
      oferta: "Simulador interativo de consórcio integrado ao WhatsApp.",
      nat: "membro"
    },
    {
      id: "paula",
      nome: "Paula",
      empresa: "BPO financeiro (terceirização do financeiro)",
      especialidade: "Terceirização do financeiro / BPO",
      vertical: "financeiro",
      papel: "Membro",
      pitch: "Terceirização do financeiro com apoio operacional para traduzir números em dados e contribuir para a gestão. Cliente ideal da semana: empresas com patrocínio acima de R$ 80 mil.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      redes: [],
      fit: "Alto",
      gargalo: "Conferência manual de comprovantes e lançamentos de dezenas de empresas clientes.",
      oferta: "Pipeline OCR de comprovantes com conciliação automática e trilha de auditoria.",
      nat: "membro"
    },
    {
      id: "raoni",
      nome: "Raoni Camilo",
      empresa: "Estratégia comportamental",
      especialidade: "Comportamento de equipes nas empresas",
      vertical: "marketing",
      papel: "Membro",
      pitch: "Estratégia comportamental aplicada a questões de comportamento de funcionários e equipes nas empresas. Cliente ideal: empresas que enfrentam problemas comportamentais no ambiente de trabalho.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      redes: [],
      fit: "Médio",
      gargalo: "Aplicação e consolidação de diagnósticos de comportamento de equipe sem ferramenta padronizada.",
      oferta: "Plataforma web de diagnóstico comportamental com relatório automático.",
      nat: "membro"
    },
    {
      id: "felipe",
      nome: "Felipe Gomes",
      empresa: "Prudential",
      especialidade: "Planejamento financeiro e seguro de vida",
      vertical: "financeiro",
      papel: "Membro",
      pitch: "Planejamento financeiro e seguro de vida, com foco na proteção da renda e do patrimônio diante de imprevistos. Cliente ideal: pessoas e famílias que precisam proteger sua estabilidade financeira.",
      origem: "Transcrição — pitch semanal",
      fonte: "Anexo",
      redes: [],
      fit: "Médio",
      gargalo: "Acompanhamento de apólices e renovações sem alerta automático de vencimento.",
      oferta: "Automação de lembrete de renovação e acompanhamento de apólice via n8n + WhatsApp.",
      nat: "membro"
    },
    {
      id: "andressa",
      nome: "Andressa",
      empresa: "Ergonomia — equipe multidisciplinar",
      especialidade: "Ergonomia (análise ergonômica do trabalho, biomecânica)",
      vertical: "saude_sst",
      papel: "Convidada em avaliação (também citada como 'Jarsa' na transcrição)",
      pitch: "Ergonomia com abordagem ampla, incluindo documentação, análise ergonômica do trabalho e biomecânica, em colaboração com uma equipe multidisciplinar. Apontou que o trabalho depende dessa equipe, em conjunto com advogados e arquitetos: avaliação documental e biomecânica, conscientização no ambiente de trabalho e correção de riscos antes que causem problemas de saúde ou consequências jurídicas.",
      origem: "Transcrição — pitch + apresentação como convidada",
      fonte: "Anexo",
      redes: [],
      observacao_cadeira: "Na entrevista de candidatura foi explicado que a especialidade de ergonomia precisa ser esclarecida: relaciona-se à saúde do trabalhador e ao treinamento de pessoas, não deve ficar vaga. A responsabilidade técnica do serviço é da sócia, que possui a formação correspondente.",
      fit: "Exploratório",
      gargalo: "Produção multidisciplinar de documentação técnica de ergonomia e organização de evidências.",
      oferta: "Plataforma de coleta e versionamento de evidências de AET.",
      nat: "convidada"
    }
  ],

  /* ---------------------------------------------------------
     CONEXÕES — arestas declaradas na reunião ou inferidas
     --------------------------------------------------------- */
  conexoes: [
    /* --- Referência confirmada na reunião (negócio gerado) --- */
    { from: "bruno", to: "andressa", tipo: "referencia",
      label: "Bruno agradeceu publicamente a Andressa por uma indicação que se converteu em trabalho conjunto",
      confirmado: true },

    /* --- Ofertas de entrada KeyCore (análise) --- */
    { from: "KEYCORE", to: "heitor",   tipo: "oferta", label: "RAG de prontuários médicos" },
    { from: "KEYCORE", to: "andreia",  tipo: "oferta", label: "Painel de conformidade NR-1" },
    { from: "KEYCORE", to: "paula",    tipo: "oferta", label: "OCR de comprovantes e conciliação" },
    { from: "KEYCORE", to: "luiz",     tipo: "oferta", label: "Agente de atendimento de leads" },
    { from: "KEYCORE", to: "henrique", tipo: "oferta", label: "Qualificação 24/7 no WhatsApp" },
    { from: "KEYCORE", to: "bruno",    tipo: "oferta", label: "Workflow eSocial + evidências do PGR" },

    /* --- Sinergias (análise a partir de público/atuação) --- */
    { from: "luiz", to: "henrique", tipo: "sinergia", label: "Demanda (Ads) + conversão comercial: o mesmo funil",
      base: "Ambos citaram a Renault Fachada na reunião — Luiz produziu o podcast durante uma feira e Henrique é aluno/parceiro." },
    { from: "heitor", to: "andreia", tipo: "sinergia", label: "Mesma cadeira jurídica, especialidades distintas (saúde × trabalhista)",
      base: "Ambos citaram a NR-1 em seus pitches — Heitor em 'falsos coletivos' de plano de saúde e Andreia em estruturação de conformidade." },
    { from: "bruno", to: "andreia", tipo: "sinergia", label: "NR-1: Bruno na avaliação de risco, Andreia na conformidade legal",
      base: "Bruno deu a palestra sobre NR-1; Andreia citou canal de denúncias, capacitação e código de ética no contexto da NR-1." },
    { from: "bruno", to: "raoni", tipo: "sinergia", label: "Riscos psicossociais da NR-1 (obrigatórios no PGR a partir de maio/2026) × comportamento de equipes",
      base: "Bruno citou pressão por metas, liderança e conflitos como aspectos avaliados; é o escopo exato da atuação de Raoni." },
    { from: "andressa", to: "gabriel", tipo: "sinergia", label: "Ergonomia + adequação de espaços",
      base: "Andressa declarou atuar em equipe multidisciplinar com arquitetos." },
    { from: "andressa", to: "bruno", tipo: "sinergia", label: "Ergonomia + SST (sobreposição a resolver pelo grupo)",
      base: "Sobreposição de escopo — atuação complementar, mas exige definição de especialidade pelo grupo." },
    { from: "gabriel", to: "otto", tipo: "sinergia", label: "Obra/reforma + energia: demanda conjunta em residências e empresas",
      base: "Análise: o público de reforma (Gabriel) coincide com o de eficiência energética (Otto)." },
    { from: "james", to: "felipe", tipo: "sinergia", label: "Vertical financeira: planejamento e patrimônio",
      base: "Ambos atendem pessoa física com foco em construção/proteção de patrimônio." },
    { from: "paula", to: "felipe", tipo: "sinergia", label: "BPO financeiro + seguro de vida: mesmo decisor (empresário/PME)",
      base: "Análise: Paula atende PMEs, Felipe atende pessoas e famílias — sobreposição no decisor da empresa." },
    { from: "luiz", to: "heitor", tipo: "sinergia", label: "Campanha para médicos × tese de saúde suplementar",
      base: "Cliente ideal declarado por Luiz foi 'médicos ortopedistas'; Heitor litiga contra planos de saúde." },
    { from: "henrique", to: "paula", tipo: "sinergia", label: "Treinamento comercial + BPO: mesma empresa cliente (PME)",
      base: "Análise: ambos declaram PMEs como cliente ideal." }
  ],

  /* ---------------------------------------------------------
     VERTICAIS
     --------------------------------------------------------- */
  verticais: [
    { id: "juridico",    nome: "Jurídico & Compliance",            cor: "blue"    },
    { id: "financeiro",  nome: "Financeiro, Consórcios & BPO",     cor: "emerald" },
    { id: "marketing",   nome: "Marketing, Vendas & Comportamento", cor: "violet"  },
    { id: "saude_sst",   nome: "Saúde, Seguros & SST",             cor: "amber"   },
    { id: "engenharia",  nome: "Engenharia, Arquitetura & Energia", cor: "cyan"   },
    { id: "tecnologia",  nome: "Tecnologia & IA (cadeira KeyCore)", cor: "blue"    }
  ],

  /* ---------------------------------------------------------
     PÚBLICOS-ALVO (L3 do grafo) — inferidos dos pitches
     --------------------------------------------------------- */
  publicos: [
    { id: "P1", nome: "Empresas e PMEs", desc: "Público comum de BPO, consórcios empresariais e treinamento comercial." },
    { id: "P2", nome: "Pessoas e famílias", desc: "Seguro de vida, consórcio pessoal e planejamento patrimonial." },
    { id: "P3", nome: "Empresas com risco ocupacional", desc: "SST, NR-1, ergonomia e riscos psicossociais." },
    { id: "P4", nome: "Obras, espaços e energia", desc: "Arquitetura, reforma e eficiência energética." },
    { id: "P5", nome: "Leads e funil comercial", desc: "Geração de demanda e conversão de vendas." },
    { id: "P6", nome: "Consumidores em relação de consumo", desc: "Saúde suplementar e negativas de plano." }
  ],

  membro_publico: {
    "heitor":   ["P6", "P2"],
    "andreia":  ["P1", "P3"],
    "paula":    ["P1"],
    "james":    ["P2", "P1"],
    "felipe":   ["P2"],
    "luiz":     ["P5", "P1"],
    "henrique": ["P5", "P1"],
    "raoni":    ["P1", "P3"],
    "bruno":    ["P3", "P1"],
    "andressa": ["P3", "P4"],
    "gabriel":  ["P4"],
    "otto":     ["P4", "P1"]
  },

  vertical_publico: {
    "P1": ["financeiro", "marketing"],
    "P2": ["financeiro"],
    "P3": ["saude_sst", "juridico"],
    "P4": ["engenharia"],
    "P5": ["marketing"],
    "P6": ["juridico"]
  }
};
