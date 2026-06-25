import { barCatalogRoutes } from '@/bar-catalog/application/BarCatalogRouter';
import { homeRoutes } from '@/home/application/HomeRouter';
import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
  ...homeRoutes(),
  ...barCatalogRoutes(),
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
