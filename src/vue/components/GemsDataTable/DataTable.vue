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
      <tfoot>
      <table-pagination
          v-model:page="page"
          v-model:per-page="perPage"
          :total-count="totalCount"
          :colspan="transformedHeaders.length"/>
      </tfoot>
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
import TablePagination from "./TablePagination.vue";

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

const {
  filterColumns,
  page: currentPage,
    setPage,
  itemsPerPage,
    setItemsPerPage,
  totalCount,
} = useDataTableInfo();

const page = computed({
  get() {
    return currentPage.value;
  },
  set(value) {
    setPage(value);
  },
});

const perPage = computed({
  get() {
    return itemsPerPage.value;
  },
  set(value) {
    setItemsPerPage(value);
  },
});

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