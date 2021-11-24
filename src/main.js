export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

import {siteMenu} from './view/site-menu.js';
import {profile} from './view/profile';

import {films} from './view/films';
import {filmCard} from './view/film-card';
import {loadMoreButton} from './view/load-more-button';

import {topRated} from './view/top-rated';
import {mostCommented} from './view/most-commented';

const CARD_COUNT = 5;
const EXTRA_CARD_COUNT = 2;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

renderTemplate(siteHeaderElement, profile(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, siteMenu(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, films(), RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films');
const mainFilmListElement = siteMainElement.querySelector('.films-list');
const mainFilmListContainerElement = filmsElement.querySelector('.films-list__container');

for (let i = 0; i < CARD_COUNT; i++) {
  renderTemplate(mainFilmListContainerElement, filmCard(), RenderPosition.BEFOREEND);
}

renderTemplate(mainFilmListElement, loadMoreButton(), RenderPosition.BEFOREEND);
renderTemplate(filmsElement, topRated(), RenderPosition.BEFOREEND);
renderTemplate(filmsElement, mostCommented(), RenderPosition.BEFOREEND);

const topRatedElement = siteMainElement.querySelector('.films-list--extra');
const topRatedContainerElement = topRatedElement.querySelector('.films-list__container');

const mostCommentedElement = siteMainElement.querySelector('.films-list--extra:last-child');
const mostCommentedContainerElement = mostCommentedElement.querySelector('.films-list__container');

for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
  renderTemplate(topRatedContainerElement, filmCard(), RenderPosition.BEFOREEND);
  renderTemplate(mostCommentedContainerElement, filmCard(), RenderPosition.BEFOREEND);
}


