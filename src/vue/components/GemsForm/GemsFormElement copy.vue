<template>
  <component v-if="currentComponentName !== null" :is="components[currentComponentName]"
    :options="options" />
</template>
<script>
import { computed, defineAsyncComponent } from 'vue';
/*
// eslint-disable-next-line no-unused-vars
import GemsFormElementCheckbox from './GemsFormElementCheckbox.vue';
import GemsFormElementDate from './GemsFormElementDate.vue';
// eslint-disable-next-line no-unused-vars
import GemsFormElementHidden from './GemsFormElementHidden.vue';
// eslint-disable-next-line no-unused-vars
import GemsFormElementHtml from './GemsFormElementHtml.vue';
// eslint-disable-next-line no-unused-vars
// import GemsFormElementDossierTemplate from './GemsFormElementDossierTemplate.vue';
// eslint-disable-next-line no-unused-vars
import GemsFormElementMultiCheckbox from './GemsFormElementMultiCheckbox.vue';
// eslint-disable-next-line no-unused-vars
import GemsFormElementMultiSelect from './GemsFormElementMultiSelect.vue';
// eslint-disable-next-line no-unused-vars
import GemsFormElementNumber from './GemsFormElementNumber.vue';
// eslint-disable-next-line no-unused-vars
import GemsFormElementRadio from './GemsFormElementRadio.vue';
// eslint-disable-next-line no-unused-vars
import GemsFormElementSelect from './GemsFormElementSelect.vue';
// eslint-disable-next-line no-unused-vars
import GemsFormElementSubform from './GemsFormElementSubform.vue';
// eslint-disable-next-line no-unused-vars
import GemsFormElementText from './GemsFormElementText.vue';
// eslint-disable-next-line no-unused-vars
// import GemsFormElementTextSuggestions from './GemsFormElementTextSuggestions.vue';
*/

export default {
  name: 'GemsFormElement',
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  components: {
    GemsFormElementCheckbox: defineAsyncComponent(() => import('./GemsFormElementCheckbox.vue')),
    GemsFormElementDate: defineAsyncComponent(() => import('./GemsFormElementDate.vue')),
    // GemsFormElementDossierTemplate,
    GemsFormElementHidden: defineAsyncComponent(() => import('./GemsFormElementHidden.vue')),
    GemsFormElementHtml: defineAsyncComponent(() => import('./GemsFormElementHtml.vue')),
    GemsFormElementMultiCheckbox: defineAsyncComponent(() => import('./GemsFormElementMultiCheckbox.vue')),
    GemsFormElementMultiSelect: defineAsyncComponent(() => import('./GemsFormElementMultiSelect.vue')),
    GemsFormElementNumber: defineAsyncComponent(() => import('./GemsFormElementNumber.vue')),
    GemsFormElementRadio: defineAsyncComponent(() => import('./GemsFormElementRadio.vue')),
    GemsFormElementSelect: defineAsyncComponent(() => import('./GemsFormElementSelect.vue')),
    GemsFormElementSubform: defineAsyncComponent(() => import('./GemsFormElementSubform.vue')),
    GemsFormElementText: defineAsyncComponent(() => import('./GemsFormElementText.vue')),
    GemsFormElementTextarea: defineAsyncComponent(() => import('./GemsFormElementTextarea.vue')),
    // GemsFormElementTextSuggestions,
  },
  setup(props) {
    const elementType = computed(() => {
      if ('elementClass' in props.options) {
        return props.options.elementClass;
      }
      if ('multiOptions' in props.options) {
        return 'select';
      }
      if ('multiOptionSettings' in props.options) {
        return 'select';
      }
      return 'text';
    });

    const currentComponentName = computed(() => {
      if (elementType.value !== null) {
        const camelCase = elementType.value.replace('project/', '').replace(/-./g, (x) => x[1].toUpperCase());
        const capitalizedName = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
        return `GemsFormElement${capitalizedName}`;
      }
      return null;
    });

    return {
      elementType,
      currentComponentName,
    };
  },
};
</script>
