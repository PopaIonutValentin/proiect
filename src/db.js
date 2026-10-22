const {DatabaseSync} = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const FOLDER_DATE = path.join(__dirname, '..', 'data');
fs.mkdirSync(FOLDER_DATE, { recursive: true });

const db = new DatabaseSync(path.join(FOLDER_DATE, 'retete.db'));

db.exec('PRAGMA foreign_keys = ON;');

db.exec
(`
    CREATE TABLE IF NOT EXISTS utilizatori 
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nume_utilizator TEXT NOT NULL UNIQUE COLLATE NOCASE,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        parola_hash TEXT NOT NULL,
        rol TEXT NOT NULL DEFAULT 'user' CHECK (rol IN ('user', 'admin')),
        creat_la TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    STRICT;
`);

db.exec
(`
    CREATE TABLE IF NOT EXISTS categorii
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nume TEXT NOT NULL UNIQUE COLLATE NOCASE
    )
    STRICT;
`)

db.exec
(`
    CREATE TABLE IF NOT EXISTS retete
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        autor_id INTEGER NOT NULL REFERENCES utilizatori(id) ON DELETE CASCADE,
        categorie_id INTEGER REFERENCES categorii(id) ON DELETE SET NULL,
        titlu TEXT NOT NULL,
        poza TEXT,
        vizibilitate TEXT NOT NULL DEFAULT 'public' CHECK (vizibilitate IN ('public', 'private')),
        creat_la TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        actualizat_la TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    STRICT;
    
    CREATE INDEX IF NOT EXISTS idx_retete_autor ON retete(autor_id);
    CREATE INDEX IF NOT EXISTS idx_retete_categorie ON retete(categorie_id);
`);

module.exports = db;