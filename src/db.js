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

db.exec
(`
    CREATE TABLE IF NOT EXISTS ingrediente
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reteta_id INTEGER NOT NULL REFERENCES retete(id) ON DELETE CASCADE,
        nume TEXT NOT NULL,
        cantitate TEXT NOT NULL
    )
    STRICT;

    CREATE INDEX IF NOT EXISTS idx_ingrediente_reteta ON ingrediente(reteta_id);
`);

db.exec
(`
    CREATE TABLE IF NOT EXISTS pasi
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reteta_id INTEGER NOT NULL REFERENCES retete(id) ON DELETE CASCADE,
        numar INTEGER NOT NULL CHECK (numar >= 1),
        continut TEXT NOT NULL,
        UNIQUE (reteta_id, numar)
    )
    STRICT;
`);

db.exec
(`
    CREATE TABLE IF NOT EXISTS recenzii
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reteta_id INTEGER NOT NULL REFERENCES retete(id) ON DELETE CASCADE,
        autor_id INTEGER NOT NULL REFERENCES utilizatori(id) ON DELETE CASCADE,
        nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
        continut TEXT NOT NULL,
        creat_la TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        actualizat_la TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (reteta_id, autor_id)
    )
    STRICT;

    CREATE INDEX IF NOT EXISTS idx_recenzii_autor ON recenzii(autor_id);
`);

module.exports = db;