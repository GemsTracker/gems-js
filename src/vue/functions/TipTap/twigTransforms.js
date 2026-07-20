import { escapeHtmlText, escapeAttr } from './htmlEscape';
import { variablePass } from './variablePass';

const CTRL_TAG = /\{%\s*(if|elseif|else|endif)\b([\s\S]*?)%\}/g;

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
  'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

const getDocument = () => {
  if (typeof document !== 'undefined') {
    return document;
  }
  throw new Error('No document available');
};

const scanTags = (string) => {
  const tags = [];
  CTRL_TAG.lastIndex = 0;
  let match;
  while ((match = CTRL_TAG.exec(string))) {
    tags.push({
      index: match.index,
      end: CTRL_TAG.lastIndex,
      kw: match[1],
      expr: match[2].trim(),
      raw: match[0]
    });
  }
  return tags;
}

const matchEndif = (tags, ifIndex) => {
  let depth = 1;
  for (let j = ifIndex + 1; j < tags.length; j++) {
    if (tags[j].kw === 'if') depth++;
    else if (tags[j].kw === 'endif') { depth--; if (depth === 0) return j; }
  }
  return null;
};

const serializeAttrs = (el) => {
  return Array.from(el.attributes).map((a) => ` ${a.name}="${escapeAttr(a.value)}"`).join('');
};

export const makeTransforms = ({ passes = [variablePass], blocks = true } = {}) => {
  const applyLeafParse = (text) => passes.reduce((t, p) => p.textToHtml(t), text);

  const toEditorHtml = (twig) => {
    if (!twig) {
      return twig;
    }
    return blocks ? parseSequence(twig): applyLeafParse(twig);
  }

  const parseSequence = (string) => {
    const tags = scanTags(string);
    let out = '';
    let cursor = 0
    let ti = 0;
    while (ti < tags.length) {
      const tag = tags[ti];
      out += applyLeafParse(string.slice(cursor, tag.index));
      if (tag.kw === 'if') {
        const endIdx = matchEndif(tags, ti);
        if (endIdx === null) {
          out += escapeHtmlText(tag.raw);
          cursor = tag.end;
          ti += 1;
        } else {
          out += buildBlock(tag.expr, string.slice(tag.end, tags[endIdx].index));
          cursor = tags[endIdx].end;
          ti = endIdx + 1;
        }
      } else {
        out += escapeHtmlText(tag.raw);
        cursor = tag.end;
        ti += 1;
      }
    }
    return out + applyLeafParse(string.slice(cursor));
  };

  const buildBlock = (ifExpr, inner) => {
    const tags = scanTags(inner);
    const segments = [];
    let depth = 0;
    let current = {
      kind: 'if',
      expr: ifExpr,
      bodyStart: 0
    };
    for (const tag of tags) {
      if (tag.kw === 'if') {
        depth++;
      } else if (tag.kw === 'endif') {
        depth--;
      } else if ((tag.kw === 'elseif' || tag.kw === 'else') && depth === 0) {
        current.body = inner.slice(current.bodyStart, tag.index);
        segments.push(current);
        current = {
          kind: tag.kw,
          expr: tag.expr,
          bodyStart: tag.end
        };
      }
    }
    current.body = inner.slice(current.bodyStart);
    segments.push(current);

    let html = '<div data-type="ifBlock">';
    for (const seg of segments) {
      const body = parseSequence(seg.body);
      if (seg.kind === 'if') {
        html += `<div data-type="ifBranch" data-condition="${escapeAttr(seg.expr)}">${body}</div>`;
      } else if (seg.kind === 'elseif') {
        html += `<div data-type="elseifBranch" data-condition="${escapeAttr(seg.expr)}">${body}</div>`;
      } else {
        html += `<div data-type="elseBranch">${body}</div>`;
      }
    }
    return html + '</div>';
  }

  const toStored = (html) => {
    if (!html) {
      return html;
    }
    const template = getDocument().createElement('template');
    template.innerHTML = html;
    return serializeChildren(template.content);
  }

  const serializeChildren = (parent) => {
    let out = '';
    parent.childNodes.forEach((node) => { out += serializeNode(node); });
    return out;
  }

  const serializeNode = (node) => {
    if (node.nodeType === 3) {
      return escapeHtmlText(node.data);
    }
    if (node.nodeType !== 1) {
      return '';
    }
    const el = node;
    if (blocks && el.getAttribute('data-type') === 'ifBlock') {
      return serializeIfBlock(el);
    }
    for (const pass of passes) {
      const claimed = pass.nodeToText(el);
      if (claimed !== null) {
        return claimed;
      }
    }
    const tag = el.tagName.toLowerCase();
    const attrs = serializeAttrs(el);
    if (VOID_TAGS.has(tag)) {
      return `<${tag}${attrs}>`;
    }
    return `<${tag}${attrs}>${serializeChildren(el)}</${tag}>`;
  }

  const serializeIfBlock = (blockEl) => {
    let out = '';
    for (const branch of Array.from(blockEl.children)) {
      const t = branch.getAttribute('data-type');
      const cond = branch.getAttribute('data-condition') ?? '';
      const body = serializeChildren(branch);
      if (t === 'ifBranch') {
        out += `{% if ${cond} %}${body}`;
      } else if (t === 'elseifBranch') {
        out += `{% elseif ${cond} %}${body}`;
      } else if (t === 'elseBranch') {
        out += `{% else %}${body}`;
      }
    }
    return out + '{% endif %}';
  }

  return { toEditorHtml, toStored };
}

export const variableOnly = makeTransforms({ blocks: false });
export const twigFull = makeTransforms({ blocks: true });
