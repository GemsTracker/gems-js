<template>
  <div class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <div v-for="(formOption, index) in formOptions" :key="index">
        <label>
          <input type="checkbox" v-model="checkboxValues[formOption.key]"
            :value="formOption.key" :disabled="disabled" />
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
import { computed, onMounted, ref, watch } from 'vue';

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

    const elementOptions = computed(() => props.options);

    const {
      formOptions,
      initMultipleAnswerElement,
      loadingReferenceData,
    } = useGemsFormMultiOptionFunctions(elementOptions, formValue, formData);

    onMounted(() => {
      initMultipleAnswerElement();
    });

    const checkboxValues = ref({});

    watch(checkboxValues.value, (newValues) => {
      const values = [];
      Object.keys(newValues).forEach((key) => {
        if (newValues[key] === true) {
          values.push(key);
        }
      });
      formValue.value = values;
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
      checkboxValues,
    };
  },
};
</script>
