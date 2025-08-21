import { ref, readonly } from 'vue';

const order = ref('');
const filterColumns = ref([]);
const searchData = ref(null);

export function useDataTableInfo() {
  const updateOrder = (newOrder) => {
    order.value = newOrder;
  };

  const setFilterColumns = (columns) => {
    filterColumns.value = columns;
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
    searchData: readonly(searchData),
    setSearchData,
  };
}