const {test} = require ('node:test');
const assert = require ('node:assert/strict');
const {valideazaNumeUtilizator, valideazaEmail} = require('../src/utils/validare-utilizator');

test('accepta un nume de utilizator valid', () =>
{
    assert.equal(valideazaNumeUtilizator('alexandrea.popa'),null);
});

test('respinge numele cu caractere interzise', () => 
{
    assert.match(valideazaNumeUtilizator('ana<script>'), /3-30 caractere/);
});

test('respinge numele prea scurt', () =>
{
    assert.match(valideazaNumeUtilizator('ab'), /3-30 caractere/)
});

test('accepta un email valid', () =>
{
    assert.equal(valideazaEmail('alexandra@exemplu.ro'), null);
});

test('respinge emailul fara @', () =>
{
    assert.match(valideazaEmail('alexandra.exemplu.ro'), /format valid/);
});

test('respinge emailul prea lung', () =>
{
    assert.match(valideazaEmail('a'.repeat(250)+'@x.ro'), /cel mult 254/);
});

