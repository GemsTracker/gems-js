<template>
  <div>
    <input type="hidden" :id="elementId" :name="elementId" :value="formValue"
      class="form-control" />
  </div>
</template>
<script>
import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';

export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  setup(props) {
    const { elementId, formValue } = useGemsFormElementFunctions(props.options);

    return {
      elementId,
      formValue,
    };
  },
};
</script>
