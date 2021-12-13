import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

import {getRandomInteger, getRandomFloat} from '../utils/common.js';

const titles = [
  'Sagebrush trail',
  'Santa claus conquers the martians',
  'The dance of life',
  'The great flamarion',
  'The man with the golden arm'
];

const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
];

const generateTitle = () => {
  const randomIndex = getRandomInteger(0, titles.length - 1);
  return titles[randomIndex];
};

const generatePoster = () => {
  const randomIndex = getRandomInteger(0, titles.length - 1);
  const path = './images/posters';
  const ext = 'jpg';

  return `${path}/${titles[randomIndex].toLowerCase().split(' ').join('-')}.${ext}`;
};

const generateDescription = () => {
  const randomCount = getRandomInteger(0, 5);

  const items = Array.from({ length: randomCount }, () => {
    const randomIndex = getRandomInteger(0, descriptions.length - 1);
    return descriptions[randomIndex];
  });

  return items.join(' ');
};

const generateRating = () => getRandomFloat();

export const generateFilmCard = () => ({
  id: nanoid(),
  title: generateTitle(),
  poster: generatePoster(),
  description: generateDescription(),
  comments: [1, 2, 3, 4],
  rating: generateRating(),
  isInWatchList: Boolean(getRandomInteger(0, 1)),
  isWatched: Boolean(getRandomInteger(0, 1)),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  additionalInfo: {
    director: 'Anthony Mann',
    writers: 'Anne Wigton, Heinz Herald, Richard Weil',
    actors: 'Erich von Stroheim, Mary Beth Hughes, Dan Duryea',
    releaseYear: dayjs('1929-01-05').toDate(),
    runtime: 115,
    country: 'USA',
    genres: ['Musical', 'Drama', 'Mystery']
  }
});
