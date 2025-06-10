import Home from '../pages/Home';
import Tasks from '../pages/Tasks';
import Settings from '../pages/Settings';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);