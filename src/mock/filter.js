const taskToFilterMap = {
  all: {
    fn: (cards) => cards.length,
    title: 'All movies',
  },
  watchlist: {
    fn: (cards) => cards.filter((task) => task.isInWatchList).length,
    title: 'Watchlist'
  },
  watched: {
    fn: (cards) => cards.filter((task) => task.isWatched).length,
    title: 'History'
  },
  favorites: {
    fn: (cards) => cards.filter((task) => task.isFavorite).length,
    title: 'Favorites'
  },
};

export const generateFilter = (cards) => Object.entries(taskToFilterMap).map(
  ([filterName, {fn, title}]) => ({
    name: filterName,
    count: fn(cards),
    title
  }),
);
