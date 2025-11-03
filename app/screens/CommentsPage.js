import { createElement } from '../utils/dom.js';
import { api } from '../services/api.js';
import { getCurrentSearch } from '../components/SearchBar.js';

export function CommentsPage() {
  const root = createElement('div', { className: 'page comments' });
  const list = createElement('div', { className: 'list' });
  root.append(createElement('div', { className: 'panel' }, [
    createElement('h3', {}, ['Комменты']),
    list
  ]));

  async function reload() {
    list.innerHTML = 'Загрузка...';
    const res = await Promise.allSettled([api.getComments()]);
    const comments = res[0].status === 'fulfilled' ? res[0].value : [];
    const q = (getCurrentSearch() || '').toLowerCase();
    const filtered = !q ? comments : comments.filter(c =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.body && c.body.toLowerCase().includes(q))
    );
    renderComments(list, filtered);
  }

  reload();
  return root;
}

function renderComments(root, comments) {
  root.innerHTML = '';
  if (!comments.length) {
    root.append(createElement('div', { className: 'empty' }, ['Ничего не найдено']));
    return;
  }
  comments.forEach(c => {
    root.append(createElement('div', { className: 'list-item' }, [
      createElement('div', { className: 'row' }, [
        createElement('h4', {}, [c.name]),
        createElement('span', { className: 'badge' }, ['post#', c.postId])
      ]),
      createElement('div', { className: 'muted' }, [c.body])
    ]));
  });
}


