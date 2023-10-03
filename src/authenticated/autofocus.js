export default class AutoFocus {
    constructor() {
        this.init();
    }

    init() {
        var focusTracker = document.querySelector('input#auto_form_focus_tracker');
        var currentElement;

        if (focusTracker) {
            currentElement = focusTracker.getAttribute('value');
            // console.log(currentElement, focusTracker.getAttribute('name'));
        }

        if (! currentElement) {
            currentElement = document.querySelector('form input').getAttribute('id');
        }
        if (currentElement) {
            var current = document.querySelector('#' + currentElement);

            current.focus();
            if (current.scrollIntoView) {
                current.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
            try {
                if (current.select) {
                    current.select();
                }
            } catch (ex) {}
        }

        if (focusTracker) {
            document.querySelectorAll('form input, form select, form textarea').forEach((inputElement) => {
                if ('submit' !== inputElement.getAttribute('type')) {
                    this.addTracker(inputElement, focusTracker);
                }
            });
        }
    }

    addTracker(currentElement, focusTracker) {
        currentElement.addEventListener('focus', function () {
            console.log(currentElement.getAttribute('id'));
            focusTracker.setAttribute('value', currentElement.getAttribute('id'));
        });
    }
}

window.addEventListener('load', () => {
    const autoFocus = new AutoFocus();
});
