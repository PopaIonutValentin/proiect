const express = require('express');
const {doarLogat, identificaUtilizatorul} = require('../middleware/acces');
const {valideazaReteta, curataReteta} = require('../utils/validare-reteta');
const retete = require('../models/retete');

const router = express.Router();

const MESAJ_NEGASITA = 'Reteta nu a fost gasita.';

function poateVedea(utilizator, reteta)
{
    if (reteta.vizibilitate === 'public')
    {
        return true;
    }

    if(!utilizator)
    {
        return false;
    }

    return utilizator.id === reteta.autor_id || utilizator.rol ==='admin';
}

router.post('/', doarLogat, (req, res) =>
{
    const eroare = valideazaReteta(req.body);
    
    if(eroare)
    {
        return res.status(400).json({eroare});
    }

    const id = retete.creeazaReteta(req.utilizator.id, curataReteta(req.body));

    res.status(201).json({id});
});

router.get('/:id', identificaUtilizatorul, (req, res) =>
{
    const idReteta = Number(req.params.id);

    if(!Number.isSafeInteger(idReteta) || idReteta < 1)
    {
        return res.status(404).json({eroare: MESAJ_NEGASITA});
    }

    const reteta = retete.gasesteReteta(idReteta);

    if(!reteta || !poateVedea(req.utilizator, reteta))
    {
        return res.status(404).json({eroare: MESAJ_NEGASITA});
    }

    if (reteta.vizibilitate === 'private')
    {
        res.set('Cache-Control', 'no-store');
    }

    res.json({reteta});
});

module.exports = router;
