export default class Autosubmit {
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
      // inputElement.setAttribute('auto-submit-value', inputElement.getAttribute('value'));
      // inputElement.addEventListener('change', call);
      // const callKey = (event) => this.submitOnMinimalChange(form, inputElement, event);
      // inputElement.addEventListener('keyup', callKey);
      // inputElement.addEventListener('input', callKey);
      inputElement.addEventListener('blur', (event) => this.submitOnChange(form, inputElement, event));
    }
  }

  addSelect(form, selectElement) {
    const call = (event) => this.submitOnElement(form, selectElement, event);
    selectElement.addEventListener('change', call);
  }

  /*
  submitOnMinimalChange(form, inputElement, event) {
    const orig = inputElement.getAttribute('auto-submit-value');
    const input = inputElement.value;
    const maxLength = Math.max(orig.length, input.length);
    let diffCount = 0;

    if (Math.abs(orig.length - input.length) >= 3) {
      this.submitOnElement(form, inputElement, event);
      return;
    }

    Array.from({ length: maxLength }).forEach((_, i) => {
      if (orig[i] !== input[i]) {
        diffCount += 1;
      }
      if (diffCount > 3) {
        this.submitOnElement(form, inputElement, event);
        return;
      }
    });
  } // */

  submitOnChange(form, inputElement, event) {
    // console.log(inputElement.value, inputElement.getAttribute('value'));
    if (inputElement.value && (inputElement.value !== inputElement.getAttribute('value'))) {
      this.submitOnElement(form, inputElement, event);
    }
  }

  submitOnElement(form, inputElement, event) {
    // console.log(inputElement.getAttribute('name'));

    // Ajax does not yet work (from the GT side)
    // var targetId = form.getAttribute('auto-submit-target-id');

    // var targetUrl = form.getAttribute('auto-submit-url');
    // var eClass = inputElement.getAttribute('class');
    //
    // console.log(targetId, targetUrl, eClass);
    // if (targetId && targetUrl) {
    //   if (! (eClass && eClass.includes('force'))) {
    //     // asynch class
    //     // console.log(form-serialize(from));
    //     var formData = new FormData(form);
    //     console.log(Object.fromEntries(formData));
    //
    //     var request = new XMLHttpRequest();
    //     request.addEventListener('load', (event) => {
    //       console.log(request.response);
    //       // document.querySelector(targetId).setHtml(request.response);
    //     });
    //     request.open('POST', targetUrl);
    //     request.send(FormData);
    //   }
    // }

    form.submit();
  }
}

window.addEventListener('load', () => {
  const autosubmit = new Autosubmit();
});
