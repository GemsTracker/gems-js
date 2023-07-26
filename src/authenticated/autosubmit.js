export default class Autosubmit {
  constructor() {
    this.init();
  }

  init() {
    const autosubmitForms = document.querySelectorAll('form.autosubmit, form.selected-autosubmit');

    autosubmitForms.forEach((form) => {
      const selective = this.isSelective(form);

      this.addSelect(form, selective);
      this.addInput(form, selective);
    });
  }

  addInput(form, selective = false) {
    let selector = 'input';
    if (selective) {
      selector = 'input.autosubmit';
    }
    const inputs = form.querySelectorAll(selector);
    inputs.forEach((input) => {
      // input.addEventListener('keyup', () => form.submit());
      // input.addEventListener('input', () => form.submit());
      input.addEventListener('change', () => form.submit());
    });
  }

  addSelect(form, selective = false) {
    let selector = 'select';
    if (selective) {
      selector = 'select.autosubmit';
    }
    const selects = form.querySelectorAll(selector);
    selects.forEach((select) => {
      select.addEventListener('change', () => form.submit());
    });
  }

  isSelective(form) {
    form.classList.contains('selected-autosubmit');
  }
}

window.addEventListener('load', () => {
  const autosubmit = new Autosubmit();
});
