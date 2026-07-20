// Condition string <-> structured rows. The string is canonical (it's what
// lives in node.attrs.condition); this just gives the builder a structured view
// when the expression is simple enough, and signals { ok: false } when it isn't
// so the UI can fall back to a raw text field.
//
// Representable shape (v1): a flat list of comparisons joined by a single
// connector (all `and` OR all `or`). Anything with parentheses, mixed and/or,
// filters, functions, or operators outside the set below is NOT representable
// and returns { ok: false } -> raw mode.

const COMPARISON = /^([\w.]+)\s*(==|!=|>=|<=|>|<)\s*(.+)$/;
const UNARY = /^([\w.]+)\s+(is(?:\s+not)?\s+(?:empty|defined|null))$/;

// Split on top-level ` and ` / ` or `, respecting quotes. Returns null when the
// expression can't be represented as a flat single-connector list.
const splitTop = (str) => {
  if (/[()]/.test(str)) {
    // parentheses -> not representable
    return null;
  }
  const parts = [];
  let token = '';
  let inQuote = null;
  let connector = null;
  let i = 0;
  while (i < str.length) {
    const ch = str[i];
    if (inQuote) {
      token += ch;
      if (ch === inQuote) {
        inQuote = null;
      }
      i += 1;
      continue;
    }
    if (ch === "'" || ch === '"') {
      inQuote = ch;
      token += ch;
      i += 1;
      continue;
    }
    const rest = str.slice(i);
    const mAnd = /^\s+and\s+/i.exec(rest);
    const mOr = /^\s+or\s+/i.exec(rest);
    if (mAnd) {
      if (connector && connector !== 'and') {
        // mixed and/or
        return null;
      }
      connector = 'and';
      parts.push(token.trim());
      token = '';
      i += mAnd[0].length;
      continue;
    }
    if (mOr) {
      if (connector && connector !== 'or') {
        return null;
      }
      connector = 'or';
      parts.push(token.trim());
      token = '';
      i += mOr[0].length;
      continue;
    }
    token += ch; i += 1;
  }
  parts.push(token.trim());
  return {
    connector: connector ?? 'and',
    parts: parts.filter((p) => p.length),
  };
}

const parseComparison = (part) => {
  const trimmed = part.trim();
  const u = UNARY.exec(trimmed);
  if (u) {
    return {
      variable: u[1],
      operator: u[2].replace(/\s+/g, ' '),
      value: '',
      valueType: 'string',
    };
  }
  const m = COMPARISON.exec(trimmed);
  if (!m) {
    return null;
  }
  const [, variable, operator, rhsRaw] = m;
  const rhs = rhsRaw.trim();
  if (/^'([^']*)'$/.test(rhs) || /^"([^"]*)"$/.test(rhs)) {
    return {
      variable,
      operator,
      value: rhs.slice(1, -1),
      valueType: 'string'
    };
  }
  if (/^-?\d+(\.\d+)?$/.test(rhs)) {
    return {
      variable,
      operator,
      value: rhs,
      valueType: 'number',
    };
  }
  if (rhs === 'true' || rhs === 'false') {
    return {
      variable,
      operator,
      value: rhs,
      valueType: 'boolean',
    };
  }
  if (/^[\w.]+$/.test(rhs)) {
    return {
      variable,
      operator,
      value: rhs,
      valueType: 'variable'
    };
  }
  return null; // unrepresentable right-hand side
}

export const  parseCondition = (str) => {
  const trimmed = (str ?? '').trim();
  if (!trimmed) {
    return {
      ok: true,
      connector: 'and',
      rows: []
    };
  }
  const split = splitTop(trimmed);
  if (!split) {
    return {
      ok: false,
    };
  }
  const rows = [];
  for (const part of split.parts) {
    const row = parseComparison(part);
    if (!row) {
      return {
        ok: false,
      };
    }
    rows.push(row);
  }
  return {
    ok: true,
    connector: split.connector,
    rows
  };
}

const formatValue = (row) => {
  if (row.valueType === 'string') {
    return `'${row.value}'`;
  }
  return row.value; // number / boolean / variable emitted bare
}

export const serializeCondition = (connector, rows) => {
  return rows
      .filter((r) => r.variable && r.operator && (isUnary(r.operator) || r.value !== ''))
      .map((r) => {
        if (isUnary(r.operator)) {
          return `${r.variable} ${r.operator};`
        }
        return `${r.variable} ${r.operator} ${formatValue(r)}`;
      })
      .join(` ${connector} `);
}

export const BINARY_OPERATORS = ['==', '!=', '>', '<', '>=', '<='];
export const UNARY_OPERATORS = ['is empty', 'is not empty', 'is defined', 'is not defined', 'is null'];
export const OPERATORS = [...BINARY_OPERATORS, ...UNARY_OPERATORS];
export const VALUE_TYPES = ['string', 'number', 'boolean', 'variable'];

export const isUnary = (operator) => {
  return UNARY_OPERATORS.includes(operator);
};

export const findValueType = (rawValue, variables = []) => {
  const value = (rawValue || '').trim();
  if (value === 'true' || value === 'false') {
    return 'boolean';
  }
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return 'number';
  }
  if (variables.some((x) => x.name === value)) {
    return 'variable';
  }
  return 'string';
};

