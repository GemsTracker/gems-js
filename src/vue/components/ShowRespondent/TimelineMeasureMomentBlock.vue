<template>
  <div class="measure-moment object card">
    <h5>{{ measureMoment.name }}</h5>
    <template v-for="startDate, index in tokens" :key="index">
      <timeline-start-date-block  v-if="'tokens' in startDate && startDate.tokens.length"
       :start-date="startDate" />
    </template>
  </div>
</template>
<script>

import { computed } from 'vue';
import useTokenRepository from '../../functions/tokenRepository';
import TimelineStartDateBlock from './TimelineStartDateBlock.vue';

export default {
  props: {
    measureMoment: {
      type: Object,
      required: true,
    },
  },
  components: {
    TimelineStartDateBlock,
  },
  setup(props) {
    const { groupByDate } = useTokenRepository();

    const tokens = computed(() => groupByDate(props.measureMoment.tokens));

    return {
      tokens,
    };
  },
};
</script>
