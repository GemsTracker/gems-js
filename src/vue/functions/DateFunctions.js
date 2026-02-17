import { useI18n } from 'vue-i18n';
import { format, isValid, parse, parseISO } from 'date-fns';
import { de, enGB, fr, nl } from 'date-fns/locale';

const useDateFunctions = ((localeOverride  = null) => {
  const locales = {
    de,
    en: enGB,
    fr,
    nl,
  };

  const getDateFnsLocale = (() => {
      if (localeOverride !== null) {
        return locales[localeOverride];
      }
      return locales[useI18n().locale.value];
  });

  const formatIsoDate = ((dateItem) => {
    if (dateItem === null) {
      return null;
    }
    let newDate = dateItem;
    if (!(dateItem instanceof Date)) {
      newDate = parseDateString(dateItem);
    }

    return format(newDate, "yyyy-MM-dd'T'HH:mm:ssxxx");
  });

  const formatJsonDateTime = ((dateString, dateFormat = 'dd-MM-yyyy HH:mm:ss') => {
    if (dateString === null) {
      return null;
    }
    const dateObject = parseDateString(dateString);
    return format(dateObject, dateFormat, { locale: getDateFnsLocale() });
  });
  const formatJsonDate = ((dateString) => formatJsonDateTime(dateString, 'dd-MM-yyyy'));

  const parseDateString = ((dateString, format = null) => {

    if (format !== null) {
      const date = parse(dateString, format, new Date());
      if (isValid(date)) {
        return date;
      }
      throw new Error(`Unable to parse date string: "${dateString}" in format "${format}"`);
    }

    if (dateString.includes('T')) {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return date;
      }
    }
    let date = parse(dateString, 'yyyy-MM-dd HH:mm:ss', new Date());
    if (isValid(date)) {
      return date;
    }
    date = parse(dateString, 'yyyy-MM-dd', new Date());
    if (isValid(date)) {
      return date;
    }
    date = parse(dateString, 'yyyy-MM-dd HH:mm', new Date());
    if (isValid(date)) {
      return date;
    }

    throw new Error(`Unable to parse date string: "${dateString}"`);
  });

  return {
    formatIsoDate,
    formatJsonDate,
    formatJsonDateTime,
    parseDateString,
  };
});

export default useDateFunctions;
