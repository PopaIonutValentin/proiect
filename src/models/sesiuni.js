const session = require('express-session');
const db = require('../db');

const DURATA_IMPLICITA_MS = 30*60*1000;

const citeste = db.prepare('SELECT date FROM sesiuni WHERE sid = ? AND expira_la > ?');
const salveaza = db.prepare('INSERT OR REPLACE INTO sesiuni (sid, date, expira_la) VALUES (?, ?, ?)');
const prelungeste = db.prepare('UPDATE sesiuni SET expira_la = ? WHERE sid = ?');
const sterge = db.prepare('DELETE FROM sesiuni WHERE sid = ?');
const stergeExpirate = db.prepare('DELETE FROM sesiuni WHERE expira_la <= ?');

function calculeazaExpirarea(sesiune)
{
    const expira = sesiune?.cookie?.expires;
    return expira ? new Date(expira).getTime(): Date.now()+ DURATA_IMPLICITA_MS;
}

class StoreSQLite extends session.Store
{
    get(sid, callback)
    {
        try
        {
            const rand = citeste.get(sid, Date.now());
            callback(null, rand ? JSON.parse(rand.date): null);
        }
        catch (eroare)
        {
            callback(eroare);
        }
    }

    set(sid, sesiune, callback)
    {
        try
        {
            stergeExpirate.run(Date.now());
            salveaza.run(sid, JSON.stringify(sesiune), calculeazaExpirarea(sesiune));
            callback(null);
        }
        catch (eroare)
        {
            callback(eroare);
        }
    }
    touch(sid, sesiune, callback)
    {
        try
        {
            prelungeste.run(calculeazaExpirarea(sesiune),sid);
            callback(null);
        }
        catch(eroare)
        {
            callback(eroare);
        }
    }
    destroy(sid, callback)
    {
        try
        {
            sterge.run(sid);
            callback(null);
        }
        catch (eroare)
        {
            callback(eroare);
        }
    }
}

module.exports = StoreSQLite;