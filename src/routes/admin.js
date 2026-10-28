const express = require('express');
const { doarLogat, doarAdmin} = require('../middleware/acces');
const utilizatori = require('../models/utilizatori');

const router = express.Router();

router.use(doarLogat, doarAdmin);

router.get('/utilizatori', (req,res) =>
{
    res.set('Cache-Control', 'no-store');
    res.json({utilizatori: utilizatori.listeazaUtilizatori() });
});

module.exports = router;