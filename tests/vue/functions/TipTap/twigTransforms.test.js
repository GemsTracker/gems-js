import { describe, it, expect } from 'vitest';
import { twigFull, variableOnly } from '../../../../src/vue/functions/TipTap/twigTransforms';

const rt = (t) => (twig) => t.toStored(t.toEditorHtml(twig));

// ---- twigFull: variables + blocks ----------------------------------------
const fullValid = [
  ['plain text', '<p>Just some text</p>'],
  ['variable only', '<p>Hello {{ name }}</p>'],
  ['dotted variables', '<p>{{ user.raw }} and {{ age }}</p>'],
  ['simple if', '{% if age > 18 %}<p>Adult</p>{% endif %}'],
  ['if / else', '{% if age > 18 %}<p>Adult</p>{% else %}<p>Minor</p>{% endif %}'],
  ['if / elseif / else', '{% if age > 18 %}<p>Adult</p>{% elseif age > 12 %}<p>Teen</p>{% else %}<p>Child</p>{% endif %}'],
  ['variables inside branches', '{% if age > 18 %}<p>Hi {{ name }}</p>{% else %}<p>Bye {{ name }}</p>{% endif %}'],
  ['nested if', '{% if a %}<p>A</p>{% if b %}<p>B</p>{% endif %}{% endif %}'],
  ['nested inside elseif', '{% if a %}<p>A</p>{% elseif c %}<p>C</p>{% if b %}<p>B</p>{% else %}<p>notB</p>{% endif %}{% endif %}'],
  ['three levels deep', '{% if a %}{% if b %}{% if c %}<p>deep</p>{% endif %}{% endif %}{% endif %}'],
  ['block among content', '<p>Intro {{ name }}</p>{% if ok %}<p>yes</p>{% endif %}<p>Outro</p>'],
  ['adjacent sibling blocks', '{% if a %}<p>x</p>{% endif %}{% if b %}<p>y</p>{% endif %}'],
  ['empty if body', '{% if a %}{% else %}<p>x</p>{% endif %}'],
  ['branch is only a variable', '{% if a %}{{ name }}{% endif %}'],
  ['modulo in condition', '{% if age % 2 == 0 %}<p>even</p>{% endif %}'],
  ['complex expr var left literal', '<p>{{ user.name|upper }}</p>'],
];

describe('twigFull round-trip', () => {
  it.each(fullValid)('%s', (_l, input) => expect(rt(twigFull)(input)).toBe(input));
});

describe('twigFull malformed survives losslessly', () => {
  it('unbalanced open -> literal', () => expect(rt(twigFull)('{% if x %}<p>hi</p>')).toBe('{% if x %}<p>hi</p>'));
  it('stray endif -> literal', () => expect(rt(twigFull)('<p>hi</p>{% endif %}')).toBe('<p>hi</p>{% endif %}'));
  it('does not throw on garbage', () => expect(() => rt(twigFull)('{% if %}{% elseif {% endif {{ ')).not.toThrow());
});

describe('twigFull documented limitations', () => {
  it('unbalanced literal escapes operators on re-save', () =>
      expect(rt(twigFull)('{% if a < b %}<p>hi</p>')).toBe('{% if a &lt; b %}<p>hi</p>'));
  it('quoted %} breaks the matcher', () =>
      expect(rt(twigFull)("{% if label == 'a%}b' %}<p>x</p>{% endif %}")).toBe("{% if label == 'a %}b' %}<p>x</p>{% endif %}"));
  it('elseif-after-else tolerated by transform (schema is the gate)', () =>
      expect(rt(twigFull)('{% if a %}<p>A</p>{% else %}<p>B</p>{% elseif c %}<p>C</p>{% endif %}'))
          .toBe('{% if a %}<p>A</p>{% else %}<p>B</p>{% elseif c %}<p>C</p>{% endif %}'));
});

// ---- variableOnly: variables work, blocks are inert ----------------------
describe('variableOnly', () => {
  it('converts variables', () => expect(rt(variableOnly)('<p>Hi {{ name }}</p>')).toBe('<p>Hi {{ name }}</p>'));

  it('leaves block tags as literal text (does not create ifBlock nodes)', () => {
    const parsed = variableOnly.toEditorHtml('{% if a %}<p>x</p>{% endif %}');
    expect(parsed).not.toContain('data-type="ifBlock"');
    expect(rt(variableOnly)('{% if a %}<p>x</p>{% endif %}')).toBe('{% if a %}<p>x</p>{% endif %}');
  });

  it('handles variables adjacent to literal block tags', () =>
      expect(rt(variableOnly)('{% if a %}{{ name }}{% endif %}')).toBe('{% if a %}{{ name }}{% endif %}'));
});