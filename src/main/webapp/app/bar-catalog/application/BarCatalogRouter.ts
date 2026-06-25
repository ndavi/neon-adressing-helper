import BarCatalogPage from '@/bar-catalog/infrastructure/primary/BarCatalogPage.vue';
import type { RouteRecordRaw } from 'vue-router';

export const barCatalogRoutes = (): RouteRecordRaw[] => [
  {
    path: '/bar-catalog',
    name: 'BarCatalog',
    component: BarCatalogPage,
  },
];
