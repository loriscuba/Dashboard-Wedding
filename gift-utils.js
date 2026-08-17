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

function createExternalContributor(nome, importo, tipoRegalo = 'Bonifico', note = '', id = Date.now() + Math.random()) {
  const trimmedName = String(nome || '').trim();
  return {
    id: Number.isFinite(id) ? id : Date.now() + Math.random(),
    nome: trimmedName,
    importo: parseFloat(importo) || 0,
    tipo_regalo: tipoRegalo || 'Bonifico',
    note: String(note || ''),
  };
}

function mergeExternalContributors(existing = [], incoming = []) {
  const merged = [...(Array.isArray(existing) ? existing : []), ...(Array.isArray(incoming) ? incoming : [])];
  const deduplicated = [];
  const seen = new Set();

  merged.forEach(item => {
    const key = item && item.id !== undefined && item.id !== null
      ? `id:${String(item.id)}`
      : `body:${String(item && item.nome || '')}|${String(item && item.importo || '')}|${String(item && item.tipo_regalo || '')}|${String(item && item.note || '')}`;

    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(item);
    }
  });

  return deduplicated;
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

function getTableAssignableGuests({ guests = [], children = [] } = {}) {
  const adultGuests = (Array.isArray(guests) ? guests : []).map(g => ({
    id: g && g.id,
    nome: g && g.nome ? String(g.nome).trim() : '',
    tipo: 'adulto',
    tavolo: g && g.tavolo ? String(g.tavolo) : '',
  })).filter(g => g.nome);

  const childGuests = (Array.isArray(children) ? children : []).map(b => ({
    id: b && b.id,
    nome: b && b.nome ? String(b.nome).trim() : '',
    tipo: 'bambino',
    tavolo: b && b.tavolo ? String(b.tavolo) : '',
  })).filter(g => g.nome);

  return [...adultGuests, ...childGuests].sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
}

module.exports = {
  getGiftTypeLabel,
  normalizeGiftType,
  isBonificoGift,
  isListaNozzeGift,
  getGiftTotals,
  createExternalContributor,
  mergeExternalContributors,
  getTableAssignableGuests,
};
