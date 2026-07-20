import { createVariableExtension } from './createVariableExtension';
import { makeVariableTransforms } from './variableTransforms';

const NAME = 'twigVariable';

export function createTwigVariable(getVariables) {
  return createVariableExtension({
    name: NAME,
    char: '{{',
    htmlClass: 'twig-variable',
    getItems: (query) => {
      const q = query.toLowerCase();
      return getVariables().filter((v) => v.name.toLowerCase().includes(q));
    },
  });
}

export const twigTransforms = makeVariableTransforms({
  dataType: NAME,
  pattern: /\{\{\s*([\w.-]+)\s*\}\}/g,
  wrap: (id) => `{{ ${id} }}`,
});