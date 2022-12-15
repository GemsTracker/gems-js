import { defineStore } from 'pinia';

export default defineStore('base', {
  state: () => ({
    baseUrl: null,
  }),
  actions: {
    setBaseUrl(baseUrl) {
      this.baseUrl = baseUrl;
    },
  },
});
