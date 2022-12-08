<template>
  <div class="start-date-block">
    <h6 class="start-date">{{ displayDate }}</h6>
    <timeline-owner-block v-for="owner, index in tokens"
      :key="index" :owner="owner" />
  </div>
</template>
<script>
import { computed } from 'vue';
import useTokenRepository from '../../functions/tokenRepository';
import TimelineOwnerBlock from './TimelineOwnerBlock.vue';
import useDateFunctions from '../../functions/DateFunctions';

export default {
  props: {
    startDate: {
      type: Object,
      required: true,
    },
  },
  components: {
    TimelineOwnerBlock,
  },
  setup(props) {
    const { groupByOwner } = useTokenRepository();

    const { formatJsonDate } = useDateFunctions();

    const displayDate = computed(() => {
      if (props.startDate.start !== null) {
        return formatJsonDate(props.startDate.start);
      }
      return null;
    });

    const tokens = computed(() => groupByOwner(props.startDate.tokens));

    return {
      displayDate,
      tokens,
    };
  },
};
</script>
