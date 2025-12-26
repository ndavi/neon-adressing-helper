import HomePage from '@/home/infrastructure/primary/HomePage.vue';
import type { RouteRecordRaw } from 'vue-router';

export const homeRoutes = (): RouteRecordRaw[] => [
  {
    path: '/',
    redirect: { name: 'Home' },
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
];
