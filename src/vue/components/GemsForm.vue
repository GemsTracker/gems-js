<template>
  <div class="gems-form">
    <div class="form" v-if="structure !== null">
      <base-form :structure="structure" :form-type="formType" />
      <button class="btn btn-success" @click="submit" :disabled="submitting || !changes">
        {{ submitLabel }}
        <span v-if="submitting">
          &nbsp;<loading-screen v-if="submitting" size="1.25rem" color="white" />
        </span>
      </button>
      <span v-if="submitInfo !== null" class="submitMessage"
        :class="`text-${submitInfo.status}`">
        <font-awesome-icon :icon="submitInfo.icon" />
        {{submitInfo.message}}
      </span>
      <br />
      <!-- <div class="actionlink btn" @click="validate">validate</div><br /> -->
      <!-- <div class="actionlink btn" @click="cancel">Cancel</div> -->
    </div>
    <loading-screen v-if="loading" />
  </div>
</template>
<script>
import {
  computed,
  nextTick,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue';
import { cloneDeep, isEqual } from 'lodash';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useGetModelRepository from '../functions/modelRepository';
import useGemsFormFunctions from '../functions/gemsFormFunctions';
import useBasePropStorer from '../functions/basePropStorer';
import BaseForm from './GemsForm/BaseForm.vue';
import LoadingScreen from './Util/LoadingScreen.vue';

library.add(faCheck, faTimes);

export default {
  props: {
    apiUrl: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    formType: {
      type: String,
      required: false,
      default: null,
    },
    locale: {
      type: String,
      required: false,
      default: 'en',
    },
    resource: {
      type: String,
      required: true,
    },
    edit: {
      required: false,
      default: false,
    },
    submitLabel: {
      type: String,
      default: 'Save',
    },
  },
  components: {
    BaseForm,
    FontAwesomeIcon,
    LoadingScreen,
  },
  setup(props) {
    const { getModelRepository } = useGetModelRepository();
    const modelRepository = getModelRepository();

    useBasePropStorer(props);

    const formData = ref({});
    const initialFormValues = ref(null);

    const structure = ref(null);

    const changes = ref(false);

    const { getInitialFormValues, validation, validationRules, validate } = useGemsFormFunctions(structure, formData);
    const serverValidation = ref({});

    const getEndpointStructure = (async () => {
      const model = modelRepository.getEndpointModel(props.resource, props.endpoint);
      console.log(model);
      const modelStructure = await model.structure();
      console.log(modelStructure);
      structure.value = modelStructure;

      if (props.edit === false) {
        formData.value = getInitialFormValues();
        initialFormValues.value = { ...formData.value };
      }
    });

    const getEditData = (async (editId) => {
      const model = modelRepository.getEndpointModel(props.resource, props.endpoint);
      const editData = await model.findById(editId);
      console.log('EDIT DATA!');
      console.log(editData);
      formData.value = editData;
      initialFormValues.value = cloneDeep(formData.value);
    });

    const loading = computed(() => {
      if (structure.value !== null && Object.keys(structure.value).length
        && (props.edit === false || Object.keys(formData.value).length > 0)) {
        return false;
      }
      return true;
    });

    const cancel = (() => {
      console.log(window.location);
      const currentUrl = window.location.href;
      const newUrl = currentUrl.replace('/create', '').replace(`/edit/id/${props.edit}`, '').replace(window.location.search, '');
      console.log(newUrl);
      window.location.href = newUrl;
    });

    const submitting = ref(false);
    const submitInfo = ref(null);

    const submit = (async () => {
      submitting.value = true;
      validate();
      await nextTick();
      if (validation.value.$invalid === false) {
        const model = modelRepository.getEndpointModel(props.resource, props.endpoint);
        let response = null;
        if (props.edit === false) {
          response = await model.insert(formData.value);
        } else {
          response = await model.updateById(props.edit, formData.value);
        }
        console.log(response);
        if (response !== null && 'status' in response) {
          if (response.status === 201) {
            submitInfo.value = {
              icon: 'check',
              status: 'success',
            };
          } else {
            if ('error' in response.data && response.data.error === 'validation_error') {
              const serverValidationMessages = {};
              Object.keys(response.data.errors).forEach((fieldName) => {
                const fieldErrors = [];
                const fieldMessages = [];
                Object.keys(response.data.errors[fieldName]).forEach((errorName) => {
                  fieldErrors.push({
                    name: errorName,
                    message: response.data.errors[fieldName][errorName],
                  });
                  fieldMessages.push(response.data.errors[fieldName][errorName]);
                });
                serverValidationMessages[fieldName] = {
                  errors: fieldErrors,
                  messages: fieldMessages,
                };
              });
              serverValidation.value = serverValidationMessages;
            }
            submitInfo.value = {
              icon: 'times',
              status: 'danger',
            };
          }
        }
      }
      submitting.value = false;
    });

    onMounted(() => {
      getEndpointStructure();
      if (props.edit !== false) {
        getEditData(props.edit);
      }

      watch(formData, (newData) => {
        console.log('CHANGES IN FORM DATA');
        console.log(newData);
        console.log(initialFormValues.value);
        if (isEqual(newData, initialFormValues.value)) {
          changes.value = false;
        } else {
          changes.value = true;
        }
      }, { deep: true });
    });

    provide('formData', formData);
    provide('formType', props.formType);
    provide('startData', initialFormValues);
    provide('validation', validation);
    provide('serverValidation', serverValidation);
    provide('structure', structure);

    return {
      cancel,
      changes,
      formData,
      initialFormValues,
      loading,
      structure,
      submit,
      submitInfo,
      submitting,
      validationRules,
    };
  },
};
</script>
