<template>
  <div>
    <span class="errors alert alert-danger" v-if="previewValidationMessage">
      {{ previewValidationMessage}}
    </span>
    <div class="preview card mt-4">
      <div v-html="preview"></div>
    </div>
  </div>
</template>

<script setup>

import { onMounted, onUnmounted, ref, watch } from 'vue';
import useGemsFormElementFunctions from '../../functions/gemsFormElementFunctions';

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
  previewUrl: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    required: false,
  }
});

const { formValue } = useGemsFormElementFunctions(props.options);

let previewPollInterval = 1000;

const previewValidationMessage = ref(null);
const previewValidationLine = ref(null);
const preview = ref(null);

const shouldUpdatePreview = ref(true);
const loadingPreview = ref(false);


watch(formValue, () => {
  textUpdateIteration.value++;
});

const textUpdateIteration = ref(0);
let lastSentUpdate = null;

const getPreview = async (tokenId, template) => {
  loadingPreview.value = true;
  previewValidationMessage.value = null;
  console.log('fetching preview', tokenId, template);
  const response = await fetch(props.previewUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-gems-vue': 1,
    },
    body: JSON.stringify({ tokenId, template })
  });

  console.log('response', response);

  let body = null;
  const raw = await response.text();
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch (e) {
      body = raw;
    }
  }

  loadingPreview.value = false;

  if (response.ok) {
    return {
      ok: true,
      data: body
    };
  }

  const error = body && typeof body === 'object'
      ? { error: body.error ?? response.status, type: body.error ?? 'error', message: body.message ?? response.statusText, line: body.line ?? null }
      : { error: response.status, type: 'error', message: typeof body === 'string' && body ? body : response.statusText };

  console.log('error', error);

  return { ok: false, error };
};

const checkPreview = async () => {

  //console.log('SHOULD PREVIEW', shouldUpdatePreview.value);
  //console.log('ALREADY LOADING PREVIEW', loadingPreview.value);
  //console.log('CHANGE DETECTION', textUpdateIteration.value === lastSentUpdate, textUpdateIteration.value, lastSentUpdate);


  if (shouldUpdatePreview.value === false) {
    // Skip if manually disabled
    return;
  }
  if (loadingPreview.value === true) {
    // Skip if already loading preview
    return;
  }
  if (textUpdateIteration.value === lastSentUpdate) {
    // This text version has already been sent
    return;
  }

  const snapshot = textUpdateIteration.value;
  lastSentUpdate = snapshot;

  try {
    const result = await getPreview(props.tokenId, formValue.value);

    if (lastSentUpdate !== textUpdateIteration.value) {
      return;
    }

    if (result.ok) {
      previewValidationMessage.value = null;
      previewValidationLine.value = null;
      if (result.data !== null && typeof result.data === 'object' && 'template' in result.data) {
        preview.value = result.data.template;
      } else {
        preview.value = null;
      }

    } else {
      console.log('preview error!', result.error.message);
      previewValidationMessage.value = result.error.message;
      if (result.error.type === 'twig_syntax_error') {
        previewValidationMessage.value = `Twig syntax error: ${result.error.message} (line ${result.error.line})`;
      }

      previewValidationLine.value = result.error.line ?? null;
    }
  } catch (e) {
    // network failure / fetch threw — never got a response
    if (snapshot !== textUpdateIteration.value) {
      return;
    }
    previewValidationMessage.value = { error: 'network', message: e.message }
    if (lastSentUpdate === snapshot) {
      console.log('RESETTING LAST SENT UPDATE', e);
      lastSentUpdate = null
    }
  }
};


const intervalId = ref(null);
const stopInterval = () => {
  if (intervalId.value === null) {
    return;
  }
  clearInterval(intervalId.value);
  intervalId.value = null;
};

const startInterval = () => {
  stopInterval();
  checkPreview();
  intervalId.value = setInterval(checkPreview, previewPollInterval);
}

watch(props.tokenId, () => {
  if (props.tokenId !== null) {
    getPreview(props.tokenId, formValue.value);
  }
});

onMounted(() => {
  startInterval();
});
onUnmounted(() => {
  stopInterval();
});
</script>