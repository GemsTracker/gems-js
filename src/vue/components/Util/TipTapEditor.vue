<template>
  <div class="rte-editor">
    <tip-tap-menu v-if="editor" :editor="editor" :quick-texts="quickTexts">
      <slot name="menu-buttons"></slot>
    </tip-tap-menu>
    <editor-content :editor="editor" class="editor" />
  </div>
</template>
<script>
import { provide, watch } from 'vue';
import Link from '@tiptap/extension-link';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TipTapMenu from './TipTap/TipTapMenu.vue';

export default {
  props: {
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
  },
  emits: ['update:modelValue'],
  components: {
    TipTapMenu,
    EditorContent,
  },
  setup(props, { emit }) {
    const editor = useEditor({
      content: props.modelValue,
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
        }),
      ],
      onUpdate: () => {
        emit('update:modelValue', editor.value.getHTML());
      },
    });

    provide('editor', editor);

    watch(() => props.modelValue, (newValue) => {
      if (newValue !== editor.value.getHTML()) {
        editor.value.commands.setContent(newValue, false);
      }
    });

    return {
      editor,
    };
  },
};
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
