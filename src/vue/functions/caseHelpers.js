export function kebabToCamelCase(s) {
  return (s ? (s.replace(/-./g, (x) => x[1].toUpperCase())) : s);
}

export function kebabToPascalCase(s) {
  return (s ? (s.replace(/-./g, (x) => x[1].toUpperCase())) : s);
}
