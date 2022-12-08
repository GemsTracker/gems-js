import { useI18n } from 'vue-i18n';

const useDateFunctions = (() => {
  const { locale } = useI18n();

  const formatJsonDateTime = ((dateString, options = null) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleString(locale.value, options);
  });
  const formatJsonDate = ((dateString) => formatJsonDateTime(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }));

  return {
    formatJsonDate,
    formatJsonDateTime,
  };
});

export default useDateFunctions;
