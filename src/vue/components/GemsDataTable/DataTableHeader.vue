<template>
  <thead class="block md:table-header-group">
  <tr class="bg-[var(--gems-table-head-background-color)] text-white border border-gray-200 md:border-none block md:table-row">

    <th v-for="(column, index) in headers"
        class="p-2 text-left font-bold block md:table-cell font-normal">
      <div v-for="(subItem, itemIndex) in column"
           :key="`${index}_${itemIndex}`"
           @click="changeOrder(subItem)"
           class="cursor-pointer"
          :class="{underline: order === subItem.name || order === `-${subItem.name}`}">
        {{ subItem.label }}
        <span v-if="order === subItem.name || order === `-${subItem.name}`" class="inline-block text-xs">
          <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               stroke-width="1.5"
               stroke="currentColor"
               class="w-3 h-3"
              :class="{'rotate-180': order === `-${subItem.name}`}">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </span>
      </div>
    </th>
  </tr>
  </thead>
</template>
<script setup>

import { useDataTableInfo } from '../../functions/GemsDataTable/dataTableInfo';

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  }
});

const { order, updateOrder } = useDataTableInfo();

const changeOrder = ((item) => {
  console.log(order.value);
  if (item.name === order.value) {
    console.log(`-${item.name}`);
    updateOrder(`-${item.name}`);
    return;
  }
  if (`-${item.name}` === order.value) {
    console.log(item.name);
    updateOrder(item.name);
    return;
  }
  console.log(item.name);
  updateOrder(item.name);
});

</script>