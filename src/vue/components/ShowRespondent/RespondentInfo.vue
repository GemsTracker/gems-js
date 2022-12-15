<template>
  <div class="patient-info">
    <loading-screen v-if="loading === true" size="3rem" />
    <dt>Patient nr</dt><dd>{{ patientNr }}&nbsp;</dd>
    <dt>Patient</dt><dd>{{ fullName }}&nbsp;</dd>
    <dt>Geboortedatum</dt><dd>{{ birthdayDmy }}&nbsp;</dd>
    <dt>Email</dt><dd><a :href="`mailto:${email}`">{{ email }}</a>&nbsp;</dd>
    <dt>Phonenumber</dt><dd>{{ phoneNumber }}&nbsp;</dd>
  </div>
</template>
<script>
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
      loading,
      patientNr,
      phoneNumber,
    } = usePatientRepository();

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
  .loader-container {
    left: 5rem;
    position: absolute;
  }
}
</style>
