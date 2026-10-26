const express = require('express');
const {valideazaNumeUtilizator, valideazaEmail} = require('../utils/validare-utilizator');
const {valideazaParola} = require('../utils/validare-parola');
const {esteParolaScursa} = require('../utils/parola-scursa');
const {hashParola, verificareParola} = require('../utils/parola');
const utilizatori = require('../models/utilizatori');

const router = express.Router();

const MESAJ_GENERAL = 'Nu s-a putut crea contul cu aceste date.';
const MESAJ_LOGIN_GRESIT = 'Nume de utilizator sau parola gresita.';
const hashFalsPromis = hashParola('parola-falsa-doar-pentru-timp-egal');

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

router.post('/login', async (req,res,next) =>
{
    const { numeUtilizator, parola} = req.body ??{};

    if(typeof numeUtilizator !== 'string' || typeof parola !== 'string')
    {
        return res.status(400).json({ eroare: MESAJ_LOGIN_GRESIT});
    }
    const utilizator = utilizatori.gasesteUtilizatorPentruLogin(numeUtilizator);
    const hashDeVerificat = utilizator ? utilizator.parola_hash: await hashFalsPromis;
    const parolaCorecta = await verificareParola(parola, hashDeVerificat);

    if(!utilizator || !parolaCorecta)
    {
        return res.status(401).json({eroare: MESAJ_LOGIN_GRESIT});
    }
    req.session.regenerate((eroare) =>
    {
        if (eroare)
        {
            return next(eroare);
        }
        req.session.utilizatorId = utilizator.id;

        req.session.save((eroareSalvare) =>
        {
            if(eroareSalvare)
            {
                return next(eroareSalvare);
            }

            res.json({mesaj: 'Autentificare reusita.'});
        });
    });
});

module.exports = router;


