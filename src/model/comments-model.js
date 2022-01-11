import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';

export default class CommentsModel extends AbstractObservable {
  #commentItems = [];
  #apiService = null;

  get commentItems() {
    return this.#commentItems;
  }

  set commentItems(commentItems) {
    this.#commentItems = [...commentItems];
  }

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  getСommentItems = async (id) => {
    try {
      const comments = await this.#apiService.getComments(id);
      this.#commentItems = [...comments];
    } catch(err) {
      this.#commentItems = [];
    }

    this._notify(UpdateType.LOADED_COMMENTS);

    return this.#commentItems;
  }

  deleteComment(data) {
    const index = this.#commentItems.findIndex((comment) => comment.id === data.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#commentItems = [
      ...this.#commentItems.slice(0, index),
      ...this.#commentItems.slice(index + 1),
    ];
  }

  addComment(newComment) {
    this.#commentItems = [
      ...this.#commentItems,
      newComment,
    ];
  }
}
