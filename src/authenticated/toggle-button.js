export default class ToggleButton {
  constructor() {
    this.init();
  }

  init() {
    const toggleButtons = document.querySelectorAll('button.toggle-btn');
    toggleButtons.forEach((element) => {
      this.addToggle(element);
    });
  }

  addToggle(targetElement) {
    targetElement.addEventListener('click', this.toggle);
  }

  static getTargetName(element) {
    let name = null;
    if (element.hasAttribute('selectorName')) {
      name = element.getAttribute('selectorName');
    }
    if (element.hasAttribute('selectorname')) {
      name = element.getAttribute('selectorname');
    }
    if (element.hasAttribute('selector-name')) {
      name = element.getAttribute('selector-name');
    }
    return name;
  }

  // eslint-disable-next-line class-methods-use-this
  toggle(event) {
    const element = event.target;

    const targetName = ToggleButton.getTargetName(element);
    const formElement = element.closest('form');
    const targetElements = formElement.querySelectorAll(`input[name^="${targetName}"]`);
    let currentState = null;
    targetElements.forEach((targetElement) => {
      const checkbox = targetElement;
      if ('checked' in checkbox) {
        if (currentState === null) {
          currentState = checkbox.checked;
        }
        checkbox.checked = !currentState;
      }
    });
  }
}

window.addEventListener('load', () => {
  // eslint-disable-next-line no-unused-vars
  const toggleButton = new ToggleButton();
});
