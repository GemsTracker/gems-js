<template>
  <div v-if="visible" class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <tip-tap-editor v-model="formValue" :prevent-emit="isEditingSource">
        <template #menu-buttons>
          <slot name="menu-buttons"></slot>
        </template>
      </tip-tap-editor>
      <div class="source">
        <a href="#" class="toggle-button" @click.prevent="toggleSource">{{ sourceButtonLabel }}</a>
        <textarea v-if="showSource"
                  v-model="formValue"
                  @focus="isEditingSource = true"
                  @blur="isEditingSource = false"
                  style="width: 100%;"
                  rows="6"
        />
      </div>
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script setup>
import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';

import { useI18n } from 'vue-i18n';
import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';
import TipTapEditor from '../../Util/TipTapEditor.vue';
import { computed, ref } from 'vue';

const props = defineProps({
  options: {
    type: Object,
    required: true,
    default: () => {},
  },
});

const { t } = useI18n();

const showSource = ref(false);
const isEditingSource = ref(false);

const toggleSource = (() => {
  showSource.value = !showSource.value;
});

const sourceButtonLabel = computed(() => {
  if (showSource.value) {
    return t('Hide source');
  }
  return t('Edit source');
});

const {
  disabled,
  elementId,
  formValue,
  serverValidator,
  validator,
  validatorClass,
  visible,
} = useGemsFormElementFunctions(props.options);

</script>
<style scoped>
.source {
  .toggle-button {
    font-size: .75rem;
  }
  textarea {
    padding: .5rem;
    border: #aaa 1px solid;
  }
}
</style>
