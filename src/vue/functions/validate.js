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

  const validateField = ((fieldName) => {
    if (fieldName in validationRules.value) {
      console.log(`Validating ${fieldName}`);
      let fieldValidations = validationRules.value[fieldName];
      console.log(fieldValidations);
      if (!Array.isArray(fieldValidations)) {
        fieldValidations = [fieldValidations];
      }
      fieldValidations.forEach((validationRule) => {
        const { message, test } = validationRule;
        console.log(validationRule);
        if (test(formData.value[fieldName]) === false) {
          console.log('VALIDATION ERRORS');
          errors.value[fieldName] = true;
          if (!(fieldName in messages.value)) {
            messages.value[fieldName] = [];
          }
          messages.value[fieldName].push(message);
        }
      });
    }
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
      validateField(fieldName);
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
  });

  return {
    result,
  };
});

export default useValidate;
