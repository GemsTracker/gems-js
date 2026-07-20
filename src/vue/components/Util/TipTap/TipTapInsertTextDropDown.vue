<template>
  <div class="dropdown">
    <button @click="dropDownOpen = !dropDownOpen"
        v-if="itemList !== null && itemList.length"
        class="dropdown-button"
        type="button"
        :title="title">
      {{ label }} <font-awesome-icon icon="caret-down" />
    </button>
    <div class="dropdown-items" :class="{open: dropDownOpen}"
       ref="dropDownList" :style="dropDownListSize">
      <div v-for="(item, index) in itemList" :key="index" class="dropdown-row"
          @click="insertTextAndClose(item.name, item.value)">
        <div class="dropdown-column dropdown-key">{{ item.name }}</div>
        <div class="dropdown-column dropdown-value"
           v-html="item.value">
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject, ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onClickOutside } from '@vueuse/core';
import useTipTapFunctions from '../../../functions/tipTapFunctions';

library.add(faCaretDown);

const props = defineProps({
  items: {
    type: [Object, Array],
    default: null,
  },
  label: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    default: null,
  },
  insertType: {
    type: String,
    default: 'value',
  },
});
const dropDownOpen = ref(false);
const dropDownList = ref(false);

const editor = inject('editor');

const dropDownListSize = computed(() => {
  if (props.size !== 0) {
    return `max-height: ${props.size}rem`;
  }
  return null;
});

const itemList = computed(() => {
  if (Array.isArray(props.items)) {
    return props.items;
  }
  const newList = [];
  if (props.items === null) {
    return null;
  }
  Object.keys(props.items).forEach(key => {
    newList.push({
      name: key,
      value: props.items[key],
    })
  });
  return newList;
});

const { insertText, insertTwigVariable } = useTipTapFunctions(editor);

const insertTextAndClose = ((key, value) => {
  dropDownOpen.value = false;
  if (props.insertType === 'value') {
    insertText(value);
    return;
  }
  if (props.insertType === 'twig') {
    insertTwigVariable(key);
    return;
  }
  insertText(key);

});

onClickOutside(dropDownList, () => {
  dropDownOpen.value = false;
});
</script>
<style lang="scss" scoped>
.dropdown {
  position: relative;
}
.dropdown-items {
  position: absolute;
  min-width: 32rem;
  background: white;
  border: #aaa 1px solid;
  z-index: 999;
  overflow-y: auto;
  display: none;
  &.open {
    display: block;
  }
  .dropdown-row {
    display: flex;
    padding: .4rem;
    cursor: pointer;
    &:nth-child(even) {
      background-color: #eee;
    }
    &:hover {
      background: #bfdbfe;
    }
  }
  .dropdown-column {
    &.dropdown-key {
      flex-grow: 1;
      font-weight: bold;
    }
    &.dropdown-value {
      margin-left: 1rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
