/**
 * @param {MouseEvent} el
 */
export default function fakeSubmitButtonHandler(el) {
    /** @var {HTMLButtonElement} */
    const button = el.currentTarget;

    const targetName = button.dataset.targetName;
    const targetValue = button.dataset.targetValue;

    let value;
    if (targetValue) {
        /** @var {HTMLInputElement} */
        const valueSource = document.getElementsByName(targetValue)[0];
        value = valueSource.value;
    } else {
        value = button.innerText
    }

    /** @var {HTMLInputElement} */
    const hiddenInput = document.getElementsByName(targetName)[0];
    hiddenInput.value = value;

    hiddenInput.form.submit();
}

window.addEventListener('load', () => {
    document.querySelectorAll('.btn.fake-submit-button[type="button"]')
        .forEach((el) => el.addEventListener('click', fakeSubmitButtonHandler));
});
