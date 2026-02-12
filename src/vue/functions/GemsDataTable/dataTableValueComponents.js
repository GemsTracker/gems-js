import { defineAsyncComponent, shallowReadonly } from 'vue';

let defaultComponent = 'DataTableValue';

const dataTableValueComponents = {
  DataTableValue: defineAsyncComponent(() => import('../../components/GemsDataTable/value/DataTableValue.vue')),
  Buttons: defineAsyncComponent(() => import('../../components/GemsDataTable/value/Buttons.vue')),
  GroupedSubValue: defineAsyncComponent(() => import('../../components/GemsDataTable/value/GroupedSubValue.vue')),
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
