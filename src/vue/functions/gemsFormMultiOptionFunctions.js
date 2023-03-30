import {
  computed,
  inject,
  ref,
  watch,
} from 'vue';
import useGetModelRepository from './modelRepository';

const useGemsFormMultiOptionFunctions = ((elementOptions, formValue, formValues) => {
  const allReferenceData = ref(null);
  const loadingReferenceData = ref(false);

  const structure = inject('structure');

  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();

  const getAllReferenceData = (async (options) => {
    if ('reference' in options) {
      loadingReferenceData.value = true;
      const referenceList = options.reference.split('/');
      const referenceName = referenceList[referenceList.length - 1];
      const model = modelRepository.getEndpointModel(
        referenceName,
        options.reference,
      );

      const data = await model.all({ per_page: 9999 });
      allReferenceData.value = data;
      loadingReferenceData.value = false;
    }
    return null;
  });

  const sortFields = ((fields) => {
    const fieldsInfo = fields.map((order) => {
      const fieldInfo = {
        field: order,
        direction: 1,
      };
      if (order[0] === '-') {
        fieldInfo.field = order.substring(1);
        fieldInfo.direction = -1;
      }
      return fieldInfo;
    });

    return (a, b) => {
      let i = 0;
      let result = 0;
      while (i < fieldsInfo.length && result === 0) {
        if (typeof a[fieldsInfo[i].field] === 'number' && typeof b[fieldsInfo[i].field] === 'number') {
          result = fieldsInfo[i].direction
            * (a[fieldsInfo[i].field] - b[fieldsInfo[i].field]);
        } else {
          result = fieldsInfo[i].direction
            * (a[fieldsInfo[i].field].toString().localeCompare(b[fieldsInfo[i].field].toString()));
        }
        i += 1;
      }
      return result;
    };
  });

  const referenceOptions = computed(() => {
    let referenceData = null;
    if ('multiOptionSettings' in elementOptions && 'referenceData' in elementOptions.multiOptionSettings
      && elementOptions.multiOptionSettings.referenceData !== null) {
      referenceData = elementOptions.multiOptionSettings.referenceData;
    } else if (allReferenceData.value !== null) {
      referenceData = allReferenceData.value;
    }

    if (referenceData !== null) {
      if ('multiOptionSettings' in elementOptions && 'filter' in elementOptions.multiOptionSettings) {
        if ('otherFieldValueJoin' in elementOptions.multiOptionSettings.filter) {
          const { otherFieldValueJoin } = elementOptions.multiOptionSettings.filter;
          Object.keys(otherFieldValueJoin).forEach((otherFieldName) => {
            if (otherFieldName in formValues.value
              && ((formValues.value[otherFieldName] !== null)
                || (Array.isArray(formValues.value[otherFieldName])
                  && formValues.value[otherFieldName].length > 0))) {
              const dataRowFieldName = otherFieldValueJoin[otherFieldName];
              const filteredValues = {};
              let dataRowValue = null;
              Object.keys(referenceData).forEach((dataRowKey) => {
                const dataRow = referenceData[dataRowKey];
                // let dataRowValue = null;
                if (Array.isArray(dataRowFieldName)) {
                  dataRowValue = dataRow;
                  dataRowFieldName.forEach((dataRowSubFieldName) => {
                    if (dataRowSubFieldName in dataRowValue) {
                      dataRowValue = dataRowValue[dataRowSubFieldName];
                    }
                  });
                } else if (dataRowFieldName in dataRow) {
                  dataRowValue = dataRow[dataRowFieldName];
                }

                if (dataRowValue === formValues.value[otherFieldName]) {
                  filteredValues[dataRowKey] = dataRow;
                }
              });
              referenceData = filteredValues;
            }
          });
        }
      }

      if ('order' in elementOptions.multiOptionSettings) {
        referenceData = Object.values(referenceData)
          .sort(sortFields(elementOptions.multiOptionSettings.order));
      }

      if ('key' in elementOptions.multiOptionSettings
        && 'value' in elementOptions.multiOptionSettings) {
        const options = [];
        let referenceValues = referenceData;
        if (!Array.isArray(referenceData)) {
          referenceValues = Object.values(referenceData);
        }
        referenceValues.forEach((dataRow) => {
          if (elementOptions.multiOptionSettings.key in dataRow
            && elementOptions.multiOptionSettings.value in dataRow) {
            options.push({
              key: dataRow[elementOptions.multiOptionSettings.key],
              value: dataRow[elementOptions.multiOptionSettings.value],
            });
          }
        });
        if (options.length) {
          return options;
        }
      }
      if ('column' in elementOptions.multiOptionSettings) {
        const options = [];
        let referenceValues = referenceData;
        if (!Array.isArray(referenceData)) {
          referenceValues = Object.values(referenceData);
        }
        referenceValues.forEach((dataRow) => {
          if (elementOptions.multiOptionSettings.column in dataRow) {
            options.push(dataRow[elementOptions.multiOptionSettings.column]);
          }
        });
        if (options.length) {
          return options;
        }
      }
    }

    return null;
  });

  const formOptions = computed(() => {
    const options = [];
    if ('multiOptions' in elementOptions) {
      if (Array.isArray(elementOptions.multiOptions)) {
        elementOptions.multiOptions.forEach((optionRow) => {
          if (optionRow.key !== '') {
            let correctKey = optionRow.key;
            if (!Number.isNaN(+correctKey)) {
              correctKey = +correctKey;
            }
            options.push({ key: correctKey, value: optionRow.value });
          }
        });
      } else {
        Object.keys(elementOptions.multiOptions).forEach((key) => {
          if (key !== '') {
            let correctKey = key;
            if (!Number.isNaN(+correctKey)) {
              correctKey = +correctKey;
            }
            options.push({ key: correctKey, value: elementOptions.multiOptions[key] });
          }
        });
      }
    }
    if ('multiOptionSettings' in elementOptions && referenceOptions.value !== null) {
      return referenceOptions.value;
    }
    return options;
  });

  const onChange = ((newValue) => {
    const updateFields = elementOptions.multiOptionSettings.onChange;
    Object.keys(updateFields).forEach((updateFieldName) => {
      if ('multiOptionSettings' in updateFields[updateFieldName]) {
        const newSettings = {};

        if ('referenceData' in updateFields[updateFieldName].multiOptionSettings) {
          if (Array.isArray(newValue) && newValue.length === 0) {
            newSettings.multiOptionSettings = {
              referenceData: null,
            };
          } else if (allReferenceData.value !== null && newValue in allReferenceData.value
            && updateFields[updateFieldName].multiOptionSettings.referenceData
            in allReferenceData.value[newValue]) {
            const localField = updateFields[updateFieldName].multiOptionSettings.referenceData;

            newSettings.multiOptionSettings = {
              referenceData: allReferenceData.value[newValue][localField],
            };
          }
        }

        if (Object.keys(newSettings).length) {
          Object.keys(newSettings).forEach((settingName) => {
            let newData = newSettings;
            if (settingName in structure.value[updateFieldName]) {
              newData = {
                ...structure.value[updateFieldName][settingName],
                ...newSettings[settingName],
              };
            }
            structure.value[updateFieldName][settingName] = newData;
          });
        }
      }
    });
  });

  if ('multiOptionSettings' in elementOptions && 'onChange' in elementOptions.multiOptionSettings) {
    watch(formValue, (newValue) => {
      onChange(newValue);
    });
  }

  const initSingleAnswerElement = (async () => {
    if ('multiOptionSettings' in elementOptions) {
      await getAllReferenceData(elementOptions.multiOptionSettings);
      if (formValue.value !== null && 'multiOptionSettings' in elementOptions && 'onChange' in elementOptions.multiOptionSettings) {
        onChange(formValue.value);
      }
    }
  });

  const initMultipleAnswerElement = (async () => {
    /* if (!Array.isArray(formValue.value)) {
      const value = formValue;
      console.log('SETTINGS VALUE');
      console.log(value.value);
      value.value = [];
    } */
    if ('multiOptionSettings' in elementOptions) {
      await getAllReferenceData(elementOptions.multiOptionSettings);
      if (formValue.value !== null && 'multiOptionSettings' in elementOptions && 'onChange' in elementOptions.multiOptionSettings) {
        onChange(formValue.value);
      }
    }
  });

  return {
    formOptions,
    getAllReferenceData,
    initMultipleAnswerElement,
    initSingleAnswerElement,
    loadingReferenceData,
    // Debug
    referenceOptions,
  };
});
export default useGemsFormMultiOptionFunctions;