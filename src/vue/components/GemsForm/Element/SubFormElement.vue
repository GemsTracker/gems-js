<template>
  <div>
    <gems-form-element v-for="(elementOptions, index) in structure"
        :key="index"
        :options="elementOptions" />
  </div>
</template>
<script>
import { computed, defineAsyncComponent, provide } from 'vue';

export default {
  props: {
    structure: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
  },
  components: {
    GemsFormElement: defineAsyncComponent(() => import('../GemsFormElement.vue')),
  },
  setup(props) {
    const formData = computed(() => props.formData);

    provide('formData', formData);

    return {
    };
  },
};
</script>
