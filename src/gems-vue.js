import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import appSettings from './vue/appSettings';
import translations from './locales/translations';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: translations,
});

const app = createApp(appSettings);
const pinia = createPinia();
app.use(pinia);
app.use(i18n);
app.mount('#app');
export default app;
