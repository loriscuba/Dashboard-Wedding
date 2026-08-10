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
console.log('gift-utils tests passed');
