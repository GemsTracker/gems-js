<template>
  <div class="form-group">
    <label v-html="label"></label>
    <div class="element-container">
      <ul class="nav nav-tabs">
        <li v-for="(label, index) in tabs" :key="index" class="nav-item">
          <a class="nav-link" :class="{active: currentTab === index}" href=""
            @click.prevent="currentTab = index">
            {{label}}
          </a>
        </li>
      </ul>
      <div class="row">
        <div v-if="currentTabData !== null"
          :class="{col: (visiblePreview && previewPosition == 'right')}">
          <text-element :options="structure.subject" />
          <ck-editor :options="structure.body" />
          <validator-messages :validator="validator" :serverValidator="serverValidator" />
        </div>
        <div class="preview" :class="{col: (visiblePreview && previewPosition == 'right')}">
          <h3 class="title">Preview</h3>
          <div class="controls">
            <font-awesome-icon @click="changePreviewPosition('right')"
              icon="fa-regular fa-square-caret-left"
              title="Side by side"
              :class="{'text-danger': visiblePreview && previewPosition == 'right'}" />
            <font-awesome-icon @click="changePreviewPosition('bottom')"
              icon="fa-regular fa-square-caret-down"
              title="Under"
              :class="{'text-danger': visiblePreview && previewPosition == 'bottom'}" />
            <font-awesome-icon v-if="visiblePreview" @click="visiblePreview = false"
              title="Hide"
              icon="fa-solid fa-eye" />
            <font-awesome-icon v-if="!visiblePreview" @click="visiblePreview = true"
              title="Hidden"
              icon="fa-solid fa-eye-slash" class="text-danger" />
          </div>
          <comm-template-preview v-if="visiblePreview"
            :form-data="currentTabData" :comm-fields="commFields" />
        </div>
      </div>
      <comm-field-filter :comm-target="commTarget" />
      <template v-if="!commFieldsLoading">
        <span v-if="commFieldsEmpty" class="text-danger">No fields found for input value</span>
        <comm-template-fields :comm-fields="commFields" />
      </template>
      <loading-screen v-if="commFieldsLoading"/>
    </div>
  </div>
</template>
<script>
import {
  computed,
  inject,
  onMounted,
  provide,
  ref,
  toRaw,
  watch,
} from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSquareCaretLeft, faSquareCaretDown } from '@fortawesome/free-regular-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import CkEditor from './CkEditorElement.vue';
// import SubForm from './SubForm.vue';
import CommTemplatePreview from '../CommTemplatePreview.vue';
import CommFieldFilter from '../CommFieldFilter.vue';
import CommTemplateFields from '../CommTemplateFields.vue';
import TextElement from './TextElement.vue';
import LoadingScreen from '../../Util/LoadingScreen.vue';
import ValidatorMessages from '../ValidatorMessages.vue';
import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';
import useGemsFormFunctions from '../../../functions/gemsFormFunctions';
import CommFieldsRepository from '../../../functions/CommFieldsRepository';

library.add(faEye, faEyeSlash, faSquareCaretLeft, faSquareCaretDown);

export default {
  props: {
    options: {
      // type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {
    CkEditor,
    CommFieldFilter,
    CommTemplateFields,
    CommTemplatePreview,
    FontAwesomeIcon,
    LoadingScreen,
    TextElement,
    ValidatorMessages,
  },
  setup(props) {
    const {
      // disabled,
      elementId,
      formValue,
      serverValidator,
      validator,
      // validatorClass,
    } = useGemsFormElementFunctions(props.options);

    const formType = inject('formType');
    const structure = computed(() => {
      if ('structure' in props.options) {
        return props.options.structure;
      }
      return null;
    });

    const label = computed(() => {
      if ('label' in props.options) {
        return props.options.label;
      }
      return ' ';
    });

    const currentTab = ref(null);
    const tabs = computed(() => {
      if ('language' in structure.value && 'multiOptions' in structure.value.language) {
        return structure.value.language.multiOptions;
      }
      return null;
    });
    onMounted(() => {
      const tabIndexes = Object.keys(tabs.value);
      if (tabIndexes.length) {
        [currentTab.value] = tabIndexes;
      }
    });

    const currentTabData = computed(() => {
      if (Array.isArray(formValue.value)) {
        let currentData = {};
        for (let i = 0; i < formValue.value.length; i += 1) {
          if ('language' in formValue.value[i] && formValue.value[i].language === currentTab.value) {
            currentData = formValue.value[i];
            break;
          }
        }
        return currentData;
      }

      return {};
    });

    const parentFormData = inject('formData');

    const commTarget = computed(() => {
      if ('mailTarget' in parentFormData.value) {
        return parentFormData.value.mailTarget;
      }
      return null;
    });

    provide('formData', currentTabData);

    const visiblePreview = ref(true);
    const previewPosition = ref('right');
    const changePreviewPosition = ((position) => {
      previewPosition.value = position;
      visiblePreview.value = true;
    });

    // Comm fields

    const { getCommFieldsForTarget, loading: commFieldsLoading } = CommFieldsRepository();

    const fieldFilter = ref({});

    provide('fieldFilter', fieldFilter);

    const commFields = ref({});

    const commFieldsEmpty = ref(false);

    const getCommFields = (async (target, filter = null) => {
      commFieldsEmpty.value = false;
      const newCommfields = await getCommFieldsForTarget(target, filter);
      if (newCommfields !== null) {
        commFields.value = newCommfields;
        return;
      }
      commFieldsEmpty.value = true;
    });

    const initValues = (() => {
      if ('name' in props.options && props.options.name !== null && props.options.name in parentFormData.value && parentFormData.value[props.options.name] === null) {
        const newData = [];
        const { getInitialFormValues } = useGemsFormFunctions(
          structure,
          currentTabData,
        );

        Object.keys(tabs.value).forEach((language) => {
          const newRow = getInitialFormValues();
          newRow.language = language;
          newData.push(newRow);
        });

        parentFormData.value[props.options.name] = newData;
      }
    });

    onMounted(() => {
      getCommFields(commTarget.value);

      initValues();
    });

    watch(commTarget, (newTarget) => {
      console.log('changing target');
      getCommFields(newTarget);
    });

    watch(fieldFilter, (newFilter) => {
      const filter = toRaw(newFilter);
      console.log('changing filter', commTarget.value, filter);
      getCommFields(commTarget.value, filter);
    });

    return {
      changePreviewPosition,
      commFields,
      commFieldsEmpty,
      commFieldsLoading,
      commTarget,
      currentTab,
      currentTabData,
      elementId,
      fieldFilter,
      formType,
      formValue,
      label,
      parentFormData,
      previewPosition,
      serverValidator,
      structure,
      tabs,
      validator,
      visiblePreview,
    };
  },
};
</script>
<style scoped>
  .preview {
    .title {
      display: inline-block;
    }
    .controls {
      display: inline-block;
    }
  }
</style>
