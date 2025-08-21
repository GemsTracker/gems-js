<template>
  <div v-if="hasFilterColumns" class="search-form p-2">
    <base-form :structure="filterColumns" form-type="inline" />
    <button @click="search"
      class="!ml-4 border rounded bg-green-600 text-white p-1 px-2 hover:bg-green-700"
      >
      Search
    </button>
  </div>
</template>
<script setup>
import { computed, provide, ref } from 'vue';
import { useDataTableInfo } from 'gems-js/src/vue/functions/GemsDataTable/dataTableInfo';
import BaseForm from "../GemsForm/BaseForm.vue";
import useGemsFormFunctions from "../../functions/gemsFormFunctions";

const { filterColumns, setSearchData } = useDataTableInfo();

const hasFilterColumns = computed(() => Object.keys(filterColumns).length > 0);

const formData = ref({});

const { getInitialFormValues, validation, validate } = useGemsFormFunctions(filterColumns, formData);

const search = (() => {
  setSearchData(formData.value);
});

provide('formData', formData);
provide('structure', filterColumns);
provide('startData', {});
provide('validation', validation);
provide('serverValidation', ref({}));

</script>