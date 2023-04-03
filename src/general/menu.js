export default class Menu {
  init(root) {
    const menuContainers = root.querySelectorAll('#menu .container-link-item');

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
}
