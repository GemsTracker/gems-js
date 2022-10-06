import { createApp } from 'vue';
import { createPinia } from 'pinia';
import BatchRunner from './vue/components/BatchRunner.vue';
import ShowRespondent from './vue/components/ShowRespondent.vue';

const appSettings = {
  components: {
    BatchRunner,
    ShowRespondent,
  },
};

const app = createApp(appSettings);
const pinia = createPinia();
app.use(pinia);
app.mount('#app');
export default app;
