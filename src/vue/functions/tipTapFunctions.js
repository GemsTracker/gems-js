import { computed } from 'vue';

const useTipTapFunctions = ((editor) => {
  const activeBold = computed(() => editor.value && editor.value.isActive('bold'));
  const activeItalic = computed(() => editor.value && editor.value.isActive('italic'));
  const activeLink = computed(() => editor.value && editor.value.isActive('link'));

  const doRedo = (() => {
    editor.value.chain().focus().redo().run();
  });

  const doUndo = (() => {
    editor.value.chain().focus().undo().run();
  });

  const hasRedo = computed(() => editor.value && editor.value.can().redo());
  const hasUndo = computed(() => editor.value && editor.value.can().undo());

  const insertText = ((text) => {
    editor.value.chain().focus().insertContent(text).run();
  });

  const setBold = (() => {
    editor.value.chain().focus().toggleBold().run();
  });

  const setItalic = (() => {
    editor.value.chain().focus().toggleItalic().run();
  });

  const setLink = ((url) => {
    editor.value
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  });

  const getCurrentLink = (() => editor.value.getAttributes('link').href);

  const breakLink = (() => {
    editor.value
      .chain()
      .focus()
      .unsetLink()
      .run();
  });

  return {
    activeBold,
    activeItalic,
    breakLink,
    doRedo,
    doUndo,
    getCurrentLink,
    hasRedo,
    hasUndo,
    insertText,
    setBold,
    setItalic,
    setLink,
  };
});

export default useTipTapFunctions;
