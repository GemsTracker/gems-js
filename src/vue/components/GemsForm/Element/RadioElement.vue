<template>
  <div class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <label class="radio-inline" v-for="(formOption, index) in formOptions" :key="index">
        <input type="radio" v-model="formValue" :name="formOption.value" :value="formOption.key"
          :disabled="disabled" />
        {{formOption.value}}
      </label>
      <loading-screen v-if="loadingReferenceData" size="1.25rem" />
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script>
import { onMounted } from 'vue';

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
      getAllReferenceData,
      loadingReferenceData,
    } = useGemsFormMultiOptionFunctions(props.options, formValue, formData);

    onMounted(() => {
      if ('multiOptionSettings' in props.options) {
        getAllReferenceData(props.options.multiOptionSettings);
      }
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
