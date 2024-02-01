<template>
  <div class="form-group" :class="validatorClass">
    <gems-form-label :elementId="elementId" :options="options" :for="elementId" />
    <div class="element-container">
      <div v-for="(row, index) in formValue" :key="index" class="form-inline">
        <sub-form-element :form-data="row" :structure="structure" />
        <button type="button" @click="removeRow(index)" class="btn btn-danger btn-sm">
            <font-awesome-icon icon="xmark" />
        </button>
      </div>
        <button type="button" @click="addNewRow" class="btn btn-success btn-sm">
            <font-awesome-icon icon="plus" />
        </button>
        <div v-if="isInvalid" class="errors alert alert-danger">
            <div v-for="(fields, rowIndex) in validator.$messages" :key="rowIndex">
              {{ t('Row')}}: {{rowIndex}}
              <ul>
                  <li v-for="(messages, fieldName, index) in fields" :key="index">
                      {{getFieldLabel(fieldName)}}: {{messages.join(', ')}}
                  </li>
              </ul>
            </div>
        </div>

<!--      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />-->
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script>
import {
  computed,
  onMounted,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';

import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';
import useGemsFormFunctions from '../../../functions/gemsFormFunctions';
import SubFormElement from './SubFormElement.vue';


library.add(faPlus, faXmark);
export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {
    SubFormElement,
    FontAwesomeIcon,
    GemsFormLabel,
    GemsFormValidatorMessages,
  },
  setup(props) {

    const { t } = useI18n();
    const {
      disabled,
      elementId,
      formValue,
      serverValidator,
      validator,
      validatorClass,
    } = useGemsFormElementFunctions(props.options);

    const structure = computed(() => {
      if ('structure' in props.options) {
        return props.options.structure;
      }
      return {};
    });

    const { getInitialFormValues } = useGemsFormFunctions(structure, formValue);

    const initialFormValues = getInitialFormValues();

    const size = computed(() => {
      if ('size' in props.options && props.options.size) {
        return props.options.size;
      }
      return null;
    });

    const addNewRow = (() => {
      console.log(initialFormValues);
      if (formValue.value === null) {
        formValue.value = [];
      }
      formValue.value.push({ ...initialFormValues });
    });

    const removeRow = ((index) => {
      formValue.value.splice(index, 1);
    });

    const isInvalid = computed(() => {
      if (validator.value && '$invalid' in validator.value) {
        return validator.value.$invalid;
      }
      return false;
    });

    const getFieldLabel = ((fieldName) => {
      if ('structure' in props.options
          && fieldName in props.options.structure
          && 'label' in props.options.structure[fieldName]
      ) {
        props.options.structure[fieldName].label;
      }
      return fieldName;
    });

    onMounted(() => {
      //console.log(getInitialFormValues());
      if (formValue.value === null) {
        formValue.value = [];
      }
      if (formValue.value.length === 0) {
        addNewRow();
      }
    });

    return {
      addNewRow,
      disabled,
      elementId,
      formValue,
      getFieldLabel,
      isInvalid,
      removeRow,
      serverValidator,
      size,
      structure,
      t,
      validator,
      validatorClass,
    };
  },
};
</script>
