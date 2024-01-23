import {
  computed,
  inject,
  ref,
  watch,
} from 'vue';

const useGemsFormElementFunctions = ((elementOptions) => {
  const elementId = `element-${elementOptions.name}`;

  const formData = inject('formData');
  const startData = inject('startData');

  const formValue = computed({
    get: () => {
      if (elementOptions.name in formData.value) {
        return formData.value[elementOptions.name];
      }
      return null;
    },
    set: (value) => {
      formData.value[elementOptions.name] = value;
    },
  });

  const otherFieldDependency = ((otherFieldOptions) => {
    const fieldName = otherFieldOptions[0];
    if (fieldName in formData.value) {
      const otherFieldValue = formData.value[fieldName];
      if (otherFieldOptions.length === 1) {
        if (otherFieldValue === null) {
          return true;
        }
        return false;
      }

      switch (otherFieldOptions[1]) {
        case 'length':
          if (otherFieldOptions.length === 2 && otherFieldValue.length) {
            return true;
          }
          if (otherFieldOptions[2] === '=' && otherFieldValue.length === otherFieldOptions[3]) {
            return true;
          }
          if (otherFieldOptions[2] === '>' && otherFieldValue.length > otherFieldOptions[3]) {
            return true;
          }
          if (otherFieldOptions[2] === '<' && otherFieldValue.length < otherFieldOptions[3]) {
            return true;
          }
          return false;
        case 'null':
          if (otherFieldValue === null) {
            return true;
          }
          return false;
        case '=':
          if (otherFieldValue === otherFieldOptions[2]) {
            return true;
          }
          return false;
        case '!=':
          if (otherFieldValue !== otherFieldOptions[2]) {
            return true;
          }
          return false;
        case '>':
          if (otherFieldValue > otherFieldOptions[2]) {
            return true;
          }
          return false;
        case '<':
          if (otherFieldValue < otherFieldOptions[2]) {
            return true;
          }
          return false;
        case '>=':
          if (otherFieldValue >= otherFieldOptions[2]) {
            return true;
          }
          return false;
        case '<=':
          if (otherFieldValue <= otherFieldOptions[2]) {
            return true;
          }
          return false;
        case 'in':
          if (otherFieldOptions[2].includes(otherFieldValue)) {
            return true;
          }
          return false;
        default:
          return false;
      }
    }
    return false;
  });

  const disabled = computed(() => {
    if ('disabled' in elementOptions) {
      if (elementOptions.disabled === true || elementOptions.disabled === 'disabled') {
        return true;
      }
      if (elementOptions.disabled === false) {
        return false;
      }
      if (typeof elementOptions.disabled === 'object' && 'otherField' in elementOptions.disabled) {
        return otherFieldDependency(elementOptions.disabled.otherField);
      }
    }
    return false;
  });

  const visible = computed(() => {
    if ('hidden' in elementOptions) {
      if ('otherField' in elementOptions.hidden) {
        return !otherFieldDependency(elementOptions.hidden.otherField);
      }
    }
    return false;
  });

  const previousValue = ref(null);
  /* if (Array.isArray(formValue.value)) {
    previousValue.value = [];
  }
  watch(disabled, (currentlyDisabled) => {
    if (currentlyDisabled === true) {
      console.log('SETTING PREVIOUS VERSION');
      previousValue.value = formValue.value;
      let newValue = null;
      if (Array.isArray(formValue.value)) {
        newValue = [];
      }
      formValue.value = newValue;
    }
    if (currentlyDisabled === false) {
      console.log('RESTORING PREVIOUS VERSION');
      console.log(previousValue.value);
      formValue.value = previousValue.value;
    }
  }); */

  const validation = inject('validation');

  const validator = computed(() => {
    if ('$fields' in validation.value && elementOptions.name in validation.value.$fields) {
      return validation.value.$fields[elementOptions.name];
    }
    return null;
  });

  const serverValidation = inject('serverValidation');

  const serverValidator = computed(() => {
    if (elementOptions.name in serverValidation.value) {
      return serverValidation.value[elementOptions.name];
    }
    return null;
  });

  const validatorClass = computed(() => {
    if (validator.value !== null && validator.value.$dirty === true) {
      if (validator.value.$invalid) {
        return 'has-error';
      }
      return 'has-success';
    }
    if (serverValidator.value !== null && 'errors' in serverValidator.value && serverValidator.value.errors.length) {
      return 'has-error';
    }
    return null;
  });

  const previouslyChanged = ref(false);

  if ('onChange' in elementOptions) {
    if ('otherFieldValue' in elementOptions.onChange) {
      Object.keys(elementOptions.onChange.otherFieldValue).forEach((fieldName) => {
        watch(formValue, (newValue/* , oldValue */) => {
          // console.log(startData.value[elementOptions.name]);
          if (startData.value !== null && (newValue !== startData.value[elementOptions.name]
            || previouslyChanged.value === true)) {
            if (fieldName in formData.value) {
              const valueSet = elementOptions.onChange.otherFieldValue[fieldName];
              if (!Array.isArray(valueSet)) {
                formData.value[fieldName] = valueSet;
              }
            }
            previouslyChanged.value = true;
          }
        });
      });
    }
  }

  const validate = (() => {
    validator.value.$test();
    serverValidation.value = {};
  }, { deep: true });

  return {
    disabled,
    elementId,
    formValue,
    formData,
    validate,
    validator,
    serverValidator,
    validatorClass,
    visible,
    previousValue,
  };
});
export default useGemsFormElementFunctions;
