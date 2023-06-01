<template>
  <div class="token-timeline">
    <loading-screen v-if="loading === true"></loading-screen>
    <careplan-timeline-block v-for="(carePlan, index) in carePlans" :key="index"
    :care-plan="carePlan" :open="index === 0" />
      <span v-if="carePlans !== null && carePlans.length === 0" class="info">No tracks</span>
  </div>
</template>
<script>
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue';
import useCarePlanRepository from '../../functions/carePlanRepository';
import usePatientStore from '../../stores/patientStore';
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

    const patientStore = usePatientStore();
    const patientCombi = computed(() => patientStore.patientOrganizationCombination);
    watch(patientCombi, () => {
      getCarePlans();
    });

    return {
      carePlans,
      loading,
    };
  },
};
</script>
