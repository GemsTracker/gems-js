import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import BatchRunner from './vue/components/BatchRunner.vue';
import GemsForm from './vue/components/GemsForm.vue';
import ShowRespondent from './vue/components/ShowRespondent.vue';
import nlTranslations from './locales/nl.json';
import enTranslations from './locales/en.json';

const appSettings = {
  components: {
    BatchRunner,
    GemsForm,
    ShowRespondent,
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: enTranslations,
    nl: nlTranslations,
  },
});

const app = createApp(appSettings);
const pinia = createPinia();
app.use(pinia);
app.use(i18n);
app.mount('#app');
export default app;
