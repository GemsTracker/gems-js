<template>
  <div class="measure-moment object card">
    <h5>
      <div v-if="measureMoment.overviewUrl" data-v-baseline="" class="tooltip-container icon rightFloat"
           data-bs-toggle="tooltip" :data-bs-title="t('Summary')">
        <a @click="showDialog(measureMoment.overviewUrl)">
          <i class="fa fa-list-alt fa-fw" data-toggle="tooltip" data-placement="auto top"
             data-html="1" title="" :data-original-title="t('Summary')"></i>
        </a>
      </div>
      {{ measureMoment.name }}
    </h5>
    <template v-for="(startDate, index) in tokens" :key="index">
      <timeline-start-date-block  v-if="'tokens' in startDate && startDate.tokens.length"
                                  :start-date="startDate" />
    </template>
  </div>
</template>
<script>

import { ref } from 'vue'
import { computed } from 'vue';
import useTokenRepository from '../../functions/tokenRepository';
import TimelineStartDateBlock from './TimelineStartDateBlock.vue';
import {useI18n} from "vue-i18n";

export default {
  props: {
    measureMoment: {
      type: Object,
      required: true,
    },
    showDialog: {
      type: Function,
      required: true,
    }
  },
  components: {
    TimelineStartDateBlock,
  },
  setup(props) {
    const { t } = useI18n();

    const { groupByDate } = useTokenRepository();

    const tokens = computed(() => groupByDate(props.measureMoment.tokens));
    // console.log('TimeLineMeasureMoment' , props.measureMoment, tokens);

    const showDialog = (url) => {
      // console.log(url);
      const dialog = document.getElementById('inline-answers-dialog');
      // console.log(dialog);
      const inline = document.getElementById('inline-answers-content');

      var parts = url.split("/");
      var round = parts[parts.length - 1];
      inline.innerHTML = "<h2>" + round + "</h2>Loading...";
      dialog.showModal();

      const request = new XMLHttpRequest();
      request.responseType = 'document';
      request.addEventListener('load', (event) => {
        const response = request.response;
        const newHtml = response.getElementById('overviewResult');
        // console.log(targetId, request.response);

        // console.log(newHtml);
        if (newHtml) {
          inline.setHTMLUnsafe(newHtml.innerHTML);
        }
      });
      request.addEventListener('error', (event) => {
        console.log(event.error);
      });
      request.open('GET', url);
      request.send();
    }

    return {
      tokens, showDialog, t,
    };
  },
};
</script>
