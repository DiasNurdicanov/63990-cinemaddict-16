import {render, RenderPosition} from './utils/render.js';

import SiteMenuView from './view/site-menu-view.js';
import ProfileView from './view/profile-view';
import FooterStatsView from './view/footer-stats-view';

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

const siteMenuComponent = new SiteMenuView();
render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);
render(siteMainElement, siteMenuComponent, RenderPosition.BEFOREEND);
render(footerStatsWrapElement, new FooterStatsView(), RenderPosition.BEFOREEND);

const apiService = new ApiService(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel(apiService);

const commentsModel = new CommentsModel(apiService);

const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMenuComponent, filterModel, filmsModel);


filterPresenter.init();
filmsPresenter.init();

filmsModel.init();

