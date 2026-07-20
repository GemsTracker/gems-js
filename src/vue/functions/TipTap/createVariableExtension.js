import { VueRenderer } from '@tiptap/vue-3';
import { mergeAttributes } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Mention from '@tiptap/extension-mention';
import TipTapVariableList from '../../components/Util/TipTap/TipTapVariableList.vue';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';


const makeRender = (listComponent) => {
  let component;
  let el;
  let cleanup;
  let currentProps;

  const reference = {
    getBoundingClientRect: () =>
        currentProps.clientRect
          ? currentProps.clientRect()
          : currentProps.editor.view.dom.getBoundingClientRect(),
  };

  return {
    onStart: (props) => {
      currentProps = props;
      component = new VueRenderer(listComponent, { props, editor: props.editor });
      if (!props.clientRect) {
        return;
      }
      el = component.element;
      el.style.position = 'absolute';
      el.style.zIndex = '50';
      document.body.appendChild(el);
      cleanup = autoUpdate(reference, el, () => {
        computePosition(reference, el, {
          placement: 'bottom-start',
          middleware: [offset(6), flip(), shift({ padding: 8})],
        }).then(({ x, y }) => {
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
        });
      });
    },
    onUpdate: (props) => {
      currentProps = props;
      component?.updateProps(props);
    },
    onKeyDown: (props) => component?.ref?.onKeyDown(props) ?? false,
    onExit: () => {
      cleanup?.();
      cleanup = null;
      el?.remove();
      component?.destroy();
      component = null;
      el = null;
    },
  };
};

export const createVariableExtension = ({
    name,
    char,
    getItems,
    htmlClass,
    listComponent = TipTapVariableList,
}) => {
  return Mention.extend({
    name,
    renderHTML({ node, HTMLAttributes }) {
      return [
        'span',
        mergeAttributes(
            { 'data-type': this.name },
            this.options.HTMLAttributes,
            HTMLAttributes,
        ),
        node.attrs.id,
      ];
    }
  }).configure({
    HTMLAttributes: { class: htmlClass ?? name },
    suggestion: {
      char,
      pluginKey: new PluginKey(name),
      items: ({ query }) => getItems(query),
      render: () => makeRender(listComponent),
    }
  })
}