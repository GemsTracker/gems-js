<template>
  <div class="care-plans-content">
    <table v-if="carePlans" class="table browser">
      <thead>
      <tr>
        <th></th>
        <th>{{ t('Track')}}</th>
        <th>{{ t('Description')}}</th>
        <th>{{ t('Start')}}</th>
        <th v-if="showTokenProgress || showTokenStatusBar">{{ t('Progress')}}</th>
        <th>{{ t('Added by')}}</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(carePlan, index) in filteredCarePlans" :key="index"
            :class="{deleted: isDeleted(carePlan)}">
          <td>
              <a :href="getCarePlanShowUrl(carePlan.id, getCarePlanPatientNr(carePlan), getCarePlanOrganization(carePlan))" class="btn">{{ t('Show')}}</a>
          </td>
          <td>{{ carePlan.title }}</td>
          <td>{{ carePlan.description }}</td>
          <td>{{ formatJsonDate(carePlan.start) }}</td>
          <td v-if="showTokenProgress || showTokenStatusBar">
              <span v-if="carePlan.id in carePlanTasks">
                  <token-progress v-if="showTokenProgress"
                                  :tokens="carePlanTasks[carePlan.id]" />
                  <token-status-bar v-if="showTokenStatusBar"
                                  :tokens="carePlanTasks[carePlan.id]" />
              </span>
          </td>
          <td>{{ getCarePlanCreator(carePlan) }}</td>
          <td>
              <a v-if="carePlan.status === 'active'"
                 :href="getCarePlanEditUrl(carePlan.id, getCarePlanPatientNr(carePlan), getCarePlanOrganization(carePlan))"
                 class="btn">
                {{ t('Edit')}}
              </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useCarePlanRepository from '../../functions/carePlanRepository';
import useDateFunctions from '../../functions/DateFunctions';
import useTokenRepository from '../../functions/tokenRepository';
import useUrlHelper from '../../functions/urlHelper';
import TokenStatusBar from './TokenStatusBar.vue';
import TokenProgress from './TokenProgress.vue';

const props = defineProps({
  showDeleted: {
    type: Boolean,
    default: true,
  },
  showTokenProgress: {
    type: Boolean,
    default: false,
  },
  showTokenStatusBar: {
    type: Boolean,
    default: false,
  },
});

const carePlans = ref(null);
const questionnaireTasks = ref(null);
const { t } = useI18n();
const { formatJsonDate } = useDateFunctions();

const { getCarePlanEditUrl, getCarePlanShowUrl } = useUrlHelper();

const { getAllCarePlans } = useCarePlanRepository();
const { getAllTokens, groupByCarePlans } = useTokenRepository();

const getCarePlans = (async () => {
  carePlans.value = await getAllCarePlans();
  questionnaireTasks.value = await getAllTokens();
});

const filteredCarePlans = computed(() => {
  if (props.showDeleted === false && carePlans.value !== null) {
    return carePlans.value.filter((carePlan) => carePlan.status !== 'revoked');
  }
  return carePlans.value;
});

const getCarePlanCreator = ((carePlan) => {
  let creatorName = null;
  if ('contributor' in carePlan && Array.isArray(carePlan.contributor)) {
    carePlan.contributor.forEach((contributor) => {
      if ('type' in contributor && contributor.type === 'staff' && 'display' in contributor) {
        creatorName = contributor.display;
      }
    });
  }
  return creatorName;
});

const getCarePlanOrganization = ((carePlan) => {
  if ('contributor' in carePlan && Array.isArray(carePlan.contributor)) {
    let organizationId = null;
    carePlan.contributor.forEach((contributor) => {
      if ('type' in contributor && contributor.type === 'Organization' && 'id' in contributor) {
        organizationId = contributor.id;
      }
    });
    return organizationId;
  }

  return null;
});

const getCarePlanPatientNr = ((carePlan) => {
  if ('subject' in carePlan && 'id' in carePlan.subject) {
    return carePlan.subject.id.split('@')[0];
  }
  return null;
})

const carePlanTasks = computed(() => {
  if (questionnaireTasks.value !== null) {
    return groupByCarePlans(questionnaireTasks.value);
  }
  return {};
});

const isDeleted = ((carePlan) => {
  return carePlan.status === 'revoked' || carePlan.status === 'unknown';
});

onMounted(() => {
  getCarePlans();
  getAllTokens();
});

</script>
