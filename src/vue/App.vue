<template>
  <component :is="currentElement" v-bind="baseProps"/>
</template>
<script setup>
import useBasePropStorer from './functions/basePropStorer';

const props = defineProps({
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
});

useBasePropStorer(props.baseProps);

// kebab-case to PascalCase
const toPascalCase = (s) => (s ? (s.replace(/(^\w)|(-\w)/g, (gr0, gr1, gr2) => gr1?.toUpperCase() ?? gr2[gr2.length - 1].toUpperCase())) : s);
const currentElementName = toPascalCase(props.tag);

const currentElement = props.appSettings.components[currentElementName] ?? null;

</script>
