export const EMOJIS = ['smile', 'sleeping', 'puke', 'angry'];

export const FILM_LISTS = {
  main: {
    title: 'All movies. Upcoming',
    isTitleHidden: true,
  },
  topRated: {
    title: 'Top rated',
    isExtra: true,
  },
  mostCommented: {
    title: 'Most commented',
    isExtra: true,
  },
  empty: {
    isEmpty: true,
  },
  loading: {
    title: 'Loading...',
  },
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserAction = {
  UPDATE_CARD: 'UPDATE_CARD',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const MenuItem = {
  FILMS: 'FILMS',
  STATS: 'STATS',
};
