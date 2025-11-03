const USERS_KEY = 'localUsers';
const TODOS_KEY = 'localTodos';
const POSTS_KEY = 'localPosts';
const COMMENTS_KEY = 'localComments';

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

export function updateLocalTodo(id, patch) {
  const todos = getLocalTodos().map(t => {
    if (String(t.id) === String(id)) {
      return { ...t, ...patch };
    }
    return t;
  });
  saveLocalTodos(todos);
}

// Posts
export function getLocalPosts() {
  return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
}

export function saveLocalPosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function addLocalPost(post) {
  const posts = getLocalPosts();
  posts.push(post);
  saveLocalPosts(posts);
}

// Comments
export function getLocalComments() {
  return JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
}

export function saveLocalComments(comments) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

export function addLocalComment(comment) {
  const comments = getLocalComments();
  comments.push(comment);
  saveLocalComments(comments);
}


