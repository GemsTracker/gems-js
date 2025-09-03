<template>
  <div class="form-group">
    <gems-form-label :elementId="elementId" :options="options" />
    <div class="element-container row">
      <div :class="{col: (visiblePreview && previewPosition === 'right')}">
        <tip-tap-editor v-model="formValue">
          <template #menu-buttons>
            <tip-tap-link />
            <tip-tap-all-list-functions />
            <tip-tap-insert-text-drop-down
              :label="t('Variables')"
              :items="commFieldsWithDelimiters" :size="20"
              insert-type="key"
            />
          </template>
        </tip-tap-editor>
        <gems-form-validator-messages :validator="validator" :serverValidator="serverValidator" />
        <p v-if="'description' in options" class="help-block"> {{options.description}}</p>
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
                                 :form-data="formData" :comm-fields="commFields" />
      </div>
    </div>
  </div>
</template>
<script>
import {computed, inject, onMounted, ref, watch} from 'vue';
import { useI18n } from 'vue-i18n';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSquareCaretLeft, faSquareCaretDown } from '@fortawesome/free-regular-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import CommTemplatePreview from '../CommTemplatePreview.vue';
import CommFieldsRepository from '../../../functions/CommFieldsRepository';
import CommTemplateFields from '../CommTemplateFields.vue';
import TipTapEditor from '../../Util/TipTapEditor.vue';
import GemsFormValidatorMessages from '../ValidatorMessages.vue';
import GemsFormLabel from '../Label.vue';
import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';
import TipTapInsertTextDropDown from '../../Util/TipTap/TipTapInsertTextDropDown.vue';
import TipTapLink from '../../Util/TipTap/TipTapLink.vue';
import TipTapBulletList from '../../Util/TipTap/TipTapBulletList.vue';
import TipTapAllListFunctions from '../../Util/TipTap/TipTapAllListFunctions.vue';

library.add(faEye, faEyeSlash, faSquareCaretLeft, faSquareCaretDown);
export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {
    TipTapAllListFunctions,
    TipTapBulletList,
    TipTapLink,
    TipTapInsertTextDropDown,
    GemsFormLabel,
    GemsFormValidatorMessages,
    CommTemplateFields,
    CommTemplatePreview,
    FontAwesomeIcon,
    TipTapEditor,
  },
  setup(props) {
    const { getCommFieldsForTarget, loading: commFieldsLoading } = CommFieldsRepository();
    const { t } = useI18n();
    const commFields = ref(null);
    const visiblePreview = ref(true);
    const previewPosition = ref('right');
    const changePreviewPosition = ((position) => {
      previewPosition.value = position;
      visiblePreview.value = true;
    });

    const formData = inject('formData');

    const {
      elementId,
      formValue,
      serverValidator,
      validator,
    } = useGemsFormElementFunctions(props.options);

    const commFieldsEmpty = computed(() => {
      if (commFields.value !== null) {
        return false;
      }
      return true;
    });

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

    const getCommFields = (async (tokenId) => {
      commFields.value = await getCommFieldsForTarget('token', { id: tokenId });
    });

    watch(formData, (newData) => {
      if ('id' in newData && newData.id !== null) {
        getCommFields(newData.id);
      }
    });

    onMounted(async () => {
      if ('id' in formData.value && formData.value.id !== null) {
        getCommFields(formData.value.id);
      }
    });

    return {
      changePreviewPosition,
      commFields,
      commFieldsEmpty,
      commFieldsLoading,
      commFieldsWithDelimiters,
      elementId,
      formData,
      formValue,
      getCommFieldsForTarget,
      previewPosition,
      serverValidator,
      t,
      validator,
      visiblePreview,
    };
  },
};
</script>
