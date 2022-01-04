import {FILM_LISTS, SortType, UserAction, UpdateType, FilterType} from '../const.js';

import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {sortByDate, sortByRating} from '../utils/common.js';
import {filter} from '../utils/filter.js';


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
  #filmsModel = null;
  #commentsModel = [];
  #filterModel = null;

  #filmCards = new Map();
  #filmDetailsPopup = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  #renderedFilmCardsCount = CARD_COUNT_PER_STEP;

  #filmsComponent = new FilmsView();

  #mainFilmsListComponent = null;
  #topRatedComponent = new FilmsListView(FILM_LISTS.topRated);
  #mostCommentedComponent = new FilmsListView(FILM_LISTS.mostCommented);
  #noFilmsComponent = null;

  #sortComponent = null;
  #loadMoreButtonComponent = null;

  constructor(listsContainer, filmsModel, commentsModel, filterModel) {
    this.#listsContainer = listsContainer;

    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this._handleModelEvent);
    this.#filterModel.addObserver(this._handleModelEvent);
  }

  get cardsData() {
    this.#filterType = this.#filterModel.filter;
    const cards = this.#filmsModel.cardsData;
    const filteredCards = filter[this.#filterType](cards);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredCards.sort(sortByDate);
      case SortType.RATING:
        return filteredCards.sort(sortByRating);
    }

    return filteredCards;
  }

  get commentItems() {
    return this.#commentsModel.commentItems;
  }

  init() {
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
      this._handleViewAction(UserAction.UPDATE_CARD, UpdateType.MINOR, {...cardData, isInWatchList: !cardData.isInWatchList});
    });

    filmCardComponent.setWatchedClickHandler(() => {
      this._handleViewAction(UserAction.UPDATE_CARD, UpdateType.MINOR, {...cardData, isWatched: !cardData.isWatched});
    });

    filmCardComponent.setFavoriteClickHandler(() => {
      this._handleViewAction(UserAction.UPDATE_CARD, UpdateType.MINOR, {...cardData, isFavorite: !cardData.isFavorite});
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

  _renderFilmCards(cardsData, filmListElement) {
    cardsData.forEach((filmCard) => this._renderFilmCard(filmCard, filmListElement));
  }

  _renderNoFilms() {
    this.#noFilmsComponent = new FilmsListView(FILM_LISTS.empty, this.#filterType);
    render(this.#filmsComponent, this.#noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoadMoreButton() {
    this.#loadMoreButtonComponent = new LoadMoreView();
    this.#loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);

    render(this.#mainFilmsListComponent, this.#loadMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _handleLoadMoreButtonClick = () => {
    const cardsCount = this.cardsData.length;
    const newRendredCardsCount = Math.min(cardsCount, this.#renderedFilmCardsCount + CARD_COUNT_PER_STEP);
    const cards = this.cardsData.slice(this.#renderedFilmCardsCount, newRendredCardsCount);

    this._renderFilmCards(cards, this.#mainFilmsListComponent.container);
    this.#renderedFilmCardsCount = newRendredCardsCount;

    if (this.#renderedFilmCardsCount >= cardsCount) {
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

    this.#filmDetailsPopup = new FilmDetailsView(cardData, this.commentItems);
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
    const cardsCount = this.cardsData.length;
    const cards = this.cardsData.slice(0, Math.min(cardsCount, this.#renderedFilmCardsCount));
    const extraCards = this.cardsData.slice(0, EXTRA_CARD_COUNT);

    this.#mainFilmsListComponent = new FilmsListView(FILM_LISTS.main);

    render(this.#filmsComponent, this.#mainFilmsListComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent, this.#topRatedComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent, this.#mostCommentedComponent, RenderPosition.BEFOREEND);

    this._renderFilmCards(cards, this.#mainFilmsListComponent.container);
    this._renderFilmCards(extraCards, this.#topRatedComponent.container);
    this._renderFilmCards(extraCards, this.#mostCommentedComponent.container);

    if (this.cardsData.length > this.#renderedFilmCardsCount) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilms() {

    const cards = this.cardsData;
    const cardsCount = cards.length;

    if (cardsCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmLists();
  }

  _handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this._clearCardList();
    this._renderFilmLists();
  }

  _renderSort() {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this.#listsContainer, this.#sortComponent, RenderPosition.BEFOREEND);
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

  _handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this.#filmsModel.updateCard(updateType, update);
        break;
    }
  }

  _handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this._renderFilmCard(data);

        if (this.#filmDetailsPopup) {
          this._createPopup(data);
        }
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderFilms();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedCardCount: true, resetSortType: true});
        this._renderFilms();
        break;
    }
  }

  _clearBoard = ({resetRenderedCardCount = false, resetSortType = false} = {}) => {
    const cardsCount = this.cardsData.length;

    this.#filmCards.forEach((card) => card.destroy());
    this.#filmCards.clear();

    remove(this.#mainFilmsListComponent);
    remove(this.#loadMoreButtonComponent);
    remove(this.#sortComponent);

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetRenderedCardCount) {
      this.#renderedFilmCardsCount = CARD_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCardsCount = Math.min(cardsCount, this.#renderedFilmCardsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }
}
