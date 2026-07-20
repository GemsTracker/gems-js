<template>
  <div class="element-container">
    <input type="text" class="form-control" v-model="previewTokenId" :placeholder="t('Token')">
    <button type="button" class="btn" @click="setPreviewVariables">
      <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
    </button>
    <div class="errors text-danger m-2" v-if="previewTokenValidationMessage">{{ previewTokenValidationMessage}}</div>
    <div class="preview card mt-4">
      <twig-rendered-text :text="formValue" :variables="previewVariables" />
    </div>
    <div v-if="Object.keys(previewVariables).length">
      <a @click="showVariables = !showVariables">{{ t('Show variables') }}</a>
      <div class="show-variables" v-if="showVariables">
        <table>
          <tr v-for="(value, key, index) in previewVariables">
            <th>{{ key}}</th>
            <td v-if="typeof value === 'string'">{{ value }}</td>
            <td v-else>
              <table>
                <tr v-for="(answer, type, questionIndex) in value">
                  <th>{{ type}}</th>
                  <td>{{ answer }}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import TwigRenderedText from './TwigRenderedText.vue';
import useGemsFormElementFunctions from '../../functions/gemsFormElementFunctions';

library.add(faMagnifyingGlass);

const { t } = useI18n();

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
  variableUrl: {
    type: String,
    required: true,
  }
});

const { formValue } = useGemsFormElementFunctions(props.options);

const previewTokenId = ref(null);

const previewTokenValidationMessage = ref(null);

const previewVariables = ref({});

const setPreviewVariables = (async () => {
  if (props.variableUrl === null) {
    return;
  }
  const tokenId = previewTokenId.value;
  previewTokenValidationMessage.value = null;
  if (!/^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/.test(tokenId)) {
    console.log('NOT A VALID TOKEN!');
    // show validation message!
    previewTokenValidationMessage.value = t('Token invalid!');
    return;
  }
  try {
    const response = await fetch(`${props.variableUrl.value}/${tokenId}`);

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
    return data;
  } catch (error) {
    console.log(error)
  }
});
</script>