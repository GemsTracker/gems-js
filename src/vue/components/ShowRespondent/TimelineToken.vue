<template>
  <div class="zpitem" :class="statusClass">
    <div class="tokenwrapper">
      <a v-if="tokenLink !== null" :href="tokenLink">{{ token.focus.display }}</a>
      <span v-if="tokenLink === null">{{ token.focus.display }}</span>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';
import useTimelineTokens from '../../functions/useTimelineTokens';

export default {
  props: {
    token: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { getStatusClass } = useTimelineTokens();

    const tokenLink = computed(() => {
      if (props.token.status === 'in-progress' || props.token.status === 'requested') {
        return props.token.surveyUrl;
      }
      return null;
    });

    const statusClass = computed(() => getStatusClass(props.token.status));

    return {
      statusClass,
      tokenLink,
    };
  },
};
</script>
