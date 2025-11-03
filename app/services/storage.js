const USERS_KEY = 'localUsers';
const TODOS_KEY = 'localTodos';

export function getLocalUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function saveLocalUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function addLocalUser(user) {
  const users = getLocalUsers();
  users.push(user);
  saveLocalUsers(users);
}

export function deleteLocalUser(id) {
  const users = getLocalUsers().filter(u => String(u.id) !== String(id));
  saveLocalUsers(users);
}

export function getLocalTodos() {
  return JSON.parse(localStorage.getItem(TODOS_KEY) || '[]');
}

export function saveLocalTodos(todos) {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

export function addLocalTodo(todo) {
  const todos = getLocalTodos();
  todos.push(todo);
  saveLocalTodos(todos);
}

export function deleteLocalTodosByUserId(userId) {
  const filtered = getLocalTodos().filter(t => String(t.userId) !== String(userId));
  saveLocalTodos(filtered);
}


