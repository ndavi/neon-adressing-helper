import { config } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { vi } from 'vitest';

const vuetify = createVuetify({
  components,
  directives,
});

config.global.plugins = [vuetify];

vi.stubGlobal(
  'ResizeObserver',
  vi.fn().mockImplementation(function (this: any) {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
  }),
);
