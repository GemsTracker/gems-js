<template>
  <div class="form-group" :class="validatorClass">
    <gems-form-label :elementId="elementId" :options="options" :for="elementId" />
    <div class="element-container">
      <ckeditor :editor="editor" v-model="editValue" :config="editorConfig" />
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script>
import { computed, onMounted, watch } from 'vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';

import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';

export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {
    ckeditor: CKEditor.component, GemsFormLabel, GemsFormValidatorMessages,
  },
  setup(props) {
    const {
      disabled,
      elementId,
      formValue,
      serverValidator,
      validator,
      validatorClass,
    } = useGemsFormElementFunctions(props.options);

    const editor = ClassicEditor;
    const editorConfig = {
    };

    const editValue = computed({
      get() {
        if (formValue.value !== null) {
          return formValue.value;
        }
        return '';
      },
      set(value) {
        let newValue = value;
        if (newValue === '') {
          newValue = null;
        }
        formValue.value = newValue;
      },
    });

    /* onMounted(() => {
      console.log('CKEDITOR INIT', formValue.value);
      if (formValue.value === null) {
        console.log('IS NULL!');
        formValue.value = '';
        console.log('CKEDITOR ', formValue.value);
      }
    });

    watch(formValue, (value) => {
      console.log('CKEditor formvalue', formValue);
      if (value.value === null) {
        formValue.value = '';
      }
    }); */

    return {
      disabled,
      editor,
      editorConfig,
      editValue,
      elementId,
      formValue,
      serverValidator,
      validator,
      validatorClass,
    };
  },
};
</script>
<style lang="scss">
.ck.ck-voice-label {
  display: none;
}
</style>
