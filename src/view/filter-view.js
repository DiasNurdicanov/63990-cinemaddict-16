import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {name, count, title} = filter;
  const isActive = name.toLowerCase() === currentFilterType;
  const itemClassName = isActive
    ? 'main-navigation__item main-navigation__item--active'
    : 'main-navigation__item';

  return (
    `<a
      href="#${name}"
      class="${itemClassName}"
      data-filter-type="${name}"
    >
      ${title}
      ${name !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ''}
    </a>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>`;
};

export default class SiteMenuView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.closest('.main-navigation__item').dataset.filterType);
  }
}
