<template>
  <input type="text" ref="dateElement" :disabled="disabled" />
</template>
<script>
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import localeDe from 'air-datepicker/locale/de';
import localeEn from 'air-datepicker/locale/en';
import localeFr from 'air-datepicker/locale/fr';
import localeNl from 'air-datepicker/locale/nl';

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const dateElement = ref(null);

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

    onMounted(() => {
      const options = {};

      if (locale.value in availableLocales) {
        options.locale = availableLocales[locale.value];
      }

      const datePicker = new AirDatepicker(dateElement.value, options);
    });

    return {
      dateElement,
    };
  },
};
</script>
