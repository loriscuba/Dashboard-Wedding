const assert = require('assert');
const { getGiftTypeLabel, getGiftTotals, createExternalContributor, mergeExternalContributors, getTableAssignableGuests } = require('../gift-utils.js');

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

const firstContributor = { id: 1, nome: 'Alice', importo: 80, tipo_regalo: 'Bonifico', note: 'Prima' };
const secondContributor = createExternalContributor('Bob', 50, 'Lista Nozze', 'Seconda', 2);
const mergedContributors = mergeExternalContributors([firstContributor], [secondContributor]);
assert.strictEqual(mergedContributors.length, 2);
assert.strictEqual(mergedContributors[0].nome, 'Alice');
assert.strictEqual(mergedContributors[1].nome, 'Bob');

const assignableGuests = getTableAssignableGuests({
  guests: [{ id: 1, nome: 'Marco', tavolo: '' }, { id: 2, nome: 'Luca', tavolo: 'Tavolo 2' }],
  children: [{ id: 10, nome: 'Sofia', tavolo: '' }],
});
assert.strictEqual(assignableGuests.length, 3);
assert.strictEqual(assignableGuests[0].tipo, 'adulto');
assert.strictEqual(assignableGuests[2].nome, 'Sofia');

console.log('gift-utils tests passed');
