import {renderElement, RenderPosition} from './render.js';
import {FILM_LISTS} from './const.js';

import SiteMenuView from './view/site-menu-view.js';
import ProfileView from './view/profile-view';
import FilmsView from './view/films-view';
import FilmsListView from './view/films-list-view.js';
import LoadMoreView from './view/load-more-button-view';
import FooterStatsView from './view/footer-stats-view';
import FilmCardView from './view/film-card-view';
import FilmDetailsView from './view/film-details-view';

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

const filmsComponent = new FilmsView();


const createPopup = (cardData) => {
  let filmDetailsComponent = null;

  const closePopup = () => {
    document.body.removeChild(filmDetailsComponent.element);
    document.body.classList.remove('hide-overflow');
    filmDetailsComponent = null;
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };


  filmDetailsComponent = new FilmDetailsView(cardData, commentItems);
  document.body.appendChild(filmDetailsComponent.element);
  document.body.classList.add('hide-overflow');
  document.addEventListener('keydown', onEscKeyDown);

  filmDetailsComponent.element.querySelector('.film-details__close-btn').addEventListener('click', (e) => {
    e.preventDefault();

    closePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });
};

const renderFilmCard = (filmListElement, cardData) => {
  const filmCardComponent = new FilmCardView(cardData);

  renderElement(filmListElement, filmCardComponent.element, RenderPosition.BEFOREEND);

  filmCardComponent.element.querySelector('.film-card__link').addEventListener('click', (e) => {
    e.preventDefault();
    createPopup(cardData);
  });

};

renderElement(siteHeaderElement, new ProfileView().element, RenderPosition.BEFOREEND);
renderElement(siteMainElement, new SiteMenuView(filters).element, RenderPosition.BEFOREEND);
renderElement(siteMainElement, filmsComponent.element, RenderPosition.BEFOREEND);

if (cards.length === 0) {
  renderElement(filmsComponent.element, new FilmsListView(FILM_LISTS.empty).element, RenderPosition.BEFOREEND);
} else {
  const mainFilmsListComponent = new FilmsListView(FILM_LISTS.main);
  const topRatedComponent = new FilmsListView(FILM_LISTS.topRated);
  const mostCommentedComponent = new FilmsListView(FILM_LISTS.mostCommented);

  const mainFilmListContainerElement = mainFilmsListComponent.element.querySelector('.films-list__container');
  const topRatedContainerElement = topRatedComponent.element.querySelector('.films-list__container');
  const mostCommentedContainerElement = mostCommentedComponent.element.querySelector('.films-list__container');

  renderElement(filmsComponent.element, mainFilmsListComponent.element, RenderPosition.BEFOREEND);
  renderElement(filmsComponent.element, topRatedComponent.element, RenderPosition.BEFOREEND);
  renderElement(filmsComponent.element, mostCommentedComponent.element, RenderPosition.BEFOREEND);

  for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
    renderFilmCard(topRatedContainerElement, cards[i]);
    renderFilmCard(mostCommentedContainerElement, cards[i]);
  }

  for (let i = 0; i < Math.min(cards.length, CARD_COUNT_PER_STEP); i++) {
    renderFilmCard(mainFilmListContainerElement, cards[i]);
  }

  if (cards.length > CARD_COUNT_PER_STEP) {
    let renderedCardCount = CARD_COUNT_PER_STEP;

    const loadMoreComponent = new LoadMoreView();

    renderElement(mainFilmsListComponent.element, loadMoreComponent.element, RenderPosition.BEFOREEND);

    loadMoreComponent.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      cards
        .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
        .forEach((card) => renderFilmCard(mainFilmListContainerElement, card));

      renderedCardCount += CARD_COUNT_PER_STEP;

      if (renderedCardCount >= cards.length) {
        loadMoreComponent.element.remove();
      }
    });
  }
}

const footerStatsWrapElement = document.querySelector('.footer__statistics');
renderElement(footerStatsWrapElement, new FooterStatsView(cards.length).element, RenderPosition.BEFOREEND);
