import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import localeNl from 'air-datepicker/locale/nl';
import localeDe from 'air-datepicker/locale/de';
import localeFr from 'air-datepicker/locale/fr';
import { createPopper } from '@popperjs/core';
import { isValid, parse } from 'date-fns';

import 'air-datepicker/air-datepicker.css';

export default class Datepicker {
  constructor() {
    this.localeObjects = {
      de: localeDe,
      en: localeEn,
      fr: localeFr,
      nl: localeNl,
    };
  }

  init(root) {
    const datepickers = root.querySelectorAll('input.date-picker');

    datepickers.forEach((datepicker) => {
      const locale = this.getLocaleObject(datepicker);

      let options = {
        locale,
        position({
          $datepicker,
          $target,
          $pointer,
          done,
        }) {
          const popper = createPopper($target, $datepicker, {
            placement: 'bottom',
            modifiers: [
              {
                name: 'flip',
                options: {
                  padding: {
                    top: 64,
                  },
                },
              },
              {
                name: 'offset',
                options: {
                  offset: [0, 10],
                },
              },
              {
                name: 'arrow',
                options: {
                  element: $pointer,
                },
              },
            ],
          });
          return function completeHide() {
            popper.destroy();
            done();
          };
        },
      };

      if (datepicker.getAttribute('data-date-picker-settings')) {
        try {
          const elementSettings = JSON.parse(datepicker.getAttribute('data-date-picker-settings'));
          options = { ...options, ...elementSettings };
        } catch (error) {
          // do nothing
        }
      }

      if (!('selectedDates' in options)) {
        const selectedDate = this.getCurrentDate(datepicker);
        if (selectedDate instanceof Date) {
          options.selectedDates = [selectedDate];
        }
      }

      if (!('dateFormat' in options)) {
        const dateFormat = this.getDateFormat(datepicker);
        if (dateFormat !== null) {
          options.dateFormat = dateFormat;
        }
      }

      if (!('timeFormat' in options)) {
        const timeFormat = this.getTimeFormat(datepicker);
        if (timeFormat !== null) {
          options.timepicker = true;
          options.timeFormat = timeFormat;
        }
      }

      const element = new AirDatepicker(datepicker, options);

      datepicker.addEventListener('input', () => {
        const inputDate = this.getCurrentDate(datepicker);
        if (isValid(inputDate)) {
          element.selectDate(inputDate);
          element.setViewDate(inputDate);
        }
      });
    });
  }

  getCurrentDate(element) {
    const currentDate = element.value;
    if (currentDate === '') {
      return null;
    }
    const format = this.getFullFormat(element);
    return parse(currentDate, format, new Date());
  }

  getDateFormat(element) {
    if (element.getAttribute('data-date-format') === null) {
      return null;
    }
    const format = this.formatDateFormat(element.getAttribute('data-date-format').replace(/[^dmY/-]/gi, ''));
    if (format !== '') {
      return format;
    }
    return null;
  }

  getFullFormat(element) {
    if (element.getAttribute('data-date-format') === null) {
      return null;
    }
    return this.formatDateFormat(this.formatTimeFormat(element.getAttribute('data-date-format')));
  }

  formatDateFormat(dateFormat) {
    return dateFormat.replace('d', 'dd')
      .replace('m', 'MM')
      .replace('Y', 'yyyy');
  }

  getTimeFormat(element) {
    if (element.getAttribute('data-date-format') === null) {
      return null;
    }
    const format = this.formatTimeFormat(element.getAttribute('data-date-format').replace(/[^Hi:]/gi, ''));
    if (format !== '') {
      return format;
    }
    return null;
  }

  formatTimeFormat(dateFormat) {
    return dateFormat.replace('H', 'HH')
      .replace('i', 'mm');
  }

  getLocaleObject(element) {
    const attributeLocale = element.getAttribute('lang');
    if (attributeLocale !== null && attributeLocale in this.localeObjects) {
      return this.localeObjects[attributeLocale];
    }
    return this.localeObjects.en;
  }
}
