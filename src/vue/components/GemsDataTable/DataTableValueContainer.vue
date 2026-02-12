<template>
  <div>
    <component :is="valueComponents[currentComponentName]"
       :raw-value="rawValue"
       :other-values="otherValues"
       :structure-data="structureData"
       :index="index"
    />
  </div>
</template>
<script setup>
import useDataTableElementComponents from '../../functions/GemsDataTable/dataTableValueComponents';
import { computed } from "vue";

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
  },
  index: {
    type: Number,
    required: true,
  }
});

const { defaultComponent, valueComponents } = useDataTableElementComponents();

const currentComponentName = computed(() => {
  if ('valueComponent' in props.structureData) {
    if (props.structureData.valueComponent in valueComponents) {
      return props.structureData.valueComponent;
    }
    if (props.structureData.valueComponent === null) {
      return null;
    }
  }
  return defaultComponent;
});

</script>