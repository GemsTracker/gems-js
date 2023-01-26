<template>
  <label v-if="'label' in options" :for="elementId"
      :class="{required: options.required === true}">
    {{options.label}}
  </label>
</template>
<script>
export default {
  props: {
    elementId: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
};
</script>
