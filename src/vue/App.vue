<template>
  <component :is="currentElement" v-bind="baseProps"/>
</template>
<script>

export default {
  props: {

    tag: {
      type: String,
      required: true,
    },
    appSettings: {
      type: Object,
      required: true,
    },
    baseProps: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // kebab-case to PascalCase
    const toPascalCase = (s) => (s ? (s.replace(/(^\w)|(-\w)/g, (gr0, gr1, gr2) => gr1?.toUpperCase() ?? gr2[gr2.length - 1].toUpperCase())) : s);

    const currentElementName = toPascalCase(props.tag);

    const currentElement = props.appSettings.components[currentElementName] ?? null;

    return {
      currentElement,
      currentElementName,
    };
  },
};
</script>
