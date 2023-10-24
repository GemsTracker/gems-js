<template>
  <div class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <simple-typeahead v-model="testValue" :items="formOptions" @onInput="updateFormData"
        @selectItem="selectItem" :disabled="disabled" :defaultItem="testValue" />
      <loading-screen v-if="loadingReferenceData" size="1.25rem" />
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script>
import {
  onMounted,
} from 'vue';

// import Multiselect from 'vue-multiselect';
import SimpleTypeahead from 'vue3-simple-typeahead';
import 'vue3-simple-typeahead/dist/vue3-simple-typeahead.css';

import 'vue-select/dist/vue-select.css';

import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';

import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';
import LoadingScreen from '../../Util/LoadingScreen.vue';
import useGemsFormMultiOptionFunctions from '../../../functions/gemsFormMultiOptionFunctions';

export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {
    GemsFormLabel, GemsFormValidatorMessages, LoadingScreen, SimpleTypeahead,
  },
  setup(props) {
    const {
      disabled,
      elementId,
      formValue,
      formValue: testValue,
      formData,
      serverValidator,
      validator,
      validatorClass,
    } = useGemsFormElementFunctions(props.options);

    const {
      formOptions,
      initSingleAnswerElement,
      loadingReferenceData,
      referenceOptions,
      testOptions,
    } = useGemsFormMultiOptionFunctions(props.options, formValue, formData);

    const updateFormData = ((inputEvent) => {
      if ('input' in inputEvent) {
        const value = inputEvent.input;
        formValue.value = value;
      }
    });

    const selectItem = ((value) => {
      formValue.value = value;
    });

    onMounted(() => {
      initSingleAnswerElement();
    });

    return {
      disabled,
      elementId,
      formOptions,
      formValue,
      formData,
      loadingReferenceData,
      selectItem,
      serverValidator,
      validator,
      validatorClass,
      testValue,
      referenceOptions,
      testOptions,
      updateFormData,
    };
  },
};
</script>
<style>
.simple-typeahead-input {
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555555;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 2px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
}
</style>
