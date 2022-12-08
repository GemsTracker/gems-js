<template>
  <div class="patient-info">
    <dt>Patient nr</dt><dd>{{ patientNr }}</dd>
    <dt>Patient</dt><dd>{{ fullName }}</dd>
    <dt>Geboortedatum</dt><dd>{{ birthdayDmy }}</dd>
    <dt>Email</dt><dd>{{ email }}</dd>
    <dt>Phonenumber</dt><dd>{{ phoneNumber }}</dd>
  </div>
</template>
<script>
import usePatientRepository from '../../functions/patientRepository';

export default {
  setup() {
    const {
      birthdayDmy,
      email,
      fullName,
      patientNr,
      phoneNumber,
    } = usePatientRepository();

    return {
      birthdayDmy,
      email,
      fullName,
      patientNr,
      phoneNumber,
    };
  },
};
</script>
