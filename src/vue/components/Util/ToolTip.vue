<template>
  <div class="tooltip-container" ref="info">
    <slot></slot>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { Tooltip } from 'bootstrap';

export default {
  props: {
    content: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const info = ref(null);
    let infoTooltip = null;

    onMounted(() => {
      if (props.content !== null) {
        info.value.setAttribute('data-bs-toggle', 'tooltip');
        info.value.setAttribute('data-bs-title', props.content);
      }
      infoTooltip = new Tooltip(info.value);
    });

    return {
      info,
      infoTooltip,
    };
  },
};
</script>
<style scoped>
.tooltip-container {
  display: inline-block;
}
</style>
