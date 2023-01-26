<template>
  <input type="text" ref="dateElement"/>
</template>
<script>
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const dateElement = ref(null);

    onMounted(() => {
      const datePicker = new AirDatepicker(dateElement.value);
    });

    return {
      dateElement,
    };
  },
};
</script>
