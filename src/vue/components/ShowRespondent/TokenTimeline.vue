<template>
  <div class="token-timeline">
    <loading-screen v-if="loading === true"></loading-screen>
    <careplan-timeline-block v-for="carePlan, index in carePlans" :key="index"
    :care-plan="carePlan" :open="index === 0" />
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';
import useCarePlanRepository from '../../functions/carePlanRepository';
import CareplanTimelineBlock from './CareplanTimelineBlock.vue';
import LoadingScreen from '../Util/LoadingScreen.vue';

export default {
  components: {
    CareplanTimelineBlock, LoadingScreen,
  },
  setup() {
    const carePlans = ref(null);

    const { getAllCarePlans, loading } = useCarePlanRepository();

    const getCarePlans = (async () => {
      carePlans.value = await getAllCarePlans();
    });

    onMounted(() => {
      getCarePlans();
    });

    return {
      carePlans,
      loading,
    };
  },
};
</script>
