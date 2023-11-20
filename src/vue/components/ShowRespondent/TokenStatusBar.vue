<template>
  <div class="token-status-bar">
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
</template>
<script>
import { computed } from 'vue';
import ToolTip from '../Util/ToolTip.vue';

export default {
  props: {
    tokens: {
      type: Array,
      required: true,
    },
  },
  components: {
    ToolTip,
  },
  setup(props) {
    const tokenStatusCounts = computed(() => {
      const statusCounts = {};
      props.tokens.forEach((token) => {
        if (!(token.status in statusCounts)) {
          statusCounts[token.status] = 0;
        }
        statusCounts[token.status] += 1;
      });
      return statusCounts;
    });

    const tokenStatusPercentages = computed(() => {
      if (tokenStatusCounts.value !== null) {
        const total = props.tokens.length;
        const percentages = {};
        Object.keys(tokenStatusCounts.value).forEach((statusName) => {
          percentages[statusName] = (tokenStatusCounts.value[statusName] / total) * 100;
        });
        return percentages;
      }
      return null;
    });

    return {
      tokenStatusCounts,
      tokenStatusPercentages,
    };
  },
};
</script>
