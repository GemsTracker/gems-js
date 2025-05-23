<template>
  <div class="owner-block actor">
    <h6 @click="toggleOpened" class="owner-type-title">
      <span v-if="!opened"><font-awesome-icon icon="square-plus" /></span>
      <span v-if="opened"><font-awesome-icon icon="square-minus" /></span>
      {{ answererLabel }}
    </h6>
    <div v-if="!opened" @click="toggleOpened" class="item-legenda row">
      <template v-for="statusGroup, index in tokensByStatus" :key="index">
        <div v-if="'tokens' in answerer && answerer.tokens.length"
             :class="getStatusClass(statusGroup.status)" class="legenda-item col card">
          {{ statusGroup.tokens.length }}
        </div>
      </template>
    </div>
    <div v-if="opened" class="token-items">
      <timeline-token v-for="token, index in answerer.tokens" :key="index" :token="token">
      </timeline-token>
    </div>
  </div>
</template>
<script>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSquareMinus, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import useTokenRepository from '../../functions/tokenRepository';
import useTimelineTokens from '../../functions/useTimelineTokens';
import TimelineToken from './TimelineToken.vue';

library.add(faSquareMinus, faSquarePlus);

export default {
  props: {
    answerer: {
      type: Object,
      required: true,
    },
  },
  components: {
    FontAwesomeIcon, TimelineToken,
  },
  setup(props) {
    const { groupByStatus } = useTokenRepository();
    const opened = ref(false);

    const { t } = useI18n();

    const { getStatusClass } = useTimelineTokens();

    const toggleOpened = (() => {
      opened.value = !opened.value;
    });

    const answererLabel = computed(() => {
      if ('type' in props.answerer) {
        return props.answerer.type;
      }
      return null;
    });

    const tokensByStatus = computed(() => groupByStatus(props.answerer.tokens));

    return {
      answererLabel,
      getStatusClass,
      opened,
      toggleOpened,
      tokensByStatus,
    };
  },
};
</script>
