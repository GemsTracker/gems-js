<template>
  <div class="grouped-sub-values">
    <div v-for="(subRow, subRowIndex) in groupedSubValues"
         :key="subRowIndex"
         class="row">

      <data-table-value-container
          v-for="(columnInfo, columnIndex) in subColumns"
          :key="`${subRowIndex}_${columnIndex}`"
          :raw-value="subRow[columnInfo.name] || null"
          :other-values="subRow"
          :structure-data="columnInfo"
          :index="columnIndex"
          :class="{italic: cursiveSubs && subRowIndex > 0}"
      />
    </div>

    <template v-if="showMainRow">

    </template>
  </div>
</template>

<script setup>
import {computed} from "vue";
import DataTableValueContainer from "../DataTableValueContainer.vue";

const props = defineProps({
  rawValue: {
    type: [String, Number],
    default: null,
  },
  structureData: {
    type: Object,
    required: true,
  },
  otherValues: {
    type: Object,
    required: true,
  }
});

const groupedColumnName = computed(() => props.structureData.groupedName ?? null);

const showMainRow = computed(() => props.structureData.showMainRow ?? true);

const subColumns = computed(() => {
  if (!'subColumns' in props.structureData || !Array.isArray(props.structureData.subColumns)) {
    return [];
  }

  const columns = [];
  props.structureData.subColumns.forEach((column) => {

    if (typeof column === 'string') {
      columns.push({
        name: column,
      });
    } else {
      columns.push(column);
    }
  });

  return columns;
});

const cursiveSubs = computed(() => props.structureData.cursiveSubs ?? true);

const groupedSubValues = computed(() => {
  const values = [];

  if (showMainRow.value) {
    const subValues = {};
    subColumns.value.forEach((columnInfo) => {
      subValues[columnInfo.name] = props.otherValues[columnInfo.name] || null;
    });
    values.push(subValues);
  }

  if (groupedColumnName.value in props.otherValues && Array.isArray(props.otherValues[groupedColumnName.value])) {
    props.otherValues[groupedColumnName.value].forEach((item) => {
      values.push(item);
    })
  }
  return values;
});


</script>