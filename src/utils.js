export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (a = 0, b = 10) => (Math.random() * (b - a) + a).toFixed(1);

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
