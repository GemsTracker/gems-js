<template>
  <div class="data-table">
    <data-table :data="tableData" :headers="headers"></data-table>
  </div>
</template>
<script setup>
import DataTable from './GemsDataTable/DataTable.vue';
import { computed, onMounted, ref } from 'vue';
import useGetModelRepository from '../functions/modelRepository';

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
    default: 20,
  },
});

const { getModelRepository } = useGetModelRepository();
const modelRepository = getModelRepository();
const model = modelRepository.getEndpointModel(props.resource, props.endpoint);

const structure = ref({});

const page = ref(1);

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

const filter = computed(() => {
  return {
    page: page.value,
    perPage: props.perPage,
  };
});

const getData = (async () => {
  const fetchedData = model.all(
      filter.value
  );
  if (Array.isArray(fetchedData)) {
    tableData.value = [...tableData, ...fetchedData];
  }
});

onMounted(() => {
  getEndpointStructure();
  getData();
});



</script>