const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get cards() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = async (id) => {
    const response = await this.#load({
      url: `comments/${id}`,
    });

    return await ApiService.parseResponse(response);
  }

  updateCard = async (card) => {
    const response = await this.#load({
      url: `movies/${card.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(card)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  addComment = async (comment, cardId) => {
    const response = await this.#load({
      url: `comments/${cardId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  deleteComment = async (comment) => {
    const response = await this.#load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }

  #adaptToServer = (card) => {
    const additionalInfo = card.additionalInfo;

    const adaptedCard = {
      'id': card.id,
      'comments': card.comments,
      'film_info': {
        'actors': additionalInfo.actors,
        'director': additionalInfo.director,
        'genre': additionalInfo.genres,
        'runtime': additionalInfo.runtime,
        'writers': additionalInfo.writers,
        'release': {
          'date': additionalInfo.releaseYear,
          'release_country': additionalInfo.country
        },
        'poster': card.poster,
        'total_rating': card.rating,
        'title': card.title,
        'description': card.description,
        'alternative_title': card.alternativeTitle,
        'age_rating': card.ageRating
      },
      'user_details': {
        'watchlist': card.isInWatchList,
        'already_watched': card.isWatched,
        'watching_date': card.watchedDate,
        'favorite': card.isFavorite
      },
    };

    return adaptedCard;
  }
}
