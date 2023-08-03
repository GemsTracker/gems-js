export default class OnOfEdit {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('input.on-off-edit').forEach((element) => {
            var val = element.getAttribute('value');
            var tval = element.getAttribute('onoffeditvalue');

            // console.log(val, tval);
            if (val == tval) {
                this.addEditOff(element);
            } else {
                this.addEditOn(element);
            }
            if (element.getAttribute('checked')) {
                element.click();
            }
        });
    }

    addEditOff(targetElement) {
        targetElement.addEventListener('click', this.editOn);
    }

    addEditOn(targetElement) {
        targetElement.addEventListener('click', this.editOff);
    }

    static getTargetName(element) {
        let name = null;
        if (element.hasAttribute('onoffeditfor')) {
            name = element.getAttribute('onoffeditfor');
        }
        console.log(name);
        return name;
    }

    // eslint-disable-next-line class-methods-use-this
    editOff(event) {
        const element = event.target;

        const targetName = OnOfEdit.getTargetName(element);
        const formElement = element.closest('form');
        const targetElements = formElement.querySelectorAll(`input[name="${targetName}"]`);
        targetElements.forEach((targetElement) => {
            // console.log(targetElement);
            targetElement.setAttribute('readonly', 'readonly');
        });
        const targetSelects = formElement.querySelectorAll(`select[name="${targetName}"]`);
        targetSelects.forEach((targetSelect) => {
            // console.log(targetElement);
            targetSelect.setAttribute('disabled', 'disabled');
        });
    }

    // eslint-disable-next-line class-methods-use-this
    editOn(event) {
        const element = event.target;

        const targetName = OnOfEdit.getTargetName(element);
        const formElement = element.closest('form');
        const targetElements = formElement.querySelectorAll(`input[name="${targetName}"]`);
        targetElements.forEach((targetElement) => {
            // console.log(targetElement);
            targetElement.removeAttribute('readonly');
        });
        const targetSelects = formElement.querySelectorAll(`select[name="${targetName}"]`);
        targetSelects.forEach((targetSelect) => {
            // console.log(targetElement);
            targetSelect.removeAttribute('disabled');
        });
    }
}

window.addEventListener('load', () => {
    // eslint-disable-next-line no-unused-vars
    const onOffEdit = new OnOfEdit();
});
