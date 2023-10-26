import { kebabToCamelCase } from './caseHelpers';

const dataAttributesToProps = (baseElement) => {
  return baseElement.getAttributeNames().reduce((accumulator, currentKey) => {
    if (currentKey.startsWith('data-vue-')) {
      let newKey = kebabToCamelCase(currentKey.replace('data-vue-', ''));
      if (newKey === 'tag') {
        return accumulator;
      }
      let newValue = baseElement.getAttribute(currentKey);
      if (newKey.startsWith(':')) {
        newKey = newKey.substring(1);
        if (!Number.isNaN(newValue)) {
          newValue = Number(newValue);
        }
      }
      accumulator[newKey] = newValue;
    }
    return accumulator;
  }, {});
};

const rootAttributesToProps = (elementName, appSettings) => {
  let baseElementName = elementName;
  if (elementName.startsWith('#')) {
    baseElementName = elementName.substring(1);
  }
  const baseElement = document.getElementById(baseElementName);
  const props = dataAttributesToProps(baseElement);
  return {
    baseProps: props,
    tag: baseElement.getAttribute('data-vue-tag'),
    appSettings,
  };
};

export default rootAttributesToProps;
