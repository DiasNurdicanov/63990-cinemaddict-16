import {FILM_LISTS} from '../const.js';

import {render, RenderPosition, remove, replace, createElement} from '../utils/render.js';
import {updateItem} from '../utils/common.js'


import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view.js';
import LoadMoreView from '../view/load-more-button-view';
import FilmCardView from '../view/film-card-view';
import FilmDetailsView from '../view/film-details-view';
import SortView from '../view/sort-view';

const EXTRA_CARD_COUNT = 2;
const CARD_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #listsContainer = null;
  #cards = [];
  #commentsItems = [];
  #filmCards = new Map();
  #filmDetailsPopup = null;

  #renderedFilmCardsCount = CARD_COUNT_PER_STEP;

  #filmsComponent = new FilmsView();
  #sortComponent = new SortView();

  #mainFilmsListComponent = new FilmsListView(FILM_LISTS.main);
  #topRatedComponent = new FilmsListView(FILM_LISTS.topRated);
  #mostCommentedComponent = new FilmsListView(FILM_LISTS.mostCommented);
  #noFilmsComponent = new FilmsListView(FILM_LISTS.empty);
  #loadMoreButtonComponent = new LoadMoreView();

  constructor(listsContainer) {
    this.#listsContainer = listsContainer;
  }

  init = (cards, commentsItems) => {
    this.#cards = [...cards];
    this.#commentsItems = [...commentsItems];

    this.#renderSort();

    render(this.#listsContainer, this.#filmsComponent, RenderPosition.BEFOREEND);

    this.#renderFilms();
  }

  #renderSort = () => {
    render(this.#listsContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmCard = (cardData, filmListElement) => {
    const prevFilmCardComponent = this.#filmCards.get(cardData.id);

    if (prevFilmCardComponent && filmListElement && filmListElement !== prevFilmCardComponent.element.parentNode) {
      render(filmListElement, prevFilmCardComponent.createCopy(), RenderPosition.BEFOREEND);
      return;
    }

    const filmCardComponent = new FilmCardView(cardData);
    this.#filmCards.set(cardData.id, filmCardComponent);

    filmCardComponent.setClickHandler(() => {
      this.#createPopup(cardData);
    });

    filmCardComponent.setWatchlistClickHandler(() => {
      this.#filmCardUpdate({...cardData, isInWatchList: !cardData.isInWatchList});
    });

    filmCardComponent.setWatchedClickHandler(() => {
      this.#filmCardUpdate({...cardData, isWatched: !cardData.isWatched});
    });

    filmCardComponent.setFavoriteClickHandler(() => {
      this.#filmCardUpdate({...cardData, isFavorite: !cardData.isFavorite});
    });

    if (!prevFilmCardComponent) {
      render(filmListElement, filmCardComponent.createCopy(), RenderPosition.BEFOREEND);
      return;
    }

    if (!filmListElement) {
      prevFilmCardComponent.renderedCards.forEach((card) => {
        replace(filmCardComponent.createCopy(), card);
      });
    }

    remove(prevFilmCardComponent);
  }

  #filmCardUpdate = (updatedCardData) => {
    this.#cards = updateItem(this.#cards, updatedCardData);
    this.#renderFilmCard(updatedCardData);

    if (this.#filmDetailsPopup) {
      this.#createPopup(updatedCardData);
    }
  }

  #renderFilmCards = (from, to, filmListElement) => {
    this.#cards
      .slice(from, to)
      .forEach((filmCard) => this.#renderFilmCard(filmCard, filmListElement));
  }

  #renderNoFilms = () => {
    render(this.#listsContainer, this.#noFilmsComponent, RenderPosition.BEFOREEND);
  }

  #renderLoadMoreButton = () => {
    render(this.#mainFilmsListComponent, this.#loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderFilmCards(this.#renderedFilmCardsCount, this.#renderedFilmCardsCount + CARD_COUNT_PER_STEP, this.#mainFilmsListComponent.container);
    this.#renderedFilmCardsCount += CARD_COUNT_PER_STEP;

    if (this.#renderedFilmCardsCount >= this.#cards.length) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #createPopup = (cardData) => {
    this.#closePopup();

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    this.#filmDetailsPopup = new FilmDetailsView(cardData, this.#commentsItems);
    render(document.body, this.#filmDetailsPopup, RenderPosition.BEFOREEND);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);

    this.#filmDetailsPopup.setCloseClickHandler(() => {
      this.#closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    this.#filmDetailsPopup.setWatchlistClickHandler(() => {
      this.#filmCardUpdate({...cardData, isInWatchList: !cardData.isInWatchList});
    });

    this.#filmDetailsPopup.setWatchedClickHandler(() => {
      this.#filmCardUpdate({...cardData, isWatched: !cardData.isWatched});
    });

    this.#filmDetailsPopup.setFavoriteClickHandler(() => {
      this.#filmCardUpdate({...cardData, isFavorite: !cardData.isFavorite});
    });
  }

  #closePopup = () => {
    remove(this.#filmDetailsPopup);

    document.body.classList.remove('hide-overflow');
    this.#filmDetailsPopup = null;
  }

  #renderFilmLists = () => {
    render(this.#filmsComponent, this.#mainFilmsListComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent, this.#topRatedComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent, this.#mostCommentedComponent, RenderPosition.BEFOREEND);

    this.#renderFilmCards(0, Math.min(this.#cards.length, CARD_COUNT_PER_STEP), this.#mainFilmsListComponent.container);
    this.#renderFilmCards(0, EXTRA_CARD_COUNT, this.#topRatedComponent.container);
    this.#renderFilmCards(0, EXTRA_CARD_COUNT, this.#mostCommentedComponent.container);

    if (this.#cards.length > CARD_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }

  #renderFilms = () => {
    if (this.#cards.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderFilmLists();
  }
}
