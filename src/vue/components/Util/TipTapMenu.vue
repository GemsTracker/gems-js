<template>
  <div class="menu">
    <button @click="setBold" type="button" title="Bold (ctrl+b)" :class="{active: activeBold}">
      <font-awesome-icon icon="bold" />
    </button>
    <button @click="setItalic" type="button" title="Italic (ctrl+i)"
            :class="{active: activeItalic}">
      <font-awesome-icon icon="italic" />
    </button>
    <button @click="doUndo" :disabled="!hasUndo" type="button" title="Undo (ctrl+z)">
      <font-awesome-icon icon="undo" />
    </button>
    <button @click="doRedo" :disabled="!hasRedo" type="button" title="Redo (shift+ctrl+z)">
      <font-awesome-icon icon="redo" />
    </button>
    <slot></slot>
  </div>
</template>
<script>
import { ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBold,
  faItalic,
  faRedo,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useTipTapFunctions from '../../functions/tipTapFunctions';

library.add(faBold, faItalic, faRedo, faUndo);

export default {
  props: {
    editor: {
      type: Object,
      required: true,
    },
    quickTexts: {
      type: Array,
      default: [],
    },
  },
  components: {
    FontAwesomeIcon,
  },
  setup(props) {
    const editor = ref(props.editor);

    const {
      activeBold,
      activeItalic,
      doRedo,
      doUndo,
      hasRedo,
      hasUndo,
      insertText,
      setBold,
      setItalic,
    } = useTipTapFunctions(editor);

    const quickTextsOpen = ref(false);

    const addText = ((text) => {
      quickTextsOpen.value = false;
      insertText(text);
    });

    return {
      activeBold,
      activeItalic,
      addText,
      doRedo,
      doUndo,
      hasRedo,
      hasUndo,
      insertText,
      quickTextsOpen,
      setBold,
      setItalic,
    };
  },
};
</script>
