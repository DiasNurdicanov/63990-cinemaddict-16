const cardToFilterMap = {
  all: {
    isMatch: (cards) => [...cards],
    title: 'All movies',
  },
  watchlist: {
    isMatch: (cards) => cards.filter((card) => card.isInWatchList),
    title: 'Watchlist'
  },
  watched: {
    isMatch: (cards) => cards.filter((card) => card.isWatched),
    title: 'History'
  },
  favorites: {
    isMatch: (cards) => cards.filter((card) => card.isFavorite),
    title: 'Favorites'
  },
};

export const generateFilter = (cards) => Object.entries(cardToFilterMap).map(
  ([filterName, {isMatch, title}]) => ({
    name: filterName,
    count: isMatch(cards).length,
    title
  }),
);
