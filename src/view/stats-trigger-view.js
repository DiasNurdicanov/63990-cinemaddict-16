import SmartView from './smart-view.js';
import {MenuItem} from '../const.js';

const createSiteMenuTemplate = (isActive) => (
  `<a href="#stats" class="main-navigation__additional${isActive ? ' main-navigation__additional--active' : ''}">Stats</a>`
);

export default class StatsTriggerView extends SmartView {
  constructor() {
    super();
    this._data = {
      active: false
    };
  }

  restoreHandlers() {
    this.setMenuClickHandler(this._callback.menuClick);
  }

  get template() {
    return createSiteMenuTemplate(this._data.active);
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(MenuItem.STATS);
  }
}
