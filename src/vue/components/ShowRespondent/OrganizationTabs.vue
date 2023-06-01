<template>
  <ul class="organization-tabs nav nav-tabs">
    <li v-for="(organizationInfo, index) in organizations" :key="index" class="nav-item">
      <a @click="setCurrentOrganization(organizationInfo.organizationId)" class="nav-link"
         :class="{active: currentOrganizationId === organizationInfo.organizationId}">
        {{organizationInfo.organizationName}}
      </a>
    </li>
  </ul>
</template>
<script>
import { onMounted, ref } from 'vue';
import useGetModelRepository from '../../functions/modelRepository';
import usePatientStore from '../../stores/patientStore';

export default {
  setup() {
    const patientStore = usePatientStore();

    const { getModelRepository } = useGetModelRepository();
    const modelRepository = getModelRepository();
    const otherOrgModel = modelRepository.getEndpointModel(
      'other-patient-numbers',
      `other-patient-numbers/${patientStore.patientNr}/${patientStore.organizationId}`,
      [],
    );

    const currentOrganizationId = ref(patientStore.organizationId);

    const organizations = ref([]);

    const setCurrentOrganization = ((organizationId) => {
      currentOrganizationId.value = organizationId;
      patientStore.setOrganizationId(organizationId);
    });

    onMounted(async () => {
      organizations.value = await otherOrgModel.all();
    });

    return {
      currentOrganizationId,
      organizations,
      setCurrentOrganization,
    };
  },
};
</script>
