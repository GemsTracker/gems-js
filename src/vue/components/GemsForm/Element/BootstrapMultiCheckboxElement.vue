<template>
  <div class="form-group multi-checkbox">
    <div>
      <gems-form-label :elementId="elementId" :options="options" />
      <span v-if="'description' in options" class="help-block"> {{options.description}}</span>
    </div>
    <div class="element-container">
      <div v-for="(formOption, index) in formOptions" :key="index" class="form-check" :class="{'checkbox-inline': inline}">
        <label class="form-check-label" >
          <input type="checkbox" v-model="formValue"
            :value="formOption.key" :disabled="disabled" class="form-check-input" />
          {{formOption.value}}
        </label>
      </div>
      <loading-screen v-if="loadingReferenceData" size="1.25rem" />
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />

    </div>
  </div>
</template>
<script setup>
import { computed, onMounted } from 'vue';

import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';
import useGemsFormMultiOptionFunctions from '../../../functions/gemsFormMultiOptionFunctions';

import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';
import LoadingScreen from '../../Util/LoadingScreen.vue';
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
  formData,
  serverValidator,
  validator,
  validatorClass,
  previousValue,
} = useGemsFormElementFunctions(props.options);

const elementOptions = computed(() => props.options);

const {
  formOptions,
  initMultipleAnswerElement,
  loadingReferenceData,
} = useGemsFormMultiOptionFunctions(elementOptions, formValue, formData);

const inline = computed(() => props.options.elementOptions?.inline ?? false);

onMounted(() => {
  initMultipleAnswerElement();
});
</script>
