<template>
  <VueSelect
      :model-value="modelValue"
      :options="props.options"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      :reduce="getValue"
      :get-option-label="getLabel"
      append-to-body
      :calculate-position="positionMenu"
      @update:model-value="$emit('update:modelValue', $event ?? null)"
  />
</template>
<script setup>
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const props = defineProps({
  modelValue: { type: null, default: null },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  /** Show a × to deselect; v-model becomes null. */
  clearable: { type: Boolean, default: true },
});

defineEmits(['update:modelValue']);

const isObject = (o) => o !== null && typeof o === 'object';
const getValue = (o) => (isObject(o) ? o.value : o);
// Also handles a v-model value that isn't in options (shown as-is).
const getLabel = (o) => (isObject(o) ? String(o.label ?? o.value ?? '') : String(o ?? ''));

// The menu is appended to <body>. Size it to its content (at least as wide as the field),
// match the field's font size, and keep it inside the window.
const positionMenu = (menu, component, { width, top, left }) => {
  menu.classList.add('rich-select-menu');
  menu.style.top = top;
  menu.style.left = left;
  menu.style.minWidth = width;
  menu.style.width = 'max-content';
  menu.style.maxWidth = 'min(32rem, calc(100vw - 16px))';
  menu.style.fontSize = getComputedStyle(component.$el).fontSize;

  requestAnimationFrame(() => {
    const overflow = menu.getBoundingClientRect().right - (document.documentElement.clientWidth - 8);
    if (overflow > 0) menu.style.left = `${parseFloat(left) - overflow}px`;
  });
};
</script>
<style>
.rich-select-menu {
  --vs-dropdown-option-padding: 0.2em 0.7em;
  padding: 0.25em 0;
}
.rich-select-menu .vs__dropdown-option {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>