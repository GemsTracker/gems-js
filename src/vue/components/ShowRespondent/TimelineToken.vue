<template>
  <div class="token-item card" :class="statusClass">
    <div class="token-border">
      <div class="tokenwrapper row">
        <div class="token-link col">
          <tool-tip :content="tokenTooltip">
            <a v-if="tokenLink !== null" :href="tokenLink">{{ token.focus.display }}</a>
          </tool-tip>
          <span v-if="tokenLink === null">{{ token.focus.display }}</span>
          <span class="token-display" ref="tokenDisplay">{{ token.id }}</span>
        </div>
        <div class="token-utils col-4">
          <tool-tip @click="copyToken" v-if="token.status !== 'completed'"
            data-bs-toggle="tooltip"
            :data-bs-title="copyTokenTooltip" class="icon">
            <!-- <font-awesome-icon  icon="fa-regular fa-clipboard" /> -->
            <copy-to-clipboard-icon></copy-to-clipboard-icon>
          </tool-tip>
          <tool-tip v-if="token.status === 'completed'" :content="t('Correct answers')" class="icon">
            <a :href="tokenCorrectUrl">
              <font-awesome-icon icon="fa-solid fa-pen" />
            </a>
          </tool-tip>
          <tool-tip :content="t('Show token')" class="icon">
            <a :href="tokenShowUrl">
              <font-awesome-icon icon="fa-solid fa-ellipsis" />
            </a>
          </tool-tip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faEllipsis, faPen } from '@fortawesome/free-solid-svg-icons';
import useUrlHelper from '../../functions/urlHelper';
import CopyToClipboardIcon from '../Util/CopyToClipboardIcon.vue';
import ToolTip from '../Util/ToolTip.vue';
import useTimelineTokens from '../../functions/useTimelineTokens';
import useCopyToClipboard from '../../functions/ClipboardFunctions';
import useModelStore from '../../stores/modelRepository';

library.add(faClipboard, faEllipsis, faPen);

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
    const { t } = useI18n();

    const { getStatusClass } = useTimelineTokens();
    const modelStore = useModelStore();
    const currentLocale = computed(() => modelStore.locale);
    const tokenDisplay = ref(null);
    const copyTokenTooltip = ref(t('Copy token to clipboard'));

    const {
      getTokenAnswerUrl,
      getTokenCorrectUrl,
      getTokenEditUrl,
      getTokenShowUrl,
    } = useUrlHelper();
    const tokenAnswerUrl = getTokenAnswerUrl(props.token.id, props.token.carePlanId);
    const tokenCorrectUrl = getTokenCorrectUrl(props.token.id, props.token.carePlanId);
    const tokenEditUrl = getTokenEditUrl(props.token.id, props.token.carePlanId);
    const tokenShowUrl = getTokenShowUrl(props.token.id, props.token.carePlanId);

    const tokenLink = computed(() => {
      if (props.token.status === 'in-progress' || props.token.status === 'requested') {
        if (props.token.ownerType === 'Organization') {
          return props.token.surveyUrl;
        }
        return tokenShowUrl;
      }
      if (props.token.status === 'draft' || props.token.status === 'rejected') {
        return tokenEditUrl;
      }
      if (props.token.status === 'completed') {
        return tokenAnswerUrl;
      }
      return null;
    });

    const tokenTooltip = computed(() => {
      if (props.token.statusDescription) {
        return props.token.statusDescription;
      }
    });
    // const tokenTooltip = computed(() => {
    //   if (props.token.status === 'in-progress' || props.token.status === 'requested') {
    //     if ('executionPeriod' in props.token && 'end' in props.token.executionPeriod && props.token.executionPeriod.end !== null) {
    //       const date = new Date(props.token.executionPeriod.end);
    //       return t('Open until') + ' ' + date.toLocaleDateString(currentLocale.value);
    //     }
    //     return null;
    //   }
    //   return null;
    // });

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
      statusClass,
      t,
      tokenCorrectUrl,
      tokenDisplay,
      tokenLink,
      tokenShowUrl,
      tokenTooltip,
    };
  },
};
</script>
