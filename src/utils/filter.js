import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (cards) => [...cards],
  [FilterType.WATCHLIST]: (cards) => cards.filter((card) => card.isInWatchList),
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.isWatched),
  [FilterType.FAVORITES]: (cards) => cards.filter((card) => card.isFavorite),
};
