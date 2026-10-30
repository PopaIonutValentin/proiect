const db = require('../db');

const insereazaReteta = db.prepare('INSERT INTO retete (autor_id, titlu, descriere, vizibilitate) VALUES (?, ?, ?, ?)');
const insereazaIngrediente = db.prepare('INSERT INTO ingrediente (reteta_id, nume, cantitate) VALUES (?, ?, ?)');
const insereazaPas = db.prepare('INSERT INTO pasi (reteta_id, numar, continut) VALUES (?, ?, ?)');

function salveazaIngredienteSiPasi (retetaId, reteta)
{
    for (const ingredient of reteta.ingrediente)
    {
        insereazaIngrediente.run(retetaId, ingredient.nume, ingredient.cantitate);
    }

    reteta.pasi.forEach((continut, index) =>
    {
        insereazaPas.run(retetaId, index + 1, continut);
    });
}

function creeazaReteta (autorId, reteta)
{
    db.exec('BEGIN');

    try
    {
        const rezultat = insereazaReteta.run(autorId, reteta.titlu, reteta.descriere, reteta.vizibilitate);
        const retetaId = Number(rezultat.lastInsertRowid);

        salveazaIngredienteSiPasi(retetaId, reteta);

        db.exec('COMMIT');
        return retetaId;
    }
    catch (eroare)
    {
        db.exec('ROLLBACK')
        throw eroare;
    }
}

module.exports = {creeazaReteta};