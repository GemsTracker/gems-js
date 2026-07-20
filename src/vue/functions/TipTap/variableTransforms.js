/**
 * Build the boundary transforms for one variable syntax. Pairs with an
 * extension created by createVariableExtension using the same `dataType`.
 *
 * @param {object} opts
 * @param {string} opts.dataType         Must equal the extension's node name.
 * @param {RegExp} opts.pattern          Global regex; capture group 1 is the id.
 * @param {(id: string) => string} opts.wrap  Renders an id back to stored syntax.
 */
export function makeVariableTransforms({ dataType, pattern, wrap }) {
  // Stored syntax -> editor HTML (spans). Run before setContent.
  const toEditorHtml = (stored, isKnown) => {
    if (!stored) {
      return stored;
    }
    return stored.replace(pattern, (match, id) => {
      if (isKnown && !isKnown(id)) {
        return match;
      }
      return `<span data-type="${dataType}" data-id="${id}"></span>`;
    });
  }

  // Editor HTML (spans) -> stored syntax. Run on getHTML() before emitting.
  const toStored = (html) => {
    if (!html) {
      return html;
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll(`[data-type="${dataType}"]`).forEach((el) => {
      el.replaceWith(doc.createTextNode(wrap(el.getAttribute('data-id') ?? '')));
    });
    return doc.body.innerHTML;
  }

  return { toEditorHtml, toStored };
}