<template>
  <div>
    <component :is="valueComponents[currentComponentName]"
       :raw-value="rawValue"
       :other-values="otherValues"
       :structure-data="structureData"
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
  }
});

const { defaultComponent, valueComponents } = useDataTableElementComponents();

const currentComponentName = computed(() => {
  if ('valueComponent' in props.structureData && props.structureData.valueComponent in valueComponents) {
    return props.structureData.valueComponent;
  }
  return defaultComponent;
});

</script>