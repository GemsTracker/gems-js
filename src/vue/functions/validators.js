const required = ((value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return Boolean(value);
});

const none = (() => true);

export {
  none,
  required,
};
