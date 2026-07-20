<template>
  <twig-r-t-e-element
      :options="options"
  />
  <div v-if="previewUrl" class="form-group">
    <div class="element-label">Preview</div>
    <div class="token-search element-container">
      <input type="text" class="form-control" v-model.trim="tokenId" :placeholder="t('Token')">
      <button type="button" class="btn" @click="setPreviewTokenId(tokenId)">
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
      </button>
      <div class="errors text-danger m-2" v-if="previewTokenValidationMessage">{{ previewTokenValidationMessage}}</div>

      <twig-server-preview v-if="previewUrl" :options="options" :preview-url="previewUrl" :tokenId="previewTokenId" />
      <twig-js-preview v-else :options="options" />

    </div>

  </div>

</template>
<script setup>
import { useI18n } from 'vue-i18n';
import {computed, onMounted, ref, watch} from 'vue';
import TwigJsPreview from '../../Util/TwigJsPreview.vue';
import TwigServerPreview from '../../Util/TwigServerPreview.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';
import TwigRTEElement from "./TwigRTEElement.vue";

library.add(faMagnifyingGlass);

const { t } = useI18n();

const props = defineProps({
  options: {
    type: Object,
    required: true,
    default: () => {},
  },
});

const previewVariables = ref({});

const newOptions = ref(props.options);

const previewUrl = computed(() => props.options.elementOptions?.previewUrl ?? null);
const variableUrl = computed(() => props.options.elementOptions?.variableUrl ?? null);

const tokenId = ref(null);
const previewTokenId = ref(null);
const previewTokenValidationMessage = ref(null);

const { formData } = useGemsFormElementFunctions(props.options);

const setPreviewTokenId = () => {
  previewTokenId.value = null;
  previewTokenValidationMessage.value = null;
  if (!/^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/.test(tokenId.value)) {
    console.log('NOT A VALID TOKEN!');
    // show validation message!
    previewTokenValidationMessage.value = t('Token invalid!');
    return;
  }
  previewTokenId.value = tokenId.value;

  //getVariables({tokenId: previewTokenId.value});
}

const getVariables = async (options) => {
  try {

    const filteredOptions = Object.entries(options).filter(([, value]) => value != null);
    const params = new URLSearchParams(filteredOptions);

    const response = await fetch(`${variableUrl.value}?${params}`);

    if (!response.ok) {
      let message = `HTTP error: ${response.status}`;
      if (response.status === 404) {
        message = t('Token not found.');
      }
      previewTokenValidationMessage.value = message;
      return;
    }
    const data = await response.json();
    console.log(data);
    previewVariables.value = data;
    newOptions.value.elementOptions.variables = data;
    return data;
  } catch (error) {
    console.log(error)
  }
};

const variableWatch = () => {
  const elementOptions = props.options.elementOptions ?? {};
  if (!('variableUrl' in elementOptions)) {
    return;
  }

  const watchedObj = computed(() =>
      Object.fromEntries(
          (elementOptions.updateVariablesOnFields ?? []).map(name => [name, formData.value[name]])
      )
  );

  watch([watchedObj, previewTokenId], ([combined, tokenId]) => {
    getVariables({...combined, tokenId});
  });
};

onMounted(() => {
  variableWatch();
});
</script>
<style>
.twig-variable {
  background: #eef2ff;
  border-radius: 3px;
  padding: 0 0.15rem;
  color: #1e3a8a;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.9em;
  white-space: nowrap;
  &::before { content: '{{ '; }
  &::after  { content: ' }}'; }
}
</style>