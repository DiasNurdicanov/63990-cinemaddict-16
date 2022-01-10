import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (a = 0, b = 10) => (Math.random() * (b - a) + a).toFixed(1);

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const convertTime = (minutes) => {
  const time = dayjs.duration(minutes, 'minutes');
  const h = time.hours();
  const m = time.minutes();

  return `${h > 0 ? `${h}h` : ''} ${m}m`;
};

export const getYearFromDate = (date) => dayjs(date).format('YYYY');
export const humanizeDate = (date) => dayjs(date).format('D MMMM YYYY');

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const sortByDate= (cardA, cardB) => getYearFromDate(cardA.additionalInfo.releaseYear) - getYearFromDate(cardB.additionalInfo.releaseYear);

export const sortByRating = (cardA, cardB) => cardA.rating - cardB.rating;


export const removeItem = (items, id) => {
  const index = items.findIndex((item) => item === id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    ...items.slice(index + 1),
  ];
};
