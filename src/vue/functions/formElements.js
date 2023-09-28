import { defineAsyncComponent, shallowReadonly } from 'vue';

const formElements = {
  CheckboxElement: defineAsyncComponent(() => import('../components/GemsForm/Element/CheckboxElement.vue')),
  DateElement: defineAsyncComponent(() => import('../components/GemsForm/Element/DateElement.vue')),
  ExhibitorElement: defineAsyncComponent(() => import('../components/GemsForm/Element/ExhibitorElement.vue')),
  HiddenElement: defineAsyncComponent(() => import('../components/GemsForm/Element/HiddenElement.vue')),
  HtmlElement: defineAsyncComponent(() => import('../components/GemsForm/Element/HtmlElement.vue')),
  MultiCheckboxElement: defineAsyncComponent(() => import('../components/GemsForm/Element/MultiCheckboxElement.vue')),
  MultiSelectElement: defineAsyncComponent(() => import('../components/GemsForm/Element/MultiSelectElement.vue')),
  NumberElement: defineAsyncComponent(() => import('../components/GemsForm/Element/NumberElement.vue')),
  RadioElement: defineAsyncComponent(() => import('../components/GemsForm/Element/RadioElement.vue')),
  RTEElement: defineAsyncComponent(() => import('../components/GemsForm/Element/RTEElement.vue')),
  SelectElement: defineAsyncComponent(() => import('../components/GemsForm/Element/SelectElement.vue')),
  SubformsElement: defineAsyncComponent(() => import('../components/GemsForm/Element/SubformsElement.vue')),
  TextElement: defineAsyncComponent(() => import('../components/GemsForm/Element/TextElement.vue')),
  TextareaElement: defineAsyncComponent(() => import('../components/GemsForm/Element/TextareaElement.vue')),
  CommTemplateTranslationsElement: defineAsyncComponent(() => import('../components/GemsForm/Element/CommTemplateTranslationsElement.vue')),
};

const addFormElement = ((name, component) => {
  formElements[name] = component;
});

const useFormElements = (() => {
  return {
    addFormElement,
    formElements: shallowReadonly(formElements),
  };
});

export default useFormElements;
