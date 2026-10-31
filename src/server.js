const app = require('./app');

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '127.0.0.1', () =>
{
    console.log(`Serverul ruleaza la adresa: http://127.0.0.1:${PORT}`);
});