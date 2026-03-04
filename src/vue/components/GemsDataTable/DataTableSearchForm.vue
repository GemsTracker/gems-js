<template>
  <div v-if="hasFilterColumns" class="search">
    <base-form :structure="filterColumns" form-type="inline" />
    <div class="panel">
      <button @click="search"
        class="!ml-4 border rounded bg-green-600 text-white p-1 px-2 hover:bg-green-700"
        >
        {{ t('Search') }}
      </button>
      <button @click="reset"
        class="reset-button !ml-4 border rounded bg-[var(--secondary-color)] text-white p-1 px-2 hover:bg-[var(--primary-color)]"
        >
        {{  t('Reset search') }}
      </button>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, provide, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDataTableInfo } from 'gems-js/src/vue/functions/GemsDataTable/dataTableInfo';
import BaseForm from "../GemsForm/BaseForm.vue";
import useGemsFormFunctions from "../../functions/gemsFormFunctions";


const { filterColumns, resetSearchData, setSearchData, searchData } = useDataTableInfo();

const hasFilterColumns = computed(() => Object.keys(filterColumns.value).length > 0);

const { t } = useI18n();

const formData = ref({})

const { validation, validate } = useGemsFormFunctions(filterColumns, formData);

const search = (() => {
  setSearchData(formData.value);
});

const reset = (() => {
  resetSearchData();
  formData.value = { ... searchData.value };
});

onMounted(() => {
  formData.value = { ... searchData.value };
});

watch(filterColumns, (val, oldVal) => {
  if (Object.keys(oldVal).length === 0) {
    formData.value = { ...searchData.value };
  }
});

provide('formData', formData);
provide('structure', filterColumns);
provide('startData', {});
provide('validation', validation);
provide('serverValidation', ref({}));
provide('formAction', search);

</script>