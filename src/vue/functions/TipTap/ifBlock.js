import { Node, mergeAttributes } from '@tiptap/core';
import { findWrapping } from '@tiptap/pm/transform';

// renderHTML emits the clean <div data-type=...> shape twigTransforms round-trips
// against. NodeViews are display-only and do not affect this serialization.
//
// BODY_CONTENT: 'block+' forces a placeholder paragraph in empty branches
// (verified via the pipeline test — empty branches auto-fill and stay stable).
const BODY_CONTENT = 'block+';

const conditionAttr = () => {
  return {
    condition: {
      default: '',
      parseHTML: (el) => el.getAttribute('data-condition') ?? '',
      renderHTML: (attrs) => ({ 'data-condition': attrs.condition ?? '' }),
    },
  };
}

// Walk ancestors of the selection head, return the first matching {node, pos, depth}.
const findAncestor = ($from, names)=> {
  for (let d = $from.depth; d > 0; d--) {
    const node = $from.node(d);
    if (names.includes(node.type.name)) {
      return {
        node,
        depth: d,
        pos: $from.before(d)
      };
    }
  }
  return null;
}

const BRANCH_NAMES = ['ifBranch', 'elseifBranch', 'elseBranch'];

export const IfBlock = Node.create({
  name: 'ifBlock',
  group: 'block',
  content: 'ifBranch elseifBranch* elseBranch?',
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="ifBlock"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'ifBlock' }), 0];
  },

  addCommands() {
    return {
      // Primary path: wrap the current selection's block(s) as the if-body.
      // findWrapping computes the ifBlock > ifBranch nesting automatically.
      wrapInIfBlock:
          (condition = '') =>
              ({ state, dispatch, tr }) => {
                const { $from, $to } = state.selection;
                const range = $from.blockRange($to);
                if (!range) return false;
                const wrappers = findWrapping(range, state.schema.nodes.ifBranch, { condition });
                if (!wrappers) return false;
                if (dispatch) dispatch(tr.wrap(range, wrappers).scrollIntoView());
                return true;
              },

      // Insert an empty ifBlock at the cursor (non-wrapping alternative).
      insertIfBlock:
          (condition = '') =>
              ({ chain }) =>
                  chain()
                      .insertContent({
                        type: 'ifBlock',
                        content: [
                          { type: 'ifBranch', attrs: { condition }, content: [{ type: 'paragraph' }] },
                        ],
                      })
                      .run(),

      addElseIf:
          (condition = '') =>
              ({ state, dispatch, tr }) => {
                const info = findAncestor(state.selection.$from, ['ifBlock']);
                if (!info) return false;
                const { node, pos } = info;
                const contentEnd = pos + 1 + node.content.size;
                const last = node.lastChild;
                const insertAt =
                    last && last.type.name === 'elseBranch' ? contentEnd - last.nodeSize : contentEnd;
                const branch = state.schema.nodes.elseifBranch.createAndFill({ condition });
                if (!branch) return false;
                if (dispatch) dispatch(tr.insert(insertAt, branch).scrollIntoView());
                return true;
              },

      addElse:
          () =>
              ({ state, dispatch, tr }) => {
                const info = findAncestor(state.selection.$from, ['ifBlock']);
                if (!info) return false;
                const { node, pos } = info;
                if (node.lastChild && node.lastChild.type.name === 'elseBranch') return false;
                const insertAt = pos + 1 + node.content.size;
                const branch = state.schema.nodes.elseBranch.createAndFill();
                if (!branch) return false;
                if (dispatch) dispatch(tr.insert(insertAt, branch).scrollIntoView());
                return true;
              },

      // Remove the branch containing the cursor. elseif/else: always fine.
      // ifBranch: only if it's the sole branch (then the whole block goes),
      // otherwise refused (can't leave a block whose first child isn't an if).
      removeBranch:
          () =>
              ({ state, dispatch, tr }) => {
                const branch = findAncestor(state.selection.$from, BRANCH_NAMES);
                const block = findAncestor(state.selection.$from, ['ifBlock']);
                if (!branch || !block) return false;

                if (branch.node.type.name === 'ifBranch') {
                  if (block.node.childCount > 1) return false; // refuse; UI disables this
                  if (dispatch) {
                    dispatch(tr.delete(block.pos, block.pos + block.node.nodeSize).scrollIntoView());
                  }
                  return true;
                }
                if (dispatch) {
                  dispatch(tr.delete(branch.pos, branch.pos + branch.node.nodeSize).scrollIntoView());
                }
                return true;
              },
    };
  },
});

export const IfBranch = Node.create({
  name: 'ifBranch',
  content: BODY_CONTENT,
  isolating: true,
  addAttributes: conditionAttr,
  parseHTML() {
    return [{ tag: 'div[data-type="ifBranch"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'ifBranch' }), 0];
  },
});

export const ElseifBranch = Node.create({
  name: 'elseifBranch',
  content: BODY_CONTENT,
  isolating: true,
  addAttributes: conditionAttr,
  parseHTML() {
    return [{ tag: 'div[data-type="elseifBranch"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'elseifBranch' }), 0];
  },
});

export const ElseBranch = Node.create({
  name: 'elseBranch',
  content: BODY_CONTENT,
  isolating: true,
  parseHTML() {
    return [{ tag: 'div[data-type="elseBranch"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'elseBranch' }), 0];
  },
});

export const ifBlockExtensions = [IfBlock, IfBranch, ElseifBranch, ElseBranch];