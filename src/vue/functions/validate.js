import { computed, ref, watch } from 'vue';

const useValidate = ((formData, validationRules) => {
  const dirtyFields = ref({});
  const errors = ref({});
  const messages = ref({});

  /* const fieldMessages = computed(() => {
    const emptyFieldMessages = {};
    Object.keys(validationRules.value).forEach((fieldName) => {
      emptyFieldMessages[fieldName] = [];
    });
    if (fieldName in messages.value) {
      fieldMessages = messages[fieldName];
    }
  }); */

  const isDirty = computed(() => Object.keys(dirtyFields.value).length > 0);

  const invalid = computed(() => Object.keys(errors.value).length > 0);

  const reset = (() => {
    // dirtyFields = {};
    errors.value = {};
    messages.value = {};
  });

  const validateField = ((fieldName, fieldValidations, value) => {
    console.log(`Validating ${fieldName}`);
    console.log(fieldValidations);
    if (!Array.isArray(fieldValidations) && typeof fieldValidations === 'object') {
      // Nested validators
      const result = {
        errors: {},
        messages: {},
      }
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i += 1) {
          const subRow = value[i];
          Object.keys(fieldValidations).forEach((subFieldName) => {
            const subResult = validateField(fieldName, fieldValidations[subFieldName], subRow[fieldName]);
            if (!(i in result.errors)) {
              result.errors[i] = {};
            }
            if (!(i in result.messages)) {
              result.messages[i] = {};
            }
            result.errors[i][subFieldName] = true;
            result.messages[i][subFieldName] = subResult.messages;
          });
        }
      }
      if (Object.keys(result.errors).length) {
        return result;
      }
      return { errors: false };
    }

    const result = {
      errors: false,
      messages: [],
    }

    if (!Array.isArray(fieldValidations)) {
      fieldValidations = [fieldValidations];
    }

    fieldValidations.forEach((validationRule) => {
      const { message, test } = validationRule;
      console.log(validationRule);
      if (test(value) === false) {
        console.log('VALIDATION ERRORS');
        result.errors = true;
        result.messages.push(message);
      }
    });
    return result;
  });

  const fieldValidators = computed(() => {
    const validators = {};
    Object.keys(validationRules.value).forEach((fieldName) => {
      let fieldMessages = [];
      if (fieldName in messages.value) {
        fieldMessages = messages.value[fieldName];
      }
      const values = {
        $dirty: fieldName in dirtyFields.value,
        $invalid: fieldName in errors.value,
        $messages: fieldMessages,
        // $test: validateField(fieldName),
      };
      validators[fieldName] = values;
    });
    return validators;
  });

  const validate = (() => {
    console.log(formData.value);
    Object.keys(validationRules.value).forEach((fieldName) => {
      const result = validateField(fieldName, validationRules.value[fieldName], formData.value[fieldName]);
      console.log('VALIDATION RESULT!', fieldName, result);
      delete errors.value[fieldName];
      delete messages.value[fieldName];
      if (result.errors) {
        errors.value[fieldName] = true;
        messages.value[fieldName] = result.messages;
      }
    });
  });

  watch(formData, () => {
    console.log('formData change~');
  });

  const result = ref({
    $dirty: isDirty,
    $errors: errors,
    $invalid: invalid,
    $messages: messages,
    $reset: reset,
    $test: validate,
    $validate: validate,
    $fields: fieldValidators,
    $dirtyFields: dirtyFields,
    formData,
    validationRules,
  });

  return {
    result,
  };
});

export default useValidate;
