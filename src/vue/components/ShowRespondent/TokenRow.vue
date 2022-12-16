<template>
  <tr class="token-row">
    <td>{{ token.focus.display }}</td>
    <td>{{ token.carePlan.display }}</td>
    <td>{{ token.owner.type }}</td>
    <td>{{ measuredOn }}</td>
    <td>
      <a v-if="answerable" :href="tokenAskUrl" class="btn btn-sm btn-primary">Answer</a>
      <a v-if="continuable" :href="tokenAskUrl" class="btn btn-sm btn-primary">Continue</a>
      <a v-if="hasAnswers" :href="tokenAnswerUrl" class="btn btn-sm btn-primary">Answers</a>
    </td>
    <td>
      <a :href="tokenShowUrl" class="btn btn-sm btn-primary">+</a>
    </td>
  </tr>
</template>
<script>
import { computed } from 'vue';
import useModelStore from '../../stores/modelRepository';
import useUrlHelper from '../../functions/urlHelper';

export default {
  props: {
    token: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const modelStore = useModelStore();

    const currentLocale = computed(() => modelStore.locale);

    const measuredOn = computed(() => {
      if (props.token.completedAt !== null) {
        const date = new Date(props.token.completedAt);
        return date.toLocaleString(currentLocale.value);
      }
      if ('executionPeriod' in props.token && 'start' in props.token.executionPeriod && props.token.executionPeriod.start !== null) {
        const date = new Date(props.token.executionPeriod.start);
        return date.toLocaleString(currentLocale.value);
      }
      return null;
    });

    const answerable = computed(() => {
      if (props.token.status === 'requested') {
        return true;
      }
      return false;
    });

    const continuable = computed(() => {
      if (props.token.status === 'in-progress') {
        return true;
      }
      return false;
    });

    const hasAnswers = computed(() => {
      if (props.token.status === 'in-progress' || props.token.status === 'completed') {
        return true;
      }
      return false;
    });

    const toAnswers = (() => {
      console.log('Show answers');
    });

    const toSurvey = (() => {
      let url = null;
      if ('surveyUrl' in props.token) {
        url = props.token.surveyUrl;
      }
      console.log('Forward to surevy', url);
    });

    const { getTokenAnswerUrl, getTokenAskUrl, getTokenShowUrl } = useUrlHelper();

    const tokenAnswerUrl = getTokenAnswerUrl(props.token.id);
    const tokenAskUrl = getTokenAskUrl(props.token.id);
    const tokenShowUrl = getTokenShowUrl(props.token.id);

    const toTokenInfo = (() => {
      console.log('Show token info');
    });

    return {
      answerable,
      continuable,
      currentLocale,
      tokenAnswerUrl,
      tokenAskUrl,
      tokenShowUrl,
      hasAnswers,
      measuredOn,
      toAnswers,
      toSurvey,
      toTokenInfo,
    };
  },
};
</script>
