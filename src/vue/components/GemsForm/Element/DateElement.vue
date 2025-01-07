<template>
  <div class="form-group" :class="validatorClass">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <div class="input-group">
        <div class="input-group-text">
          <font-awesome-icon :icon="['far', 'calendar-alt']" />
        </div>
        <datepicker v-model="formDateObject" class="form-control"
          :disabled="disabled" />
      </div>
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Datepicker from '../../Util/DatePicker.vue';
import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';
import useDateFunctions from '../../../functions/DateFunctions';
import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';

library.add(faCalendarAlt);

export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {
    Datepicker, FontAwesomeIcon, GemsFormLabel, GemsFormValidatorMessages,
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

    const { formatIsoDate } = useDateFunctions();

    const formDateObject = computed({
      get: () => {
        if (formValue.value !== null) {
          return new Date(formValue.value);
        }
        return null;
      },
      set: (value) => {
        if (value instanceof Date) {
          formValue.value = formatIsoDate(value);
        } else {
          formValue.value = value;
        }
      },
    });

    return {
      disabled,
      elementId,
      formDateObject,
      formValue,
      serverValidator,
      validator,
      validatorClass,
    };
  },
};
</script>
