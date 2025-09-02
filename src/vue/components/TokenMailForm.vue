<template>
  <div class="token-mail-form">
    <gems-form v-bind="props">
      <template #footer="{ formData }">
        <comm-template-finder :form-data="formData" />
      </template>
    </gems-form>
  </div>
</template>
<script setup>
import GemsForm from './GemsForm.vue';
import CommTemplateFinder from './GemsForm/CommTemplateFinder.vue';

const props = defineProps({
  apiUrl: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  formType: {
    type: String,
    required: false,
    default: null,
  },
  locale: {
    type: String,
    required: false,
    default: 'en',
  },
  resource: {
    type: String,
    required: true,
  },
  edit: {
    required: false,
    default: false,
  },
  submitLabel: {
    type: String,
    default: 'Save',
  },
  afterSaveUrl: {
    type: String,
    required: false,
    default: null,
  },
});

</script>