

import {createElement} from '../render.js';

export const createFilmsListTemplate = ({title, isTitleHidden, isExtra, isEmpty}) => (
  `<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
    <h2 class="films-list__title ${isTitleHidden ? 'visually-hidden' : ''}">${title}</h2>

    ${!isEmpty ? '<div class="films-list__container"></div>' : ''}
  </section>`
);

export default class FilmsListView {
  #element = null;
  #props = null;

  constructor(props) {
    this.#props = props;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsListTemplate(this.#props);
  }

  removeElement() {
    this.#element = null;
  }
}
