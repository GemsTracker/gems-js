<template>
  <div class="data-table">
    <data-table
        :data="tableData"
        :headers="headers"
        :search-structure="searchStructure"
        :loading="loadingData"
    ></data-table>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { v4 as uuid } from 'uuid';
import DataTable from './GemsDataTable/DataTable.vue';
import useGetModelRepository from '../functions/modelRepository';
import {useDataTableInfo} from '../functions/GemsDataTable/dataTableInfo';

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

const { getSearchFilter,
  order,
  page,
  setPage,
  itemsPerPage,
  setItemsPerPage,
  setFilterColumns,
  searchData,
  setRowClasses,
  totalCount: totalDataCount,
  setTotalCount,
} = useDataTableInfo();

if (props.perPage) {
  setItemsPerPage(props.perPage);
}

const loadingData = ref(false);

const getData = (async () => {
  loadingData.value = true;
  tableData.value = [];
  const filter = getSearchFilter();
  const { data: fetchedData, totalCount } = await model.getPageData(
      filter,
      page.value,
      itemsPerPage.value,
  )
  console.log('RECEIVED DATA', fetchedData);
  if (totalDataCount.value === null && totalCount !== null) {
    setTotalCount(totalCount);
  }
  if (Array.isArray(fetchedData)) {
    tableData.value = fetchedData.map(row => ({
      ...row,
      __key: row.__key ?? uuid()
    }));
  }
  if (fetchedData && fetchedData.length < itemsPerPage.value) {
    setTotalCount(itemsPerPage.value * (page.value - 1) + fetchedData.length);
  }
  if (fetchedData && fetchedData.length === 0 && page.value > 1) {
    setPage(page.value-1);
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
    if (item.elementOptions?.localStore === true) {
      const uri = window.location.pathname.replace(/^\/+/, '').replace(/[^a-zA-Z0-9]/g, '_');
      const key = `${uri}-${item.name}`;
      if (item.name in searchData && searchData[item.name] !== null && !isNaN(searchData[item.name])) {
        localStorage.setItem(key, searchData[item.name]);
      } else {
        localStorage.removeItem(key);
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

watch(() => order.value, () => {
  getData();
  localStore(searchData.value);
});


</script>