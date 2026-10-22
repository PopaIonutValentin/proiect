const db = require('../src/db');

const tabele = db.prepare
(
    "SELECT name FROM sqlite_schema WHERE type= 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
).all();

for (const tabel of tabele)
{
    console.log(`\n${tabel.name}`);

    const coloane = db.prepare
    (
        'SELECT name, type, "notnull" AS obligatoriu FROM pragma_table_info(?)'
    ).all(tabel.name);

    for (const coloana of coloane)
    {
        console.log(` ${coloana.name} ${coloana.type} ${coloana.obligatoriu ? 'NOT NULL' : ''}`);
    }
}

console.log('\nforeign_keys: ', db.prepare('PRAGMA foreign_keys').get().foreign_keys);