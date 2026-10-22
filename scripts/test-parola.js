const {hashParola, verificareParola} = require('./src/utils/parola');

async function test()
{
    const salvat = await hashParola('test parola 1234');
    console.log('Salvat:', salvat);
    console.log('Corecta:', await verificareParola ('test parola 1234', salvat));
    console.log('Gresit:', await verificareParola('alta parola', salvat));
    console.log('Al doilea hash:', await hashParola('test parola 1234'));

}

test();