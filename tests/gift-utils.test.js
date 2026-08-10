const assert = require('assert');
const { getGiftTypeLabel, getGiftTotals } = require('../gift-utils.js');

assert.strictEqual(getGiftTypeLabel('Bonifico'), 'Bonifico');
assert.strictEqual(getGiftTypeLabel('Lista Nozze'), 'Lista Nozze');
assert.strictEqual(getGiftTypeLabel('lista_nozze'), 'Lista Nozze');
assert.strictEqual(getGiftTypeLabel(''), '');

const totals = getGiftTotals({
  guests: [
    { regalo: 100, tipo_regalo: 'Bonifico' },
    { regalo: 80, tipo_regalo: 'Lista Nozze' },
    { regalo: 40 },
  ],
  externalContributors: [{ importo: 50 }],
});
assert.strictEqual(totals.bonifico, 190);
assert.strictEqual(totals.listaNozze, 80);
assert.strictEqual(totals.total, 270);
assert.strictEqual(totals.bonificoCount, 3);
assert.strictEqual(totals.listaNozzeCount, 1);

const mixedTotals = getGiftTotals({
  guests: [{ regalo: 100, tipo_regalo: 'Bonifico' }],
  externalContributors: [
    { importo: 70, tipo_regalo: 'Lista Nozze' },
    { importo: 30, tipo_regalo: 'Bonifico' },
  ],
});
assert.strictEqual(mixedTotals.bonifico, 130);
assert.strictEqual(mixedTotals.listaNozze, 70);
assert.strictEqual(mixedTotals.total, 200);
assert.strictEqual(mixedTotals.bonificoCount, 2);
assert.strictEqual(mixedTotals.listaNozzeCount, 1);
console.log('gift-utils tests passed');
