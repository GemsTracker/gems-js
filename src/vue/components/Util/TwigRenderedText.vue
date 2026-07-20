<template>
  <div v-html="renderedText" />
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  text: {
    type: String,
  },
  variables: {
    type: Object,
    default: () => ({}),
  }
});

const Twig = ref(null);

onMounted(async () => {
  Twig.value = await import('twig/twig.min');
});

const manualVariableRender = ((text, variables) => {
  let renderedText = text;
  Object.keys(variables).forEach((searchString) => {
    const searchRegex = new RegExp(`{{\\s?${searchString}\\s?}}`, 'g');
    renderedText = renderedText.replace(searchRegex, variables[searchString]);
  });
  return renderedText;
});

const twigRender = ((text, variables) => {
  const template = Twig.value.twig({
    data: text,
  });
  return template.render(variables);
});

const renderText = ((text, variables) => {
  if (text === null || Twig.value === null) {
    return null;
  }

  if (Object.keys(variables).length === 0) {
    return text;
  }

  let renderedText = text;
  try {
    renderedText = twigRender(renderedText, variables);
  } catch (error) {
    // Fallback to manual render
    renderedText = manualVariableRender(renderedText, variables);
  }

  return renderedText;
});

const renderedText = computed(() => {
  if (Twig.value !== null) {
    return renderText(props.text, props.variables);
  }
  return null;
})

</script>
<style scoped>
div {
  display: contents;
}
</style>