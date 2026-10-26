const express = require('express');
const {valideazaNumeUtilizator, valideazaEmail} = require('../utils/validare-utilizator');
const {valideazaParola} = require('../utils/validare-parola');
const {esteParolaScursa} = require('../utils/parola-scursa');
const {hashParola} = require('../utils/parola');
const utilizatori = require('../models/utilizatori');

const router = express.Router();

const MESAJ_GENERAL = 'Nu s-a putut crea contul cu aceste date.';

router.post('/inregistrare', async (req, res) =>
{
    const{numeUtilizator, email, parola}=req.body ??{};

    const eroare = valideazaNumeUtilizator(numeUtilizator)
                ?? valideazaEmail(email)
                ?? valideazaParola(parola, numeUtilizator);
    
    if (eroare)
    {
        return res.status(400).json({eroare});
    }

    if (utilizatori.existaNumeUtilizator(numeUtilizator))
    {
        return res.status(409).json({ eroare: 'Numele de utilizator este deja folosit.'});
    }

    if (utilizatori.existaEmail(email))
    {
        return res.status(400).json({eroare: MESAJ_GENERAL});
    }

    if(await esteParolaScursa(parola))
    {
        return res.status(400).json({eroare: 'Parola apare in scurgeri de date publice. Alege alta.'});
    }

    const parolaHash = await hashParola(parola);

    try
    {
        utilizatori.creeazaUtilizator(numeUtilizator, email, parolaHash);
    }
    catch (eroareInserare)
    {
        console.warn('Inregistrare esuata la salvare:', eroareInserare.message);
        return res.status(400).json({eroare: MESAJ_GENERAL});
    }

    return res.status(201).json({mesaj: 'Contul a fost creat. Te poti autentifica.'});   
});

module.exports = router;


