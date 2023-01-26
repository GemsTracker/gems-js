<template>
  <div class="preview card">
    <div class="card-body">
      <h3 class="card-title">{{ subject }}</h3>
      <p class="card-text" v-html="body"></p>
    </div>
  </div>
</template>
<script>
import { computed, onMounted } from 'vue';

export default {
  props: {
    commFields: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    let Twig = null;

    onMounted(async () => {
      Twig = await import('twig/twig.min');
    });

    const manualVariableRender = ((text) => {
      let renderedText = text;
      Object.keys(props.commFields).forEach((searchString) => {
        const searchRegex = new RegExp(`{{\\s?${searchString}\\s?}}`, 'g');
        renderedText = renderedText.replace(searchRegex, props.commFields[searchString]);
      });
      return renderedText;
    });

    const twigRender = ((text) => {
      const template = Twig.twig({
        data: text,
      });
      return template.render(props.commFields);
    });

    const renderText = ((text) => {
      if (text === null || Twig === null) {
        return null;
      }

      let renderedText = text;
      try {
        renderedText = twigRender(renderedText);
      } catch (error) {
        // Fallback to manual render
        renderedText = manualVariableRender(renderedText);
      }

      return renderedText;
    });

    const body = computed(() => {
      if ('body' in props.formData) {
        return renderText(props.formData.body);
      }
      return null;
    });

    const subject = computed(() => {
      if ('subject' in props.formData) {
        return renderText(props.formData.subject);
      }
      return null;
    });

    return {
      body,
      subject,
    };
  },
};
</script>
