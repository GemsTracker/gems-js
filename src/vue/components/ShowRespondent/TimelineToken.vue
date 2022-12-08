<template>
  <div class="token-item card" :class="statusClass">
    <div class="tokenwrapper row">
      <div class="token-link col">
        <tool-tip :content="tokenTooltip">
          <a v-if="tokenLink !== null" :href="tokenLink">{{ token.focus.display }}</a>
        </tool-tip>
        <span v-if="tokenLink === null">{{ token.focus.display }}</span>
      </div>
      <div class="token-utils col-4">
        <tool-tip data-bs-toggle="tooltip" data-bs-title="Copy" class="icon">
          <font-awesome-icon icon="fa-regular fa-clipboard" />
        </tool-tip>
        <tool-tip content="Details" class="icon">
          <font-awesome-icon icon="fa-solid fa-ellipsis" />
        </tool-tip>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import ToolTip from '../Util/ToolTip.vue';
import useTimelineTokens from '../../functions/useTimelineTokens';
import useModelStore from '../../stores/modelRepository';

library.add(faClipboard, faEllipsis);

export default {
  props: {
    token: {
      type: Object,
      required: true,
    },
  },
  components: {
    FontAwesomeIcon, ToolTip,
  },
  setup(props) {
    const { getStatusClass } = useTimelineTokens();
    const modelStore = useModelStore();
    const currentLocale = computed(() => modelStore.locale);

    const tokenLink = computed(() => {
      if (props.token.status === 'in-progress' || props.token.status === 'requested') {
        return props.token.surveyUrl;
      }
      return null;
    });

    const tokenTooltip = computed(() => {
      if (props.token.status === 'in-progress' || props.token.status === 'requested') {
        if ('executionPeriod' in props.token && 'end' in props.token.executionPeriod && props.token.executionPeriod.end !== null) {
          const date = new Date(props.token.executionPeriod.end);
          return `Open until ${date.toLocaleDateString(currentLocale.value)}`;
        }
        return null;
      }
      return null;
    });

    const statusClass = computed(() => getStatusClass(props.token.status));

    return {
      statusClass,
      tokenLink,
      tokenTooltip,
    };
  },
};
</script>
