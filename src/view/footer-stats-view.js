import {createElement} from '../render.js';

const createFooterStatsTemplate = (count) => `<p>${count} movies inside</p>`;

export default class FooterStatsView {
  #element = null;
  #count = null;

  constructor(count) {
    this.#count = count;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFooterStatsTemplate(this.#count);
  }

  removeElement() {
    this.#element = null;
  }
}
