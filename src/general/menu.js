export default class Menu {
  #button = null;
  #menu = null;
  #backdrop = null;
  #showMenu = false;

  constructor() {
    window.addEventListener('load', () => {
      this.#button = document.getElementById('menu-toggle');
      this.#menu = document.getElementById('menu');
      this.#backdrop = document.getElementById('backdrop');

      if (this.#menu !== null && this.#button !== null && this.#backdrop !== null) {
        this.#button.addEventListener('click', () => this.#toggle());
        this.#backdrop.addEventListener('click', () => this.#hide());
      }
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
};

new Menu();