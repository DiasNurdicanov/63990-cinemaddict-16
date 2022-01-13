import {EMOJIS} from '../const.js';
import {capitalizeFirstLetter, convertTime, humanizeDate, getDateWithTime} from '../utils/common.js';
import SmartView from './smart-view.js';

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

const createNewCommentTemplate = ({emojiName = '', textareaText = ''}, isSaving) => (
  `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      ${emojiName ? `<img src="images/emoji/${emojiName}.png" width="55" height="55" alt="emoji-${emojiName}">` : ''}
    </div>

    <label class="film-details__comment-label">
      <textarea ${isSaving ? 'disabled' : ''} class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${textareaText ? textareaText : ''}</textarea>
    </label>

    <div class="film-details__emoji-list">
      ${EMOJIS.map((emoji) => `<input ${isSaving ? 'disabled' : ''} class="film-details__emoji-item visually-hidden ${emojiName === emoji ? 'film-details__emoji-item--active' : ''}" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
        <label class="film-details__emoji-label" for="emoji-${emoji}">
          <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
        </label>`).join('')}
    </div>
  </div>`
);

const createCommentsTemplate = (commentItems, idDeleting, deletingCommentId) => {
  const items = commentItems.map((item) => {
    const {emotion, comment, author, date, id} = item;
    return `<li class="film-details__comment" data-id="${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getDateWithTime(date)}</span>
          <button class="film-details__comment-delete" type="button">${idDeleting && deletingCommentId === id ? 'Deleting' : 'Delete'}</button>
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
    additionalInfo,
    newCommentData,
    isSaving,
    isDeleting,
    deletingCommentId
  } = filmData;

  const posterTemplate = createPosterTemplate(poster);
  const infoTemplate = createInfoTemplate(title, rating, description, additionalInfo);
  const controlsTemplate = createControlsTemplate(isInWatchList, isWatched, isFavorite);
  const commentsTemplate = commentItems.length ? createCommentsTemplate(commentItems, isDeleting, deletingCommentId) : 'Loading...';
  const newCommentTemplate = createNewCommentTemplate(newCommentData, isSaving);

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

export default class FilmDetailsView extends SmartView {
  #commentItems = null;

  constructor(card = BLANK_CARD, commentItems = []) {
    super();
    this._data = FilmDetailsView.parseCardToData(card);
    this.#commentItems = commentItems;

    this._setInnerHandlers();
  }

  get template() {
    return createFilmDetailsTemplate(this._data, this.#commentItems);
  }

  static parseCardToData = (card) => ({...card,
    newCommentData: {
      emojiName: null,
    },
    scrollPosition: null,
  });

  updateElement() {
    super.updateElement();

    if (this._data.scrollPosition) {
      this.element.scrollTo(0, this._data.scrollPosition);
    }
  }

  updateComments({commentItems, clearForm = false}) {
    this.#commentItems = commentItems;

    this.updateData({
      newCommentData: clearForm ? {} : this._data.newCommentData,
      isSaving: false,
      isDeleting: false,
      deletingCommentId: null
    });
  }

  abort(id) {
    if (id) {
      this.shake(this.element.querySelector(`.film-details__comment[data-id="${id}"]`), () => {
        this.updateData({
          isDeleting: false,
          deletingCommentId: null
        });
      });
    } else {
      this.shake(this.element, () => {
        this.updateData({
          isSaving: false
        });
      });
    }
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  }


  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }


  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }


  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _setInnerHandlers() {
    this.element.querySelectorAll('.film-details__emoji-item').forEach((item) => item.addEventListener('change', this.#emojiClickHandler));
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  #emojiClickHandler = (evt) => {
    evt.preventDefault();

    this.updateData({
      newCommentData: {
        emojiName: evt.target.value,
        textareaText: this.element.querySelector('.film-details__comment-input').value
      },
      scrollPosition: this.element.scrollTop,
    });
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((item) => item.addEventListener('click', this.#deleteClickHandler));
  }

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick({
      id: evt.target.closest('.film-details__comment').dataset.id
    });
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    document.addEventListener('keydown', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    if (evt.ctrlKey && evt.keyCode === 13) {
      evt.preventDefault();

      this._data.scrollPosition = this.element.scrollTop;
      this._callback.formSubmit(this._parseNewCommentData());
    }
  }

  _parseNewCommentData() {
    const checkedEmoji = this.element.querySelector('.film-details__emoji-item--active');
    const comment = this.element.querySelector('.film-details__comment-input').value;

    return {
      emotion: checkedEmoji ? checkedEmoji.value : '',
      comment,
    };
  }
}
