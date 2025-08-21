<template>
  <span>{{ newValue }}</span>
</template>
<script setup>
import {computed} from "vue";
import useDateFunctions from "../../functions/DateFunctions";

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

const { formatJsonDate, formatJsonDateTime } = useDateFunctions();

const newValue = computed(() => {
  if ('multiOptions' in props.structureData && props.rawValue in props.structureData.multiOptions) {
    return props.structureData.multiOptions[props.rawValue];
  }

  if ('type' in props.structureData && props.structureData.type === 'date') {
    return formatJsonDate(props.rawValue);
  }
  if ('type' in props.structureData && props.structureData.type === 'datetime') {
    return formatJsonDateTime(props.rawValue, 'dd-MM-yyyy HH:mm');
  }
  return props.rawValue;
});


</script>