import { defineStore } from 'pinia';

export default defineStore('patient', {
  state: () => ({
    patientNr: null,
    organizationId: null,
    delimiter: '@',
  }),
  actions: {
    setPatientNr(patientNr) {
      this.patientNr = patientNr;
    },
    setOrganizationId(organizationId) {
      this.organizationId = organizationId;
    },
  },
  getters: {
    patientOrganizationCombination(state) {
      return `${state.patientNr}${state.delimiter}${state.organizationId}`;
    },
  },
});
