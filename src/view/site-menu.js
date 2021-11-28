const createFilterItemTemplate = (filter, isActive) => {
  const {name, count, title} = filter;
  const itemClassName = isActive
    ? 'main-navigation__item main-navigation__item--active'
    : 'main-navigation__item';

  return (
    `<a href="#${name}" class="${itemClassName}">${title} ${!isActive ? `<span class="main-navigation__item-count">${count}</span>` : ''}</a>`
  );
};

export const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>`;
};

export const siteMenu = (filterItems) => (
  `<nav class="main-navigation">
    ${createFilterTemplate(filterItems)}
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>

  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`
);
