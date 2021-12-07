import AbstractView from './abstract-view.js';

const createFooterStatsTemplate = (count) => `<p>${count} movies inside</p>`;

export default class FooterStatsView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createFooterStatsTemplate(this.#count);
  }
}
