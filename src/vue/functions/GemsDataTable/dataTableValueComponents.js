import { defineAsyncComponent, shallowReadonly } from 'vue';

let defaultComponent = 'DataTableValue';

const dataTableValueComponents = {
  DataTableValue: defineAsyncComponent(() => import('../../components/GemsDataTable/DataTableValue.vue')),
};

const addComponent = ((name, component) => {
  console.log('xyz', name, component);
  dataTableValueComponents[name] = component;
});

const setDefaultComponent = (name) => {
  defaultComponent = name;
}

const useDataTableElementComponents = (() => {
  return {
    addComponent,
    defaultComponent,
    setDefaultComponent,
    valueComponents: shallowReadonly(dataTableValueComponents),
  };
});

export default useDataTableElementComponents;
