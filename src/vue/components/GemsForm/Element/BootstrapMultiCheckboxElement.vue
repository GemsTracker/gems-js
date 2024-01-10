<template>
  <div class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <div v-for="(formOption, index) in formOptions" :key="index" class="form-check">
        <label class="form-check-label">
          <input type="checkbox" v-model="formValue"
            :value="formOption.key" :disabled="disabled" class="form-check-input" />
          {{formOption.value}}
        </label>
      </div>
      <loading-screen v-if="loadingReferenceData" size="1.25rem" />
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script>
import { computed, onMounted } from 'vue';

import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';
import useGemsFormMultiOptionFunctions from '../../../functions/gemsFormMultiOptionFunctions';

import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';
import LoadingScreen from '../../Util/LoadingScreen.vue';

export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {
    GemsFormLabel, GemsFormValidatorMessages, LoadingScreen,
  },
  setup(props) {
    const {
      disabled,
      elementId,
      formValue,
      formData,
      serverValidator,
      validator,
      validatorClass,
      previousValue,
    } = useGemsFormElementFunctions(props.options);

    const {
      formOptions,
      initMultipleAnswerElement,
      loadingReferenceData,
    } = useGemsFormMultiOptionFunctions(props.options, formValue, formData);

    onMounted(() => {
      initMultipleAnswerElement();
    });

    return {
      disabled,
      elementId,
      formOptions,
      formValue,
      loadingReferenceData,
      serverValidator,
      validator,
      validatorClass,
      previousValue,
    };
  },
};
</script>
