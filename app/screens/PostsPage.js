import { createElement } from '../utils/dom.js';
import { api } from '../services/api.js';
import { getCurrentSearch } from '../components/SearchBar.js';

export function PostsPage() {
  const root = createElement('div', { className: 'page posts' });
  const list = createElement('div', { className: 'list' });
  root.append(createElement('div', { className: 'panel' }, [
    createElement('h3', {}, ['Посты']),
    list
  ]));

  async function reload() {
    list.innerHTML = 'Загрузка...';
    const res = await Promise.allSettled([api.getPosts()]);
    const posts = res[0].status === 'fulfilled' ? res[0].value : [];
    const q = (getCurrentSearch() || '').toLowerCase();
    const filtered = !q ? posts : posts.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.body && p.body.toLowerCase().includes(q))
    );
    renderPosts(list, filtered);
  }

  reload();
  return root;
}

function renderPosts(root, posts) {
  root.innerHTML = '';
  if (!posts.length) {
    root.append(createElement('div', { className: 'empty' }, ['Ничего не найдено']));
    return;
  }
  posts.forEach(p => {
    root.append(createElement('div', { className: 'list-item' }, [
      createElement('h4', {}, [p.title]),
      createElement('div', { className: 'muted' }, [p.body])
    ]));
  });
}


