<template>
  <div class="preview card">
    <div class="card-body">
      <h3 class="card-title">{{ subject }}</h3>
      <p class="card-text" v-html="body"></p>
    </div>
  </div>
</template>
<script>
import { computed, onMounted, ref } from 'vue';

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
    const Twig = ref(null);

    onMounted(async () => {
      Twig.value = await import('twig/twig.min');
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
      const template = Twig.value.twig({
        data: text,
      });
      return template.render(props.commFields);
    });

    const renderText = ((text) => {
      if (text === null || Twig.value === null) {
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

    const bodyTest = computed(() => {
      if ('body' in props.formData) {
        return props.formData.body;
      }
      return null;
    });

    const body = computed(() => {
      if (Twig.value !== null && 'body' in props.formData) {
        return renderText(props.formData.body);
      }
      return null;
    });

    const subject = computed(() => {
      if (Twig.value !== null && 'subject' in props.formData) {
        return renderText(props.formData.subject);
      }
      return null;
    });

    return {
      body,
      bodyTest,
      subject,
    };
  },
};
</script>
