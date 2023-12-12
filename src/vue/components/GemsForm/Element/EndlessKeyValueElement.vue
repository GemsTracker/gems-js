<template>
  <div class="form-group" :class="validatorClass">
    <gems-form-label :elementId="elementId" :options="options" :for="elementId" />
    <div class="element-container">
      <div v-for="(row, index) in formValue" :key="index">
        <key-value-sub-element v-model="formValue[index]" />
        <button type="button" @click="removeRow(index)" class="btn btn-danger btn-sm">
            <font-awesome-icon icon="xmark" />
        </button>
      </div>
        <button type="button" @click="addNewRow" class="btn btn-success btn-sm">
            <font-awesome-icon icon="plus" />
        </button>
      <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
      <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
    </div>
  </div>
</template>
<script>
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import GemsFormLabel from '../Label.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';

import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';
import KeyValueSubElement from './KeyValueSubElement.vue';

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
    FontAwesomeIcon,
    GemsFormLabel,
    GemsFormValidatorMessages,
    KeyValueSubElement,
  },
  setup(props) {
    const {
      disabled,
      elementId,
      formValue,
      serverValidator,
      validator,
      validatorClass,
    } = useGemsFormElementFunctions(props.options);

    const size = computed(() => {
      if ('size' in props.options && props.options.size) {
        return props.options.size;
      }
      return null;
    });

    // const keyValues = ref([]);

    const newKeyValue = {
      key: null,
      value: null,
    };

    // const externalValueChange = ref(true);

    /* watch(formValue, (newValues, oldValues) => {
      /* console.log('Mooooioiosdfjklsdfhj', oldValues, newValues);
      if (newValues !== null && externalValueChange.value === true && typeof newValues === 'object') {
        console.log('EXTERNAL CHANGE~');
        const pairs = [];
        Object.keys(newValues).forEach((key) => {
          const value = newValues[key];
          pairs.push({
            key,
            value,
          });
        });
        console.log(pairs);
        keyValues.value = pairs;
      }
    }); */

    /* const keyValues = computed({
      get() {
        if (formValue.value !== null) {
          const pairs = [];
          Object.keys(formValue.value).forEach((key) => {
            const value = formValue.value[key];
            pairs.push({
              key,
              value,
            });
          });
          return pairs;
        }
        return [];
      },
      set(values) {
        const pairs = {};
        values.forEach((row) => {
          if (row.key !== null) {
            pairs[row.key] = row.value;
          }
        });
        formValue.value = pairs;
      },
    }); */

    /* watch(keyValues, (newValues, oldValues) => {
      console.log('CHANGING KEY VALUES', newValues, oldValues);
      if (externalValueChange.value === true && Array.isArray(newValues)) {
        const pairs = {};
        console.log('XXXXX');
        console.log(newValues);
        newValues.forEach((row) => {
          pairs[row.key] = row.value;
        });
        externalValueChange.value = false;
        formValue.value = pairs;
        externalValueChange.value = true;
      }
    }, { deep: true }); */

    const addNewRow = (() => {

      formValue.value.push({ ...newKeyValue });
    });

    const removeRow = ((index) => {
      formValue.value.splice(index, 1);
    });

    onMounted(() => {
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
      removeRow,
      serverValidator,
      size,
      validator,
      validatorClass,
    };
  },
};
</script>
