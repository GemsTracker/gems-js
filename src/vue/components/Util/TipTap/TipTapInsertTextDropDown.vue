<template>
  <div class="dropdown">
    <button @click="dropDownOpen = !dropDownOpen"
        v-if="items !== null && Object.keys(items).length"
        class="dropdown-button"
        type="button"
        :title="title">
      {{ label }}<font-awesome-icon icon="caret-down" />
    </button>
    <div class="dropdown-items" :class="{open: dropDownOpen}"
       ref="dropDownList" :style="dropDownListSize">
      <div v-for="(value, key, index) in items" :key="index" class="dropdown-row"
          @click="insertTextAndClose(key, value)">
        <div class="dropdown-column dropdown-key">{{ key }}</div>
        <div class="dropdown-column dropdown-value"
           v-html="value">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, inject, ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onClickOutside } from '@vueuse/core';
import useTipTapFunctions from '../../../functions/tipTapFunctions';

library.add(faCaretDown);
export default {
  props: {
    items: {
      type: Object,
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
  },
  components: {
    FontAwesomeIcon,
  },
  setup(props) {
    const dropDownOpen = ref(false);
    const dropDownList = ref(false);

    const editor = inject('editor');

    const dropDownListSize = computed(() => {
      if (props.size !== 0) {
        return `max-height: ${props.size}rem`;
      }
      return null;
    });

    const { insertText } = useTipTapFunctions(editor);

    const insertTextAndClose = ((key, value) => {
      dropDownOpen.value = false;
      if (props.insertType === 'value') {
        insertText(value);
      } else {
        insertText(key);
      }
    });

    onClickOutside(dropDownList, () => {
      dropDownOpen.value = false;
    });

    return {
      dropDownList,
      dropDownListSize,
      dropDownOpen,
      insertTextAndClose,
    };
  },
};
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
