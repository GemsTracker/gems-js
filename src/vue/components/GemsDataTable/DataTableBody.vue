<template>
  <tbody class="block md:table-row-group">
    <tr v-for="(row, rowIndex) in data" :key="rowIndex"
        class="odd:bg-gray-100 border border-gray-200 ">
      <td v-for="(column, columnIndex) in headers" :key="`${row.id}_${columnIndex}`"
          class="p-2 md:border md:border-gray-200 block md:table-cell align-top">
        <data-table-value-container
            :raw-value="row[column.name]"
            :other-values="row"
            :structure-data="column"
        />
      </td>
    </tr>
  </tbody>
</template>
<script setup>
import DataTableValueContainer from './DataTableValueContainer.vue';

const getColumnKey = ((row, columnIndex) => {
  let rowId = null;
  if ('id' in row) {
    rowId = row.id;
  } else {
    rowId = hashObject(row);
  }

  return `${rowId}_${columnIndex}`;
});

const hashObject = async (obj) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(obj));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

</script>