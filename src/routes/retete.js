const express = require('express');
const {doarLogat} = require('../middleware/acces');
const {valideazaReteta, curataReteta} = require('../utils/validare-reteta');
const reteta = require('../models/retete');

const router = express.Router();

router.post('/', doarLogat, (req, res) =>
{
    const eroare = valideazaReteta(req.body);
    
    if(eroare)
    {
        return res.status(400).json({eroare});
    }

    const id = reteta.creeazaReteta(req.utilizator.id, curataReteta(req.body));

    res.status(201).json({id});
});

module.exports = router;
