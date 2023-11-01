export default class OnBehave {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('.windowCloseButton').forEach((element) => {
      element.addEventListener('click', this.closeWindow);
    });
    document.querySelectorAll('.windowPrintButton').forEach((element) => {
      element.addEventListener('click', this.printWindow);
    });
    document.querySelectorAll('a.newWindowOnClick').forEach((element) => {
      const targetId = element.getAttribute('gt-target-id');
      if (targetId) {
        element.setAttribute('target', targetId);
      } else {
        element.setAttribute('target', '_blank');
      }
    });
  }

  closeWindow() {
    window.close();
  }

  printWindow() {
    window.print();
  }
}

window.addEventListener('load', () => {
  // eslint-disable-next-line no-unused-vars
  const onBehave = new OnBehave();
});
