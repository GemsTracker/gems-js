import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { ifBlockExtensions } from '../../../../src/vue/functions/TipTap/ifBlock.js';
import { createTwigVariable  } from '../../../../src/vue/functions/TipTap/twigVariableExtension.js';
import { twigFull } from '../../../../src/vue/functions/TipTap/twigTransforms.js';

const TwigVariable = createTwigVariable(() => []);
const mk = (c) => new Editor({
  element: document.createElement('div'),
  extensions: [StarterKit, TwigVariable, ...ifBlockExtensions],
  content: c,
});
const twig = (e) => twigFull.toStored(e.getHTML());
const cursorIn = (e, typeName) => {
  let p = null;
  e.state.doc.descendants((n, pos) => {
    if (n.type.name === typeName && p === null) p = pos + 2; // into the inner paragraph
  });
  e.commands.setTextSelection(p);
};

describe('if-block commands', () => {
  it('wrapInIfBlock wraps the selection as the if-body', () => {
    const e = mk('<p>You are an adult</p>');
    e.commands.selectAll();
    e.commands.wrapInIfBlock('age > 18');
    expect(twig(e)).toContain('{% if age > 18 %}<p>You are an adult</p>{% endif %}');
  });

  it('addElseIf inserts an elseif before any else', () => {
    const e = mk(twigFull.toEditorHtml('{% if a %}<p>A</p>{% else %}<p>B</p>{% endif %}'));
    cursorIn(e, 'ifBranch');
    e.commands.addElseIf('b');
    expect(twig(e)).toContain('{% if a %}<p>A</p>{% elseif b %}<p></p>{% else %}<p>B</p>{% endif %}');
  });

  it('addElse appends once and refuses a second', () => {
    const e = mk(twigFull.toEditorHtml('{% if a %}<p>A</p>{% endif %}'));
    cursorIn(e, 'ifBranch');
    expect(e.commands.addElse()).toBe(true);
    cursorIn(e, 'ifBranch');
    expect(e.commands.addElse()).toBe(false);
  });

  it('removeBranch drops an elseif but keeps the rest', () => {
    const e = mk(twigFull.toEditorHtml('{% if a %}<p>A</p>{% elseif b %}<p>B</p>{% else %}<p>C</p>{% endif %}'));
    cursorIn(e, 'elseifBranch');
    e.commands.removeBranch();
    expect(twig(e)).toContain('{% if a %}<p>A</p>{% else %}<p>C</p>{% endif %}');
  });

  it('removeBranch on the sole if-branch removes the whole block', () => {
    const e = mk(twigFull.toEditorHtml('{% if a %}<p>hi</p>{% endif %}'));
    cursorIn(e, 'ifBranch');
    e.commands.removeBranch();
    expect(twig(e)).not.toContain('{% if');
  });

  it('removeBranch refuses to remove the if-branch when siblings exist', () => {
    const e = mk(twigFull.toEditorHtml('{% if a %}<p>A</p>{% else %}<p>B</p>{% endif %}'));
    cursorIn(e, 'ifBranch');
    expect(e.commands.removeBranch()).toBe(false);
  });
});