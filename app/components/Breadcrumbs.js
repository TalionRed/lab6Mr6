import { createElement, clearChildren } from '../utils/dom.js';
import { routeConfig } from '../routes.js';
import { navigateTo } from '../router.js';

let rootEl;

export function Breadcrumbs() {
  rootEl = createElement('div', { className: 'breadcrumbs panel' });
  renderCrumbs();
  return rootEl;
}

export function updateBreadcrumbs() {
  if (!rootEl) return;
  renderCrumbs();
}

function renderCrumbs() {
  clearChildren(rootEl);
  const hash = location.hash || '#users';
  const segments = hash.replace(/^#/, '').split('#').filter(Boolean);

  const chain = [];
  if (segments[0] === 'users') chain.push({ title: 'Пользователи', hash: '#users' });
  if (segments[1] === 'todos') chain.push({ title: 'Тудушки', hash: '#users#todos' });
  if (segments[1] === 'posts') chain.push({ title: 'Посты', hash: '#users#posts' });
  if (segments[2] === 'comments') chain.push({ title: 'Комменты', hash: '#users#posts#comments' });

  if (chain.length === 0) chain.push({ title: 'Пользователи', hash: '#users' });

  const row = createElement('div');
  chain.forEach((c, i) => {
    const link = createElement('a', { href: c.hash }, [c.title]);
    link.addEventListener('click', (e) => { e.preventDefault(); navigateTo(c.hash); });
    row.append(link);
    if (i < chain.length - 1) row.append(createElement('span', { className: 'sep' }, ['›']));
  });
  rootEl.append(row);
}


