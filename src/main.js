import {render, RenderPosition} from './utils/render.js';

import SiteMenuView from './view/site-menu-view.js';
import ProfileView from './view/profile-view';
import FooterStatsView from './view/footer-stats-view';

import {generateFilmCard} from './mock/film-card';
import {generateCommentItem} from './mock/comment-item';

import FilmsModel from './model/films-model.js';
import CommentsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';

import FilmsPresenter from './presenter/films-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';


const CARD_COUNT = 5;

const filmCards = Array.from({ length: CARD_COUNT }, generateFilmCard);
const commentItems = Array.from({ length: 4 }, generateCommentItem);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const footerStatsWrapElement = document.querySelector('.footer__statistics');

const siteMenuComponent = new SiteMenuView();
render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);
render(siteMainElement, siteMenuComponent, RenderPosition.BEFOREEND);
render(footerStatsWrapElement, new FooterStatsView(filmCards.length), RenderPosition.BEFOREEND);

const filmsModel = new FilmsModel();
filmsModel.cardsData = filmCards;

const commentsModel = new CommentsModel();
commentsModel.commentItems = commentItems;

const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMenuComponent, filterModel, filmsModel);


filterPresenter.init();
filmsPresenter.init();
