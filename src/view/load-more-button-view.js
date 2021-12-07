
import AbstractView from './abstract-view.js';

const createLoadMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class LoadMoreView extends AbstractView {
  get template() {
    return createLoadMoreButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}
