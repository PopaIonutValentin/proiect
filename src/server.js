const express = require('express');
const helmet = require('helmet');
require('./db');
const rutaAutentificare = require('./routes/autentificare');

const PORT = Number(process.env.PORT) || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET;

if(!SESSION_SECRET || SESSION_SECRET.length<32)
{
    console.error('Lipseste SESSION_SECRET din .env (minim 32 caractere). ');
    process.exit(1);
}

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({limit:'10kb'}));

app.use('/api', rutaAutentificare);

app.use((req, res) =>
{
    res.status(404).json({ eroare: 'Ruta nu exista'});
});

app.use((err, req, res, next) =>
{
    if(res.headersSent)
    {
        return next(err);
    }

    const status = Number(err.status || err.statusCode) || 500;

    if(status >= 400 && status < 500)
    {
        return res.status(status).json({eroare: 'Cerere invalida.'});
    }

    console.error('Eroare interna: ', err);
    res.status(500).json({eroare: 'A aparut o eroare interna pe server.'});

});

app.listen(PORT, '127.0.0.1', () =>
{
    console.log(`Serverul ruleaza la adresa: http://127.0.0.1:${PORT}`);
});