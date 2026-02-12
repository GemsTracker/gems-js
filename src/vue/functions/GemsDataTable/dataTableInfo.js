import { ref, readonly } from 'vue';

const order = ref('');
const filterColumns = ref({});
const searchData = ref(null);
const rowClasses = ref(null);

export function useDataTableInfo() {
  const updateOrder = (newOrder) => {
    order.value = newOrder;
  };

  const getInitialFormValues = () => {
    const initialValues = {};
    Object.values(filterColumns.value).forEach((field) => {
      let initialValue = null;
      const multiElementTypes = ['MultiSelect', 'MultiCheckbox'];
      if ('elementClass' in field
          && multiElementTypes.includes(field.elementClass)) {
        initialValue = [];
      }
      if ('default' in field) {
        initialValue = field.default;
      }

      initialValues[field.name] = initialValue;
    });

    return initialValues;
  }

  const setFilterColumns = (columns) => {
    filterColumns.value = columns;
    searchData.value = getInitialFormValues();
  }

  const setRowClasses = (classes) => {
    rowClasses.value = classes;
  }

  const setSearchData = (data) => {
    const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== null)
    );
    searchData.value = filteredData;
  }

  return {
    order: readonly(order),
    updateOrder,
    filterColumns: readonly(filterColumns),
    setFilterColumns,
    rowClasses: readonly(rowClasses),
    setRowClasses,
    searchData: readonly(searchData),
    setSearchData,
  };
}