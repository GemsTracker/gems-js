<template>
  <div class="start-date-block">
    <h6 class="start-date">{{ displayDate }}</h6>
    <template v-for="answerer, index in tokens" :key="index">
      <timeline-answerer-block  v-if="'tokens' in answerer && answerer.tokens.length" :answerer="answerer" />
    </template>
  </div>
</template>
<script>
import { computed } from 'vue';
import useTokenRepository from '../../functions/tokenRepository';
import TimelineAnswererBlock from './TimelineAnswererBlock.vue';
import useDateFunctions from '../../functions/DateFunctions';

export default {
  props: {
    startDate: {
      type: Object,
      required: true,
    },
  },
  components: {
    TimelineAnswererBlock,
  },
  setup(props) {
    const { groupByAnswerer } = useTokenRepository();

    const { formatJsonDate } = useDateFunctions();

    const displayDate = computed(() => {
      if (props.startDate.start !== null) {
        return formatJsonDate(props.startDate.start);
      }
      return null;
    });

    const tokens = computed(() => groupByAnswerer(props.startDate.tokens));

    return {
      displayDate,
      tokens,
    };
  },
};
</script>
