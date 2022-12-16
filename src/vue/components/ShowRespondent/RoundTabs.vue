<template>
  <div class="round-tabs">
    <loading-screen v-if="loading === true"></loading-screen>
    <template v-if="groupedTokens">
      <ul class="nav nav-tabs">
        <li v-for="momentInfo, index in groupedTokens" :key="index"
          @click="changeTab(index)" class="nav-item">
          <a class="nav-link" :class="{active: (index === currentTab)}">{{momentInfo.name}}</a>
        </li>
      </ul>
      <div class="tab-content">
        <div v-if="currentTab in groupedTokens" role="tabpanel" class="tab-pane active">
          <table class="browser table table-striped table-bordered table-hover table-condensed">
            <thead>
              <tr>
                <th>Survey</th>
                <th>Track</th>
                <th>Assigned to</th>
                <th>Measure(d) on</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <token-row v-for="token, index in groupedTokens[currentTab].tokens"
                :key="index" :token="token"></token-row>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { computed, onMounted, ref } from 'vue';
import useTokenRepository from '../../functions/tokenRepository';
import LoadingScreen from '../Util/LoadingScreen.vue';
import TokenRow from './TokenRow.vue';

export default {
  components: {
    LoadingScreen, TokenRow,
  },
  setup() {
    const currentTab = ref(0);
    const tokenData = ref(null);
    const { getAllTokens, groupByMeasureMoment, loading } = useTokenRepository();

    const getTokens = (async () => {
      tokenData.value = await getAllTokens();
    });

    const groupedTokens = computed(() => {
      if (tokenData.value !== null) {
        return groupByMeasureMoment(tokenData.value);
      }
      return null;
    });

    const changeTab = ((tabIndex) => {
      currentTab.value = tabIndex;
    });

    onMounted(async () => {
      getTokens();
    });

    return {
      changeTab,
      currentTab,
      groupedTokens,
      loading,
      tokenData,
    };
  },
};
</script>
