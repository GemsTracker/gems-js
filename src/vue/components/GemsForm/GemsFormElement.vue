<template>
  <component v-if="currentComponentName !== null && currentComponentName in formElements"
             :is="formElements[currentComponentName]"
             :options="options" />
</template>
<script>
import { computed } from 'vue';
import useFormElements from '../../functions/formElements';

export default {
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { formElements } = useFormElements();

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
      formElements,
    };
  },
};
</script>
