<template>
  <div v-if="visible" class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <div v-if="displayRaw" v-html="showValue"></div>
      <div v-else>{{ showValue }}</div>
      <input type="hidden" :name="elementId" :value="formValue" />
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';

import GemsFormLabel from '../Label.vue';

const props = defineProps({
  options: {
    type: Object,
    required: true,
    default: () => {
    },
  },
});

const { elementId, formValue, visible } = useGemsFormElementFunctions(props.options);

const showValue = computed(() => {
  if ('multiOptions' in props.options && formValue in props.options.multiOptions) {
    return props.options.multiOptions[formValue];
  }
  return formValue;
});

const displayRaw = computed(() => props.options.elementOptions?.raw === true);
</script>
