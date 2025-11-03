import { createElement } from '../utils/dom.js';
import { api } from '../services/api.js';
import { getCurrentSearch } from '../components/SearchBar.js';
import { addLocalUser, deleteLocalUser, getLocalUsers, deleteLocalTodosByUserId } from '../services/storage.js';

export function UsersPage() {
  const root = createElement('div', { className: 'page users' });

  const addForm = createAddUserForm(() => reload());
  const listWrap = createElement('div', { className: 'list' });

  root.append(createElement('div', { className: 'panel' }, [
    createElement('h3', {}, ['Добавить пользователя']),
    addForm
  ]));
  root.append(createElement('div', { className: 'panel' }, [
    createElement('h3', {}, ['Пользователи']),
    listWrap
  ]));

  async function reload() {
    listWrap.innerHTML = 'Загрузка...';
    const [remote] = await Promise.allSettled([api.getUsers()]);
    let users = [];
    if (remote.status === 'fulfilled') users = remote.value;
    const locals = getLocalUsers();
    const combined = [...locals, ...users];
    const q = (getCurrentSearch() || '').toLowerCase();
    const filtered = !q ? combined : combined.filter(u =>
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
    renderUsers(listWrap, filtered, locals.map(u => String(u.id)));
  }

  // Перерисовка по кастомному событию
  root.addEventListener('reload', () => { reload(); });

  reload();
  return root;
}

function renderUsers(root, users, localIds) {
  root.innerHTML = '';
  if (!users.length) {
    root.append(createElement('div', { className: 'empty' }, ['Ничего не найдено']));
    return;
  }
  users.forEach(u => {
    const isLocal = localIds.includes(String(u.id));
    const card = createElement('div', { className: 'list-item' }, [
      createElement('div', { className: 'row' }, [
        createElement('h4', {}, [u.name || 'Без имени']),
        isLocal ? createElement('span', { className: 'badge' }, ['локально']) : null
      ]),
      createElement('div', { className: 'muted' }, [u.email || '—']),
      isLocal ? createElement('div', { className: 'row' }, [
        (() => {
          const btn = createElement('button', { className: 'btn danger' }, ['Удалить']);
          btn.addEventListener('click', () => {
            deleteLocalUser(u.id);
            deleteLocalTodosByUserId(u.id);
            const usersRoot = document.querySelector('.page.users');
            if (usersRoot) usersRoot.dispatchEvent(new Event('reload'));
          });
          return btn;
        })(),
      ]) : null
    ].filter(Boolean));

    root.append(card);
  });
  root.addEventListener('reload', () => {}); // placeholder to allow dispatch
}

function createAddUserForm(onAdded) {
  const name = createElement('input', { placeholder: 'Имя', required: true });
  const email = createElement('input', { placeholder: 'Email', type: 'email', required: true });
  const add = createElement('button', { className: 'btn' }, ['Добавить пользователя']);

  const form = createElement('div', { className: 'form' }, [
    createElement('div', { className: 'row' }, [name]),
    createElement('div', { className: 'row' }, [email]),
    createElement('div', { className: 'actions' }, [add])
  ]);

  add.addEventListener('click', () => {
    const nm = name.value.trim();
    const em = email.value.trim();
    if (!nm || !em) return;
    const id = `local-${Date.now()}`;
    addLocalUser({ id, name: nm, email: em });
    name.value = '';
    email.value = '';
    onAdded && onAdded();
  });

  return form;
}


