<template>
  <div class="patient-info">
    <loading-screen v-if="loading === true" size="3rem" />
    <div class="info-block">
      <dt>Patient nr</dt><dd>{{ patientNr }}&nbsp;</dd>
    </div>
    <div class="info-block">
      <dt>Patient</dt><dd>{{ fullName }}&nbsp;</dd>
    </div>
    <div class="info-block">
      <dt>Geboortedatum</dt><dd>{{ birthdayDmy }}&nbsp;</dd>
    </div>
    <div class="info-block">
      <dt>Email</dt><dd><a :href="`mailto:${email}`">{{ email }}</a>&nbsp;</dd>
    </div>
    <div class="info-block">
      <dt>Telefoonnummer</dt><dd>{{ phoneNumber }}&nbsp;</dd>
    </div>
  </div>
</template>
<script>
import { onMounted } from 'vue';

import usePatientRepository from '../../functions/patientRepository';
import LoadingScreen from '../Util/LoadingScreen.vue';

export default {
  components: {
    LoadingScreen,
  },
  setup() {
    const {
      birthdayDmy,
      email,
      fullName,
      getPatientData,
      loading,
      patientNr,
      phoneNumber,
    } = usePatientRepository();

    onMounted(() => {
      getPatientData();
    });

    return {
      birthdayDmy,
      email,
      fullName,
      loading,
      patientNr,
      phoneNumber,
    };
  },
};
</script>
<style lang="scss" scoped>
.patient-info {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin: .5rem;

  .info-block {
    flex: 50%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #ddd;
    dd, dt {
      flex: 50%;
    }
  }

  .loader-container {
    left: 5rem;
    position: absolute;
  }
}
</style>
