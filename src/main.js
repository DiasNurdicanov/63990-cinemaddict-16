import {render, RenderPosition, remove} from './utils/render.js';
import {MenuItem} from './const.js';

import SiteMenuView from './view/site-menu-view.js';
import StatsTriggerView from './view/stats-trigger-view';


import StatisticsView from './view/statistics-view.js';

import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';

import FilmsPresenter from './presenter/films-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic ghjgnvt54657y3452edasszdf';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const footerStatsWrapElement = document.querySelector('.footer__statistics');

const statsTriggerComponent = new StatsTriggerView();

const siteMenuComponent = new SiteMenuView();

render(siteMainElement, siteMenuComponent, RenderPosition.BEFOREEND);
render(siteMenuComponent, statsTriggerComponent, RenderPosition.BEFOREEND);


const apiService = new ApiService(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel(apiService);

const commentsModel = new CommentsModel(apiService);

const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel, footerStatsWrapElement, siteHeaderElement);
const filterPresenter = new FilterPresenter(siteMenuComponent, filterModel, filmsModel);


filterPresenter.init();
filmsPresenter.init();

filmsModel.init();

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      statsTriggerComponent.updateData({active: false});
      remove(statisticsComponent);
      filmsPresenter.init();
      filterPresenter.init();
      break;
    case MenuItem.STATS:
      filmsPresenter.destroy();
      filterPresenter.destroy();
      statisticsComponent = new StatisticsView(filmsModel.cardsData);
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      filterPresenter.setMenuClickHandler(handleSiteMenuClick);

      statsTriggerComponent.updateData({active: true});
      break;
  }
};

statsTriggerComponent.setMenuClickHandler(handleSiteMenuClick);

