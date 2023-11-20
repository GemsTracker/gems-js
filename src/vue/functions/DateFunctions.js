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

  const formatJsonDateTime = ((dateString, dateFormat = 'dd-MM-yyyy HH:mm:ss') => {
    if (dateString === null) {
      return null;
    }
    const dateObject = new Date(dateString);
    return format(dateObject, dateFormat, getDateFnsLocale());
  });
  const formatJsonDate = ((dateString) => formatJsonDateTime(dateString, 'dd-MM-yyyy'));

  return {
    formatJsonDate,
    formatJsonDateTime,
  };
});

export default useDateFunctions;
