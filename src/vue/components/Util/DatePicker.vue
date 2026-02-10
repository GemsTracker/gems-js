<template>
  <input
      type="text"
      ref="inputRef"
      :disabled="disabled"
      :readonly="!allowInput"
      @input="handleManualInput"
  />
</template>

<script setup>
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

const props = defineProps({
  modelValue: {
    type: Date,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  dateFormat: {
    type: String,
    default: 'dd-MM-yyyy',
  },
  allowInput: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);
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

const initDatePicker = () => {
  if (datepicker.value) {
    datepicker.value.destroy();
  }

  const options = {
    locale: availableLocales[locale.value] || localeEn,
    dateFormat: props.dateFormat,
    onSelect: ({ date }) => {
      emit('update:modelValue', date);
    },
  };

  datepicker.value = new AirDatepicker(inputRef.value, options);

  // Set initial value
  if (props.modelValue) {
    const date = typeof props.modelValue === 'string' ? new Date(props.modelValue) : props.modelValue;
    datepicker.value.selectDate(date, { silent: true });
  }
};

const handleManualInput = (event) => {
  const { value } = event.target;

  if (!value) {
    emit('update:modelValue', null);
    return;
  }

  const parsedDate = parseDate(value);
  if (parsedDate && !isNaN(parsedDate.getTime())) {
    // Update datepicker silently to avoid triggering onSelect
    datepicker.value.selectDate(parsedDate, { silent: true });
    //datepicker.value.setViewDate(parsedDate);
    emit('update:modelValue', parsedDate);
  }
};

const parseDate = (dateStr) => {
  if (!dateStr || dateStr.length < 10) return null;

  const format = props.dateFormat.toLowerCase();
  const separator = format.includes('-') ? '-' : format.includes('.') ? '.' : '/';
  const parts = dateStr.split(separator);
  const formatParts = format.split(separator);

  if (parts.length !== 3) return null;

  let day, month, year;

  formatParts.forEach((part, index) => {
    if (part.includes('d')) day = parseInt(parts[index], 10);
    if (part.includes('m')) month = parseInt(parts[index], 10) - 1;
    if (part.includes('y')) year = parseInt(parts[index], 10);
  });

  const date = new Date(year, month, day);
  // Check if it's a valid date object
  return isNaN(date.getTime()) ? null : date;
};

watch(() => props.modelValue, (newValue) => {
  if (!datepicker.value) {
    return;
  }

  if (newValue) {
    const date = typeof newValue === 'string' ? new Date(newValue) : newValue;
    const currentDate = datepicker.value.selectedDates[0];

    // Only update if the date actually changed
    if (!currentDate || currentDate.getTime() !== date.getTime()) {
      datepicker.value.selectDate(date, { silent: true });
    }
  } else {
    datepicker.value.clear({ silent: true });
  }
});

watch(() => props.disabled, (newValue) => {
  if (inputRef.value) {
    inputRef.value.disabled = newValue;
  }
});

watch(() => locale.value, (newLocale) => {
  if (datepicker.value) {
    datepicker.value.update({
      locale: availableLocales[newLocale] || localeEn,
    });
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
</script>