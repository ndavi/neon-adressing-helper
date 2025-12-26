import HomePage from '@/home/infrastructure/primary/HomePage.vue';
import { routes } from '@/router';
import { mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { createRouter, createWebHistory, type Router } from 'vue-router';

let router: Router;
beforeEach(() => {
  router = createRouter({
    history: createWebHistory(),
    routes,
  });
});

const wrap = (): VueWrapper => {
  return mount(
    {
      template: '<v-app><HomePage /></v-app>',
    },
    {
      global: {
        plugins: [router],
        components: {
          HomePage,
        },
      },
    },
  );
};

describe('Router', () => {
  describe.for(['/', '/home'])('Navigation on Home', url => {
    it(`should navigate on Home when the URL is ${url}`, async () => {
      await router.push(url);

      const wrapper = wrap();

      expect(wrapper.html()).toContain('Nombre de contrôleurs');
    });
  });
});
