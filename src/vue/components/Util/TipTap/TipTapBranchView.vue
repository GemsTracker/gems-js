<template>
  <node-view-wrapper as="div" class="if-branch">
    <div class="if-branch__header" contenteditable="false">
      <span class="if-branch__keyword">{{ keyword }}</span>

      <tip-tap-condition-builder
          v-if="hasCondition"
          :model-value="node.attrs.condition"
          class="if-branch__cond"
          :variables="[]"
          @update:model-value="updateAttributes({ condition: $event })"
      />

      <button
          type="button"
          class="if-branch__remove"
          :disabled="!canRemove"
          title="Remove this branch"
          @click="remove"
      >
        ×
      </button>
    </div>

    <!-- The branch body: ProseMirror-editable block content, one hole per branch. -->
    <node-view-content class="if-branch__body" />
  </node-view-wrapper>
</template>

<script setup>
import { computed } from 'vue';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3';
import TipTapConditionBuilder from "./TipTapConditionBuilder.vue";

const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
  node: {
    type: Object,
    required: true,
  },
  getPos: {
    type: Function,
    required: true,
  },
  updateAttributes: {
    type: Function,
    required: true,
  },
});

const KEYWORDS = {
  ifBranch: 'if',
  elseifBranch: 'else if',
  elseBranch: 'else'
};

const keyword = computed(() => KEYWORDS[props.node.type.name] ?? '');
const hasCondition = computed(() => props.node.type.name !== 'elseBranch');

// The if-branch can only be removed when it's the sole branch (the command
// then deletes the whole block). Mirror that so the button reflects reality.
const canRemove = computed(() => {
  if (props.node.type.name !== 'ifBranch') return true;
  const pos = props.getPos();
  if (typeof pos !== 'number') return true;
  const parent = props.editor.state.doc.resolve(pos).parent;
  return parent.childCount <= 1;
});

// Condition is a plain string attribute — the raw source of truth. The
// structured builder (step 3) will replace this input, still writing here.
const onCondition = (event) => {
  props.updateAttributes({ condition: event.target.value });
}

const focusInside = () => {
  const pos = props.getPos();
  if (typeof pos === 'number') props.editor.chain().setTextSelection(pos + 2).run();
}
const remove = () => {
  focusInside();
  props.editor.chain().focus().removeBranch().run();
}
</script>

<style>
.if-branch {
  & + & {
    border-top: 1px solid rgb(224 231 255);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0.5rem;
    background: rgb(238 242 255);
  }

  &__keyword {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-weight: 600;
    color: rgb(30 58 138);
  }

  &__condition {
    flex: 0 1 20rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.85rem;
    padding: 0.1rem 0.35rem;
    border: 1px solid rgb(199 210 254);
    border-radius: 4px;
  }

  &__spacer { flex: 1 1 auto; }

  &__remove {
    border: none;
    background: transparent;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    color: rgb(107 114 128);
    &:disabled { opacity: 0.3; cursor: not-allowed; }
  }

  &__body {
    padding: 0.4rem 0.6rem;
  }
}
</style>