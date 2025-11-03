import { createElement } from '../utils/dom.js';
import { api } from '../services/api.js';
import { getCurrentSearch } from '../components/SearchBar.js';
import { addLocalPost, getLocalPosts } from '../services/storage.js';

export function PostsPage() {
  const root = createElement('div', { className: 'page posts' });
  const addForm = createAddPostForm(() => reload());
  const list = createElement('div', { className: 'list' });
  root.append(createElement('div', { className: 'panel' }, [
    createElement('h3', {}, ['Добавить пост']),
    addForm
  ]));
  root.append(createElement('div', { className: 'panel' }, [
    createElement('h3', {}, ['Посты']),
    list
  ]));

  async function reload() {
    list.innerHTML = 'Загрузка...';
    const res = await Promise.allSettled([api.getPosts()]);
    const remote = res[0].status === 'fulfilled' ? res[0].value : [];
    const local = getLocalPosts();
    const combined = [...local, ...remote];
    const q = (getCurrentSearch() || '').toLowerCase();
    const filtered = !q ? combined : combined.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.body && p.body.toLowerCase().includes(q))
    );
    renderPosts(list, filtered);
  }

  // Перерисовка по кастомному событию
  root.addEventListener('reload', () => { reload(); });

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
    const isLocal = String(p.id || '').startsWith('local-');
    root.append(createElement('div', { className: 'list-item' }, [
      createElement('div', { className: 'row' }, [
        createElement('h4', {}, [p.title || 'Без названия']),
        isLocal ? createElement('span', { className: 'badge' }, ['локально']) : null
      ].filter(Boolean)),
      createElement('div', { className: 'muted' }, [p.body || '—'])
    ]));
  });
}

function createAddPostForm(onAdded) {
  const userId = createElement('input', { placeholder: 'ID пользователя (существующий или local-*)', required: true });
  const title = createElement('input', { placeholder: 'Заголовок', required: true });
  const body = createElement('textarea', { placeholder: 'Текст поста', required: true });
  const add = createElement('button', { className: 'btn' }, ['Добавить пост']);

  const form = createElement('div', { className: 'form' }, [
    createElement('div', { className: 'row' }, [userId]),
    createElement('div', { className: 'row' }, [title]),
    createElement('div', { className: 'row' }, [body]),
    createElement('div', { className: 'actions' }, [add])
  ]);

  add.addEventListener('click', () => {
    const uid = userId.value.trim();
    const tt = title.value.trim();
    const bd = body.value.trim();
    if (!uid || !tt || !bd) return;
    addLocalPost({ id: `local-${Date.now()}`, userId: uid, title: tt, body: bd });
    userId.value = '';
    title.value = '';
    body.value = '';
    onAdded && onAdded();
  });

  return form;
}


