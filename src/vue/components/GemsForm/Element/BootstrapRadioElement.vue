<template>
  <div class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <div class="form-check" v-for="(formOption, index) in formOptions" :key="index"
           :class="{'form-check-inline': inline}">
        <label class="form-check-label">
          <input type="radio" v-model="formValue" :name="formOption.value" :value="formOption.key"
            class="form-check-input" :disabled="disabled" />
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
      getAllReferenceData,
      loadingReferenceData,
    } = useGemsFormMultiOptionFunctions(props.options, formValue, formData);

    const inline = computed(() => {
      if ('elementOptions' in props.options && 'inline' in props.options.elementOptions) {
        return props.options.elementOptions;
      }
      return false;
    });

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
      inline,
      loadingReferenceData,
      serverValidator,
      validator,
      validatorClass,
      previousValue,
    };
  },
};
</script>
