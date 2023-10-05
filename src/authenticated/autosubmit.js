import {getAttribute} from "eslint-plugin-vue/lib/utils";

export default class Autosubmit {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('form').forEach((form) => {
      if (form.getAttribute('class').includes('auto-submit')) {
        // console.log(form.getAttribute('class'));
        form.querySelectorAll('input').forEach((inputElement) => {this.addInput(form, inputElement);});
        form.querySelectorAll('select').forEach((selectElement) => {this.addSelect(form, selectElement);});
      } else {
        form.querySelectorAll('input.auto-submit').forEach((inputElement) => {this.addInput(form, inputElement);});
        form.querySelectorAll('select.auto-submit').forEach((selectElement) => {this.addSelect(form, selectElement);});
      }
    });
  }

  addInput(form, inputElement) {
    var eType = inputElement.getAttribute('eType');
    // console.log(inputElement.getAttribute('name'), inputElement.getAttribute('eType'));

    if (['hidden'].includes(eType)) {
      return;
    }

    var eClass = inputElement.getAttribute('class');
    if (eClass && eClass.includes('blur')) {
      inputElement.addEventListener('blur', (event) => this.submitOnChange(form, inputElement, event));
      return;
    }

    var call = (event) => this.submitOnElement(form, inputElement, event);
    if (['checkbos', 'radio'].includes(eType)) {
      inputElement.addEventListener('click', call);
      return;
    }
    inputElement.addEventListener('keyup', call);
    inputElement.addEventListener('input', call);
    // inputElement.addEventListener('change', call);
  }

  addSelect(form, selectElement){
    var call = (event) => this.submitOnElement(form, selectElement, event);
    selectElement.addEventListener('change', call);
  }

  submitOnChange(form, inputElement, event) {
    // console.log(inputElement.value, inputElement.getAttribute('value'));
    if (inputElement.value && (inputElement.value != inputElement.getAttribute('value'))) {
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
