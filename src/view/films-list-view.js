

import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';

const NoTasksTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

export const createFilmsListTemplate = ({title, isTitleHidden, isExtra, isEmpty}, filterType) => {
  const noTaskTextValue = NoTasksTextType[filterType];

  return `<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
    <h2 class="films-list__title ${isTitleHidden ? 'visually-hidden' : ''}">${isEmpty ? noTaskTextValue : title}</h2>

    ${!isEmpty ? '<div class="films-list__container"></div>' : ''}
  </section>`
};

export default class FilmsListView extends AbstractView {
  #props = null;
  #container = null;
  #filterType = FilterType.ALL;

  constructor(props, filterType) {
    super();
    this.#props = props;
    this.#filterType = filterType;
  }

  get template() {
    return createFilmsListTemplate(this.#props, this.#filterType);
  }

  get container() {
    return this.element.querySelector('.films-list__container');
  }
}
