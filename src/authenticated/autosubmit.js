export default class Autosubmit {
  #newRequest = false;

  #request = null;

  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('form').forEach((form) => {
      if (form.getAttribute('class').includes('auto-submit')) {
        // console.log(form.getAttribute('class'));
        form.querySelectorAll('input').forEach((inputElement) => { this.addInput(form, inputElement); });
        form.querySelectorAll('select').forEach((selectElement) => { this.addSelect(form, selectElement); });
      } else {
        form.querySelectorAll('input.auto-submit').forEach((inputElement) => { this.addInput(form, inputElement); });
        form.querySelectorAll('select.auto-submit').forEach((selectElement) => { this.addSelect(form, selectElement); });
      }
    });
  }

  addInput(form, inputElement) {
    const eType = inputElement.getAttribute('type');
    const targetId = form.getAttribute('auto-submit-target');
    const targetUrl = form.getAttribute('auto-submit-url');
    // console.log(inputElement.getAttribute('name'), inputElement.getAttribute('eType'));

    if (['hidden', 'submit'].includes(eType)) {
      return;
    }

    const eClass = inputElement.getAttribute('class');
    if (eClass && eClass.includes('blur')) {
      inputElement.addEventListener('blur', (event) => this.submitOnChange(form, inputElement, event));
      return;
    }

    const call = (event) => this.submitOnElement(form, inputElement, event);
    if (['checkbox', 'radio'].includes(eType)) {
      inputElement.addEventListener('click', call);
      return;
    }

    if (['text'].includes(eType)) {
      if (targetId && targetUrl) {
        inputElement.addEventListener('input', (event) => this.submitOnTextChange(form, inputElement, event));

      } else {
        inputElement.addEventListener('blur', (event) => this.submitOnChange(form, inputElement, event));
      }
    }
  }

  addSelect(form, selectElement) {
    const call = (event) => this.submitOnElement(form, selectElement, event);
    selectElement.addEventListener('change', call);
  }

  submitOnChange(form, inputElement, event) {
    // console.log(inputElement.value, inputElement.getAttribute('value'));
    if (inputElement.value && (inputElement.value !== inputElement.getAttribute('value'))) {
      this.submitOnElement(form, inputElement, event);
    }
  }

  submitOnTextChange(form, inputElement, event) {
    // console.log(inputElement.value, inputElement.getAttribute('value'));
    // Option for extra filtering, but decided this is unpractical
    if (inputElement.value !== inputElement.getAttribute('value')) {
      this.submitOnElement(form, inputElement, event);
    }
  }

  submitOnElement(form, inputElement, event) {
    const formData = new FormData(form);
    const targetId = form.getAttribute('auto-submit-target');
    const targetReplace = document.getElementById(targetId);
    const targetUrl = form.getAttribute('auto-submit-url');

    if (inputElement.getAttribute('class') && inputElement.getAttribute('class').includes('auto-submit-force')) {
      form.submit();
      return;
    }
    // console.log(inputElement.getAttribute('name'));

    // console.log(targetId, targetUrl);
    if (targetId && targetUrl && targetReplace) {
      // asynch class
      // console.log(Object.fromEntries(formData), formData);

      if (this.#request != null) {
        this.#newRequest = true;
        // No two queries at the same time
        // console.log('double dipped');
        return;
      }
      this.#request = new XMLHttpRequest();
      this.#request.responseType = 'document';
      this.#request.addEventListener('load', (event) => {
        const response = this.#request.response;
        const newHtml = response.getElementById(targetId);
        // console.log(targetId, request.response);

        // console.log(newHtml, targetReplace);
        if (newHtml) {
          // console.log(htmlOutput);
          targetReplace.setHTMLUnsafe(newHtml.innerHTML);
        }

        this.#request = null;
        if (this.#newRequest) {
          this.#newRequest = false;
          this.submitOnElement(form, inputElement, event);
        }
      });
      this.#request.addEventListener('error', (event) => {
        console.log(event.error);
        // document.querySelector(targetId).setHtml(request.response);
        this.#request = null;
      });
      this.#request.open('POST', targetUrl);
      this.#request.send(formData);
      return;
    }

    form.submit();
  }
}

window.addEventListener('load', () => {
  const autosubmit = new Autosubmit();
});
