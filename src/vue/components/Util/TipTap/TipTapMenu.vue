<template>
  <div class="menu">
    <slot name="default-buttons">
      <tip-tap-bold />
      <tip-tap-italic />
      <tip-tap-history />
    </slot>
    <slot></slot>
  </div>
</template>
<script>
import TipTapBold from './TipTapBold.vue';
import TipTapItalic from './TipTapItalic.vue';
import TipTapHistory from './TipTapHistory.vue';

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
    TipTapHistory,
    TipTapItalic,
    TipTapBold,
  },
};
</script>
