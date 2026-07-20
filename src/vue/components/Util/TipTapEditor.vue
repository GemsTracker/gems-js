<template>
  <div class="rte-editor">
    <tip-tap-menu v-if="editor" :editor="editor" :quick-texts="quickTexts">
      <slot name="menu-buttons"></slot>
    </tip-tap-menu>
    <editor-content :editor="editor" class="editor" />
  </div>
</template>
<script setup>
import { provide, watch } from 'vue';
import Link from '@tiptap/extension-link';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TipTapMenu from './TipTap/TipTapMenu.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  menu: {
    type: Boolean,
    default: true,
  },
  quickTexts: {
    type: Array,
    default: [],
  },
  preventEmit: {
    type: Boolean,
    default: false,
  },
  extensions: {
    type: Array,
    default: () => [],
  },
  parseContent: {
    type: Function,
    default: (value) => value,
  },
  serializeContent: {
    type: Function,
    default: (value) => value,
  },
});

const emit = defineEmits(['update:modelValue']);

let lastEmitted = props.modelValue;

const editor = useEditor({
  content: props.parseContent(props.modelValue),
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
    }),
    ...props.extensions,
  ],
  onUpdate: () => {
    const html = editor.value.getHTML();

    const value = props.serializeContent(html);
    lastEmitted = value;
    if (!props.preventEmit) {
      emit('update:modelValue', value);
    }
  },
});

provide('editor', editor);

watch(() => props.modelValue, (newValue) => {
  if (newValue !== lastEmitted) {
    editor.value?.commands.setContent(props.parseContent(newValue), false);
  }
});

</script>
<style lang="scss">

.rte-editor {
  background: white;
  .menu {
    border: #aaa 1px solid;
    border-bottom: none;
    padding: .25rem;
    button {
      background: white;
      color: black;
      border: none;
      padding: .25rem .5rem;
      margin: 0 .25rem;
      &:hover {
        background: #eee;
      }
      &.active {
        background: #bfdbfe;
      }
      &:disabled {
        color: #aaa;
        cursor: not-allowed;
        &:hover {
          background: white;
        }
      }
    }
    .tip-tap-menu-group {
      display: inline-block;
      button {
        margin: 0;
      }
    }
  }
  .editor .ProseMirror {
    border: #aaa 1px solid;
    padding: .5rem;
  }

  .dropdown {
    display: inline-block;
  }

  .dropdown-menu.open {
    display: block;
    padding: .5rem;
    li {
      cursor: pointer;
      &:nth-child(even) {
        background: #eee;
      }
      &:hover {
        background: #bfdbfe;
      }
    }
  }
}
</style>
