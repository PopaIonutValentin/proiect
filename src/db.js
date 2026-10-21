const {DatabaseSync} = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const FOLDER_DATE = path.join(__dirname, '..', 'data');
fs.mkdirSync(FOLDER_DATE, { recursive: true });

const db = new DatabaseSync(path.join(FOLDER_DATE, 'retete.db'));

db.exec('PRAGMA foreign_keys = ON;');

module.exports;