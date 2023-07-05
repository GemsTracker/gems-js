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
        <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
      </ul>
    </div>
    <div v-if="info.length" class="card text-bg-light">
      <div class="card-body">
        <p v-for="(message, index) in info" :key="index" class="info">
          {{ message }}
        </p>
      </div>
    </div>
    <div v-if="errorMessage">
        <h4>A communication error occurred!</h4>
        <p>{{ errorMessage }}</p>
        <p class="centerAlign" v-if="errorLink"><a :href="errorLink" class="actionlink btn" target="_blank">Open error link in new tab</a></p>
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
    errorLink: {
      type: String,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    initUrl: {
      type: String,
      default: null,
    },
    runUrl: {
      type: String,
      default: null,
    },
    downloadUrl: {
      type: String,
      default: null,
    },
    restartLoad: {
      type: Boolean,
      default: false,
    },
    restartUrl: {
      type: String,
      default: null,
    },
  },
  components: {
    ProgressBar,
  },
  setup(props) {
    const batchCount = ref(0);
    const finished = ref(false);
    const errorLink = ref(null);
    const errorMessage = ref(null);
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

    async function fetchUrl(url) {
        var output;

        errorLink.value = url;
        console.log(url);
        output = await axios.get(url)
          .catch(function (error) {
              var message = error.message;

              if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  // console.log(error.response.data);
                  if (! message) {
                      if (500 === error.response.status) {
                          message = "The server could not handle your request.";
                      } else {
                          message = "We got an error from you server!"
                      }
                  }
              } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  // console.log(error.request);
                  if (! message) {
                      message = "The server did not react in time."
                  }
              } else {
                  // Something happened in setting up the request that triggered an Error
                  // console.log('Error', error.message);
                  if (! message) {
                      message = "Some error occured, but we have no information on it."
                  }
              }
              errorMessage.value = message;
              finished.value = true;
              return {
                  'messages': message,
                  'finished': true
              };
          });

        // console.log(output);
        return output;
    };

    const abort = (() => {
      emergencyStop.value = true;
    });

    const fetchProgress = (async () => {
      const { runUrl } = props;
      const result = fetchUrl(runUrl);

      if ('data' in result) {
        if ('percent' in result.data) {
          progress.value = result.data.percent * 100;
          if (progress.value === 100) {
            finished.value = true;
          }
        }
        if ('messages' in result.data && result.data.messages !== null) {
          messages.value = result.data.messages;
        }
        if ('finished' in result.data) {
          finished.value = result.data.finished;
          if (finished.value && props.downloadUrl) {
            // console.log(props.downloadUrl);
            window.location.href = props.downloadUrl;
          } else {
              return;
          }
        }
      }
      // console.log(result.data);
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
      const { initUrl } = props;
      const result = await fetchUrl(initUrl);
      if ('data' in result) {
        initialized.value = true;
        // console.log(result.data)
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
      const { restartUrl } = props;
      // console.log(restartUrl, props.restartLoad);
      if (props.restartLoad) {
        window.location.href = restartUrl;
      }
      // const result = await axios.get(restartUrl);
      const result = await fetchUrl(restartUrl);
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
        await start();
      }
    });

    return {
      abort,
      batchCount,
      emergencyStop,
      errorLink,
      errorMessage,
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
