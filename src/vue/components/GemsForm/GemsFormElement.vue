<template>
  <component v-if="currentComponentName !== null" :is="currentComponentName"
    :options="options" />
</template>
<script>
import { computed, defineAsyncComponent } from 'vue';

export default {
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  components: {
    CheckboxElement: defineAsyncComponent(() => import('./Element/CheckboxElement.vue')),
    DateElement: defineAsyncComponent(() => import('./Element/DateElement.vue')),
    // DossierTemplateElement,
    HiddenElement: defineAsyncComponent(() => import('./Element/HiddenElement.vue')),
    HtmlElement: defineAsyncComponent(() => import('./Element/HtmlElement.vue')),
    MultiCheckboxElement: defineAsyncComponent(() => import('./Element/MultiCheckboxElement.vue')),
    MultiSelectElement: defineAsyncComponent(() => import('./Element/MultiSelectElement.vue')),
    NumberElement: defineAsyncComponent(() => import('./Element/NumberElement.vue')),
    RadioElement: defineAsyncComponent(() => import('./Element/RadioElement.vue')),
    SelectElement: defineAsyncComponent(() => import('./Element/SelectElement.vue')),
    SubformsElement: defineAsyncComponent(() => import('./Element/SubformsElement.vue')),
    TextElement: defineAsyncComponent(() => import('./Element/TextElement.vue')),
    TextareaElement: defineAsyncComponent(() => import('./Element/TextareaElement.vue')),

    CommTemplateTranslationsElement: defineAsyncComponent(() => import('./Element/CommTemplateTranslationsElement.vue')),
    // TextSuggestionsElement,
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
        return `${capitalizedName}Element`;
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
