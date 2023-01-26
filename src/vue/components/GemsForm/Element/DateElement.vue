<template>
  <div class="form-group" :class="validatorClass">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container">
      <div class="input-group">
        <div class="input-group-addon">
          <font-awesome-icon :icon="['far', 'calendar-alt']" />
        </div>
        <datepicker v-if="dateLocale !== null" v-model="formDateObject" class="form-control"
          :disabled="disabled" :locale="dateLocale" />
      </div>
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { enUS, nl } from 'date-fns/locale';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Datepicker from '../../Util/DatePicker.vue';
import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';
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
    const { locale } = useI18n({ useScope: 'global' });

    const availableLanguages = {
      en: enUS,
      nl,
    };

    const dateLocale = computed(() => {
      if (locale.value !== null && locale.value in availableLanguages) {
        const currentLocale = availableLanguages[locale.value];
        return currentLocale;
      }
      return null;
    });

    const {
      disabled,
      elementId,
      formValue,
      serverValidator,
      validator,
      validatorClass,
    } = useGemsFormElementFunctions(props.options);

    const formDateObject = computed({
      get: () => {
        if (formValue.value !== null) {
          return new Date(formValue.value);
        }
        return null;
      },
      set: (value) => {
        if (value instanceof Date) {
          formValue.value = value.toISOString();
        } else {
          formValue.value = value;
        }
      },
    });

    return {
      availableLanguages,
      dateLocale,
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
