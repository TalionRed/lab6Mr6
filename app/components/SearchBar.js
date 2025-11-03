import { createElement, debounce } from '../utils/dom.js';

let inputEl;

export function SearchBar() {
  const initial = getQueryFromHash();
  inputEl = createElement('input', { type: 'text', placeholder: 'Поиск...', value: initial || '' });
  const wrap = createElement('div', { className: 'search panel' }, [
    createElement('span', { className: 'muted' }, ['Поиск:']),
    inputEl
  ]);

  inputEl.addEventListener('input', debounce(() => {
    setQueryToHash(inputEl.value.trim());
  }, 350));

  return wrap;
}

function getHashParts() {
  const hash = location.hash || '#users';
  const [path, query] = hash.split('?');
  return { path, query: new URLSearchParams(query || '') };
}

function setHash(path, params) {
  const qs = params.toString();
  location.hash = qs ? `${path}?${qs}` : path;
}

export function setSearchValueFromHash() {
  if (!inputEl) return;
  inputEl.value = getQueryFromHash() || '';
}

function getQueryFromHash() {
  const { query } = getHashParts();
  return query.get('q') || '';
}

function setQueryToHash(q) {
  const { path, query } = getHashParts();
  if (q) query.set('q', q); else query.delete('q');
  setHash(path, query);
}

export function getCurrentSearch() {
  return getQueryFromHash();
}


