import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import SmartView from './smart-view.js';
import Chart, { defaults } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {FilterType} from '../const';
import {filter} from '../utils/filter.js';
import {makeItemsUniq} from '../utils/common';

dayjs.extend(isBetween);

const FILTER_TYPES = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MOUNTH: 'month',
  YEAR: 'year'
};


const getChartData = (cardsData, dateFrom, dateTo) => {
  const filteredCards = filter[FilterType.HISTORY](cardsData).filter((card) => {
    if (!dateFrom || !dateTo) {
      return true;
    }

    if (
      dayjs(card.watchedDate).isSame(dateFrom, 'day') ||
      dayjs(card.watchedDate).isBetween(dateFrom, dateTo) ||
      dayjs(card.watchedDate).isSame(dateTo, 'day')) {
      return true;
    }

    return false;
  });

  const genres = filteredCards.map((card) => [...card.additionalInfo.genres]).flat();
  const uniqGenres = makeItemsUniq(genres);

  const genresData = uniqGenres.map((uniqGenre) => ({
    genre: uniqGenre,
    count: genres.filter((genre) => genre === uniqGenre).length
  }));

  const cardsByGenrecounts = genresData.map((item) => item.count);

  return {
    filteredCards,
    uniqGenres,
    cardsByGenrecounts,
    genresData
  };
};

const createStatisticsTemplate = ({cardsData, dateFrom, dateTo, currentFilter}) => {
  const {filteredCards, genresData} = getChartData(cardsData, dateFrom, dateTo);

  const length = filteredCards.length;
  const totalDuration = filteredCards.reduce((acc, card) => acc + card.additionalInfo.runtime, 0);

  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration - hours * 60;
  const topGenre = genresData.sort((a, b) => b.count - a.count)[0];

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentFilter === FILTER_TYPES.ALL ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentFilter === FILTER_TYPES.TODAY ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentFilter === FILTER_TYPES.WEEK ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentFilter === FILTER_TYPES.MOUNTH ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentFilter === FILTER_TYPES.YEAR ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${length} <span class="statistic__item-description">movies</span></p>
      </li>

      ${length > 0 ? `<li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre.genre}</p>
        </li>`: ''}
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

const renderChart = (ctx, cardsData, dateFrom, dateTo) => {
  const BAR_HEIGHT = 50;
  const {uniqGenres, cardsByGenrecounts} = getChartData(cardsData, dateFrom, dateTo);

  // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
  ctx.height = BAR_HEIGHT * uniqGenres.length;

  const myChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqGenres,
      datasets: [{
        data: cardsByGenrecounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export default class StatisticsView extends SmartView {
  #chart = null;

  constructor(cardsData) {
    super();

    this._data = {
      cardsData,
      // По условиям техзадания по умолчанию интервал - неделя от текущей даты
      dateFrom: null,
      dateTo: null,
      currentFilter: FILTER_TYPES.ALL
    };

    this.#setCharts();
  }

  removeElement = () => {
    super.removeElement();

    if (this.#chart) {
      this.#chart.destroy();
      this.#chart = null;
    }
  }

  get template() {
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  setFiltersHandler() {
    this.element.querySelectorAll('.statistic__filters-input').forEach((input) => input.addEventListener('change', this._filterHandle));
  }

  _filterHandle = (evt) => {
    evt.preventDefault();


    switch (evt.target.value) {
      case FILTER_TYPES.ALL:
        this.updateData({
          dateFrom: null,
          dateTo: null,
          currentFilter: FILTER_TYPES.ALL
        });
        break;
      case FILTER_TYPES.TODAY:
        this.updateData({
          dateFrom: dayjs(),
          dateTo: dayjs(),
          currentFilter: FILTER_TYPES.TODAY
        });
        break;
      case FILTER_TYPES.WEEK:
        this.updateData({
          dateFrom: dayjs().subtract(6, 'day').toDate(),
          dateTo: dayjs().toDate(),
          currentFilter: FILTER_TYPES.WEEK
        });
        break;
      case FILTER_TYPES.MOUNTH:
        this.updateData({
          dateFrom: dayjs().subtract(30, 'day').toDate(),
          dateTo: dayjs().toDate(),
          currentFilter: FILTER_TYPES.MOUNTH
        });
        break;
      case FILTER_TYPES.YEAR:
        this.updateData({
          dateFrom: dayjs().subtract(365, 'day').toDate(),
          dateTo: dayjs().toDate(),
          currentFilter: FILTER_TYPES.YEAR
        });
        break;
    }
  }

  #setCharts = () => {
    const {cardsData, dateFrom, dateTo} = this._data;

    const statsCtx = this.element.querySelector('.statistic__chart');
    this.#chart = renderChart(statsCtx, cardsData, dateFrom, dateTo);

    this.setFiltersHandler();
  }
}
