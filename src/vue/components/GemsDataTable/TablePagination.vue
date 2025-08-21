<template>
  <div class="pagination flex justify-between m-1">
    <div class="page-select">
      <button @click="setPage(1)" :disabled="isFirstPage"
        class="text-blue-500 disabled:text-gray-400 disabled:bg-gray-200 border px-1 hover:underline disabled:no-underline"><< First</button>
      <button @click="setPage(page - 1)" :disabled="isFirstPage"
              class="text-blue-500 disabled:text-gray-400 disabled:bg-gray-200 border px-1 hover:underline disabled:no-underline">< Previous</button>

      <button @click="setPage(page + 1)" :disabled="isLastPage"
              class="text-blue-500 disabled:text-gray-400 disabled:bg-gray-200 border px-1 hover:underline disabled:no-underline">> Next</button>
      <button @click="setPage(totalPages)" :disabled="isLastPage"
              class="text-blue-500 disabled:text-gray-400 disabled:bg-gray-200 border px-1 hover:underline disabled:no-underline">>> Last</button>
    </div>
    <div class="right flex gap-2">
      <div class="per-page">
        <select v-model="selectedPerPage" class="rounded border p-0.5">
          <option v-for="(item, index) in perPageOptions"
                  :value="item"
                  :key="index">
            {{ item }}
          </option>
        </select>
      </div>
      <div class="progression">
        {{ itemStart }} - {{ itemEnd }} of {{ totalCount }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:page', 'update:perPage']);

const totalPages = computed(() => {
  if (props.perPage === 0) return 0;
  return Math.ceil(props.totalCount / props.perPage);
});

const itemProgression = [5, 10, 20, 30, 50, 100, 200, 500, 1000];

const perPageOptions = computed(() => {
  const nextHigherNumber = itemProgression.find(item => item > props.totalCount);
  return itemProgression.filter((item) => item <= nextHigherNumber);
});

const selectedPerPage = ref(itemProgression.find(item => item > props.perPage));

if (props.perPage > props.totalCount) {
  selectedPerPage.value = itemProgression.find(item => item > props.totalCount);
}

const isFirstPage = computed(() => props.page <= 1);

const isLastPage = computed(() => props.page >= totalPages.value);

const itemStart = computed(() => {
  if (props.totalCount === 0) {
    return 0;
  }
  return (props.page - 1) * props.perPage + 1;
});

const itemEnd = computed(() => {
  if (props.totalCount === 0) {
    return 0;
  }
  const end = itemStart.value + props.perPage - 1;
  if (end > props.totalCount) {
    return props.totalCount;
  }
  return end;
})

const setPage = ((pageNumber) => {
  emit('update:page', pageNumber);
});

const setPerPage = ((perPage) => {
  emit('update:perPage', perPage);
});

watch(selectedPerPage, (perPage) => {
  setPerPage(perPage);
});



</script>