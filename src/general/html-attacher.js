
export default class HtmlAttacher {
    static #observers = [];
    static #loaded = false;

    static registerObserver(observer) {
        HtmlAttacher.#observers.push(observer);

        if (this.#loaded) {
            // Call init() in separate execution context
            setTimeout(() => observer.init(document.body));
        }
    }

    static onload() {
        this.#loaded = true;

        HtmlAttacher.attachTo(document.body);
    }

    /**
     * @param {Node} element
     */
    static attachTo(element) {
        for (const observer of HtmlAttacher.#observers) {
            // Call init() in separate execution context
            setTimeout(() => observer.init(element));
        }
    }
}
