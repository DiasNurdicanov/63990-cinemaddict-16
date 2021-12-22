import {FILM_LISTS, SortType} from '../const.js';

import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import {sortByDate, sortByRating} from '../utils/common.js';


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

  #currentSortType = SortType.DEFAULT;
  #sourcedCards = [];

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

  init(cards, commentsItems) {
    this.#cards = [...cards];
    this.#sourcedCards = [...cards];
    this.#commentsItems = [...commentsItems];

    this._renderSort();

    render(this.#listsContainer, this.#filmsComponent, RenderPosition.BEFOREEND);

    this._renderFilms();
  }

  _renderFilmCard(cardData, filmListElement) {
    const prevFilmCardComponent = this.#filmCards.get(cardData.id);

    if (prevFilmCardComponent && filmListElement && filmListElement !== prevFilmCardComponent.element.parentNode) {
      render(filmListElement, prevFilmCardComponent.createCopy(), RenderPosition.BEFOREEND);
      return;
    }

    const filmCardComponent = new FilmCardView(cardData);
    this.#filmCards.set(cardData.id, filmCardComponent);

    filmCardComponent.setClickHandler(() => {
      this._createPopup(cardData);
    });

    filmCardComponent.setWatchlistClickHandler(() => {
      this._filmCardUpdate({...cardData, isInWatchList: !cardData.isInWatchList});
    });

    filmCardComponent.setWatchedClickHandler(() => {
      this._filmCardUpdate({...cardData, isWatched: !cardData.isWatched});
    });

    filmCardComponent.setFavoriteClickHandler(() => {
      this._filmCardUpdate({...cardData, isFavorite: !cardData.isFavorite});
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

  _filmCardUpdate(updatedCardData) {
    this.#cards = updateItem(this.#cards, updatedCardData);
    this.#sourcedCards = updateItem(this.#sourcedCards, updatedCardData);
    this._renderFilmCard(updatedCardData);

    if (this.#filmDetailsPopup) {
      this._createPopup(updatedCardData);
    }
  }

  _renderFilmCards(from, to, filmListElement) {
    this.#cards
      .slice(from, to)
      .forEach((filmCard) => this._renderFilmCard(filmCard, filmListElement));
  }

  _renderNoFilms() {
    render(this.#listsContainer, this.#noFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderLoadMoreButton() {
    render(this.#mainFilmsListComponent, this.#loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _handleLoadMoreButtonClick() {
    this._renderFilmCards(this.#renderedFilmCardsCount, this.#renderedFilmCardsCount + CARD_COUNT_PER_STEP, this.#mainFilmsListComponent.container);
    this.#renderedFilmCardsCount += CARD_COUNT_PER_STEP;

    if (this.#renderedFilmCardsCount >= this.#cards.length) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  _createPopup(cardData) {
    this._closePopup();

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this._closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    this.#filmDetailsPopup = new FilmDetailsView(cardData, this.#commentsItems);
    render(document.body, this.#filmDetailsPopup, RenderPosition.BEFOREEND);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);

    this.#filmDetailsPopup.setCloseClickHandler(() => {
      this._closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    this.#filmDetailsPopup.setWatchlistClickHandler(() => {
      this._filmCardUpdate({...cardData, isInWatchList: !cardData.isInWatchList});
    });

    this.#filmDetailsPopup.setWatchedClickHandler(() => {
      this._filmCardUpdate({...cardData, isWatched: !cardData.isWatched});
    });

    this.#filmDetailsPopup.setFavoriteClickHandler(() => {
      this._filmCardUpdate({...cardData, isFavorite: !cardData.isFavorite});
    });
  }

  _closePopup() {
    remove(this.#filmDetailsPopup);

    document.body.classList.remove('hide-overflow');
    this.#filmDetailsPopup = null;
  }

  _renderFilmLists() {
    render(this.#filmsComponent, this.#mainFilmsListComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent, this.#topRatedComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent, this.#mostCommentedComponent, RenderPosition.BEFOREEND);

    this._renderFilmCards(0, Math.min(this.#cards.length, CARD_COUNT_PER_STEP), this.#mainFilmsListComponent.container);
    this._renderFilmCards(0, EXTRA_CARD_COUNT, this.#topRatedComponent.container);
    this._renderFilmCards(0, EXTRA_CARD_COUNT, this.#mostCommentedComponent.container);

    if (this.#cards.length > CARD_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilms() {
    if (this.#cards.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmLists();
  }

  _handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this._sortCards(sortType);
    this._clearCardList();
    this._renderFilmLists();
  }

  _renderSort() {
    render(this.#listsContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _sortCards(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this.#cards.sort(sortByDate);
        break;
      case SortType.RATING:
        this.#cards.sort(sortByRating);
        break;
      default:
        this.#cards = [...this.#sourcedCards];
    }

    this.#currentSortType = sortType;
  }

  _clearCardList() {
    this.#filmCards.forEach((card) => {
      card.renderedCards.forEach((renderedCard) => renderedCard.remove());
      card.renderedCards.length = 0;
      remove(card);
    });
    this.#filmCards.clear();
    this.#renderedFilmCardsCount = CARD_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }
}
