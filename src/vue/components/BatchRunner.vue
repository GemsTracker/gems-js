<template>
  <div>
    <h3 v-if="title">{{ title }}</h3>
    <div v-if="batchCount === 0" class="alert alert-info">
      {{ translations.empty }}
    </div>
    <button v-if="!finished && !emergencyStop" @click="start"
      class="btn btn-primary" :disabled="running || !initialized || batchCount === 0">
      <template v-if="initialized">{{ translations.start }}</template>
      <template v-if="!initialized">Loading...</template>
    </button>
    <button v-if="finished || emergencyStop" @click="restart" class="btn btn-primary">
      {{ translations.restart }}
    </button>
    <progress-bar :progress="progress" />
    <button v-if="!finished" @click="abort" class="btn btn-danger" :disabled="!running">
      {{ translations.cancel }}
    </button>
    <div v-if="messages.length" class="alert alert-info" role="alert">
      <ul>
        <li v-for="message, index in messages" :key="index">{{ message }}</li>
      </ul>
    </div>
    <div v-if="info.length" class="card text-bg-light">
      <div class="card-body">
        <p v-for="message, index in info" :key="index" class="info">
          {{ message }}
        </p>
      </div>
    </div>

  </div>
</template>
<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import ProgressBar from './ProgressBar.vue';

export default {
  props: {
    title: {
      type: String,
      default: null,
    },
    autostart: {
      type: Boolean,
      default: false,
    },
    finishUrl: {
      type: String,
      default: null,
    },
  },
  components: {
    ProgressBar,
  },
  setup(props) {
    const batchCount = ref(0);
    const currentUrl = window.location.pathname;
    const finished = ref(false);
    const info = ref([]);
    const initialized = ref(false);
    const messages = ref([]);
    const progress = ref(0);
    const emergencyStop = ref(false);
    const running = ref(false);
    const translations = ref({
      start: 'Start',
      cancel: 'Cancel',
      restart: 'Restart',
    });

    const abort = (() => {
      emergencyStop.value = true;
    });

    const fetchProgress = (async () => {
      const runUrl = `${currentUrl}?progress=run`;
      console.log(currentUrl, runUrl);
      const result = await axios.get(runUrl);
      if ('data' in result) {
        if ('percent' in result.data) {
          progress.value = result.data.percent * 100;
          if (progress.value === 100) {
            finished.value = true;
            if (props.finishUrl) {
              window.location.href = props.finishUrl;
            }
          }
        }
        if ('messages' in result.data && result.data.messages !== null) {
          messages.value = result.data.messages;
        }
      }
      console.log(result.data);
    });

    const start = (async () => {
      running.value = true;
      while (finished.value !== true && emergencyStop.value !== true) {
        // eslint-disable-next-line no-await-in-loop
        await fetchProgress();
      }
      running.value = false;
    });

    const init = (async () => {
      const initUrl = `${currentUrl}?progress=init`;
      const result = await axios.get(initUrl);
      if ('data' in result) {
        initialized.value = true;
        if ('count' in result.data) {
          batchCount.value = result.data.count;
        }
        if ('translations' in result.data) {
          translations.value = result.data.translations;
        }
        if ('info' in result.data && result.data.info !== null) {
          let infoArray = result.data.info;
          if (!Array.isArray(infoArray)) {
            infoArray = [infoArray];
          }
          info.value = infoArray;
        }
      }
    });

    const restart = (async () => {
      const resetUrl = `${currentUrl}?progress=restart`;
      const result = await axios.get(resetUrl);
      if ('data' in result) {
        progress.value = 0;
        finished.value = false;
        messages.value = [];
        emergencyStop.value = false;
      }
    });

    onMounted(async () => {
      await init();
      if (props.autostart) {
        start();
      }
    });

    return {
      abort,
      batchCount,
      emergencyStop,
      finished,
      info,
      initialized,
      messages,
      progress,
      restart,
      running,
      start,
      translations,
    };
  },
};
</script>
