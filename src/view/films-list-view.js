

import AbstractView from './abstract-view.js';

export const createFilmsListTemplate = ({title, isTitleHidden, isExtra, isEmpty}) => (
  `<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
    <h2 class="films-list__title ${isTitleHidden ? 'visually-hidden' : ''}">${title}</h2>

    ${!isEmpty ? '<div class="films-list__container"></div>' : ''}
  </section>`
);

export default class FilmsListView extends AbstractView {
  #props = null;
  #container = null;

  constructor(props) {
    super();
    this.#props = props;
  }

  get template() {
    return createFilmsListTemplate(this.#props);
  }

  get container() {
    return this.element.querySelector('.films-list__container');
  }
}
