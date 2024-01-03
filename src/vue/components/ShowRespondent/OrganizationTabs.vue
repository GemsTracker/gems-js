<template>
  <ul class="organization-tabs nav nav-tabs">
    <li v-for="(organizationInfo, index) in organizations" :key="index" class="nav-item">
        <a :href="getRespondentShowUrl(organizationInfo.patientNr, organizationInfo.organizationId)"
           class="nav-link"
           :class="{active: currentOrganizationId === organizationInfo.organizationId}">
            {{organizationInfo.organizationName}}
        </a>
    </li>
  </ul>
</template>
<script>
import { computed, onMounted, ref } from 'vue';
import useGetModelRepository from '../../functions/modelRepository';
import usePatientStore from '../../stores/patientStore';
import useUrlHelper from '../../functions/urlHelper';

export default {
  setup() {
    const patientStore = usePatientStore();

    const { getRespondentShowUrl } = useUrlHelper();

    const { getModelRepository } = useGetModelRepository();
    const modelRepository = getModelRepository();
    const otherOrgModel = modelRepository.getEndpointModel(
      'other-patient-numbers',
      `other-patient-numbers/${patientStore.patientNr}/${patientStore.organizationId}`,
      [],
    );

    const organizations = ref([]);

    const currentOrganizationId = computed(() => patientStore.organizationId);

    /* const setCurrentOrganization = ((organizationId) => {
      patientStore.setOrganizationId(organizationId);
    }); */

    onMounted(async () => {
      organizations.value = await otherOrgModel.all({
        detailed: 1,
        'user-org': 1,
      });
    });

    return {
      currentOrganizationId,
      getRespondentShowUrl,
      organizations,
    };
  },
};
</script>
