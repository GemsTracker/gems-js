<template>
  <div>
    <respondent-info></respondent-info>
    <div class="display-picker">
      <span v-for="(label, optionName, index) in displayOptions" :key="index">
        <a @click.prevent="currentDisplay = optionName"
          href="" v-if="currentDisplay !== optionName">
          {{label}}
        </a>
        <span v-if="currentDisplay === optionName">{{label}}</span>
        &nbsp;
      </span>
    </div>

    <token-timeline v-if="currentDisplay === 'timeline'" />
    <round-tabs v-if="currentDisplay === 'roundTabs'"/>
  </div>
</template>
<script>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useBasePropStorer from '../functions/basePropStorer';
import RespondentInfo from './ShowRespondent/RespondentInfo.vue';
import RoundTabs from './ShowRespondent/RoundTabs.vue';
import TokenTimeline from './ShowRespondent/TokenTimeline.vue';

export default {
  props: {
    apiUrl: {
      type: String,
      required: true,
    },
    patientNr: {
      type: String,
      required: true,
    },
    organizationId: {
      type: Number,
      required: true,
    },
    locale: {
      type: String,
      required: false,
      default: 'en',
    },
  },
  components: {
    RespondentInfo, RoundTabs, TokenTimeline,
  },
  setup(props) {
    const displayOptions = {
      timeline: 'Timeline',
      roundTabs: 'Round tabs',
    };

    const currentDisplay = ref('timeline');

    const { locale } = useI18n({ useScope: 'global' });
    // eslint-disable-next-line vue/no-setup-props-destructure
    locale.value = props.locale;
    useBasePropStorer(props);

    return {
      currentDisplay,
      displayOptions,
    };
  },
};
</script>
