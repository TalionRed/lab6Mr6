import { UsersPage } from './screens/UsersPage.js';
import { TodosPage } from './screens/TodosPage.js';
import { PostsPage } from './screens/PostsPage.js';
import { CommentsPage } from './screens/CommentsPage.js';

export const routeConfig = [
  { key: 'users', title: 'Пользователи', hash: '#users' },
  { key: 'todos', title: 'Тудушки', hash: '#users#todos' },
  { key: 'posts', title: 'Посты', hash: '#users#posts' },
  { key: 'comments', title: 'Комменты', hash: '#users#posts#comments' },
];

export function getPageComponent(segments) {
  const path = segments.join('#');
  switch (path) {
    case 'users': return UsersPage;
    case 'users#todos': return TodosPage;
    case 'users#posts': return PostsPage;
    case 'users#posts#comments': return CommentsPage;
    default: return UsersPage;
  }
}


