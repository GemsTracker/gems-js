import { computed } from 'vue';
// import useValidate from 'vue-tiny-validate';
import useValidate from './validate';
import { required } from './validators';

const useGemsFormFunctions = ((structureData, formData) => {
  const getInitialFormValues = (() => {
    const initialValues = {};
    Object.keys(structureData.value).forEach((fieldName) => {
      let initialValue = null;
      const multiElementTypes = ['MultiSelect', 'MultiCheckbox'];
      if ('elementClass' in structureData.value[fieldName]
        && multiElementTypes.includes(structureData.value[fieldName].elementClass)) {
        initialValue = [];
      }
      if ('default' in structureData.value[fieldName]) {
        initialValue = structureData.value[fieldName].default;
      }

      initialValues[fieldName] = initialValue;
    });
    return initialValues;
  });

  const validationRules = computed(() => {
    const rules = {};
    if (structureData.value !== null) {
      Object.values(structureData.value).forEach((structureRow) => {
        if ('required' in structureRow && structureRow.required === true) {
          rules[structureRow.name] = [
            {
              name: 'required',
              test: required,
              message: 'Value is required and can\'t be empty',
            },
          ];
        }
      });
    }
    return rules;
  });

  const { result: validation } = useValidate(formData, validationRules);

  const validate = (() => {
    validation.value.$test();
    validation.value.$touch();
    // store.dispatch('gemsForm/resetServerValidation', true);
  });

  return {
    getInitialFormValues,
    validate,
    validation,

    validationRules,
  };
});

export default useGemsFormFunctions;
