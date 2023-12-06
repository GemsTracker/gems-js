<template>
  <div class="key-value-input" style="display: inline-block;">
      <input type="text" v-model="currentValue.key" class="form-control form-control-sm"/>
      <input type="text" v-model="currentValue.value" class="form-control form-control-sm"/>
  </div>
</template>
<script>
import { computed } from 'vue';

export default {
  props: {
    modelValue: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const currentValue = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        return emit('update:modelValue', value);
      },
    });

    return {
      currentValue,
    };
  },
};
</script>
