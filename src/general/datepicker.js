import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import localeNl from 'air-datepicker/locale/nl';
import localeDe from 'air-datepicker/locale/de';
import localeFr from 'air-datepicker/locale/fr';
import { createPopper } from '@popperjs/core';
import { parse } from 'date-fns';

import 'air-datepicker/air-datepicker.css';

export default class Datepicker {
  constructor() {
    console.log(4);

    this.localeObjects = {
      de: localeDe,
      en: localeEn,
      fr: localeFr,
      nl: localeNl,
    };

    this.init();
  }

  init() {
    const datepickers = document.querySelectorAll('input.date-picker');

    datepickers.forEach((datepicker) => {
      const locale = this.getLocaleObject(datepicker);

      const options = {
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

      const selectedDate = this.getCurrentDate(datepicker);
      if (selectedDate instanceof Date) {
        options.selectedDates = [selectedDate];
      }

      const dateFormat = this.getDateFormat(datepicker);
      if (dateFormat !== null) {
        options.dateFormat = dateFormat;
      }

      console.log(options);

      const element = new AirDatepicker(datepicker, options);
    });
  }

  getCurrentDate(element) {
    const currentDate = element.value;
    if (currentDate === '') {
      return null;
    }
    const format = this.getDateFormat(element);
    console.log(currentDate, format);
    console.log(parse(currentDate, format, new Date()));
    return parse(currentDate, format, new Date());
  }

  getDateFormat(element) {
    if (element.getAttribute('dateformat') === null) {
      return null;
    }
    return element.getAttribute('dateformat')
      .replace('d', 'dd')
      .replace('m', 'MM')
      .replace('Y', 'yyyy');
  }

  getLocaleObject(element) {
    const attributeLocale = element.getAttribute('lang');
    if (attributeLocale !== null && attributeLocale in this.localeObjects) {
      return this.localeObjects[attributeLocale];
    }
    return this.localeObjects.en;
  }
}

window.addEventListener('load', () => {
  const datepicker = new Datepicker();
});
