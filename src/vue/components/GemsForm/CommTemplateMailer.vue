<template>
  <div class="comm-template-mailer">
    <hr>
    <h3 class="fs-3">Test E-mail</h3>
    {{ renderedSubject }}
    <label for="test-email">E-mail</label>
    <input v-model="email" name="test-email" type="text" />&nbsp;
    <button class="btn" :disabled="!canEmail">Send test E-mail</button>
  </div>
</template>
<script setup>

import { useTwigRenderer } from '../../functions/TwigRenderer';
import {computed, onMounted, ref, watch} from 'vue';

const props = defineProps({
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  commFields: {
    type: Object,
    required: true,
  },
});

const renderedBody = ref(null);
const renderedSubject = ref(null);

const email = ref(null);

const canEmail = computed(() => {
  if (email.value !== null && renderedBody !== null && renderedSubject !== null) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(email.value)) {
      return true;
    }
  }
  return false;
});

const { renderTemplate, isLoading, error } = useTwigRenderer();

onMounted(async () => {
  renderedBody.value = await renderTemplate(props.body, props.commFields);
  renderedSubject.value = await renderTemplate(props.subject, props.commFields);
});

watch(() => props.body, async () => {
  renderedBody.value = await renderTemplate(props.body, props.commFields);
});
watch(() => props.subject, async () => {
  renderedSubject.value = await renderTemplate(props.subject, props.commFields);
});
watch(() => props.commFields, async () => {
  renderedBody.value = await renderTemplate(props.body, props.commFields);
  renderedSubject.value = await renderTemplate(props.subject, props.commFields);
});

</script>