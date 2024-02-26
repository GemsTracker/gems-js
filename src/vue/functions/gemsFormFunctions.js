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

  const getRulesForStructure = ((structure) => {
    const rules = {};
    if (structure !== null) {
      Object.values(structure).forEach((structureRow) => {
        if ('required' in structureRow && structureRow.required === true
            && (!('elementClass' in structureRow) || (structureRow.elementClass.toLowerCase() !== 'hidden' && structureRow.elementClass.toLowerCase() !== 'none')))
        {
          rules[structureRow.name] = [
            {
              name: 'required',
              test: required,
              message: 'Value is required and can\'t be empty',
            },
          ];
        }
        if ('structure' in structureRow) {
          rules[structureRow.name] = getRulesForStructure(structureRow.structure);
        }
      });
    }
    return rules;
  });

  const validationRules = computed(() => {
    return getRulesForStructure(structureData.value);
  });

  const { result: validation } = useValidate(formData, validationRules);

  const validate = (() => {
    validation.value.$test();
    //validation.value.$touch();
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
