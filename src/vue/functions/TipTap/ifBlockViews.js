import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { IfBlock, IfBranch, ElseifBranch, ElseBranch } from './ifBlock';
import IfBlockView from '../../components/Util/TipTap/TipTapIfBlockView.vue';
import BranchView from '../../components/Util/TipTap/TipTapBranchView.vue';

// The schema extensions from ifBlock.js are pure (no Vue) so they stay
// headless-testable. Here we attach the display layer. renderHTML is untouched,
// so serialization is unaffected — these NodeViews are editing chrome only.

const IfBlockWithView = IfBlock.extend({
  addNodeView() {
    return VueNodeViewRenderer(IfBlockView);
  },
});

const IfBranchWithView = IfBranch.extend({
  addNodeView() {
    return VueNodeViewRenderer(BranchView);
  },
});

const ElseifBranchWithView = ElseifBranch.extend({
  addNodeView() {
    return VueNodeViewRenderer(BranchView);
  },
});

const ElseBranchWithView = ElseBranch.extend({
  addNodeView() {
    return VueNodeViewRenderer(BranchView);
  },
});

export const ifBlockExtensionsWithViews = [
  IfBlockWithView,
  IfBranchWithView,
  ElseifBranchWithView,
  ElseBranchWithView,
];