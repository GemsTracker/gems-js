<template>
  <div class="data-table">
    <div class="header table-row">
      <div v-for="(columnName, index) in displayColumns" :key="index" class="column">
        {{ getColumnLabel(columnName) }}
      </div>
    </div>
    <div class="body">
      <div v-for="(row, rowIndex) in tableRows" :key="rowIndex" class="table-row">
        <div v-for="(columnName, columnIndex) in displayColumns" :key="columnIndex" class="column">
          {{ getValue(row[columnName], columnName) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { computed } from 'vue';
import useDateHelpers from '../../functions/DateFunctions';

export default {
  props: {
    tableRows: {
      type: Array,
      required: true,
    },
    structure: {
      type: Object,
      required: true,
    },
    columns: {
      type: Array,
      required: false,
      default: null,
    },
    columnLabels: {
      type: Object,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const displayColumns = computed(() => {
      if (props.columns !== null) {
        return props.columns;
      }
      return Object.keys(props.structure);
    });

    const getColumnLabel = ((columnName) => {
      if (props.columnLabels !== null && columnName in props.columnLabels) {
        return props.columnLabels[columnName];
      }
      if (columnName in props.structure && 'label' in props.structure[columnName]) {
        return props.structure[columnName].label;
      }
      return columnName;
    });

    const { formatJsonDate } = useDateHelpers();

    const getValue = ((rawValue, columnName) => {
      if (rawValue === null) {
        return null;
      }
      if (columnName in props.structure && 'type' in props.structure[columnName]) {
        switch (props.structure[columnName].type) {
          case 'datetime':
            if ('dateFormat' in props.structure[columnName]) {
              return formatJsonDate(rawValue, props.structure[columnName].dateFormat);
            }
            return formatJsonDate(rawValue);
          default:
            return rawValue;
        }
      }
      return rawValue;
    });

    return {
      displayColumns,
      getColumnLabel,
      getValue,
    };
  },
};
</script>
<style lang="scss">
</style>
