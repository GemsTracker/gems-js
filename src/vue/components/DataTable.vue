<template>
  <div class="data-table">
    <data-table
        :data="tableData"
        :headers="headers"
        :search-structure="searchStructure"
        :loading="loadingData"
    ></data-table>
    <table-pagination
        v-model:page="page"
        v-model:per-page="itemsPerPage"
        :total-count="totalDataCount" />
  </div>
</template>
<script setup>
import DataTable from './GemsDataTable/DataTable.vue';
import TablePagination from './GemsDataTable/TablePagination.vue';
import { computed, onMounted, ref, watch } from 'vue';
import useGetModelRepository from '../functions/modelRepository';
import {useDataTableInfo} from '../functions/GemsDataTable/dataTableInfo';
import { useLocalStorage } from "@vueuse/core";

const props = defineProps({
  endpoint: {
    type: String,
    required: true,
  },
  resource: {
    type: String,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
  perPage: {
    type: Number,
    default: 1,
  },
  rowClasses: {
    type: Object,
    default: null,
  },
  searchStructure: {
    type: Array,
    default: null,
  },
});

const { getModelRepository } = useGetModelRepository();
const modelRepository = getModelRepository();
const model = modelRepository.getEndpointModel(props.resource, props.endpoint);

const structure = ref({});

const page = ref(1);

const itemsPerPage = ref(props.perPage);

const tableData = ref([]);

const getEndpointStructure = (async () => {
  const modelStructure = await model.structure();
  if (modelStructure) {
    structure.value = modelStructure;
  }
});

const headers = computed(() => {
  if (props.headers.length) {
    const headerItems = [];
    props.headers.forEach((headerItem) => {
      if (typeof headerItem === 'string') {
        if (headerItem in structure.value) {
          headerItems.push(structure.value);
        } else {
          headerItems.push({
            name: headerItem,
            label: headerItem,
          });
        }
      }
      if (typeof headerItem === 'object') {
        headerItems.push(headerItem);
      }
    });
    return headerItems;
  }
  return structure.value;
});

const totalDataCount = ref(null);

const { order, updateOrder, setFilterColumns, searchData, setRowClasses } = useDataTableInfo();

const loadingData = ref(false);

const getData = (async () => {
  loadingData.value = true;
  tableData.value = [];
  const { data: fetchedData, totalCount } = await model.getPageData(
      searchData.value ?? {},
      page.value,
      itemsPerPage.value,
  )
  console.log('RECEIVED DATA', fetchedData);
  if (totalDataCount.value === null && totalCount !== null) {
    totalDataCount.value = totalCount;
  }
  if (Array.isArray(fetchedData)) {
    tableData.value = fetchedData;
  }
  if (fetchedData && fetchedData.length < itemsPerPage.value) {
    totalDataCount.value = itemsPerPage.value * (page.value - 1) + fetchedData.length;
  }
  if (fetchedData && fetchedData.length === 0 && page.value > 1) {
    page.value = page.value-1;
    getData();
  }
  loadingData.value = false;
});

if (props.searchStructure !== null) {
  setFilterColumns(props.searchStructure);
}
if (props.rowClasses !== null) {
  setRowClasses(props.rowClasses);
}

const localStore = ((searchData) => {
  props.searchStructure.forEach((item) => {
    if (item.elementOptions?.localStorage === true) {
      if (item.name in searchData) {
        const uri = window.location.pathname.replace(/^\/+/, '').replace(/[^a-zA-Z0-9]/g, '_') ;
        const key = `${uri}-${item.name}`;
        useLocalStorage(key, searchData[uri]);
      }
    }
  });
});

onMounted(() => {
  getEndpointStructure();
  getData();
});

watch(() => page.value, () => {
  getData();
});

watch(() => searchData.value, () => {
  getData();
  localStore(searchData.value);
});


</script>