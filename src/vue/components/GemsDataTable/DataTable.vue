<template>
  <div class="remote-monitor-todo">
    <data-table-search-form />
    <table class="min-w-full block md:table border-collapse" role="table">
      <data-table-header :headers="headers"/>
      <data-table-body :headers="headers" :data="data"/>
    </table>
  </div>
</template>
<script setup lang="ts">
import DataTableHeader from './DataTableHeader.vue';
import DataTableBody from './DataTableBody.vue';
import DataTableSearchForm from './DataTableSearchForm.vue';

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
  }
});

</script>