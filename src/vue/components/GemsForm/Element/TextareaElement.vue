<template>
  <div class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <textarea v-model="formValue" :id="elementId" :name="elementId" class="form-control"
        :disabled="disabled" :cols="options.cols" :rows="options.rows" />
    </div>
    <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
    <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
  </div>
</template>
<script>
import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';

import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';

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
