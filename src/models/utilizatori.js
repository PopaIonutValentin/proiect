const db = require ('../db');

const cautaDupaNume = db.prepare('SELECT 1 FROM utilizatori WHERE nume_utilizator = ?');
const cautaDUpaEmail = db.prepare('SELECT 1 FROM utilizatori WHERE email = ?');
const inserare = db.prepare('INSERT INTO utilizatori (nume_utilizator, email, parola_hash) VALUES (?, ?, ?)');

function existaNumeUtilizator(numeUtilizator)
{
    return cautaDupaNume.get(numeUtilizator) !== undefined;
};

function existaEmail(email)
{
    return cautaDUpaEmail.get(email) !== undefined;
};

function creeazaUtilizator(numeUtilizator, email, parolaHash)
{
    const rezultat = inserare.run(numeUtilizator, email, parolaHash);
    return Number(rezultat.lastInsertRowid);
}

module.exports = {existaNumeUtilizator, existaEmail, creeazaUtilizator}; 
