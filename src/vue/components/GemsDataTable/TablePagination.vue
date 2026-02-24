<template>
  <tr>
    <td :colspan="colspan">
      <div class="flex justify-between items-center">
        <ul class="pagination pagination-sm">
          <li class="page-item" :class="{disabled: isFirstPage}">
            <span @click="setPage(1)" class="page-link">
              << First
            </span>
          </li>
          <li class="page-item" :class="{disabled: isFirstPage}">
            <span @click="setPage(1)" class="page-link">
              < Previous
            </span>
          </li>
          <li
              v-for="(pageNumber) in pageNumberRange"
              @click="setPage(pageNumber)"
              :key="pageNumber"
              class="page-item page-number" :class="{active: pageNumber === page}">
            <span @click="setPage(pageNumber)" class="page-link">
              {{ pageNumber }}
            </span>
          </li>
          <li class="page-item" :class="{disabled: isLastPage}">
            <span @click="setPage(page + 1)" class="page-link">
              > Next
            </span>
          </li>
          <li v-if="totalCount !== null" class="page-item" :class="{disabled: isFirstPage}">
            <span @click="setPage(totalPages)" class="page-link">
              >> Last
            </span>
          </li>
        </ul>

        <div class="pagination-index flex">
          <div class="per-page form-group">
            <select v-model="selectedPerPage" class="">
              <option v-for="(item, index) in perPageOptions"
                      :value="item"
                      :key="index">
                {{ item }}
              </option>
            </select>
          </div>
          <div v-if="totalCount !== 0" class="progression">
            {{ itemStart }} - {{ itemEnd }} of {{ totalCount ?? '?'}}
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import {end} from "@popperjs/core";

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
    default: null,
  },
  colspan: {
    type: Number,
    default: 1,
  }
});

const emit = defineEmits(['update:page', 'update:perPage']);

const totalPages = computed(() => {
  if (props.perPage === 0) {
    return 0;
  }
  if (props.totalCount === null) {
    return null;
  }
  return Math.ceil(props.totalCount / props.perPage);
});

const itemProgression = [5, 10, 20, 30, 50, 100, 200, 500, 1000];

const perPageOptions = computed(() => {
  if (props.totalCount === null) {
    return itemProgression;
  }
  let nextHigherNumber = itemProgression.find(item => item >= props.totalCount);
  if (props.perPage > props.totalCount) {
    nextHigherNumber = props.perPage;
  }

  const options = [];
  itemProgression.forEach((item) => {
    if (item <= nextHigherNumber) {
      options.push(item);
    } else if (options.length && options.at(-1) < nextHigherNumber && item > nextHigherNumber) {
      options.push(nextHigherNumber);
    }
  });
  return options;
});

const selectedPerPage = ref(perPageOptions.value.find(item => item >= props.perPage));

const isFirstPage = computed(() => props.page <= 1);

const isLastPage = computed(() => {
  if (totalPages.value === null) {
    return false;
  }
  return props.page >= totalPages.value
});

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
  if (props.totalCount !== null && end > props.totalCount) {
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

const numberedPages = 5;

const pageNumberRange = computed(() => {
  let start = 1;
  if (props.page > numberedPages) {
    start = props.page - Math.floor(numberedPages/2);
  }

  let end = props.page + Math.floor(numberedPages/2);
  if (totalPages.value === null) {
    end = props.page;
  } else if (end > totalPages.value) {
    end = totalPages.value;
    if (((end - start) < numberedPages)) {
      start = end-numberedPages;
    }
  }

  if (start < 1) {
    start = 1;
  }

  const range = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  console.log('RANGE!', start, end);

  return range;
});



</script>