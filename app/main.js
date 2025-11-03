import { initRouter, navigateTo } from './router.js';
import { createElement } from './utils/dom.js';
import { Breadcrumbs } from './components/Breadcrumbs.js';
import { SearchBar } from './components/SearchBar.js';
import { routeConfig, getPageComponent } from './routes.js';

const appRoot = document.getElementById('app');

function mountShell() {
  appRoot.innerHTML = '';

  const header = createElement('div', { className: 'header' }, [
    createElement('div', { className: 'logo', ariaLabel: 'Логотип' }),
    createElement('div', { className: 'title' }, [
      'магистр черкис и бобров'
    ])
  ]);

  const nav = createElement('div', { className: 'nav' }, [
    linkBtn('#users', 'Пользователи'),
    linkBtn('#users#todos', 'Тудушки'),
    linkBtn('#users#posts', 'Посты'),
    linkBtn('#users#posts#comments', 'Комменты')
  ]);

  const crumbs = Breadcrumbs();

  const toolbar = createElement('div', { className: 'toolbar' }, [
    SearchBar()
  ]);

  const content = createElement('div', { id: 'content', className: 'panel' });

  appRoot.append(header, nav, crumbs, toolbar, content);
}

function linkBtn(hash, label) {
  const a = createElement('a', { href: hash }, [label]);
  if (location.hash === hash) a.classList.add('active');
  a.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(hash);
  });
  return a;
}

export function renderRoute() {
  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = '';

  const hash = location.hash || '#users';
  const segments = hash.replace(/^#/, '').split('#').filter(Boolean);
  const Page = getPageComponent(segments);
  const pageEl = Page({ segments });
  content.appendChild(pageEl);

  // Update nav active state
  document.querySelectorAll('.nav a').forEach(a => {
    if (a.getAttribute('href') === hash) a.classList.add('active');
    else a.classList.remove('active');
  });
}

function boot() {
  mountShell();
  initRouter(renderRoute);
  renderRoute();
}

boot();


