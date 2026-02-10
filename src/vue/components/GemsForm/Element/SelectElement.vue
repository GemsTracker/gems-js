<template>
  <div v-if="visible" class="form-group" :class="groupClass">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container max-w-full">
      <vue-select v-model="testValue" :options="formOptions" label="value"
        :reduce="value => value.key" :style="'width: '+ selectWidth +'rem; max-width: 100%;'"
        :disabled="disabled" :placeholder="placeholder"/>
      <!-- <select v-model="formValue">
        <option :value="null"></option>
        <option v-for="(option, index) in formOptions" :key="index" :value="option.key">
          {{option.value}}
        </option>
      </select> -->
      <loading-screen v-if="loadingReferenceData" size="1.25rem" />
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script setup>
import {
  computed,
  onMounted,
} from 'vue';

// import Multiselect from 'vue-multiselect';
import VueSelect from 'vue-select';

import 'vue-select/dist/vue-select.css';

import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';

import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';
import LoadingScreen from '../../Util/LoadingScreen.vue';
import useGemsFormMultiOptionFunctions from '../../../functions/gemsFormMultiOptionFunctions';

const props = defineProps({
  options: {
    type: Object,
    required: true,
    default: () => {},
  },
});
const {
  disabled,
  elementId,
  formValue,
  formValue: testValue,
  formData,
  serverValidator,
  validator,
  validatorClass,
  visible,
} = useGemsFormElementFunctions(props.options);

const elementOptions = computed(() => props.options);

const {
  formOptions,
  initSingleAnswerElement,
  loadingReferenceData,
  referenceOptions,
} = useGemsFormMultiOptionFunctions(elementOptions, formValue, formData);

const selectWidth = computed(() => {
  let length = 0;
  if (formOptions.value.length) {
    formOptions.value.forEach((option) => {
      if (option.value !== null && option.value.length > length) {
        length = option.value.length;
      }
    });
  }
  return length;
});

const placeholder = computed(() => props.options.elementOptions?.placeholder ?? '');
const groupClass = computed(() => props.options.elementOptions?.groupClass ?? '');

onMounted(() => {
  initSingleAnswerElement();
});
</script>
<style>
.v-select {
  display: inline-block;
  width: auto;
  min-width: 11em;
  background-color: white;
}
.vs__actions {
  cursor: pointer;
}
.vs--single.vs--open .vs__selected { position: inherit; }
</style>
