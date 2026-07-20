<template>
 <button
  type="button"
  :class="{ active: editor.isActive('ifBlock') }"
  :title="t('Add condition')"
  @click="addCondition"
 >
   if
 </button>
</template>

<script setup>
import { inject } from 'vue';
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const editor = inject('editor');

const addCondition = () => {
  const { empty } = editor.value.state.selection;
  const chain = editor.value.chain().focus();
  if (empty) {
    chain.insertIfBlock('').run();
    return;
  }
  chain.wrapInIfBlock('').run();
};
</script>