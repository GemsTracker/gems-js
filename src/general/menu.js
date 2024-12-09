export default class Menu {
  #button = null;
  #menu = null;
  #backdrop = null;
  #showMenu = false;

  constructor() {
    this.init();

    this.#button = document.getElementById('menu-toggle');
    this.#menu = document.getElementById('menu');
    this.#backdrop = document.getElementById('backdrop');

    if (this.#menu !== null && this.#button !== null && this.#backdrop !== null) {
      this.#button.addEventListener('click', () => this.#toggle());
      this.#backdrop.addEventListener('click', () => this.#hide());
    }
  }

  init() {
    const menuContainers = document.querySelectorAll('#menu .container-link-item');

    menuContainers.forEach((container) => {
      container.addEventListener('click', (event) => {
        if (event.target.parentNode !== container) {
          return;
        }
        event.preventDefault();
        let submenuList = event.target.nextElementSibling;
        console.log(submenuList);
        while (submenuList && !submenuList.classList.contains('menu-children')) {
          submenuList = submenuList.nextElementSibling;
        }
        if (submenuList) {
          if (submenuList.classList.contains('closed')) {
            submenuList.classList.add('open');
            submenuList.classList.remove('closed');
            container.classList.add('open');
            container.classList.remove('closed');
          } else {
            submenuList.classList.add('closed');
            submenuList.classList.remove('open');
            container.classList.add('closed');
            container.classList.remove('open');
          }
        }
      });
    });
  }

  #toggle() {
    if (this.#showMenu) {
      this.#hide();
    } else {
      this.#show();
    }
  }

  #show() {
    this.#showMenu = true;
    this.#menu.classList.add('show-menu');
    this.#backdrop.classList.add('show');
  }

  #hide() {
    this.#showMenu = false;
    this.#menu.classList.remove('show-menu');
    this.#backdrop.classList.remove('show');
  }
}
window.addEventListener('load', () => {
  const menu = new Menu();
});
