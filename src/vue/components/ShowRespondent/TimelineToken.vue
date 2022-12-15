<template>
  <div class="token-item card" :class="statusClass">
    <div class="tokenwrapper row">
      <div class="token-link col">
        <tool-tip :content="tokenTooltip">
          <a v-if="tokenLink !== null" :href="tokenLink">{{ token.focus.display }}</a>
        </tool-tip>
        <span v-if="tokenLink === null">{{ token.focus.display }}</span>
        <span class="token-display" ref="tokenDisplay">{{ token.id }}</span>
      </div>
      <div class="token-utils col-4">
        <tool-tip @click="copyToken" data-bs-toggle="tooltip"
          :data-bs-title="copyTokenTooltip" class="icon">
          <!-- <font-awesome-icon  icon="fa-regular fa-clipboard" /> -->
          <copy-to-clipboard-icon></copy-to-clipboard-icon>
        </tool-tip>
        <tool-tip content="Details" class="icon">
          <a :href="detailsUrl">
            <font-awesome-icon icon="fa-solid fa-ellipsis" />
          </a>
        </tool-tip>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import useBaseStore from '../../stores/baseStore';
import usePatientStore from '../../stores/patientStore';
import CopyToClipboardIcon from '../Util/CopyToClipboardIcon.vue';
import ToolTip from '../Util/ToolTip.vue';
import useTimelineTokens from '../../functions/useTimelineTokens';
import useCopyToClipboard from '../../functions/ClipboardFunctions';
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
    CopyToClipboardIcon, FontAwesomeIcon, ToolTip,
  },
  setup(props) {
    const { getStatusClass } = useTimelineTokens();
    const modelStore = useModelStore();
    const currentLocale = computed(() => modelStore.locale);
    const tokenDisplay = ref(null);
    const copyTokenTooltip = ref('Copy');

    const baseStore = useBaseStore();
    const patientStore = usePatientStore();

    const detailsUrl = computed(() => `${baseStore.baseUrl}/respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/${props.token.id}`);

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

    const { copyValueToClipboard } = useCopyToClipboard();

    const copyToken = (() => {
      copyValueToClipboard(tokenDisplay.value);

      // const oldValue = copyTokenTooltip.value;
      copyTokenTooltip.value = `Copied token ${props.token.id}`;
    });

    return {
      copyToken,
      copyTokenTooltip,
      detailsUrl,
      statusClass,
      tokenDisplay,
      tokenLink,
      tokenTooltip,
    };
  },
};
</script>
