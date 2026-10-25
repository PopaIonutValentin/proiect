const lungimeMinima = 15;
const lungimeMaxima = 128;

function esteRepetitie(text)
{
    return /^([\s\S]+?)\1+$/.test(text);
}

function esteSecventa(text)
{
    let directie = 0;

    for(let i=1; i<text.length; i++)
    {
        let pas = text.charCodeAt(i) - text.charCodeAt(i-1);

        if(text[i-1] === '9' && text[i] === '0')
        {
            pas = 1;
        }
        else if(text[i-1] === '0' && text[i] ==='9')
        {
            pas = -1;
        }

        if(pas !== 1 && pas !== -1)
        {
            return false;
        }

        if(directie === 0)
        {
            directie=pas;
        }
        else if(pas !== directie)
        {
            return false;
        }
    }
    return true;
}

function valideazaParola(parola, numeUtilizator)
{
    if(typeof parola !== 'string')
    {
        return 'Parola este obligatorie.';
    }

    const lungime =[...parola.normalize('NFC')].length;

    if(lungime < lungimeMinima)
    {
        return `Parola trebuie sa aiba cel putin ${lungimeMinima} caractere.`;
    }
    if(lungime > lungimeMaxima)
    {
        return `Parola poate avea cel mult ${lungimeMaxima} caractere`;
    }

    const simplificata = parola.toLowerCase();

    if(esteRepetitie(simplificata) || esteSecventa(simplificata))
    {
        return 'Parola este prea previzibila (o secventa sau o repetitie). Incearca o fraza din mai multe cuvinte.';
    }

    if (typeof numeUtilizator ==='string' && simplificata === numeUtilizator.toLowerCase())
    {
        return 'Parola nu poate fi identica cu numele de utilizator.';
    }

    return null;
}

module.exports={valideazaParola};