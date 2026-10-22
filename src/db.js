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

module.exports;