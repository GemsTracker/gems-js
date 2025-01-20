<template>
  <div v-if="visible" class="form-group" :class="validatorClass">
    <gems-form-label :elementId="elementId" :options="options" :for="elementId" />
    <div class="element-container">
      <input v-model="formValue" type="text" :id="elementId"
        :name="elementId" class="form-control" :disabled="disabled" :size="size"
        :class="options.class" :style="options.style" />
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';
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
      visible,
    } = useGemsFormElementFunctions(props.options);

    const size = computed(() => {
      if ('size' in props.options && props.options.size) {
        return props.options.size;
      }
      return null;
    });

    return {
      disabled,
      elementId,
      formValue,
      serverValidator,
      size,
      validator,
      validatorClass,
      visible,
    };
  },
};
</script>
