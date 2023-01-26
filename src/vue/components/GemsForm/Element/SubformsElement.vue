<template>
  <div class="form-group">
    <label v-html="label"></label>
    <div class="element-container">
      <sub-form v-for="(subFormData, index) in formValue" :key="index"
        :structure="structure" :form-data="subFormData" />
    </div>
  </div>
</template>
<script>
import { computed, inject } from 'vue';
import SubForm from './SubFormElement.vue';
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
    SubForm,
  },
  setup(props) {
    const {
      // disabled,
      elementId,
      formValue,
      // serverValidator,
      // validator,
      // validatorClass,
    } = useGemsFormElementFunctions(props.options);

    const formType = inject('formType');
    const structure = computed(() => {
      if ('structure' in props.options) {
        return props.options.structure;
      }
      return null;
    });

    const label = computed(() => {
      if ('label' in props.options) {
        return props.options.label;
      }
      return '&nbsp;';
    });

    return {
      elementId,
      formType,
      formValue,
      label,
      structure,
    };
  },
};
</script>
