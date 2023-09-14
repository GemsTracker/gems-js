import {computed} from 'vue';

const useTipTapFunctions = ((editor) => {

  const activeBold = computed(() => {
    return editor.value && editor.value.isActive('bold');
  });
  const activeItalic = computed(() => {
    return editor.value && editor.value.isActive('italic');
  });

  const doRedo = (() => {
    editor.value.chain().focus().redo().run();
  });

  const doUndo = (() => {
    editor.value.chain().focus().undo().run();
  });

  const hasRedo = computed(() => {
    return editor.value && editor.value.can().redo();
  });
  const hasUndo = computed(() => {
    return editor.value && editor.value.can().undo();
  });

  const insertText = ((text) => {
    editor.value.chain().focus().insertContent(text).run();
  });

  const setBold = (() => {
    editor.value.chain().focus().toggleBold().run();
  });

  const setItalic = (() => {
    editor.value.chain().focus().toggleItalic().run();
  });

  return {
    activeBold,
    activeItalic,
    doRedo,
    doUndo,
    hasRedo,
    hasUndo,
    insertText,
    setBold,
    setItalic,
  };
});

export default useTipTapFunctions;