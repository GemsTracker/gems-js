<template>
  <node-view-wrapper as="div" class="if-block" :class="{ 'if-block--collapsed': collapsed }">
    <!-- Collapsed: a dark "if" row (matches the branch header) with summary text. -->
    <div v-if="collapsed" class="if-block__collapsed" contenteditable="false" @click="collapsed = false">
      <span class="if-block__chev-btn"><span class="if-block__chev">▾</span></span>
      <span class="if-block__lead">if</span>
      <code class="if-block__cond">{{ firstCondition || '(no condition)' }}</code>
      <span v-if="branchSummary" class="if-block__more">{{ branchSummary }}</span>
    </div>

    <!-- Expanded: chevron sits right above the if; body kept mounted via v-show. -->
    <div v-show="!collapsed" class="if-block__body">
      <button type="button" class="if-block__chev-btn if-block__chev-btn--top"
              title="Collapse" contenteditable="false" @click="collapsed = true">
        <span class="if-block__chev">▾</span>
      </button>
      <node-view-content class="if-block__branches" />

      <div class="if-block__actions" contenteditable="false">
        <button type="button" @click="addElseIf">+ else if</button>
        <button type="button" :disabled="hasElse" @click="addElse">+ else</button>
      </div>
    </div>
  </node-view-wrapper>

</template>

<script setup>
import { computed, ref } from 'vue';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3';

// TipTap passes these props to every NodeView component.
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
});

// View-only, ephemeral. Flip the default to `true` for collapsed-by-default.
const collapsed = ref(false);

const firstCondition = computed(() => props.node.firstChild?.attrs?.condition ?? '');

// "else if · else" — shows that structure exists without expanding.
const branchSummary = computed(() => {
  const kinds = [];
  props.node.forEach((child, _offset, index) => {
    if (index === 0) return; // the primary if is already shown
    if (child.type.name === 'elseifBranch') kinds.push('else if');
    else if (child.type.name === 'elseBranch') kinds.push('else');
  });
  return kinds.join(' · ');
});


const hasElse = computed(() => {
  const last = props.node.lastChild;
  return !!last && last.type.name === 'elseBranch';
});

// Put the cursor inside the block first so the commands find the enclosing
// ifBlock, then run them. getPos() + 2 lands in the first branch's paragraph.
const focusInside = () => {
  const pos = props.getPos();
  if (typeof pos === 'number') {
    props.editor.chain().setTextSelection(pos + 2).run();
  }
}
const addElseIf = () => {
  focusInside();
  props.editor.chain().focus().addElseIf('').run();
}
const addElse = () => {
  focusInside();
  props.editor.chain().focus().addElse().run();
}
</script>
<style>
.if-block {
  border: 1px solid #c7d2fe;
  border-radius: 6px;
  margin: 0.5rem 0;
  background: #f8faff;

  .if-block__body {
    position: relative;
  }

  &__branches {
    display: block;
  }
  &__collapsed {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.5rem;
    font-size: 0.85rem;
    background: #eef2ff;
    border-radius: 6px;
    cursor: pointer;
  }

  &__chev-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0 0.2rem;
    color: #1e3a8a;
    line-height: 1;
  }
  &__chev-btn--top {
    display: block;
    padding: 0.15rem 0.4rem;
    position: absolute;
    top: 4px;
    left: 3px;
  }

  &__chev {
    display: inline-block;
    transition: transform 0.12s ease;
  }
  &.if-block--collapsed &__chev {
    transform: rotate(-90deg);
  }
  &__lead {
    font-family: ui-monospace, Menlo, monospace;
    font-weight: 600;
    color: rgb(30 58 138);
  }
  &__cond {
    font-family: ui-monospace, Menlo, monospace;
    color: rgb(30 58 138);
  }
  &__more {
    color: #6b7280;
    font-size: 0.75rem;
  }
  &__hint {
    color: #9ca3af;
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
    padding: 0.35rem 0.5rem;
    border-top: 1px dashed #c7d2fe;

    button {
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      border: 1px solid #c7d2fe;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
  }
}
</style>