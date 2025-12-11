<template>
  <div class="rte-variable-element">
    <r-t-e-element :options="options">
      <template #menu-buttons>
        <tip-tap-link />
        <tip-tap-all-list-functions />
        <tip-tap-insert-text-drop-down
            :label="t('Variables')"
            :items="variableOptions" :size="20"
            insert-type="key"
        />
      </template>

    </r-t-e-element>
    <div class="variable-list">

    </div>
  </div>
</template>
<script setup>
import TipTapAllListFunctions from '../../Util/TipTap/TipTapAllListFunctions.vue';
import RTEElement from './RTEElement.vue';
import TipTapLink from '../../Util/TipTap/TipTapLink.vue';
import TipTapInsertTextDropDown from '../../Util/TipTap/TipTapInsertTextDropDown.vue';
import { useI18n } from 'vue-i18n';
import useGemsFormElementFunctions from '../../../functions/gemsFormElementFunctions';
import {computed, onMounted} from 'vue';
import useGemsFormMultiOptionFunctions from '../../../functions/gemsFormMultiOptionFunctions';

const { t } = useI18n();

const props = defineProps({
  options: {
    type: Object,
    required: true,
    default: () => {},
  },
});

const {
  formValue,
  formData,
} = useGemsFormElementFunctions(props.options);

const elementOptions = computed(() => props.options);

const {
  formOptions,
  initSingleAnswerElement,
  loadingReferenceData,
} = useGemsFormMultiOptionFunctions(elementOptions, formValue, formData);

const variableOptions = computed(() => {
  if ('elementOptions' in props.options && 'variables' in props.options.elementOptions) {
    return props.options.elementOptions.variables;
  }
  return {};
});

onMounted(() => {
  initSingleAnswerElement();
});

</script>