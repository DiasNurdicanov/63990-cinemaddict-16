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

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING'
};

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

  #loadingComponent = new FilmsListView(FILM_LISTS.loading);;
  #isLoading = true;

  constructor(listsContainer, filmsModel, commentsModel, filterModel) {
    this.#listsContainer = listsContainer;

    this.#filmsModel = filmsModel;

    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
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
    this.#filmsModel.addObserver(this._handleModelEvent);
    this.#filterModel.addObserver(this._handleModelEvent);
    this.#commentsModel.addObserver(this._handleModelEvent);

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
      this._handleViewAction({
        actionType: UserAction.UPDATE_CARD,
        updateType: UpdateType.MINOR,
        cardData: {...cardData, isInWatchList: !cardData.isInWatchList}
      });
    });

    filmCardComponent.setWatchedClickHandler(() => {
      this._handleViewAction({
        actionType: UserAction.UPDATE_CARD,
        updateType: UpdateType.MINOR,
        cardData: {...cardData, isWatched: !cardData.isWatched}
      });
    });

    filmCardComponent.setFavoriteClickHandler(() => {
      this._handleViewAction({
        actionType: UserAction.UPDATE_CARD,
        updateType: UpdateType.MINOR,
        cardData: {...cardData, isFavorite: !cardData.isFavorite}
      });
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

    const commentItems = this.#commentsModel.getСommentItems(cardData.id);

    this.#filmDetailsPopup = new FilmDetailsView(cardData, commentItems);
    render(document.body, this.#filmDetailsPopup, RenderPosition.BEFOREEND);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);

    this.#filmDetailsPopup.setCloseClickHandler(() => {
      this._closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    this.#filmDetailsPopup.setWatchlistClickHandler(() => {
      this._handleViewAction({
        actionType: UserAction.UPDATE_CARD,
        updateType: UpdateType.PATCH,
        cardData: {...cardData, isInWatchList: !cardData.isInWatchList}
      });
    });

    this.#filmDetailsPopup.setWatchedClickHandler(() => {
      this._handleViewAction({
        actionType: UserAction.UPDATE_CARD,
        updateType: UpdateType.PATCH,
        cardData: {...cardData, isWatched: !cardData.isWatched}
      });
    });

    this.#filmDetailsPopup.setFavoriteClickHandler(() => {
      this._handleViewAction({
        actionType: UserAction.UPDATE_CARD,
        updateType: UpdateType.PATCH,
        cardData: {...cardData, isFavorite: !cardData.isFavorite}
      });
    });

    this.#filmDetailsPopup.setDeleteClickHandler((update) => {
      this._handleViewAction({
        actionType: UserAction.DELETE_COMMENT,
        updateType: UpdateType.LOADED_COMMENTS,
        commentData: update
      });
    });

    this.#filmDetailsPopup.setFormSubmitHandler((update) => {
      this._handleViewAction({
        actionType: UserAction.ADD_COMMENT,
        updateType: UpdateType.LOADED_COMMENTS,
        commentData: update,
        cardId: cardData.id
      });
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
    if (this.#isLoading) {
      this._renderLoading();
      return;
    }

    const cards = this.cardsData;
    const cardsCount = cards.length;

    if (cardsCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderFilmLists();
  }

  _handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this._clearBoard();
    this._renderFilms();
  }

  _renderSort() {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this.#filmsComponent, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  setPopupState(state, id) {
    switch (state) {
      case State.SAVING:
        this.#filmDetailsPopup.updateData({
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#filmDetailsPopup.updateData({
          isDeleting: true,
          deletingCommentId: id
        });
        break;
      case State.ABORTING:
        this.#filmDetailsPopup.abort(id);
        break;
    }
  }

  _handleViewAction = async ({actionType, updateType, cardData, commentData, cardId}) => {
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this.#filmsModel.updateCard(updateType, cardData);
        break;
      case UserAction.DELETE_COMMENT:
        this.setPopupState(State.DELETING, commentData.id);

        try {
          await this.#commentsModel.deleteComment(updateType, commentData);
        } catch(err) {
          this.setPopupState(State.ABORTING, commentData.id);
        }
        break;
      case UserAction.ADD_COMMENT:
        this.setPopupState(State.SAVING);

        try {
          await this.#commentsModel.addComment(updateType, commentData, cardId);
        } catch(err) {
          this.setPopupState(State.ABORTING);
        }
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this._renderFilms();
        break;
      case UpdateType.LOADED_COMMENTS:
        this.#filmDetailsPopup.updateComments(data);
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
    remove(this.#loadingComponent);

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

  destroy() {
    this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});

    remove(this.#filmsComponent);
    remove(this.#sortComponent);

    this.#filmsModel.removeObserver(this._handleModelEvent);
    this.#filterModel.removeObserver(this._handleModelEvent);
    this.#commentsModel.removeObserver(this._handleModelEvent);
  }

  _renderLoading() {
    render(this.#filmsComponent, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

}
