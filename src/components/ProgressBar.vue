<template>
  <div class="progress" style="position: relative">
    <div class="progress-bar progress-bar-success" role="progressbar" :aria-valuenow="progress"
      aria-valuemin="0" aria-valuemax="100" :style="progressWidth">
    </div>
    <div class="progress-text">
      {{ progress.toFixed(2) }}%
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const progressWidth = computed(() => `width: ${props.progress}%;`);

    return {
      progressWidth,
    };
  },
};
</script>
<style scoped>
  .progress {
    position: relative;
  }
  .progress-text {
    color: #333;
    text-align: center;
    width: 100%;
    position: absolute;
  }
</style>
