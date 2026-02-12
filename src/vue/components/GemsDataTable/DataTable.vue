<template>
  <div>
    <data-table-search-form v-if="hasSearchFields"/>
    <table class="table browser data-table min-w-full block md:table border-collapse" role="table">
      <data-table-header :headers="transformedHeaders"/>
      <tbody v-if="loading" class="loading">
        <tr>
          <td :colspan="transformedHeaders.length" class="text-center">
            <loading-screen />
          </td>
        </tr>
      </tbody>
      <data-table-body :headers="transformedHeaders" :data="data"/>
    </table>
  </div>
</template>
<script setup>
import DataTableHeader from './DataTableHeader.vue';
import DataTableBody from './DataTableBody.vue';
import DataTableSearchForm from './DataTableSearchForm.vue';
import {useDataTableInfo} from "gems-js/src/vue/functions/GemsDataTable/dataTableInfo";
import { computed } from "vue";
import LoadingScreen from "../Util/LoadingScreen.vue";

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  searchStructure: {
    type: Array,
    default: null,
  },
});

const { filterColumns } = useDataTableInfo();

const hasSearchFields = computed(() => {
  return (typeof filterColumns === 'object' && Object.keys(filterColumns).length > 0);
});

const transformedHeaders = computed(() => {
  const arrayedColumns = [];
  props.headers.forEach((column) => {
    let arrayColumn = column;
    if (!Array.isArray(arrayColumn)) {
      arrayColumn = [arrayColumn];
    }
    arrayedColumns.push(arrayColumn);
  });
  return arrayedColumns;
});

</script>