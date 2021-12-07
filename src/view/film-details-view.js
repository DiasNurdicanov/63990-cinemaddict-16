import {EMOJIS} from '../const.js';
import {capitalizeFirstLetter, convertTime, humanizeDate} from '../utils/common.js';
import AbstractView from './abstract-view.js';

const BLANK_CARD = {
  title: '',
  rating: null,
  poster: '',
  description: '',
  comments: [],
  isInWatchList: false,
  isWatched: false,
  isFavorite: false,
  additionalInfo: {}
};

const getAdditionalInfoValue = (term, value) => {
  switch(term) {
    case 'genres': return value.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');
    case 'runtime': return convertTime(value);
    case 'releaseYear': return humanizeDate(value);
    default: return value;
  }
};

const createPosterTemplate = (poster) => (
  `<div class="film-details__poster">
    <img class="film-details__poster-img" src="${poster}" alt="">

    <p class="film-details__age">18+</p>
  </div>`
);

const createAdditionalInfoTemplate = (data) => (
  `<table class="film-details__table">
      ${Object.entries(data).map(([term, value]) => `
        <tr class="film-details__row">
          <td class="film-details__term">${capitalizeFirstLetter(term).split(/(?=[A-Z])/).join(' ')}</td>
          <td class="film-details__cell">
            ${getAdditionalInfoValue(term, value)}
          </td>
        </tr>
      `).join('')}
  </table>`
);

const createInfoTemplate = (title, rating, description, additionalInfo) => (
  `<div class="film-details__info">
    <div class="film-details__info-head">
      <div class="film-details__title-wrap">
        <h3 class="film-details__title">${title}</h3>
        <p class="film-details__title-original">Original: ${title}</p>
      </div>

      <div class="film-details__rating">
        <p class="film-details__total-rating">${rating}</p>
      </div>
    </div>

    ${createAdditionalInfoTemplate(additionalInfo)}

    <p class="film-details__film-description">
      ${description}
    </p>
  </div>`
);

const createControlsTemplate = (isInWatchList, isWatched, isFavorite) => {
  const watchListClassName = isInWatchList
    ? 'film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button--watchlist';

  const watchedClassName = isWatched
    ? 'film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button--watched';

  const favoriteClassName = isFavorite
    ? 'film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button--favorite';

  return `<section class="film-details__controls">
    <button type="button" class="film-details__control-button ${watchListClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="film-details__control-button ${watchedClassName}" id="watched" name="watched">Already watched</button>
    <button type="button" class="film-details__control-button ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
  </section>`;
};

const createNewCommentTemplate = () => (
  `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label"></div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>

    <div class="film-details__emoji-list">
      ${EMOJIS.map((emoji) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
        <label class="film-details__emoji-label" for="emoji-${emoji}">
          <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
        </label>`).join('')}
    </div>
  </div>`
);

const createCommentsTemplate = (commentIds, commentItems) => {
  const items = commentIds.map((id, i) => {
    const {emoji, text, author, date} = commentItems[i];
    return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
  });

  return `<ul class="film-details__comments-list">
    ${items.join('')}
  </ul>`;
};

const createFilmDetailsTemplate = (filmData, commentItems) => {
  const {
    title,
    rating,
    poster,
    description,
    comments,
    isInWatchList,
    isWatched,
    isFavorite,
    additionalInfo
  } = filmData;

  const posterTemplate = createPosterTemplate(poster);
  const infoTemplate = createInfoTemplate(title, rating, description, additionalInfo);
  const controlsTemplate = createControlsTemplate(isInWatchList, isWatched, isFavorite);
  const commentsTemplate = createCommentsTemplate(comments, commentItems);
  const newCommentTemplate = createNewCommentTemplate();

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          ${posterTemplate}
          ${infoTemplate}
        </div>
      </div>

      ${controlsTemplate}

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          ${commentsTemplate}

          ${newCommentTemplate}
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetailsView extends AbstractView {
  #card = null;
  #commentItems = null;

  constructor(card = BLANK_CARD, commentItems = []) {
    super();
    this.#card = card;
    this.#commentItems = commentItems;
  }

  get template() {
    return createFilmDetailsTemplate(this.#card, this.#commentItems);
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  }
}
