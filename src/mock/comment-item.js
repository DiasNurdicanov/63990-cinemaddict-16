import {EMOJIS} from '../const.js';
import {getRandomInteger} from '../utils.js';

const TEXTS = [
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
  'Interesting setting and a good cast'
];

const generateEmoji = () => {
  const randomIndex = getRandomInteger(0, EMOJIS.length - 1);
  return EMOJIS[randomIndex];
};

const generateTexts = () => {
  const randomIndex = getRandomInteger(0, TEXTS.length - 1);
  return TEXTS[randomIndex];
};

export const generateCommentItem = () => ({
  emoji: generateEmoji(),
  text: generateTexts(),
  author: 'John Doe',
  date: '2019/12/31 23:59',
});
