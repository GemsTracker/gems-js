import HtmlAttacher from "../general/html-attacher";

export default class Autosubmit {
  init(root) {
    const autosubmitForms = root.querySelectorAll('form.autosubmit, form.selected-autosubmit');

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
      input.addEventListener('keyup', () => this.submit(form));
      input.addEventListener('input', () => this.submit(form));
      input.addEventListener('change', () => this.submit(form));
    });
  }

  addSelect(form, selective = false) {
    let selector = 'select';
    if (selective) {
      selector = 'select.autosubmit';
    }
    const selects = form.querySelectorAll(selector);
    selects.forEach((select) => {
      select.addEventListener('change', () => this.submit(form));
    });
  }

  isSelective(form) {
    return form.classList.contains('selected-autosubmit');
  }

  submit(form) {
    if (form.getAttribute('data-autosubmit-inplace')) {
      this.submitInPlace(form);
    } else {
      form.submit();
    }
  }

  submitInPlace(form) {
    const submitUrl = form.getAttribute('data-autosubmit-url') || window.location.href;

    let target;
    if (form.getAttribute('data-autosubmit-target')) {
      target = document.querySelector(form.getAttribute('data-autosubmit-target'));
    } else {
      target = form;
    }

    fetch(submitUrl, {
      method: 'post',
      body: new FormData(form),
      headers: {
        'X-Content-Only' : 'true',
      },
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error();
          }

          return response.text();
        })
        .then((html) => {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = html;
          const replacement = wrapper.firstChild;

          target.replaceWith(replacement);
          HtmlAttacher.attachTo(replacement);
        });
  }
}
