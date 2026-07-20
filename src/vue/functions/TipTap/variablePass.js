import { escapeAttr } from './htmlEscape';

const SIMPLE_VAR = /\{\{\s*([\w.-]+)\s*\}\}/g;
const NODE_NAME = 'twigVariable';

export const variablePass = {
  name: NODE_NAME,

  textToHtml(text) {
    return text.replace(
        SIMPLE_VAR,
        (_, id) => `<span data-type="${NODE_NAME}" data-id="${escapeAttr(id)}"></span>`
    );
  },

  nodeToText(el) {
    if (el.getAttribute('data-type') !== NODE_NAME) {
      return null;
    }
    return `{{ ${el.getAttribute('data-id') ?? ''} }}`;
  }
};