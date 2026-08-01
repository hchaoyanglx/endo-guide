(function () {
  'use strict';
  const KEY = 'endo-favorites';
  const memory = {};
  function storage() {
    try {
      const probe = '__endo_favorite_probe__';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      return window.localStorage;
    } catch {
      return {
        getItem: (key) => Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null,
        setItem: (key, value) => { memory[key] = String(value); },
        removeItem: (key) => { delete memory[key]; }
      };
    }
  }
  const store = storage();
  function read() {
    try {
      const rows = JSON.parse(store.getItem(KEY) || '[]');
      return Array.isArray(rows) ? rows.filter(row => row && row.id && row.title) : [];
    } catch {
      return [];
    }
  }
  function normalize(item) {
    const route = String(item.route || '');
    const key = String(item.key ?? '');
    const title = String(item.title || '').trim();
    return {
      id: String(item.id || `${route}:${key || title}`),
      kind: String(item.kind || '学习卡'),
      title,
      route,
      key,
      savedAt: item.savedAt || Date.now()
    };
  }
  function save(rows) {
    store.setItem(KEY, JSON.stringify(rows.slice(0, 200)));
  }
  function encode(item) {
    return encodeURIComponent(JSON.stringify(normalize(item)));
  }
  function decode(value) {
    try { return normalize(JSON.parse(decodeURIComponent(value))); } catch { return null; }
  }
  function isFavorite(id) { return read().some(row => row.id === id); }
  function button(item, extraClass) {
    const row = normalize(item);
    const active = isFavorite(row.id);
    return `<button type="button" class="favorite-control${extraClass ? ` ${extraClass}` : ''}${active ? ' is-favorite' : ''}" data-favorite="${encode(row)}" aria-pressed="${active}" aria-label="${active ? '取消收藏' : '收藏'}">${active ? '★ 已收藏' : '☆ 收藏'}</button>`;
  }
  function toggle(item) {
    const row = normalize(item);
    const rows = read();
    const index = rows.findIndex(x => x.id === row.id);
    if (index >= 0) rows.splice(index, 1);
    else rows.unshift(row);
    save(rows);
    return index < 0;
  }
  function updateButtons() {
    document.querySelectorAll('[data-favorite]').forEach(buttonNode => {
      const row = decode(buttonNode.dataset.favorite);
      if (!row) return;
      const active = isFavorite(row.id);
      buttonNode.classList.toggle('is-favorite', active);
      buttonNode.setAttribute('aria-pressed', String(active));
      buttonNode.setAttribute('aria-label', active ? '取消收藏' : '收藏');
      buttonNode.textContent = active ? '★ 已收藏' : '☆ 收藏';
    });
  }
  document.addEventListener('click', event => {
    const buttonNode = event.target.closest('[data-favorite]');
    if (!buttonNode) return;
    event.preventDefault();
    event.stopPropagation();
    const row = decode(buttonNode.dataset.favorite);
    if (!row) return;
    const added = toggle(row);
    updateButtons();
    window.dispatchEvent(new CustomEvent('endo:favorites-change', { detail: { item: row, added } }));
  });
  window.endoFavorites = {
    key: KEY,
    get: read,
    isFavorite,
    button,
    toggle,
    updateButtons,
    decode
  };
})();
