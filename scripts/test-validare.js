const { valideazaParola } = require('../src/utils/validare-parola');

console.log('1:', valideazaParola('scurta', 'ion'));
console.log('2:', valideazaParola('123456789012345', 'ion'));
console.log('3:', valideazaParola('aaaaaaaaaaaaaaa', 'ion'));
console.log('4:', valideazaParola('ParolaParolaParola', 'ion'));
console.log('5:', valideazaParola('popaionutvalentin', 'PopaIonutValentin'));
console.log('6:', valideazaParola(12345, 'ion'));
console.log('7:', valideazaParola('cafeaua de dimineata e fierbinte', 'ion'));