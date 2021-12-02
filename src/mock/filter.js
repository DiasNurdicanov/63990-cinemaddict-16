const cardToFilterMap = {
  all: {
    getCount: (cards) => cards.length,
    title: 'All movies',
  },
  watchlist: {
    getCount: (cards) => cards.filter((card) => card.isInWatchList).length,
    title: 'Watchlist'
  },
  watched: {
    getCount: (cards) => cards.filter((card) => card.isWatched).length,
    title: 'History'
  },
  favorites: {
    getCount: (cards) => cards.filter((card) => card.isFavorite).length,
    title: 'Favorites'
  },
};

export const generateFilter = (cards) => Object.entries(cardToFilterMap).map(
  ([filterName, {getCount, title}]) => ({
    name: filterName,
    count: getCount(cards),
    title
  }),
);
