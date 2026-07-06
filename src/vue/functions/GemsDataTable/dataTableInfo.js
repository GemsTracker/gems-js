import { ref, readonly } from 'vue';

const order = ref('');
const filterColumns = ref({});
const searchData = ref(null);
const initialSearchData = ref(null);
const rowClasses = ref(null);
const itemsPerPage = ref(20);
const page = ref(1);
const totalCount = ref(0);

export function useDataTableInfo() {

  const uri = window.location.pathname.replace(/^\/+/, '').replace(/[^a-zA-Z0-9]/g, '_');

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
      if (field.elementOptions?.localStore === true) {
        const key = `${uri}-${field.name}`;
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
          initialValue = JSON.parse(storedValue);
        }
      }
      if (field.elementOptions?.sessionStore === true) {
        const key = `${uri}-${field.name}`;
        const storedValue = sessionStorage.getItem(key);
        if (storedValue !== null) {
          initialValue = JSON.parse(storedValue);
        }
      }

      initialValues[field.name] = initialValue;
    });

    return initialValues;
  }

  const getSearchFilter = () => {
    const filter = searchData.value ?? {};
    if (order.value) {
      filter['order'] = [order.value];
    }
    return filter;
  };

  const resetSearchData = () => {
    searchData.value = { ... initialSearchData.value };
  }

  const setFilterColumns = (columns) => {
    filterColumns.value = columns;
    initialSearchData.value = getInitialFormValues();
    searchData.value = { ...initialSearchData.value };
  }

  const setPage = (newPage) => {
    page.value = newPage;
  }

  const setItemsPerPage = (newItemsPerPage) => {
    itemsPerPage.value = newItemsPerPage;

    const key = `${uri}-items-per-page`;
    sessionStorage.setItem(key, JSON.stringify(newItemsPerPage));
  }

  const setInitialItemsPerPage = (newInitialItemsPerPage = null) => {
    const storedItemsPerPage = sessionStorage.getItem(`${uri}-items-per-page`);

    if (storedItemsPerPage !== null)  {
      itemsPerPage.value = JSON.parse(storedItemsPerPage);
      return;
    }

    if (newInitialItemsPerPage !== null)  {
      itemsPerPage.value = newInitialItemsPerPage;
    }
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

  const setTotalCount = (newTotalCount) => {
    totalCount.value = newTotalCount;
  }

  return {
    getSearchFilter,
    order: readonly(order),
    updateOrder,
    filterColumns: readonly(filterColumns),
    setFilterColumns,
    page: readonly(page),
    setPage,
    itemsPerPage: readonly(itemsPerPage),
    setItemsPerPage,
    setInitialItemsPerPage,
    rowClasses: readonly(rowClasses),
    setRowClasses,
    searchData: readonly(searchData),
    resetSearchData,
    setSearchData,
    totalCount: readonly(totalCount),
    setTotalCount,
  };
}