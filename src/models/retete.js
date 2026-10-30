const db = require('../db');
const cautaReteta = db.prepare
(`
    SELECT retete.id, retete.autor_id, utilizatori.nume_utilizator AS autor,
           retete.titlu, retete.descriere, retete.poza, retete.vizibilitate,
           retete.creat_la, retete.actualizat_la
    FROM retete
    JOIN utilizatori ON utilizatori.id = retete.autor_id
    WHERE retete.id = ?  
`);
const cautaIngrediente = db.prepare('SELECT nume, cantitate FROM ingrediente WHERE reteta_id = ? ORDER BY id');
const cautaPasi = db.prepare('SELECT numar, continut FROM pasi WHERE reteta_id = ? ORDER BY numar');
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

function gasesteReteta(id)
{
    const reteta = cautaReteta.get(id);

    if(!reteta)
    {
        return undefined;
    }

    reteta.ingrediente = cautaIngrediente.all(id);
    reteta.pasi = cautaPasi.all(id);
    return reteta;
}

module.exports = {creeazaReteta, gasesteReteta};