import '@mdi/font/css/materialdesignicons.css';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import AppVue from './AppVue.vue';
import router from './router';
// seed4j-needle-main-ts-import

const vuetify = createVuetify();

const app = createApp(AppVue);
app.use(router);
app.use(vuetify);
// seed4j-needle-main-ts-provider
app.mount('#app');
