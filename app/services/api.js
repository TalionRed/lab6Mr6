const BASE = 'https://jsonplaceholder.typicode.com';

async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error('Network error: ' + res.status);
  return res.json();
}

export const api = {
  getUsers: () => safeFetch(`${BASE}/users`),
  getTodos: () => safeFetch(`${BASE}/todos`),
  getPosts: () => safeFetch(`${BASE}/posts`),
  getComments: () => safeFetch(`${BASE}/comments`),
};


