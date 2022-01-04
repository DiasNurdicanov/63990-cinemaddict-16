import FilterView from '../view/filter-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this._handleModelEvent);
    this.#filterModel.addObserver(this._handleModelEvent);
  }

  get filters() {
    const cardsData = this.#filmsModel.cardsData;

    return [
      {
        name: FilterType.ALL,
        title: 'All movies'
      },
      {
        name: FilterType.WATCHLIST,
        title: 'Watchlist',
        count: filter[FilterType.WATCHLIST](cardsData).length,
      },
      {
        name: FilterType.HISTORY,
        title: 'History',
        count: filter[FilterType.HISTORY](cardsData).length,
      },
      {
        name: FilterType.FAVORITES,
        title: 'Favorites',
        count: filter[FilterType.FAVORITES](cardsData).length,
      }
    ];
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent = () => {
    this.init();
  }

  _handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
