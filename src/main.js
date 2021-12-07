import {render, RenderPosition, remove} from './utils/render.js';
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

const filmCards = Array.from({ length: CARD_COUNT }, generateFilmCard);
const commentItems = Array.from({ length: 4 }, generateCommentItem);
const filters = generateFilter(filmCards);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');


const createPopup = (cardData) => {
  let filmDetailsComponent = null;

  const closePopup = () => {
    remove(filmDetailsComponent);

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
  render(document.body, filmDetailsComponent, RenderPosition.BEFOREEND);

  document.body.classList.add('hide-overflow');
  document.addEventListener('keydown', onEscKeyDown);

  filmDetailsComponent.setCloseClickHandler(() => {
    closePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });
};

const renderFilmCard = (filmListElement, cardData) => {
  const filmCardComponent = new FilmCardView(cardData);

  render(filmListElement, filmCardComponent, RenderPosition.BEFOREEND);

  filmCardComponent.setClickHandler(() => {
    createPopup(cardData);
  });

};

const renderFilmLists = (listsContainer, cards) => {
  const filmsComponent = new FilmsView();

  render(listsContainer, filmsComponent, RenderPosition.BEFOREEND);

  if (cards.length === 0) {
    render(filmsComponent, new FilmsListView(FILM_LISTS.empty), RenderPosition.BEFOREEND);
  } else {
    const mainFilmsListComponent = new FilmsListView(FILM_LISTS.main);
    const topRatedComponent = new FilmsListView(FILM_LISTS.topRated);
    const mostCommentedComponent = new FilmsListView(FILM_LISTS.mostCommented);

    const mainFilmListContainerElement = mainFilmsListComponent.container;
    const topRatedContainerElement = topRatedComponent.container;
    const mostCommentedContainerElement = mostCommentedComponent.container;

    render(filmsComponent, mainFilmsListComponent, RenderPosition.BEFOREEND);
    render(filmsComponent, topRatedComponent, RenderPosition.BEFOREEND);
    render(filmsComponent, mostCommentedComponent, RenderPosition.BEFOREEND);

    cards
      .slice(0, Math.min(cards.length, CARD_COUNT_PER_STEP))
      .forEach((filmCard, i) => {
        renderFilmCard(mainFilmListContainerElement, filmCard);

        if (i < EXTRA_CARD_COUNT) {
          renderFilmCard(topRatedContainerElement, filmCard);
          renderFilmCard(mostCommentedContainerElement, filmCard);
        }
      });

    if (cards.length > CARD_COUNT_PER_STEP) {
      let renderedCardCount = CARD_COUNT_PER_STEP;

      const loadMoreComponent = new LoadMoreView();

      render(mainFilmsListComponent, loadMoreComponent, RenderPosition.BEFOREEND);

      loadMoreComponent.setClickHandler(() => {
        cards
          .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
          .forEach((card) => renderFilmCard(mainFilmListContainerElement, card));

        renderedCardCount += CARD_COUNT_PER_STEP;

        if (renderedCardCount >= cards.length) {
          remove(loadMoreComponent);
        }
      });
    }
  }
};

render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(filters), RenderPosition.BEFOREEND);

const footerStatsWrapElement = document.querySelector('.footer__statistics');
render(footerStatsWrapElement, new FooterStatsView(filmCards.length), RenderPosition.BEFOREEND);

renderFilmLists(siteMainElement, filmCards);
