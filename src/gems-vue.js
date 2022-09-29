import { createApp } from 'vue';
import BatchRunner from './components/BatchRunner.vue';

const appSettings = {
  components: {
    BatchRunner,
  },
};

const app = createApp(appSettings);
app.mount('#app');
export default app;
