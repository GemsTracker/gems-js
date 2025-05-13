import { defineStore } from 'pinia';

export default defineStore('base', {
  state: () => ({
    baseUrl: null,
    baseProps: null,
  }),
  actions: {
    setBaseProps(baseProps) {
      this.baseProps = baseProps;
    },
    setBaseUrl(baseUrl) {
      this.baseUrl = baseUrl;
    },
  },
});
