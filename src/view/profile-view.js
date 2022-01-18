import SmartView from './smart-view';

const getRank = (count) => {
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

const createProfileTemplate = (count) => {
  if (count === 0) {
    return '';
  }

  const rank = getRank(count);

  return `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class ProfileView extends SmartView {
  constructor(count) {
    super();
    this._data = {
      count,
    };
  }

  restoreHandlers() {}

  get template() {
    return createProfileTemplate(this._data.count);
  }
}
