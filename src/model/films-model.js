import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';

export default class FilmsModel extends AbstractObservable {
  #cardsData = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    await this.getCards();

    this._notify(UpdateType.INIT);
  }

  getCards = async () => {
    try {
      const cards = await this.#apiService.cards;
      this.#cardsData = cards.map(this.#adaptToClient);
    } catch(err) {
      this.#cardsData = [];
    }
  }

  updateCards = async () => {
    await this.getCards();

    this._notify(UpdateType.MINOR);
  }

  get cardsData() {
    return this.#cardsData;
  }

  set cardsData(cardsData) {
    this.#cardsData = [...cardsData];
  }

  updateCard = async (updateType, update) => {
    const index = this.#cardsData.findIndex((card) => card.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting card');
    }

    try {
      const response = await this.#apiService.updateCard(update);
      const updatedCard = this.#adaptToClient(response);

      const newCardsData = this.#cardsData.slice();
      newCardsData[index] = updatedCard;
      this.#cardsData = newCardsData;

      this._notify(updateType, update);

    } catch(err) {
      throw new Error('Can\'t update card');
    }
  }

  getCard(id) {
    const index = this.#cardsData.findIndex((card) => card.id === id);
    return this.cardsData[index];
  }


  #adaptToClient = (card) => {
    const userDetails = {...card['user_details']};
    const filmInfo = {...card['film_info']};
    const release = filmInfo.release;

    const adaptedCard = {...card,
      isInWatchList: userDetails['watchlist'],
      isFavorite: userDetails['favorite'],
      isWatched: userDetails['already_watched'],
      watchedDate: userDetails['watching_date'],
      poster: filmInfo['poster'],
      rating: filmInfo['total_rating'],
      title: filmInfo['title'],
      description: filmInfo['description'],
      alternativeTitle: filmInfo['alternative_title'],
      ageRating: filmInfo['age_rating'],
      additionalInfo: {
        actors: filmInfo['actors'],
        director: filmInfo['director'],
        genres: filmInfo['genre'],
        runtime: filmInfo['runtime'],
        writers: filmInfo['writers'],
        country: release['release_country'],
        releaseYear: release['date'],
      }
    };

    // Ненужные ключи мы удаляем
    delete adaptedCard['user_details'];
    delete adaptedCard['film_info'];

    return adaptedCard;
  }
}
