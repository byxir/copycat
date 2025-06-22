import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';

export const routes = [
  {
    path: '/',
    component: Dashboard,
    name: 'Dashboard'
  },
  {
    path: '*',
    component: NotFound,
    name: 'Not Found'
  }
];