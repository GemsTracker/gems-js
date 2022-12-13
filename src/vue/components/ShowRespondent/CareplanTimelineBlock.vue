<template>
  <div class="careplan-timeline-block card">
    <div class="card-header header" @click="toggleExpand">
      <h4 class="card-title row">
        <div class="col">
          <tool-tip content="Edit" class="action-icon">
            <font-awesome-icon icon="pencil" />
          </tool-tip>
          &nbsp;
          <span class="title">{{ carePlan.title }}</span>
          &nbsp;
          <font-awesome-icon v-if="!expanded" icon="chevron-right" class="title-collapse" />
          <font-awesome-icon v-if="expanded" icon="chevron-down" class="title-collapse" />
        </div>
        <div class="col-3 text-end">
          <tool-tip content="Delete item!" class="action-icon">
            <font-awesome-icon icon="trash-can" />
          </tool-tip>
        </div>
      </h4>
      <div class="row">
        <div class="col">
        <div>{{ t('Start date') }}: {{ startDate }}</div>
        </div>
        <div class="token-status-bar col-3 align-self-end">
          <div v-if="tokenStatusCounts !== null" class="progress">
            <div v-if="'rejected' in tokenStatusCounts" class="progress-bar missed"
              :style="`width:${tokenStatusPercentages.rejected}%`">
              {{ tokenStatusCounts.rejected }}
            </div>
            <div v-if="'completed' in tokenStatusCounts"  class="progress-bar answered"
              :style="`width:${tokenStatusPercentages.completed}%`">
              {{ tokenStatusCounts.completed }}
            </div>
            <div v-if="'in-progress' in tokenStatusCounts"
              class="progress-bar open progress-bar-striped"
              :style="`width:${tokenStatusPercentages['in-progress']}%`">
              {{ tokenStatusCounts['in-progress'] }}
            </div>
            <div v-if="'requested' in tokenStatusCounts" class="progress-bar open"
              :style="`width:${tokenStatusPercentages.requested}%`">
              {{ tokenStatusCounts.requested }}
            </div>
            <div v-if="'draft' in tokenStatusCounts" class="progress-bar waiting"
              :style="`width:${tokenStatusPercentages.draft}%`">
              {{ tokenStatusCounts.draft }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="expanded" class="card-body">
      <div v-if="carePlanTokens !== null" class="objecten">
        <timeline-measure-moment-block v-for="measureMoment, index in carePlanTokens" :key="index"
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
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import useTokenRepository from '../../functions/tokenRepository';
import useModelStore from '../../stores/modelRepository';
import TimelineMeasureMomentBlock from './TimelineMeasureMomentBlock.vue';
import ToolTip from '../Util/ToolTip.vue';

library.add(faChevronDown, faChevronRight, faPencil, faTrashCan);

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
    FontAwesomeIcon, TimelineMeasureMomentBlock, ToolTip,
  },
  setup(props) {
    const modelStore = useModelStore();
    const currentLocale = computed(() => modelStore.locale);
    const expanded = ref(props.open);

    const { t } = useI18n();

    const toggleExpand = (() => {
      expanded.value = !expanded.value;
    });

    const tokenRepository = useTokenRepository();

    const ungroupedTokens = ref(null);
    const carePlanTokens = ref(null);

    const getCarePlanTokens = (async () => {
      ungroupedTokens.value = await tokenRepository.getCarePlanTokens(props.carePlan.id);
      carePlanTokens.value = tokenRepository.groupByMeasureMoment(ungroupedTokens.value);
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
      getCarePlanTokens();
    });

    return {
      carePlanTokens,
      expanded,
      startDate,
      t,
      toggleExpand,
      tokenStatusCounts,
      tokenStatusPercentages,
    };
  },
};
</script>
