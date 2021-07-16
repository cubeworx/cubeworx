import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login/Login.vue';
import Dashboard from '@/views/Dashboard/Dashboard.vue';
import Test from '@/views/Test/Test.vue';
import NotFound from '@/views/NotFound/NotFound.vue';

import dashboardRoutes from './dashboard';

const routes = [
  {
    path: '/',
    redirect: {
      name: 'Login',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: dashboardRoutes,
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
