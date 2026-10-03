const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../bni.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS verticais (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      cor TEXT NOT NULL,
      descricao TEXT,
      cadeiras INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS equipes (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      pontos INTEGER NOT NULL,
      cor TEXT
    );

    CREATE TABLE IF NOT EXISTS members (
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
      equipe TEXT DEFAULT 'Lobo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS member_redes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id TEXT NOT NULL,
      tipo TEXT NOT NULL,
      handle TEXT NOT NULL,
      FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS publicos (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      desc TEXT
    );

    CREATE TABLE IF NOT EXISTS membro_publico (
      member_id TEXT NOT NULL,
      publico_id TEXT NOT NULL,
      PRIMARY KEY (member_id, publico_id),
      FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS graph_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      target TEXT NOT NULL,
      tipo TEXT NOT NULL,
      label TEXT
    );

    CREATE TABLE IF NOT EXISTS grupo_valores (
      id INTEGER PRIMARY KEY,
      num INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS grupo_passos (
      id INTEGER PRIMARY KEY,
      num INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS grupo_estrutura (
      id TEXT PRIMARY KEY,
      cargo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      responsavel TEXT
    );

    CREATE TABLE IF NOT EXISTS reunioes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      indicador_id TEXT NOT NULL,
      contato_id TEXT NOT NULL,
      data_hora DATETIME NOT NULL,
      local TEXT NOT NULL,
      status TEXT DEFAULT 'Agendada',
      observacao TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (indicador_id) REFERENCES members(id),
      FOREIGN KEY (contato_id) REFERENCES members(id)
    );
  `);
}

initDb();

module.exports = db;
