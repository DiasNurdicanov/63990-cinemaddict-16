import {createElement} from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class AbstractView {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Класс AbstractView абстрактный');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error('Не реализован абстрактный метод: get template');
  }

  removeElement() {
    this.#element = null;
  }

  shake(element, callback) {
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      element.style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
