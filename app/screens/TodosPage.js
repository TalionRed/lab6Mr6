import { createElement } from '../utils/dom.js';
import { api } from '../services/api.js';
import { getCurrentSearch } from '../components/SearchBar.js';
import { addLocalTodo, getLocalTodos, updateLocalTodo } from '../services/storage.js';

export function TodosPage() {
  const root = createElement('div', { className: 'page todos' });

  const addForm = createAddTodoForm(() => reload());
  const listWrap = createElement('div', { className: 'list' });

  root.append(createElement('div', { className: 'panel' }, [
    createElement('h3', {}, ['Добавить тудушку']),
    addForm
  ]));
  root.append(createElement('div', { className: 'panel' }, [
    createElement('h3', {}, ['Тудушки']),
    listWrap
  ]));

  async function reload() {
    listWrap.innerHTML = 'Загрузка...';
    const [todosRes, usersRes] = await Promise.allSettled([api.getTodos(), api.getUsers()]);
    const allUsers = usersRes.status === 'fulfilled' ? usersRes.value : [];
    const remoteTodos = todosRes.status === 'fulfilled' ? todosRes.value : [];
    const local = getLocalTodos();
    const combined = [...local, ...remoteTodos];
    const q = (getCurrentSearch() || '').toLowerCase();
    const filtered = !q ? combined : combined.filter(t => (t.title || '').toLowerCase().includes(q));
    renderTodos(listWrap, filtered, new Map(allUsers.map(u => [String(u.id), u])));
  }

  // Перерисовка по кастомному событию
  root.addEventListener('reload', () => { reload(); });

  reload();
  return root;
}

function renderTodos(root, todos, userById) {
  root.innerHTML = '';
  if (!todos.length) {
    root.append(createElement('div', { className: 'empty' }, ['Ничего не найдено']));
    return;
  }
  todos.forEach(t => {
    const user = userById.get(String(t.userId));
    const done = !!t.completed;
    const isLocal = String(t.id || '').startsWith('local-');
    const item = createElement('div', { className: 'list-item' }, [
      createElement('div', { className: 'row' }, [
        createElement('h4', {}, [t.title || 'Без названия']),
        createElement('span', { className: `badge ${done ? 'todo-done' : 'todo-open'}` }, [done ? 'выполнено' : 'открыто'])
      ]),
      user ? createElement('div', { className: 'muted' }, [user.name, ' · ', user.email]) : null,
      isLocal ? (() => {
        const actions = createElement('div', { className: 'actions' });
        const toggle = createElement('button', { className: 'btn secondary' }, [done ? 'Снять выполнение' : 'Отметить выполнено']);
        toggle.addEventListener('click', () => {
          updateLocalTodo(t.id, { completed: !done });
          const todosRoot = document.querySelector('.page.todos');
          if (todosRoot) todosRoot.dispatchEvent(new Event('reload'));
        });
        actions.append(toggle);
        return actions;
      })() : null,
    ].filter(Boolean));
    root.append(item);
  });
}

function createAddTodoForm(onAdded) {
  const userId = createElement('input', { placeholder: 'ID пользователя (существующий или local-*)', required: true });
  const title = createElement('input', { placeholder: 'Название задачи', required: true });
  const add = createElement('button', { className: 'btn' }, ['Добавить тудушку']);

  const form = createElement('div', { className: 'form' }, [
    createElement('div', { className: 'row' }, [userId]),
    createElement('div', { className: 'row' }, [title]),
    createElement('div', { className: 'actions' }, [add])
  ]);

  add.addEventListener('click', () => {
    const uid = userId.value.trim();
    const tt = title.value.trim();
    if (!uid || !tt) return;
    addLocalTodo({ id: `local-${Date.now()}`, userId: uid, title: tt, completed: false });
    userId.value = '';
    title.value = '';
    onAdded && onAdded();
  });

  return form;
}


