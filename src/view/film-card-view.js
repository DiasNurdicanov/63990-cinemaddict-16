import {getYearFromDate, convertTime} from '../utils/common.js';
import AbstractView from './abstract-view.js';
import {createElement} from '../utils/render.js';

const createFilmCardTemplate = (filmData = {}) => {
  const {
    title,
    rating,
    description,
    comments = [],
    isInWatchList = false,
    isWatched = false,
    isFavorite = false,
    poster,
    additionalInfo,
  } = filmData;

  const MAX_DESCRIPTION_LENGTH = 140;

  const {genres, releaseYear, runtime} = additionalInfo;
  const genre = genres[0];

  const watchListClassName = isInWatchList
    ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item--add-to-watchlist';

  const watchedClassName = isWatched
    ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item--mark-as-watched';

  const favoriteClassName = isFavorite
    ? 'film-card__controls-item--favorite film-card__controls-item--active'
    : 'film-card__controls-item--favorite';

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getYearFromDate(releaseYear)}</span>
        <span class="film-card__duration">${convertTime(runtime)}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description.length > MAX_DESCRIPTION_LENGTH ? `${description.substr(0, MAX_DESCRIPTION_LENGTH - 1)}…` : description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${watchListClassName}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item ${watchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView {
  #card = null;
  #renderedCards = [];

  constructor(card) {
    super();
    this.#card = card;
  }

  get template() {
    return createFilmCardTemplate(this.#card);
  }

  createCopy() {
    const copy = createElement(this.template);
    copy.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
    copy.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
    copy.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
    copy.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);

    this.#renderedCards.push(copy);
    return copy;
  }

  get renderedCards() {
    return this.#renderedCards;
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }


  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }


  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }


  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
