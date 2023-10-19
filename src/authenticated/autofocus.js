export default class AutoFocus {
  constructor() {
    this.init();
  }

  init() {
    const focusTracker = document.querySelector('input#auto_form_focus_tracker');
    let currentElement;

    if (focusTracker) {
      currentElement = focusTracker.getAttribute('value');
      // console.log(currentElement, focusTracker.getAttribute('name'));
    }

    if (!currentElement) {
      const firstInput = document.querySelector('form input');
      if (firstInput) {
        currentElement = firstInput.getAttribute('id');
      }
    }
    if (currentElement) {
      const current = document.querySelector(`#${currentElement}`);

      current.focus();
      if (current.scrollIntoView) {
        current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      try {
        if (current.select) {
          current.select();
        }
      } catch (ex) {
        // do nothing
      }
    }

    if (focusTracker) {
      document.querySelectorAll('form input, form select, form textarea').forEach((inputElement) => {
        if (inputElement.getAttribute('type') !== 'submit') {
          this.addTracker(inputElement, focusTracker);
        }
      });
    }
  }

  addTracker(currentElement, focusTracker) {
    currentElement.addEventListener('focus', () => {
      // console.log(currentElement.getAttribute('id'));
      focusTracker.setAttribute('value', currentElement.getAttribute('id'));
    });
  }
}

window.addEventListener('load', () => {
  const autoFocus = new AutoFocus();
});
