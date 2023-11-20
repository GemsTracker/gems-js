<template>
  <div class="token-progress">
    {{ completedCount }}/{{ totalCount }}
  </div>
</template>
<script>
import { computed } from 'vue';

export default {
  props: {
    tokens: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const completedCount = computed(() => props.tokens.filter((token) => token.status === 'completed').length);
    const totalCount = computed(() => props.tokens.length);

    return {
      completedCount,
      totalCount,
    };
  },
};
</script>
