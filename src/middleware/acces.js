const utilizatori = require ('../models/utilizatori');

const MESAJ_NEAUTENTIFICAT = 'Trebuie sa fii autentificat.';

function doarLogat (req, res, next)
{
    const id = req.session?.utilizatorId;

    if(!id)
    {
        return res.status(401).json({eroare: MESAJ_NEAUTENTIFICAT});
    }

    const utilizator = utilizatori.gasesteDupaId(id);

    if(!utilizator)
    {
        return req.session.destroy(() =>
        {
            res.status(401).json({eroare: MESAJ_NEAUTENTIFICAT});
        });
    }

    req.utilizator = utilizator;
    next();
}

module.exports = {doarLogat};