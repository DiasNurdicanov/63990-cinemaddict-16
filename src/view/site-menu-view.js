import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (filter, isActive) => {
  const {name, count, title} = filter;
  const itemClassName = isActive
    ? 'main-navigation__item main-navigation__item--active'
    : 'main-navigation__item';

  return (
    `<a href="#${name}" class="${itemClassName}">${title} ${!isActive ? `<span class="main-navigation__item-count">${count}</span>` : ''}</a>`
  );
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>`;
};

const createSiteMenuTemplate = (filterItems) => (
  `<nav class="main-navigation">
    ${createFilterTemplate(filterItems)}
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class SiteMenuView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createSiteMenuTemplate(this.#filters);
  }
}
