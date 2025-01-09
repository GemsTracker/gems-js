<template>
  <div v-if="visible" class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <tip-tap-editor v-model="formValue" />
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script>
import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';

import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';
import TipTapEditor from '../../Util/TipTapEditor.vue';

export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {
    GemsFormLabel,
    GemsFormValidatorMessages,
    TipTapEditor,
  },
  setup(props) {
    const {
      disabled,
      elementId,
      formValue,
      serverValidator,
      validator,
      validatorClass,
      visible,
    } = useGemsFormElementFunctions(props.options);

    return {
      disabled,
      elementId,
      formValue,
      serverValidator,
      validator,
      validatorClass,
      visible,
    };
  },
};
</script>
