import AbstractView from './abstract-view.js';
import {MenuItem} from '../const.js';

const createSiteMenuTemplate = () => (
  '<nav class="main-navigation"></nav>'
);

export default class SiteMenuView extends AbstractView {
  get template() {
    return createSiteMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.querySelector('.main-navigation__additional').addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(MenuItem.STATS);
  }
}
