import { defineStore } from 'pinia';

export default defineStore('patient', {
  state: () => ({
    patientNr: null,
    organizationId: null,
  }),
  actions: {
    setPatientNr(patientNr) {
      this.patientNr = patientNr;
    },
    setOrganizationId(organizationId) {
      this.organizationId = organizationId;
    },
  },
});
