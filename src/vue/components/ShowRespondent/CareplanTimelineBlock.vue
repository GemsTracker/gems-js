<template>
  <div class="careplan-timeline-block card traject" :class="{deleted: !activeCarePlan}">
    <div class="card-header header" @click="toggleExpand">
      <h4 class="card-title row">
        <div class="col">
          <tool-tip :content="t('Edit')" class="action-icon">
            <a :href="carePlanEditUrl" v-on:click.stop>
              <font-awesome-icon icon="pencil" />
            </a>
          </tool-tip>
          &nbsp;
          <span class="title">{{ carePlan.title }}</span>
          &nbsp;
          <font-awesome-icon v-if="!expanded" icon="chevron-right" class="title-collapse" />
          <font-awesome-icon v-if="expanded" icon="chevron-down" class="title-collapse" />
        </div>
        <div class="col-3 text-end">
          <tool-tip v-if="activeCarePlan" :content="t('Delete track!')" class="action-icon">
            <a :href="carePlanDeleteUrl" v-on:click.stop>
              <font-awesome-icon icon="trash-can" />
            </a>
          </tool-tip>
          <tool-tip v-if="!activeCarePlan" :content="t('Restore track!')" class="action-icon">
            <a :href="carePlanUnDeleteUrl" v-on:click.stop>
              <font-awesome-icon icon="recycle" />
            </a>
          </tool-tip>
        </div>
      </h4>
      <div class="row">
        <div class="col">
          <div class="description">{{ carePlan.description }}</div>
        <div>{{ t('Start date') }}: {{ startDate }}</div>
        </div>
        <div class="token-status-bar col-6 col-xxl-3 align-self-end">
          <div v-if="tokenStatusCounts !== null" class="progress">
            <tool-tip :content="`${tokenStatusCounts.rejected} rejected`"
              v-if="'rejected' in tokenStatusCounts"
              class="tooltip-container progress-bar bg-danger missed"
              :style="`width:${tokenStatusPercentages.rejected}%`">
              {{ tokenStatusCounts.rejected }}
            </tool-tip>
            <tool-tip :content="`${tokenStatusCounts.completed} answered`"
              v-if="'completed' in tokenStatusCounts"
              class="tooltip-container progress-bar bg-success answered"
              :style="`width:${tokenStatusPercentages.completed}%`">
              {{ tokenStatusCounts.completed }}
            </tool-tip>
            <tool-tip :content="`${tokenStatusCounts['in-progress']} in progress`"
              v-if="'in-progress' in tokenStatusCounts"
              class="progress-bar bg-warning open progress-bar-striped"
              :style="`width:${tokenStatusPercentages['in-progress']}%`">
              {{ tokenStatusCounts['in-progress'] }}
            </tool-tip>
            <tool-tip :content="`${tokenStatusCounts.requested} open`"
              v-if="'requested' in tokenStatusCounts"
              class="tooltip-container progress-bar bg-warning open"
              :style="`width:${tokenStatusPercentages.requested}%`">
              {{ tokenStatusCounts.requested }}
            </tool-tip>
            <tool-tip :content="`${tokenStatusCounts.draft} not yet open`"
              v-if="'draft' in tokenStatusCounts"
              class="tooltip-container progress-bar bg-info waiting"
              :style="`width:${tokenStatusPercentages.draft}%`">
              {{ tokenStatusCounts.draft }}
            </tool-tip>
          </div>
        </div>
      </div>
    </div>
    <div v-if="expanded" class="card-body">
      <loading-screen v-if="loading === true"></loading-screen>
      <div v-if="carePlanTokens !== null" class="objecten">
        <timeline-measure-moment-block v-for="(measureMoment, index) in carePlanTokens" :key="index"
          :measure-moment="measureMoment" />
      </div>
    </div>
  </div>
</template>
<script>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChevronDown,
  faChevronRight,
  faPencil,
  faRecycle,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import useTokenRepository from '../../functions/tokenRepository';
import useUrlHelper from '../../functions/urlHelper';
import useModelStore from '../../stores/modelRepository';
import TimelineMeasureMomentBlock from './TimelineMeasureMomentBlock.vue';
import LoadingScreen from '../Util/LoadingScreen.vue';
import ToolTip from '../Util/ToolTip.vue';

library.add(faChevronDown, faChevronRight, faPencil, faRecycle, faTrashCan);

export default {
  props: {
    carePlan: {
      type: Object,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    FontAwesomeIcon, LoadingScreen, TimelineMeasureMomentBlock, ToolTip,
  },
  setup(props) {
    const modelStore = useModelStore();
    const currentLocale = computed(() => modelStore.locale);
    const expanded = ref(props.open);

    const { getCarePlanDeleteUrl, getCarePlanEditUrl, getCarePlanUnDeleteUrl } = useUrlHelper();

    const carePlanDeleteUrl = getCarePlanDeleteUrl(props.carePlan.id);
    const carePlanEditUrl = getCarePlanEditUrl(props.carePlan.id);
    const carePlanUnDeleteUrl = getCarePlanUnDeleteUrl(props.carePlan.id);

    const activeCarePlan = computed(() => 'status' in props.carePlan && props.carePlan.status === 'active');

    const { t } = useI18n();

    const toggleExpand = (() => {
      expanded.value = !expanded.value;
    });

    const { getCarePlanTokens, groupByMeasureMoment, loading } = useTokenRepository();

    const ungroupedTokens = ref(null);
    const carePlanTokens = ref(null);

    const getGroupedCarePlanTokens = (async () => {
      const rawCarePlanTokens = await getCarePlanTokens(props.carePlan.id);
      // remove tokens with status unknown
      ungroupedTokens.value = rawCarePlanTokens.filter((token) => token.status !== 'unknown');
      carePlanTokens.value = groupByMeasureMoment(ungroupedTokens.value);
    });

    const tokenStatusCounts = computed(() => {
      if (ungroupedTokens.value !== null) {
        const statusCounts = {};
        ungroupedTokens.value.forEach((token) => {
          if (!(token.status in statusCounts)) {
            statusCounts[token.status] = 0;
          }
          statusCounts[token.status] += 1;
        });
        return statusCounts;
      }
      return null;
    });

    const tokenStatusPercentages = computed(() => {
      if (ungroupedTokens.value !== null && tokenStatusCounts.value !== null) {
        const total = ungroupedTokens.value.length;
        const percentages = {};
        Object.keys(tokenStatusCounts.value).forEach((statusName) => {
          percentages[statusName] = (tokenStatusCounts.value[statusName] / total) * 100;
        });
        return percentages;
      }
      return null;
    });

    const startDate = computed(() => {
      const date = new Date(props.carePlan.period.start);
      return date.toLocaleDateString(currentLocale.value);
    });

    onMounted(() => {
      getGroupedCarePlanTokens();
    });

    return {
      activeCarePlan,
      carePlanTokens,
      carePlanDeleteUrl,
      carePlanEditUrl,
      carePlanUnDeleteUrl,
      expanded,
      loading,
      startDate,
      t,
      toggleExpand,
      tokenStatusCounts,
      tokenStatusPercentages,
    };
  },
};
</script>
