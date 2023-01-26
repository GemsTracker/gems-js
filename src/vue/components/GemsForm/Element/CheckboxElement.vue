<template>
  <div class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <input type="checkbox" v-model="formValue" :id="elementId" :name="elementId"
        :disabled="disabled" />
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block" style="margin-left: 1rem;">
        {{options.description}}
      </p>
    </div>
  </div>
</template>
<script>
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
    GemsFormLabel, GemsFormValidatorMessages,
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

    return {
      disabled,
      elementId,
      formValue,
      serverValidator,
      validator,
      validatorClass,
    };
  },
};
</script>
