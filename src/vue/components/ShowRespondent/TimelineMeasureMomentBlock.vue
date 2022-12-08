<template>
  <div class="measure-moment object">
    <h5>{{ measureMoment.name }}</h5>
    <timeline-start-date-block v-for="startDate, index in tokens"
      :key="index" :start-date="startDate" />
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
