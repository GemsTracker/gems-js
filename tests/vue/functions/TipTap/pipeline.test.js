import { describe, it, expect } from 'vitest';
import { getSchema } from '@tiptap/core';
import { DOMParser as PMDOMParser, DOMSerializer } from '@tiptap/pm/model';
import StarterKit from '@tiptap/starter-kit';
import { ifBlockExtensions } from '../../../../src/vue/functions/TipTap/ifBlock.js';
import { createTwigVariable  } from '../../../../src/vue/functions/TipTap/twigVariableExtension.js';
import { twigFull } from '../../../../src/vue/functions/TipTap/twigTransforms.js';

// The full editor round-trip: stored -> toEditorHtml -> PM parse -> PM
// serialize (== getHTML) -> toStored. This exercises ProseMirror's schema
// enforcement and normalization, which the pure-function suite cannot.
const TwigVariable = createTwigVariable(() => []);
const schema = getSchema([StarterKit, TwigVariable, ...ifBlockExtensions]);

function pipeline(twig) {
  const c = document.createElement('div');
  c.innerHTML = twigFull.toEditorHtml(twig);
  const doc = PMDOMParser.fromSchema(schema).parse(c);
  const frag = DOMSerializer.fromSchema(schema).serializeFragment(doc.content, { document });
  const out = document.createElement('div');
  out.appendChild(frag);
  return twigFull.toStored(out.innerHTML);
}

describe('editor pipeline round-trip (byte-exact)', () => {
  it.each([
    ['simple if', '{% if age > 18 %}<p>Adult</p>{% endif %}'],
    ['if/else', '{% if age > 18 %}<p>Adult</p>{% else %}<p>Minor</p>{% endif %}'],
    ['if/elseif/else', '{% if age > 18 %}<p>Adult</p>{% elseif age > 12 %}<p>Teen</p>{% else %}<p>Child</p>{% endif %}'],
    ['nested', '{% if a %}<p>A</p>{% if b %}<p>B</p>{% endif %}{% endif %}'],
    ['variable in branch', '{% if a %}<p>Hi {{ name }}</p>{% endif %}'],
    ['variable + block mix', '<p>{{ name }}</p>{% if ok %}<p>{{ age }}</p>{% endif %}'],
  ])('%s', (_l, input) => {
    expect(pipeline(input)).toBe(input);
  });
});

describe('editor pipeline normalization (idempotent drift)', () => {
  it('empty branch gains a placeholder <p> once, then is stable', () => {
    const input = '{% if a %}{% else %}<p>x</p>{% endif %}';
    const once = pipeline(input);
    expect(once).toBe('{% if a %}<p></p>{% else %}<p>x</p>{% endif %}'); // block+ auto-fill
    expect(pipeline(once)).toBe(once); // idempotent on reload
  });
});