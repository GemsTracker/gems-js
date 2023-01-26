<template>
  <div class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <vue-select multiple v-model="formValue" :options="formOptions" label="value"
        :reduce="value => value.key" :style="'width: '+ selectWidth +'rem;'" :disabled="disabled" />
      <loading-screen v-if="loadingReferenceData" size="1.25rem" />
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script>
import {
  computed, onMounted, ref,
} from 'vue';

// import Multiselect from 'vue-multiselect';
import VueSelect from 'vue-select';

import 'vue-select/dist/vue-select.css';

import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';

import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';
import LoadingScreen from '../../Util/LoadingScreen.vue';
import useGemsFormMultiOptionFunctions from '../../../functions/gemsFormMultiOptionFunctions';

export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {
    GemsFormLabel, GemsFormValidatorMessages, LoadingScreen, VueSelect,
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

    const allReferenceData = ref(null);

    const {
      formOptions,
      initMultipleAnswerElement,
      loadingReferenceData,
      referenceOptions,
    } = useGemsFormMultiOptionFunctions(props.options, formValue, formData);

    const selectWidth = computed(() => {
      let length = 0;
      if (formOptions.value.length) {
        formOptions.value.forEach((option) => {
          if (option.value.length > length) {
            length = option.value.length;
          }
        });
      }
      return length;
    });

    onMounted(() => {
      initMultipleAnswerElement();
    });

    return {
      allReferenceData,
      disabled,
      elementId,
      formOptions,
      formValue,
      loadingReferenceData,
      referenceOptions,
      selectWidth,
      serverValidator,
      validator,
      validatorClass,
      previousValue,
    };
  },
};
</script>
<style>
.v-select {
  display: inline-block;
  width: auto;
  min-width: 11em;
  background-color: white;
}
.vs__actions {
  cursor: pointer;
}
.vs--single.vs--open .vs__selected { position: inherit; }
</style>
