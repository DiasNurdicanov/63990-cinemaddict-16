import AbstractObservable from '../utils/abstract-observable.js';

export default class FilmsModel extends AbstractObservable {
  #cardsData = [];

  get cardsData() {
    return this.#cardsData;
  }

  set cardsData(cardsData) {
    this.#cardsData = [...cardsData];
  }

  updateCard = (updateType, update) => {
    const index = this.#cardsData.findIndex((card) => card.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting card');
    }

    this.#cardsData = [
      ...this.#cardsData.slice(0, index),
      update,
      ...this.#cardsData.slice(index + 1),
    ];


    this._notify(updateType, update);
  }
}
