<template>
  <div class="owner-block actor">
    <h6 @click="toggleOpened">
      <span v-if="!opened">+</span>
      <span v-if="opened">-</span>
      {{ owner.type }}
    </h6>
    <div v-if="!opened" @click="toggleOpened" class="item-legenda row">
      <div v-for="statusGroup, index in tokensByStatus" :key="index"
        :class="getStatusClass(statusGroup.status)" class="legenda-item col card">
        {{ statusGroup.tokens.length }}
      </div>
    </div>
    <div v-if="opened" class="token-items">
      <timeline-token v-for="token, index in owner.tokens" :key="index" :token="token">
      </timeline-token>
    </div>
  </div>
</template>
<script>
import { computed, ref } from 'vue';
import useTokenRepository from '../../functions/tokenRepository';
import useTimelineTokens from '../../functions/useTimelineTokens';
import TimelineToken from './TimelineToken.vue';

export default {
  props: {
    owner: {
      type: Object,
      required: true,
    },
  },
  components: {
    TimelineToken,
  },
  setup(props) {
    const { groupByStatus } = useTokenRepository();
    const opened = ref(false);

    const { getStatusClass } = useTimelineTokens();

    const toggleOpened = (() => {
      opened.value = !opened.value;
    });

    const tokensByStatus = computed(() => groupByStatus(props.owner.tokens));

    return {
      getStatusClass,
      opened,
      toggleOpened,
      tokensByStatus,
    };
  },
};
</script>
