<template>
  <div class="token-timeline">
    <careplan-timeline-block v-for="carePlan, index in carePlans" :key="index"
    :care-plan="carePlan" />
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';
import useCarePlanRepository from '../../functions/carePlanRepository';
import CareplanTimelineBlock from './CareplanTimelineBlock.vue';

export default {
  components: {
    CareplanTimelineBlock,
  },
  setup() {
    const carePlans = ref(null);

    const { getAllCarePlans } = useCarePlanRepository();

    const getCarePlans = (async () => {
      carePlans.value = await getAllCarePlans();
    });

    onMounted(() => {
      getCarePlans();
    });

    return {
      carePlans,
    };
  },
};
</script>
