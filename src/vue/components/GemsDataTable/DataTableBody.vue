<template>
  <tbody class="block md:table-row-group">
    <tr v-for="(row, rowIndex) in data" :key="rowIndex"
        class="odd:bg-gray-100 border border-gray-200" :class="getClass(row)">
      <td v-for="(column, columnIndex) in headers" :key="`${rowIndex}_${columnIndex}`"
          class="p-2 block md:table-cell align-top">
        <data-table-value-container v-for="(subColumn, subIndex) in column"
            :key="`${row.__key ?? rowIndex}_${columnIndex}_${subIndex}`"
            :raw-value="row[subColumn.name]"
            :other-values="row"
            :structure-data="subColumn"
            :index="subIndex"
        />
      </td>
    </tr>
  </tbody>
</template>
<script setup>
import DataTableValueContainer from './DataTableValueContainer.vue';
import { useDataTableInfo } from '../../functions/GemsDataTable/dataTableInfo';

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

const { rowClasses } = useDataTableInfo();

const compare = ((left, comparator, right) => {
  if (comparator === '===') {
    return left === right;
  }
  if (comparator === '==') {
    return left == right;
  }
  if (comparator === '!==') {
    return left !== right;
  }
  if (comparator === '<') {
    return left < right;
  }
  if (comparator === '<=') {
    return left <= right;
  }
  if (comparator === '>') {
    return left > right;
  }
  if (comparator === '>=') {
    return left >= right;
  }
  if (comparator === 'in' && Array.isArray(right)) {
    return right.includes(left);
  }
  return false;
})

const processRowClass = ((rowClass, row) => {
  if (typeof rowClass === 'string') {
    return rowClass;
  }
  if (typeof rowClass === 'object') {
    if ('classInColumn' in rowClass && rowClass.classInColumn in row) {
      return row[rowClass.classInColumn];
    }
    if ('comparator' in rowClass && 'columnName' in rowClass && rowClass.columnName in row) {
      if ('value' in rowClass) {
        const value = rowClass.value;
      } else if ('compareColumn' in rowClass && rowClass.compareColumn in row) {
        const value = row[rowClass.compareColumn];
      }
      return compare(rowClass.columnName, rowClass.comparator, value);
    }
  }
  if (Array.isArray(rowClass)) {
    if (rowClass.length === 3) {
      const [ columnName, comparator, value ] = rowClass;
      if (!(columnName in row)) {
        return null;
      }
      return compare(row[columnName], comparator, value);
    }
    if (rowClass.length === 4) {
      const [ columnName, comparator, value, valueFromColumn ] = rowClass;
      if (!(columnName in row)) {
        return null;
      }
      let newValue = value;
      if (valueFromColumn) {
        if (!(value in row)) {
          return null;
        }
        newValue = row[value]
      }

      return compare(row[columnName], comparator, newValue);
    }
  }
});

const getClass = ((row) => {
  const classes = [];
  if ('row_class' in row) {
    classes.push(row.row_class);
  }
  if (rowClasses.value) {
    Object.keys(rowClasses.value).forEach((className) => {
      const rowClass = rowClasses.value[className];
      const result = processRowClass(rowClass, row);
      if (result) {
        classes.push(className);
      }
      console.log(classes);
    });
  }

  return classes.join(' ');
});

</script>