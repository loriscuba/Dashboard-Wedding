function getGiftTypeLabel(value) {
  if (!value) return '';
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'bonifico') return 'Bonifico';
  if (normalized === 'lista_nozze' || normalized === 'lista nozze') return 'Lista Nozze';
  return value;
}

function normalizeGiftType(value) {
  if (!value) return '';
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'bonifico') return 'bonifico';
  if (normalized === 'lista_nozze' || normalized === 'lista nozze') return 'lista_nozze';
  return normalized;
}

function isBonificoGift(value, fallback = true) {
  const normalized = normalizeGiftType(value);
  if (!normalized) return fallback;
  return normalized === 'bonifico';
}

function isListaNozzeGift(value) {
  return normalizeGiftType(value) === 'lista_nozze';
}

function getGiftTotals({ guests = [], externalContributors = [] } = {}) {
  const guestBonifico = guests
    .filter(g => isBonificoGift(g && g.tipo_regalo, true))
    .reduce((sum, g) => sum + (parseFloat(g.regalo) || 0), 0);
  const guestListaNozze = guests
    .filter(g => isListaNozzeGift(g && g.tipo_regalo))
    .reduce((sum, g) => sum + (parseFloat(g.regalo) || 0), 0);

  const extBonifico = externalContributors
    .filter(p => (parseFloat(p.importo) || 0) > 0 && isBonificoGift(p && p.tipo_regalo, true))
    .reduce((sum, p) => sum + (parseFloat(p.importo) || 0), 0);
  const extListaNozze = externalContributors
    .filter(p => (parseFloat(p.importo) || 0) > 0 && isListaNozzeGift(p && p.tipo_regalo))
    .reduce((sum, p) => sum + (parseFloat(p.importo) || 0), 0);

  const bonificoCount = guests.filter(g => (parseFloat(g.regalo) || 0) > 0 && isBonificoGift(g && g.tipo_regalo, true)).length
    + externalContributors.filter(p => (parseFloat(p.importo) || 0) > 0 && isBonificoGift(p && p.tipo_regalo, true)).length;
  const listaNozzeCount = guests.filter(g => (parseFloat(g.regalo) || 0) > 0 && isListaNozzeGift(g && g.tipo_regalo)).length
    + externalContributors.filter(p => (parseFloat(p.importo) || 0) > 0 && isListaNozzeGift(p && p.tipo_regalo)).length;

  return {
    bonifico: guestBonifico + extBonifico,
    listaNozze: guestListaNozze + extListaNozze,
    total: guestBonifico + guestListaNozze + extBonifico + extListaNozze,
    bonificoCount,
    listaNozzeCount,
  };
}

module.exports = { getGiftTypeLabel, normalizeGiftType, isBonificoGift, isListaNozzeGift, getGiftTotals };
