<template>
  <div v-if="visible" class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="value">{{formValue}}</div>
      <input type="hidden" :name="elementId" :value="formValue" />
  </div>
</template>
<script>
import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';

import GemsFormLabel from '../Label.vue';

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
  },
  setup(props) {
    const { elementId, formValue, visible } = useGemsFormElementFunctions(props.options);

    return {
      elementId,
      formValue,
      visible,
    };
  },
};
</script>
