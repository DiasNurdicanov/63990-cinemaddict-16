import {render, RenderPosition} from './utils/render.js';

import SiteMenuView from './view/site-menu-view.js';
import ProfileView from './view/profile-view';
import FooterStatsView from './view/footer-stats-view';

import {generateFilmCard} from './mock/film-card';
import {generateCommentItem} from './mock/comment-item';
import {generateFilter} from './mock/filter.js';

import FilmsPresenter from './presenter/films-presenter.js';

const CARD_COUNT = 20;

const filmCards = Array.from({ length: CARD_COUNT }, generateFilmCard);
const commentItems = Array.from({ length: 4 }, generateCommentItem);
const filters = generateFilter(filmCards);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const footerStatsWrapElement = document.querySelector('.footer__statistics');

render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(filters), RenderPosition.BEFOREEND);
render(footerStatsWrapElement, new FooterStatsView(filmCards.length), RenderPosition.BEFOREEND);

const filmsPresenter = new FilmsPresenter(siteMainElement);
filmsPresenter.init(filmCards, commentItems);
