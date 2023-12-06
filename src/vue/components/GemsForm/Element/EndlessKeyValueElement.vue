<template>
  <div class="form-group" :class="validatorClass">
    <gems-form-label :elementId="elementId" :options="options" :for="elementId" />
    <div class="element-container">
      <div v-for="(row, index) in keyValues" :key="index">
        <key-value-sub-element v-model="keyValues[index]" />
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
import { computed, onMounted, ref, watch } from 'vue';
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

    const keyValues = ref([]);

    const newKeyValue = {
      key: null,
      value: null,
    };

    const addNewRow = (() => {
      keyValues.value.push({ ...newKeyValue });
    });

    const removeRow = ((index) => {
      keyValues.value.splice(index, 1);
    });

    onMounted(() => {
      addNewRow();
      if (formValue.value !== null) {
        const keyValueObjects = [];
        Object.keys(formValue.value).forEach((key) => {
          keyValueObjects.push({
            key,
            value: formValue.value[key],
          });
        });
        keyValues.value = keyValueObjects;
      }
    });

    watch(keyValues.value, (newValues) => {
      const pairs = {};
      newValues.forEach((row) => {
        pairs[row.key] = row.value;
      });
      formValue.value = pairs;
    });

    return {
      addNewRow,
      disabled,
      elementId,
      formValue,
      keyValues,
      removeRow,
      serverValidator,
      size,
      validator,
      validatorClass,
    };
  },
};
</script>
