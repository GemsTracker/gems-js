<template>
  <div class="variable-suggestion">
    <ul v-if="items.length" class="variable-suggestion-list">
      <li
          v-for="(item, index) in items"
          :key="item.name"
          :ref="(el) => (itemEls[index] = el)"
          :class="{ active: index === selectedIndex }"
          @mousedown.prevent="selectItem(index)"
          @mouseover="selectedIndex = index"
      >
        <code class="variable-name">{{ item.name }}</code>
        <span v-if="item.value !== null" class="variable-value">
          {{ item.value }}
        </span>
      </li>
    </ul>
    <div v-else class="variable-suggestion-empty">
      {{ emptyText }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  command: {
    type: Function,
    required: true,
  },
  emptyText: {
    type: String,
    default: '-',
  }
});

const selectedIndex = ref(0);
const itemEls = ref([]);

watch(() => props.items, () => {
  selectedIndex.value = 0;
  itemEls.value = [];
});

watch(selectedIndex, async () => {
  await nextTick();
  itemEls.value[selectedIndex.value]?.scrollIntoView({ block: 'nearest'});
});

const selectItem = (index) => {
  const item = props.items[index];
  if (item) {
    props.command({
      id: item.name,
      label: item.name,
    })
  }
};

const onKeyDown = ({ event }) => {
  const count = props.items.length;
  if (!count) {
    return false;
  }

  switch (event.key) {
    case 'ArrowUp':
      selectedIndex.value = (selectedIndex.value + count - 1) % count;
      return true;
    case 'ArrowDown':
      selectedIndex.value = (selectedIndex.value + 1) % count;
      return true;
    case 'Enter':
    case 'Tab':
      selectItem(selectedIndex.value);
      return true;
    default:
      return false;
  }
}

defineExpose({ onKeyDown });
</script>
<style scoped>
.variable-suggestion {
  background: white;
  border: #aaa 1px solid;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  max-height: 16rem;
  overflow-y: auto;
  min-width: 14rem;
  font-size: .875rem;

  .variable-suggestion-list {
    list-style: none;
    margin: 0;
    padding: .25rem;

    li {
      display: flex;
      white-space: nowrap;
      overflow: hidden;
      gap: .1rem;
      padding: .35rem .5rem;
      border-radius: 3px;
      cursor: pointer;

      &.active {
        background: rgb(191 219 254);
      }
    }
  }

  .variable-name {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    color: rgb(30 58 138);
    flex: 0 0 auto;
  }
  .variable-value {
    color: rgb(102 102 102);
    font-size: .75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: auto;
  }

  .variable-suggestion-empty {
    padding: .5rem;
    color: rgb(153 153 153);
  }
}
</style>