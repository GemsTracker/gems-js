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
          :class="{col: (visiblePreview && previewPosition === 'right')}">
          <text-element :options="structure.subject" />
          <r-t-e-element :options="structure.body">
              <template #menu-buttons>
              <tip-tap-link />
              <tip-tap-all-list-functions />
              <tip-tap-insert-text-drop-down
                  :label="t('Variables')"
                  :items="commFieldsWithDelimiters" :size="20"
                  insert-type="key"
              />
            </template>
          </r-t-e-element>

          <validator-messages :validator="validator" :serverValidator="serverValidator" />
        </div>
        <div class="preview" :class="{col: (visiblePreview && previewPosition === 'right')}">
          <h3 class="title">Preview</h3>
          <div class="controls">
            <font-awesome-icon @click="changePreviewPosition('right')"
              icon="fa-regular fa-square-caret-left"
              title="Side by side"
              :class="{'text-danger': visiblePreview && previewPosition === 'right'}" />
            <font-awesome-icon @click="changePreviewPosition('bottom')"
              icon="fa-regular fa-square-caret-down"
              title="Under"
              :class="{'text-danger': visiblePreview && previewPosition === 'bottom'}" />
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
      <comm-field-filter v-if="commTarget !== null" :comm-target="commTarget" />
      <template v-if="!commFieldsLoading">
        <span v-if="commFieldsEmpty" class="text-danger">No fields found for input value</span>
        <comm-template-fields :comm-fields="commFields" />
      </template>
      <loading-screen v-if="commFieldsLoading"/>
      <comm-template-mailer v-if="'subject' in currentTabData && 'body' in currentTabData" :subject="currentTabData.subject" :body="currentTabData.body" :comm-fields="commFields" />
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
import { useI18n } from 'vue-i18n';
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
import RTEElement from './RTEElement.vue';
import TipTapAllListFunctions from '../../Util/TipTap/TipTapAllListFunctions.vue';
import TipTapLink from '../../Util/TipTap/TipTapLink.vue';
import TipTapInsertTextDropDown from '../../Util/TipTap/TipTapInsertTextDropDown.vue';
import CommTemplateMailer from '../CommTemplateMailer.vue';

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
    CommTemplateMailer,
    TipTapInsertTextDropDown, TipTapLink, TipTapAllListFunctions,
    RTEElement,
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

    const { t } = useI18n();

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

    const commFieldsWithDelimiters = computed(() => {
      if (commFields.value !== null) {
        const withDelimiters = {};
        Object.keys(commFields.value).forEach((keyName) => {
          const newKey = `{{${keyName}}}`;
          withDelimiters[newKey] = commFields.value[keyName];
        });
        return withDelimiters;
      }
      return null;
    });

    const commFieldsEmpty = ref(false);

    const getCommFields = (async (target, filter = null) => {
      if (target === null) {
        return;
      }

      commFieldsEmpty.value = false;
      const newCommfields = await getCommFieldsForTarget(target, filter);
      if (newCommfields !== null) {
        commFields.value = newCommfields;
        return;
      }
      commFieldsEmpty.value = true;
    });

    const initValues = (() => {
      if ('name' in props.options && props.options.name !== null && props.options.name in parentFormData.value) {
        let newData = parentFormData.value[props.options.name];
        if (newData === null) {
          newData = [];
        }

        const addedLanguages = [];
        newData.forEach((row) => {
          if ('language' in row) {
            addedLanguages.push(row.language);
          }
        });

        const { getInitialFormValues } = useGemsFormFunctions(
          structure,
          currentTabData,
        );

        Object.keys(tabs.value).forEach((language) => {
          if (!addedLanguages.includes(language)) {
            const newRow = getInitialFormValues();
            newRow.language = language;
            newData.push(newRow);
            addedLanguages.push(language);
          }
        });

        parentFormData.value[props.options.name] = newData;
      }
    });

    onMounted(() => {
      const tabIndexes = Object.keys(tabs.value);
      if (tabIndexes.length) {
        [currentTab.value] = tabIndexes;
      }
      getCommFields(commTarget.value);

      initValues();
    });

    watch(commTarget, (newTarget) => {
      getCommFields(newTarget);
    });

    watch(fieldFilter, (newFilter) => {
      const filter = toRaw(newFilter);
      getCommFields(commTarget.value, filter);
    });

    watch(parentFormData, (newData, oldData) => {
      if (oldData !== null && !(props.options.name in oldData) && props.options.name in newData) {
        initValues();
      }
    });

    return {
      changePreviewPosition,
      commFields,
      commFieldsEmpty,
      commFieldsLoading,
      commFieldsWithDelimiters,
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
      t,
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
