<template>
  <input
      type="text"
      ref="dateElement"
      :disabled="disabled"
      :value="modelValue"
      @input="updateValue"
  />
</template>
<script>
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import localeDe from 'air-datepicker/locale/de';
import localeEn from 'air-datepicker/locale/en';
import localeFr from 'air-datepicker/locale/fr';
import localeNl from 'air-datepicker/locale/nl';

export default {
  props: {
    modelValue: {
      type: Date,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const dateElement = ref(null);
    const datepicker = ref(null);

    const { locale } = useI18n({ useScope: 'global' });

    const availableLocales = {
      en: localeEn,
      de: localeDe,
      fr: localeFr,
      nl: localeNl,
    };
    availableLocales.en.dateFormat = availableLocales.nl.dateFormat;
    availableLocales.de.dateFormat = availableLocales.nl.dateFormat;
    availableLocales.fr.dateFormat = availableLocales.nl.dateFormat;

    const updateValue = (event) => {
      emit('update:modelValue', event.target.value);
    };

    const initDatePicker = () => {
      if (datepicker.value) {
        datepicker.value.destroy();
      }

      let startDate = [];
      if (props.modelValue) {
        startDate = props.modelValue;
      }

      datepicker.value = new AirDatepicker(dateElement.value, {
        locale: availableLocales[locale.value] || localeEn,
        dateFormat: props.dateFormat,
        selectedDates: startDate,
        onSelect: ({ date, formattedDate }) => {
          console.log('NEW DATE MF!', date, formattedDate);
          emit('update:modelValue', date);
        },
      });
    };

    watch(() => props.modelValue, (newValue) => {
      if (datepicker.value) {
        datepicker.value.selectDate(newValue);
      }
    });

    onMounted(() => {
      initDatePicker();
    });

    onBeforeUnmount(() => {
      if (datepicker.value) {
        datepicker.value.destroy();
      }
    });

    return {
      dateElement,
      updateValue,
      datepicker,
    };
  },
};
</script>
