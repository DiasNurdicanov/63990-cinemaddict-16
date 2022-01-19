import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

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

export const sortByDate= (cardA, cardB) => getYearFromDate(cardB.additionalInfo.releaseYear) - getYearFromDate(cardA.additionalInfo.releaseYear);

export const sortByRating = (cardA, cardB) => cardB.rating - cardA.rating;

export const sortByComments = (cardA, cardB) => cardB.comments.length - cardA.comments.length;

export const makeItemsUniq = (items) => [...new Set(items)];

export const getRank = (count) => {
  if (count <= 10) {
    return 'Novice';
  }

  if (count >= 11 && count <= 20) {
    return 'Fan';
  }

  if (count >= 21) {
    return 'Movie buff';
  }
};

export const getHumanizeDiffDate = (date) => {
  const different = dayjs.duration(dayjs(date).diff(dayjs()));
  return different.humanize(true);
};
