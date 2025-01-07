<template>
  <div>
    <organization-tabs v-if="showOrganizationTabs"></organization-tabs>
    <respondent-info v-if="showRespondentInfo"></respondent-info>
    <button-row v-if="showButtonRows" :showButtons="showButtons" :showAddDropdown="showAddDropdown" />
    <div v-if="showDisplayPicker" class="display-picker text-end">
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
import useBaseStore from '../stores/baseStore';
import RespondentInfo from './ShowRespondent/RespondentInfo.vue';
import RoundTabs from './ShowRespondent/RoundTabs.vue';
import TokenTimeline from './ShowRespondent/TokenTimeline.vue';
import OrganizationTabs from './ShowRespondent/OrganizationTabs.vue';
import ButtonRow from './ShowRespondent/ButtonRow.vue';

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
    showAddDropdown: {
      type: Boolean,
      default: true,
    },
    showButtons: {
      type: Boolean,
      default: true,
    },
    showButtonRows: {
      type: Boolean,
      default: true,
    },
    showDisplayPicker: {
      type: Boolean,
      default: true,
    },
    showOrganizationTabs: {
      type: Boolean,
      default: true,
    },
    showPicker: {
      type: Boolean,
      default: true,
    },
    showRespondentInfo: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ButtonRow,
    OrganizationTabs,
    RespondentInfo,
    RoundTabs,
    TokenTimeline,
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

    const baseTags = document.getElementsByTagName('base');
    if (baseTags.length) {
      const baseStore = useBaseStore();
      const baseUrl = baseTags[0].getAttribute('href');
      baseStore.setBaseUrl(baseUrl);
    }

    return {
      currentDisplay,
      displayOptions,
    };
  },
};
</script>
