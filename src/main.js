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
import {filmDetails} from './view/film-details';
import {footerStats} from './view/footer-stats';

import {generateFilmCard} from './mock/film-card';
import {generateCommentItem} from './mock/comment-item';
import {generateFilter} from './mock/filter.js';

const CARD_COUNT = 20;
const EXTRA_CARD_COUNT = 2;
const CARD_COUNT_PER_STEP = 5;

const cards = Array.from({ length: CARD_COUNT }, generateFilmCard);
const commentItems = Array.from({ length: 4 }, generateCommentItem);
const filters = generateFilter(cards);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

renderTemplate(siteHeaderElement, profile(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, siteMenu(filters), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, films(), RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films');
const mainFilmListElement = siteMainElement.querySelector('.films-list');
const mainFilmListContainerElement = filmsElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(cards.length, CARD_COUNT_PER_STEP); i++) {
  renderTemplate(mainFilmListContainerElement, filmCard(cards[i]), RenderPosition.BEFOREEND);
}

renderTemplate(filmsElement, topRated(), RenderPosition.BEFOREEND);
renderTemplate(filmsElement, mostCommented(), RenderPosition.BEFOREEND);

const topRatedElement = siteMainElement.querySelector('.films-list--extra');
const topRatedContainerElement = topRatedElement.querySelector('.films-list__container');

const mostCommentedElement = siteMainElement.querySelector('.films-list--extra:last-child');
const mostCommentedContainerElement = mostCommentedElement.querySelector('.films-list__container');

for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
  renderTemplate(topRatedContainerElement, filmCard(cards[i]), RenderPosition.BEFOREEND);
  renderTemplate(mostCommentedContainerElement, filmCard(cards[i]), RenderPosition.BEFOREEND);
}

const siteFooterElement = document.querySelector('.footer');
const footerStatsWrapElement = document.querySelector('.footer__statistics');

const firstCard = document.querySelector('.film-card');

firstCard.addEventListener('click', () => {
  renderTemplate(siteFooterElement, filmDetails(cards[0], commentItems), RenderPosition.AFTEREND);
});

renderTemplate(footerStatsWrapElement, footerStats(cards.length), RenderPosition.BEFOREEND);

if (cards.length > CARD_COUNT_PER_STEP) {
  let renderedTaskCount = CARD_COUNT_PER_STEP;

  renderTemplate(mainFilmListElement, loadMoreButton(), RenderPosition.BEFOREEND);

  const loadMoreElement = mainFilmListElement.querySelector('.films-list__show-more');

  loadMoreElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    cards
      .slice(renderedTaskCount, renderedTaskCount + CARD_COUNT_PER_STEP)
      .forEach((task) => renderTemplate(mainFilmListContainerElement, filmCard(task), RenderPosition.BEFOREEND));

    renderedTaskCount += CARD_COUNT_PER_STEP;

    if (renderedTaskCount >= cards.length) {
      loadMoreElement.remove();
    }
  });
}
