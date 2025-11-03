import { createElement } from '../utils/dom.js';
import { api } from '../services/api.js';
import { getCurrentSearch } from '../components/SearchBar.js';
import { addLocalComment, getLocalComments, deleteLocalComment } from '../services/storage.js';

export function CommentsPage() {
  const root = createElement('div', { className: 'page comments' });
  const addForm = createAddCommentForm(() => reload());
  const list = createElement('div', { className: 'list' });
  root.append(createElement('div', { className: 'panel' }, [
    createElement('h3', {}, ['Добавить комментарий']),
    addForm
  ]));
  root.append(createElement('div', { className: 'panel' }, [
    createElement('h3', {}, ['Комменты']),
    list
  ]));

  async function reload() {
    list.innerHTML = 'Загрузка...';
    const res = await Promise.allSettled([api.getComments()]);
    const remote = res[0].status === 'fulfilled' ? res[0].value : [];
    const local = getLocalComments();
    const combined = [...local, ...remote];
    const q = (getCurrentSearch() || '').toLowerCase();
    const filtered = !q ? combined : combined.filter(c =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.body && c.body.toLowerCase().includes(q))
    );
    renderComments(list, filtered);
  }

  // Перерисовка по кастомному событию
  root.addEventListener('reload', () => { reload(); });

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
    const isLocal = String(c.id || '').startsWith('local-');
    root.append(createElement('div', { className: 'list-item' }, [
      createElement('div', { className: 'row' }, [
        createElement('h4', {}, [c.name || 'Без названия']),
        createElement('span', { className: 'badge' }, [isLocal ? 'локально' : 'post#', c.postId])
      ]),
      createElement('div', { className: 'muted' }, [c.body || '—']),
      isLocal ? (() => {
        const actions = createElement('div', { className: 'actions' });
        const del = createElement('button', { className: 'btn danger' }, ['Удалить комментарий']);
        del.addEventListener('click', () => {
          deleteLocalComment(c.id);
          const commentsRoot = document.querySelector('.page.comments');
          if (commentsRoot) commentsRoot.dispatchEvent(new Event('reload'));
        });
        actions.append(del);
        return actions;
      })() : null
    ]));
  });
}

function createAddCommentForm(onAdded) {
  const postId = createElement('input', { placeholder: 'ID поста (существующий или local-*)', required: true });
  const name = createElement('input', { placeholder: 'Заголовок/имя', required: true });
  const body = createElement('textarea', { placeholder: 'Текст комментария', required: true });
  const add = createElement('button', { className: 'btn' }, ['Добавить комментарий']);

  const form = createElement('div', { className: 'form' }, [
    createElement('div', { className: 'row' }, [postId]),
    createElement('div', { className: 'row' }, [name]),
    createElement('div', { className: 'row' }, [body]),
    createElement('div', { className: 'actions' }, [add])
  ]);

  add.addEventListener('click', () => {
    const pid = postId.value.trim();
    const nm = name.value.trim();
    const bd = body.value.trim();
    if (!pid || !nm || !bd) return;
    addLocalComment({ id: `local-${Date.now()}`, postId: pid, name: nm, body: bd });
    postId.value = '';
    name.value = '';
    body.value = '';
    onAdded && onAdded();
  });

  return form;
}


