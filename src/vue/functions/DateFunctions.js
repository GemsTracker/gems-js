import { useI18n } from 'vue-i18n';
import { format } from 'date-fns';
import { enGB, nl } from 'date-fns/locale';

const useDateFunctions = (() => {
  const { locale } = useI18n();

  const getDateFnsLocale = (() => {
    if (locale.value === 'en') {
      return enGB;
    }
    if (locale.value === 'nl') {
      return nl;
    }
    return enGB;
  });

  const formatIsoDate = ((dateItem) => {
    if (dateItem === null) {
      return null;
    }
    let newDate = dateItem;
    if (!(dateItem instanceof Date)) {
      newDate = new Date(dateItem);
    }

    return format(newDate, "yyyy-MM-dd'T'HH:mm:ssxxx");
  });

  const formatJsonDateTime = ((dateString, dateFormat = 'dd-MM-yyyy HH:mm:ss') => {
    if (dateString === null) {
      return null;
    }
    const dateObject = new Date(dateString);
    return format(dateObject, dateFormat, { locale: getDateFnsLocale() });
  });
  const formatJsonDate = ((dateString) => formatJsonDateTime(dateString, 'dd-MM-yyyy'));

  return {
    formatIsoDate,
    formatJsonDate,
    formatJsonDateTime,
  };
});

export default useDateFunctions;
