export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

import {siteMenuTemplate} from './view/site-menu-view.js';

const siteMainElement = document.querySelector('.main');

renderTemplate(siteMainElement, siteMenuTemplate(), RenderPosition.BEFOREEND);
